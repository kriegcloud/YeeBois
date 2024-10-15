Given the following MySQL table defined using drizzle-orm:
```ts
import { relations } from "drizzle-orm";  
import {  
  boolean,  
  index,  
  int,  
  mysqlEnum,  
  mysqlTable,  
  primaryKey,  
  varchar,  
} from "drizzle-orm/mysql-core";  
  
import { tenantDefaults } from "../../abstracts";  
import { files } from "../../core/t_file/table";  
import { tenants } from "../../tenant/t_tenant/table";  
import { inventory } from "../t_inventory/table";  
import { itemClasses } from "../t_item_class/table";  
import { itemGroups } from "../t_item_group/table";  
import { itemUOMs } from "../t_item_uom/table";  
import { inventoryRuleProfiles } from "../t_inventory_rule_profile/table";  
import { CYCLE_COUNT_CLASSES } from "../../constants";  
  
//---------------------------------  
// Table Definition  
//---------------------------------  
export const items = mysqlTable(  
  "t_item",  
  {  
    ...tenantDefaults,  
    itemId: varchar("item_id", { length: 50 }).notNull(),  
    name: varchar("name", { length: 50 }).notNull(),  
    description: varchar("description", { length: 250 }),  
    fileId: int("file_id"),  
    active: boolean("active").default(true),  
    lotControl: boolean("lot_control").default(false),  
    expirationRequired: boolean("expiration_required").default(false),  
    inspectionRequired: boolean("inspection_required").default(false),  
    comment: varchar("comment", { length: 250 }),  
    approvalRequired: boolean("approval_required").default(true),  
    itemClassId: varchar("item_class_id", { length: 50 }),  
    manufacturerName: varchar("manufacturer_name", { length: 100 }),  
    manufacturerNumber: varchar("manufacturer_number", { length: 100 }),  
    cycleCountClass: mysqlEnum("cycle_count_class", CYCLE_COUNT_CLASSES).default(  
      "C",  
    ),  
    inventoryRuleProfileId: int("inventory_rule_profile_id").references(  
      () => inventoryRuleProfiles.id,  
      { onDelete: "set null" },  
    ),  
  },  
  (t) => ({  
    pk: primaryKey({ name: "t_item", columns: [t.itemId, t.tenantId] }),  
    i_items_tenantId_active: index("i_items_tenantId_active").on(  
      t.tenantId,  
      t.itemId,  
    ),  
    i_items_tenantId_itemId: index("i_items_tenantId_itemId").on(  
      t.tenantId,  
      t.itemId,  
    ),  
  }),  
);  
  
//---------------------------------  
// Table Relations  
//---------------------------------  
export const itemRelations = relations(items, ({ one, many }) => ({  
  tenant: one(tenants, {  
    fields: [items.tenantId],  
    references: [tenants.tenantId],  
  }),  
  files: one(files, {  
    fields: [items.fileId],  
    references: [files.id],  
  }),  
  itemUOMs: many(itemUOMs),  
  itemGroups: one(itemGroups, {  
    fields: [items.tenantId, items.itemId],  
    references: [itemGroups.tenantId, itemGroups.itemId],  
  }),  
  itemClasses: one(itemClasses, {  
    fields: [items.tenantId, items.itemClassId],  
    references: [itemClasses.tenantId, itemClasses.itemClassId],  
  }),  
  inventory: many(inventory),  
  inventoryRuleProfile: one(inventoryRuleProfiles, {  
    fields: [items.inventoryRuleProfileId],  
    references: [inventoryRuleProfiles.id],  
  }),  
}));
```

And the zod schemas created from this table:
```ts
import { stringStartsAlphaNum } from "@e2/helpers";  
import { createInsertSchema } from "drizzle-zod";  
import type { ZodTypeAny } from "zod";  
import { z } from "zod";  
import { CYCLE_COUNT_CLASSES } from "../../constants";  
import type { AttributeType } from "../../core/t_attribute/constants";  
import { charMaxMsg, charMinMsg } from "../../zod-utils";  
import { itemSuppliers } from "../t_item_supplier/table";  
import { itemUOMs } from "../t_item_uom/table";  
import { items } from "./table";  
  
const defaultOmit = {  
  tenantId: true,  
  createdBy: true,  
  modifiedBy: true,  
  createdOn: true,  
  modifiedOn: true  
} as const;  
  
const itemJoinTableOmit = {  
  ...defaultOmit,  
  itemId: true  
} as const;  
  
// Related to items  
const zInsertItemSupplier = createInsertSchema(itemSuppliers, {  
  supplierId: ({ supplierId }) =>  
    supplierId  
      .min(1, charMinMsg("ItemSupplier supplierId", 1))  
      .max(150, charMaxMsg("ItemSupplier supplierId", 150)),  
  supplierSku: ({ supplierSku }) =>  
    supplierSku  
      .max(100, charMaxMsg("ItemSupplier supplierSku", 100))  
      .optional()  
}).omit(itemJoinTableOmit);  
const zInsertItemUOM = createInsertSchema(itemUOMs, {  
  uom: ({ uom }) =>  
    uom  
      .min(1, charMinMsg("UOM", 1))  
      .max(30, charMaxMsg("UOM", 30))  
      .refine((value) => stringStartsAlphaNum(value), {  
        message: "Item UOM must begin with a letter or number"  
      })  
      .transform((val) => val.toUpperCase()),  
  
  active: z.coerce.boolean(),  
  defaultUom: z.coerce.boolean(),  
  conversionFactor: ({ conversionFactor }) => conversionFactor.positive(),  
  barcode: ({ barcode }) =>  
    barcode  
      .max(50, charMaxMsg("ItemUOM barcode", 50))  
      .refine((v) => stringStartsAlphaNum(v), {  
        message: "Item UOM barcode must begin with a letter or number"  
      })  
}).omit(itemJoinTableOmit);  
const zInsertItemGroup = z.array(z.string());  
export const zAttributeValueUnion = z.union([  
  z.string(),  
  z.number(),  
  z.number().int(),  
  z.boolean(),  
  z.any()  
]);  
export type ZAttributeValueUnion = z.infer<typeof zAttributeValueUnion>;  
const zInsertItemAttributes = z.record(zAttributeValueUnion);  
  
export const zItemBase = createInsertSchema(items, {  
  itemId: ({ itemId }) =>  
    itemId  
      .min(1, charMinMsg("Item ID or SKU", 1))  
      .max(50, charMaxMsg("Item ID or SKU", 50))  
      .refine((v) => stringStartsAlphaNum(v), {  
        message: "Item SKU must begin with a letter or number"  
      }),  
  
  name: ({ name }) =>  
    name  
      .min(1, charMinMsg("Item name", 1))  
      .max(50, charMaxMsg("Item name", 50))  
      .refine((v) => stringStartsAlphaNum(v), {  
        message: "Item name must begin with a letter or number"  
      }),  
  
  description: ({ description }) =>  
    description  
      .max(250, charMaxMsg("Item description", 250))  
      .refine((v) => stringStartsAlphaNum(v), {  
        message: "Item description must begin with a letter or number"  
      }),  
  comment: ({ comment }) =>  
    comment  
      .max(250, charMaxMsg("Item comment", 250))  
      .refine((v) => stringStartsAlphaNum(v), {  
        message: "Item comment must begin with a letter or number"  
      }),  
  itemClassId: ({ itemClassId }) =>  
    itemClassId.max(50, charMaxMsg("itemClassId", 50)),  
  manufacturerName: ({ manufacturerName }) =>  
    manufacturerName  
      .max(100, charMaxMsg("Item Manufacturer Name", 250))  
      .refine((v) => stringStartsAlphaNum(v), {  
        message: "manufacturer name must begin with a letter or number"  
      }),  
  manufacturerNumber: ({ manufacturerNumber }) =>  
    manufacturerNumber  
      .max(100, charMaxMsg("Item Manufacturer Number", 250))  
      .refine((v) => stringStartsAlphaNum(v), {  
        message: "manufacturer number must begin with a letter or number"  
      }),  
  
  active: z.boolean(),  
  lotControl: z.boolean(),  
  expirationRequired: z.boolean(),  
  inspectionRequired: z.boolean(),  
  approvalRequired: z.boolean()  
})  
  .extend({  
    itemSuppliers: z.array(zInsertItemSupplier).optional(),  
    uoms: z.array(zInsertItemUOM).optional(),  
    itemGroups: zInsertItemGroup.optional(),  
    attributes: zInsertItemAttributes.optional(),  
    cycleCountClass: z.enum(CYCLE_COUNT_CLASSES),  
    file: z.string().nullable().optional()  
  })  
  .omit({  
    ...defaultOmit,  
    fileId: true  
  });  
  
export type ZItemBase = z.infer<typeof zItemBase>;  
  
export const zItemCreateInput = zItemBase  
  .extend({  
    tempImageKey: z.string().optional()  
  })  
  .omit({ file: true });  
  
export type ZItemCreateInput = z.infer<typeof zItemCreateInput>;  
  
export const zItemUpdateInput = z.object({  
  itemId: z.string().min(1),  
  values: zItemBase.omit({ itemId: true }).extend({  
    file: z.string().nullable().optional()  
  })  
});  
  
export type ZItemUpdateInput = z.infer<typeof zItemUpdateInput>;  
  
export type AttributeMetaData = {  
  id: number;  
  key: string;  
  type: AttributeType;  
  required: boolean;  
};  
  
export const createDynamicAttributeSchema = (  
  attributes: AttributeMetaData[]  
) => {  
  const attributeSchemas = attributes?.reduce(  
    (acc, attr) => {  
      acc[attr.key] = attr.required  
        ? zAttributeValueUnion  
        : zAttributeValueUnion.optional();  
      return acc;  
    },  
    {} as Record<string, ZodTypeAny>  
  );  
  
  return z.object(attributeSchemas);  
};  
  
type Mode = "create" | "update";  
  
type CreateDynamicItemFormSchemaProps<TMode extends Mode> = {  
  attributes: AttributeMetaData[];  
  mode: TMode;  
};  
  
export const createDynamicItemFormSchema = <TMode extends Mode>({  
                                                                  attributes,  
                                                                  mode  
                                                                }: CreateDynamicItemFormSchemaProps<TMode>) => {  
  const attrSchema = createDynamicAttributeSchema(attributes);  
  
  if (mode === "update") {  
    return zItemBase.extend({  
      attributes: attrSchema  
    });  
  }  
  
  return zItemCreateInput.extend({  
    attributes: attrSchema  
  });  
};
```

How might I something like `zodEnumFromObjKeys` to create a similar function which recursively keys the "path" of each field and nested field of `zItemBase` such that the enum for something like `zItemBase.shape().attributes.someAttribute` would be represented in the zod enum as:

```ts
const MyFieldPathEnum = z.enum([
  "attributes.someAttribute",
  "itemId",
 //  ... etc
])
```


---

## TODO
- omit side effect fields from item form when attribute is changed

for each Approved Item History Record reduce each newValue into an object for updating the item

for each rejected record input an array of their ids

