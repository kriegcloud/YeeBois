I have the following trpc procedure which uses `drizzle-orm` for queries and mutations:
```ts
createRevision: tenantScopedProcedure  
  .input(createRevisionSchema)  
  .mutation(async ({ctx, input}) => {  
    // 1. Update all history with new approvals (include revision if not PENDING)  
    const user = ctx.user;  
    const tenantId = user.tenantId;  
    const editingRow = input.editingRow;  
    const itemId = editingRow.itemId;  
  
  
    // TODO - we should make a ticket to address this in the future.  
    isQualityUserLillyHack(user);  
  
    await ctx.db.transaction(async (tx) => {  
      const {upsertMany} = itemHistoryRepository({db: tx});  
  
      const updatedHistories = input.history.map((history) => ({  
        ...history,  
        revision:  
          history.revision === 0 || history.approved !== zItemHistoryApproved.Enum.YES  
            ? history.revision  
            : input.revision,  
        createdBy: user.email  
      }));  
  
      await upsertMany({  
        tenantId,  
        data: updatedHistories  
      });  
  
      const item = await getItem  
        .execute({  
          tenantId: ctx.user.tenantId,  
          itemId: itemId,  
        })  
        .then((res) => res[0]);  
      if (!item) {  
        throw new TRPCError({  
          code: "NOT_FOUND",  
        });  
      }  
      let anyApprovals = false;  
  
      for (const h of input.history) {  
        if (h.revision === 0) {  
          if (h.approved === zItemHistoryApproved.Enum.YES) {  
            await updateItemMutation(  
              ctx.db,  
              itemId,  
              ctx.user.tenantId,  
              {  
                active: true,  
              },  
            );  
          }  
  
          await insertItemHistoryMutation(ctx.db, {  
            tenantId: ctx.user.tenantId,  
            itemId: item.itemId,  
            revision: 0,  
            approved: h.approved,  
            comment: input.comment,  
            createdBy: ctx.user.email,  
          });  
          return "Approved Item";  
        }  
  
        if (h.approved === zItemHistoryApproved.Enum.YES) {  
          anyApprovals = true;  
          if (h.fieldChanged) {  
            match(h.fieldChanged)  
              .with("itemGroups", async () => {  
                // handle groups separately  
                const oldGroups = h.oldValue?.split(",") ?? [];  
                const newGroups = h.newValue  
                  ? h.newValue?.split(",")  
                  : [];  
  
                for (const oldGroup of oldGroups) {  
                  const itemGroupDeleted = !newGroups.includes(oldGroup);  
                  if (itemGroupDeleted) {  
                    await ctx.db  
                      .delete(itemGroupsTable)  
                      .where(  
                        and(  
                          eq(itemGroupsTable.tenantId, ctx.user.tenantId),  
                          eq(itemGroupsTable.itemId, item.itemId),  
                          eq(itemGroupsTable.groupId, oldGroup),  
                        ),  
                      );  
                  }  
                }  
                for (const newGroup of newGroups) {  
                  const existing = await getItemGroupByItemAndGroup  
                    .execute({  
                      tenantId: ctx.user.tenantId,  
                      itemId: item.itemId,  
                      groupId: newGroup,  
                    })  
                    .then((res) => res[0]);  
                  if (!existing) {  
                    await insertItemGroupMutation(ctx.db, {  
                      tenantId: ctx.user.tenantId,  
                      itemId: item.itemId,  
                      groupId: newGroup,  
                      createdBy: ctx.user?.email,  
                    });  
                  }  
                }  
              })  
              .with(P.string.startsWith("attributes."), async () => {  
                if (h.newValue) {  
                  const attrKey = h.fieldChanged?.split(".")[1]!;  
  
                  const attribute = await ctx.db.select().from(attributes).where(  
                    and(  
                      eq(attributes.tenantId, ctx.user.tenantId),  
                      eq(attributes.key, attrKey)  
                    )  
                  ).then((res) => {  
                    const attr = res[0];  
                    if (!attr) {  
                      throw new TRPCError({  
                        code: "NOT_FOUND",  
                        message: `Attribute ${attrKey} not found`                      });  
                    }  
                    return attr;  
                  })  
  
                  const attributeValueField = `value${attribute.type.charAt(0).toUpperCase()}${attribute.type.slice(1)}` as keyof AttributeValueModel;  
  
                  const getParsedValue = (type: ZAttrTypeLiterals, value: string) => match(type)  
                    .with("string", "text", () => value)  
                    .with("integer", "float", "decimal", () => Number(value))  
                    .with("boolean", () => value === "true")  
                    .exhaustive();  
  
                  const newVal = getParsedValue(attribute.type, h.newValue);  
  
                  const newAttributeValue = await ctx.db.select().from(attributeValues)  
                    .where(  
                      and(  
                        eq(attributeValues.tenantId, ctx.user.tenantId),  
                        eq(attributeValues.attributeId, attribute.id),  
                        eq(attributeValues[attributeValueField], newVal)  
                      )  
                    ).then((res) => {  
                      const attrValue = res[0];  
                      if (!attrValue) {  
                        throw new TRPCError({  
                          code: "NOT_FOUND",  
                          message: `Attribute value not found`  
                        });  
                      }  
                      return attrValue;  
                    })  
  
                  if (!h.oldValue) {  
  
                    await itemAttributeRepository({db: ctx.db}).insert({  
                      tenantId: ctx.user.tenantId,  
                      data: {  
                        tenantId: ctx.user.tenantId,  
                        type: attribute.type,  
                        itemId: item.itemId,  
                        attributeId: attribute.id,  
                        attributeValueId: newAttributeValue.id,  
                        createdBy: ctx.user.email,  
                        value: String(newVal),  
                        key: attribute.key,  
                      }  
                    })  
                  } else {  
                    const oldValue = getParsedValue(attribute.type, h.oldValue!);  
  
                    const oldAttributeValue = await ctx.db.select().from(attributeValues)  
                      .where(  
                        and(  
                          eq(attributeValues.tenantId, ctx.user.tenantId),  
                          eq(attributeValues.attributeId, attribute.id),  
                          eq(attributeValues[attributeValueField], oldValue)  
                        )  
                      ).then((res) => {  
                        const attrValue = res[0];  
                        if (!attrValue) {  
                          throw new TRPCError({  
                            code: "NOT_FOUND",  
                            message: `Attribute value not found`  
                          });  
                        }  
                        return attrValue;  
                      })  
  
                    const itemAttr = await ctx.db.select().from(itemAttributesTable).where(  
                      and(  
                        eq(itemAttributesTable.tenantId, ctx.user.tenantId),  
                        eq(itemAttributesTable.itemId, item.itemId),  
                        eq(itemAttributesTable.attributeId, attribute.id),  
                        eq(itemAttributesTable.attributeValueId, oldAttributeValue.id)  
                      )  
                    );  
  
                    if (!itemAttr) {  
                      throw new TRPCError({  
                        code: "NOT_FOUND",  
                        message: `Item attribute not found`  
                      });  
                    }  
  
                    await ctx.db.update(itemAttributesTable).set({  
                      attributeId: attribute.id,  
                      value: String(newVal),  
                      attributeValueId: newAttributeValue.id,  
                    }).where(  
                      and(  
                        eq(itemAttributesTable.tenantId, ctx.user.tenantId),  
                        eq(itemAttributesTable.itemId, item.itemId),  
                        eq(itemAttributesTable.attributeId, attribute.id),  
                        eq(itemAttributesTable.attributeValueId, oldAttributeValue.id)  
                      )  
                    )  
                  }  
  
                  if (newAttributeValue.tenantRuleId) {  
                    const sideEffects = await ctx.db.select().from(tenantRule).where(  
                      eq(tenantRule.id, newAttributeValue.tenantRuleId)  
                    ).then((res) => {  
                      const r = res[0];  
                      if (!r) {  
                        throw new TRPCError({  
                          code: "NOT_FOUND",  
                          message: `Tenant rule not found`  
                        });  
                      }  
                      return r.rule.then;  
                    });  
  
                    for (const [k, v] of typedEntries(sideEffects as Partial<ItemInsertType>)) {  
                      await ctx.db.update(items).set({  
                        [k]: v,  
                      });  
                    }  
                  }  
  
                }  
              })  
              .otherwise(async () => {  
                if (  
                  // ignore these fields. This is why we should name fields consistently.  
                  h.fieldChanged &&  
                  h.fieldChanged !== "itemGroups" &&  
                  h.fieldChanged !== "attributes" &&  
                  h.fieldChanged !== "uoms"  
                ) {  
  
                  const newValue = match(typeof item[h.fieldChanged as keyof ItemModelType])  
                    .with("boolean", () => h.newValue === "true")  
                    .with("number", () => Number(h.newValue))  
                    .otherwise(() => h.newValue);  
  
                  await updateItemMutation(ctx.db, itemId, ctx.user.tenantId, {  
                    [h.fieldChanged as keyof ItemModelType]: newValue,  
                  });  
                }  
              });  
          }  
        }  
      }  
  
      // 3. Create parent revision history record, if there were approvals made. (all rejections => no revision)  
      const newRev = input.history.some((h) => h.approved === "YES");  
      await insertItemHistoryMutation(ctx.db, {  
        tenantId: ctx.user.tenantId,  
        itemId: item.itemId,  
        revision: newRev ? input.revision : undefined,  
        approved: newRev ? "YES" : "NO",  
        comment: input.comment,  
        createdBy: ctx.user.email,  
      });  
      return newRev  
        ? `Created Item Revision ${input.revision}`  
        : "Updated Item History";  
    });  
  })
```

I want to make the following portion of code more efficient by using joins in drizzle-orm to get most of the data that I need for each of the following tables:
```ts
.with(P.string.startsWith("attributes."), async () => {  
  if (h.newValue) {  
    const attrKey = h.fieldChanged?.split(".")[1]!;  
  
    const attribute = await ctx.db.select().from(attributes).where(  
      and(  
        eq(attributes.tenantId, ctx.user.tenantId),  
        eq(attributes.key, attrKey)  
      )  
    ).then((res) => {  
      const attr = res[0];  
      if (!attr) {  
        throw new TRPCError({  
          code: "NOT_FOUND",  
          message: `Attribute ${attrKey} not found`        });  
      }  
      return attr;  
    })  
  
    const attributeValueField = `value${attribute.type.charAt(0).toUpperCase()}${attribute.type.slice(1)}` as keyof AttributeValueModel;  
  
    const getParsedValue = (type: ZAttrTypeLiterals, value: string) => match(type)  
      .with("string", "text", () => value)  
      .with("integer", "float", "decimal", () => Number(value))  
      .with("boolean", () => value === "true")  
      .exhaustive();  
  
    const newVal = getParsedValue(attribute.type, h.newValue);  
  
    const newAttributeValue = await ctx.db.select().from(attributeValues)  
      .where(  
        and(  
          eq(attributeValues.tenantId, ctx.user.tenantId),  
          eq(attributeValues.attributeId, attribute.id),  
          eq(attributeValues[attributeValueField], newVal)  
        )  
      ).then((res) => {  
        const attrValue = res[0];  
        if (!attrValue) {  
          throw new TRPCError({  
            code: "NOT_FOUND",  
            message: `Attribute value not found`  
          });  
        }  
        return attrValue;  
      })  
  
    if (!h.oldValue) {  
  
      await itemAttributeRepository({db: ctx.db}).insert({  
        tenantId: ctx.user.tenantId,  
        data: {  
          tenantId: ctx.user.tenantId,  
          type: attribute.type,  
          itemId: item.itemId,  
          attributeId: attribute.id,  
          attributeValueId: newAttributeValue.id,  
          createdBy: ctx.user.email,  
          value: String(newVal),  
          key: attribute.key,  
        }  
      })  
    } else {  
      const oldValue = getParsedValue(attribute.type, h.oldValue!);  
  
      const oldAttributeValue = await ctx.db.select().from(attributeValues)  
        .where(  
          and(  
            eq(attributeValues.tenantId, ctx.user.tenantId),  
            eq(attributeValues.attributeId, attribute.id),  
            eq(attributeValues[attributeValueField], oldValue)  
          )  
        ).then((res) => {  
          const attrValue = res[0];  
          if (!attrValue) {  
            throw new TRPCError({  
              code: "NOT_FOUND",  
              message: `Attribute value not found`  
            });  
          }  
          return attrValue;  
        })  
  
      const itemAttr = await ctx.db.select().from(itemAttributesTable).where(  
        and(  
          eq(itemAttributesTable.tenantId, ctx.user.tenantId),  
          eq(itemAttributesTable.itemId, item.itemId),  
          eq(itemAttributesTable.attributeId, attribute.id),  
          eq(itemAttributesTable.attributeValueId, oldAttributeValue.id)  
        )  
      );  
  
      if (!itemAttr) {  
        throw new TRPCError({  
          code: "NOT_FOUND",  
          message: `Item attribute not found`  
        });  
      }  
  
      await ctx.db.update(itemAttributesTable).set({  
        attributeId: attribute.id,  
        value: String(newVal),  
        attributeValueId: newAttributeValue.id,  
      }).where(  
        and(  
          eq(itemAttributesTable.tenantId, ctx.user.tenantId),  
          eq(itemAttributesTable.itemId, item.itemId),  
          eq(itemAttributesTable.attributeId, attribute.id),  
          eq(itemAttributesTable.attributeValueId, oldAttributeValue.id)  
        )  
      )  
    }  
  
    if (newAttributeValue.tenantRuleId) {  
      const sideEffects = await ctx.db.select().from(tenantRule).where(  
        eq(tenantRule.id, newAttributeValue.tenantRuleId)  
      ).then((res) => {  
        const r = res[0];  
        if (!r) {  
          throw new TRPCError({  
            code: "NOT_FOUND",  
            message: `Tenant rule not found`  
          });  
        }  
        return r.rule.then;  
      });  
  
      for (const [k, v] of typedEntries(sideEffects as Partial<ItemInsertType>)) {  
        await ctx.db.update(items).set({  
          [k]: v,  
        });  
      }  
    }  
  
  }  
})
```

Relevant tables:

t_attribute table:
```ts
import { relations } from "drizzle-orm";  
import { boolean, int, mysqlEnum, mysqlTable, text, uniqueIndex, varchar } from "drizzle-orm/mysql-core";  
import { timeUserDefaults } from "../../abstracts";  
import { tenants } from "../../tenant/t_tenant/table";  
import { ATTRIBUTE_TYPES, INPUT_TYPES } from "./constants";  
import { BUSINESS_ENTITIES } from "../../tenant/t_tenant_rule/constants";  
  
export const attributes = mysqlTable(  
  "t_attribute",  
  {  
    id: int("id").autoincrement().primaryKey(),  
    tenantId: varchar("tenant_id", { length: 50 })  
      .notNull()  
      .references(() => tenants.tenantId, {  
        onDelete: "cascade",  
        onUpdate: "cascade",  
      }),  
    label: varchar("label", { length: 50 }).notNull(),  
    key: varchar("key", { length: 50 }).notNull(),  
    type: mysqlEnum("type", ATTRIBUTE_TYPES).notNull(),  
    entity: mysqlEnum("entity", BUSINESS_ENTITIES).notNull(),  
    description: text("description"),  
    inputType: mysqlEnum("input_type", INPUT_TYPES),  
    required: boolean("required").default(false),  
    ...timeUserDefaults,  
  },  
  (t) => ({  
    ukKeyTenantEntity: uniqueIndex("uk_key_tenant_entity").on(  
      t.key,  
      t.tenantId,  
      t.entity,  
    ),  
  }),  
);  
export const attributeRelations = relations(attributes, ({ one }) => ({  
  tenant: one(tenants, {  
    fields: [attributes.tenantId],  
    references: [tenants.tenantId],  
  }),  
}));
```

t_attribute_value
```ts
import { relations } from "drizzle-orm";  
import {  
  boolean,  
  decimal,  
  float,  
  index,  
  int,  
  json,  
  mysqlEnum,  
  mysqlTable,  
  text,  
  uniqueIndex,  
  varchar  
} from "drizzle-orm/mysql-core";  
import { timeUserDefaults } from "../../abstracts";  
import { tenants } from "../../tenant/t_tenant/table";  
import { tenantRule } from "../../tenant/t_tenant_rule/table";  
import { ATTRIBUTE_TYPES } from "../t_attribute/constants";  
import { attributes } from "../t_attribute/table";  
  
export const attributeValues = mysqlTable(  
  "t_attribute_value",  
  {  
    id: int("id").autoincrement().notNull().primaryKey(),  
    description: text("description"),  
    type: mysqlEnum("type", ATTRIBUTE_TYPES).notNull(),  
    label: varchar("label", { length: 255 }),  
    key: varchar("key", { length: 255 }).notNull(),  
    tenantId: varchar("tenant_id", { length: 50 })  
      .notNull()  
      .references(() => tenants.tenantId, {  
        onUpdate: "cascade",  
        onDelete: "no action",  
      }),  
    attributeId: int("attribute_id")  
      .notNull()  
      .references(() => attributes.id, {  
        onDelete: "cascade",  
        onUpdate: "cascade",  
      }),  
    valueString: varchar("value_string", { length: 255 }),  
    valueInteger: int("value_number"),  
    valueText: text("value_text"),  
    valueJson: json("value_json"),  
    valueBoolean: boolean("value_boolean"),  
    valueFloat: float("value_float"),  
    valueDecimal: decimal("value_decimal"),  
    tenantRuleId: int("tenant_rule_id").references(() => tenantRule.id, {  
      onDelete: "set null",  
      onUpdate: "cascade",  
    }),  
    ...timeUserDefaults,  
  },  
  (t) => ({  
    iAttributeId: index("i_attribute_id").on(t.attributeId),  
    ukKeyTenantAttr: uniqueIndex("uk_attr_key_tenant").on(  
      t.attributeId,  
      t.key,  
      t.tenantId,  
    ),  
  }),  
);  
export const attributeValueRelations = relations(  
  attributeValues,  
  ({ one }) => ({  
    attribute: one(attributes, {  
      fields: [attributeValues.attributeId],  
      references: [attributes.id],  
    }),  
    tenant: one(tenants, {  
      fields: [attributeValues.tenantId],  
      references: [tenants.tenantId],  
    }),  
    tenantRule: one(tenantRule, {  
      fields: [attributeValues.tenantRuleId],  
      references: [tenantRule.id],  
    }),  
  }),  
);
```

t_tenant_rule
```ts
import { relations } from "drizzle-orm";  
import { index, int, json, mysqlEnum, mysqlTable, text, uniqueIndex, varchar } from "drizzle-orm/mysql-core";  
import { tenantDefaults } from "../../abstracts";  
import { tenants } from "../t_tenant/table";  
import { BUSINESS_ENTITIES } from "./constants";  
import type { RuleSchema } from "./types";  
  
export const tenantRule = mysqlTable(  
  "t_tenant_rule",  
  {  
    ...tenantDefaults,  
    id: int("id").autoincrement().primaryKey(),  
    entity: mysqlEnum("entity", BUSINESS_ENTITIES).notNull(),  
    description: text("description").notNull(),  
    key: varchar("key", { length: 255 }).notNull(),  
    tenantId: varchar("tenant_id", { length: 50 })  
      .notNull()  
      .references(() => tenants.tenantId, {  
        onDelete: "cascade",  
        onUpdate: "cascade",  
      }),  
    rule: json("rule").notNull().$type<RuleSchema>(),  
  },  
  (t) => ({  
    idxTenantId: index("idx_tenant_id").on(t.tenantId),  
    uniqIdxTenantIdEntityKey: uniqueIndex("uniq_idx_tenant_id_entity_key").on(  
      t.tenantId,  
      t.entity,  
      t.key,  
    ),  
  }),  
);  
  
export const tenantRuleRelations = relations(tenantRule, ({ one }) => ({  
  tenant: one(tenants, {  
    fields: [tenantRule.tenantId],  
    references: [tenants.tenantId],  
  }),  
}));
```

t_item_attribute
```ts
import { relations } from "drizzle-orm";  
import { foreignKey, int, mysqlEnum, mysqlTable, primaryKey, uniqueIndex, varchar } from "drizzle-orm/mysql-core";  
import { timeUserDefaults } from "../../abstracts";  
import { ATTRIBUTE_TYPES } from "../../core/t_attribute/constants";  
import { attributes } from "../../core/t_attribute/table";  
import { attributeValues } from "../../core/t_attribute_value/table";  
import { tenants } from "../../tenant/t_tenant/table";  
import { items } from "../t_item/table";  
  
export const itemAttribute = mysqlTable(  
  "t_item_attribute",  
  {  
    itemId: varchar("item_id", { length: 50 }).notNull(),  
    tenantId: varchar("tenant_id", { length: 50 }).notNull(),  
    type: mysqlEnum("type", ATTRIBUTE_TYPES).notNull(),  
    value: varchar("value", { length: 255 }).notNull(),  
    key: varchar("key", { length: 255 }).notNull(),  
    attributeId: int("attribute_id")  
      .notNull()  
      .references(() => attributes.id, {  
        onDelete: "cascade",  
        onUpdate: "cascade",  
      }),  
    attributeValueId: int("attribute_value_id")  
      .notNull()  
      .references(() => attributeValues.id, {  
        onDelete: "cascade",  
        onUpdate: "cascade",  
      }),  
    ...timeUserDefaults,  
  },  
  (t) => ({  
    ukItemTenantAttrVal: uniqueIndex("uk_item_tenant").on(  
      t.itemId,  
      t.tenantId,  
      t.attributeValueId,  
      t.attributeId,  
    ),  
    fkItemTenant: foreignKey({  
      foreignColumns: [items.itemId, tenants.tenantId],  
      columns: [t.itemId, t.tenantId],  
    }),  
    pk: primaryKey({  
      name: "pk_item_tenant_attr_val",  
      columns: [t.itemId, t.tenantId, t.attributeId, t.attributeValueId],  
    }),  
  }),  
);  
  
export const itemAttributeRelations = relations(itemAttribute, ({ one }) => ({  
  item: one(items, {  
    fields: [itemAttribute.itemId],  
    references: [items.itemId],  
  }),  
  tenant: one(tenants, {  
    fields: [itemAttribute.tenantId],  
    references: [tenants.tenantId],  
  }),  
  attribute: one(attributes, {  
    fields: [itemAttribute.attributeId],  
    references: [attributes.id],  
  }),  
  attributeValue: one(attributeValues, {  
    fields: [itemAttribute.attributeValueId],  
    references: [attributeValues.id],  
  }),  
}));
```

How might I make it more efficient

---
In this portion of code:
```ts
async function getAttributeData(ctx, attrKey: string, newValue: string) {  
  const attribute = await ctx.db  
    .select()  
    .from(attributes)  
    .where(  
      and(eq(attributes.tenantId, ctx.user.tenantId), eq(attributes.key, attrKey))  
    )  
    .then((res) => res[0]);  
  
  if (!attribute) {  
    throw new TRPCError({  
      code: "NOT_FOUND",  
      message: `Attribute ${attrKey} not found`,  
    });  
  }  
  
  const attributeValueField = `value${attribute.type.charAt(0).toUpperCase()}${attribute.type.slice(1)}` as keyof AttributeValueModel;  
  
  const newVal = parseAttributeValue(attribute.type, newValue);  
  
  const attributeValueCondition = getAttributeValueCondition(attributeValueField, newVal);  
  
  const attributeValueData = await ctx.db  
    .select({  
      attributeValue: attributeValues,  
      tenantRule: tenantRule,  
    })  
    .from(attributeValues)  
    .leftJoin(tenantRule, eq(tenantRule.id, attributeValues.tenantRuleId))  
    .where(  
      and(  
        eq(attributeValues.attributeId, attribute.id),  
        eq(attributeValues.tenantId, ctx.user.tenantId),  
        attributeValueCondition  
      )  
    )  
    .then((res) => res[0]);  
  
  if (!attributeValueData) {  
    throw new TRPCError({  
      code: "NOT_FOUND",  
      message: `Attribute value not found`,  
    });  
  }  
  
  return {  
    attribute,  
    attributeValue: attributeValueData.attributeValue,  
    tenantRule: attributeValueData.tenantRule,  
  };  
}
```

Since we have `attrKey` and `newValue` and `attrKey` is unique on `key`, `tenant` and `entity` and we know `entity` will be `"ITEM"` can we make the db query for both `attribute` and `attributeValue` a single query?
```ts
ukKeyTenantEntity: uniqueIndex("uk_key_tenant_entity").on(  
  t.key,  
  t.tenantId,  
  t.entity,  
),
```