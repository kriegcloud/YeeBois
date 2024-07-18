export const entityKind = Symbol.for('Dank:entityKind');
export const hasOwnEntityKind = Symbol.for('Dank:hasOwnEntityKind');

export interface DankEntity {
  [entityKind]: string;
}


type AnyFunction<T> = (new (
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  ...args: any[]
) => T)
type AnyAbstractFunction<T> = (abstract new (
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  ...args: any[]
) => T)

export type DankEntityClass<T> = (
  | AnyAbstractFunction<T>
  | AnyFunction<T>
) &
  DankEntity;

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function is<T extends DankEntityClass<any>>(
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  value: any,
  type: T,
): value is InstanceType<T> {
  if (!value || typeof value !== 'object') {
    return false;
  }

  if (value instanceof type) {
    return true;
  }

  if (!Object.prototype.hasOwnProperty.call(type, entityKind)) {
    throw new Error(
      `Class "${
        type.name ?? '<unknown>'
      }" doesn't look like a Dank entity. If this is incorrect and the class is provided by Dank, please report this as a bug.`,
    );
  }

  let cls = value.constructor;
  if (cls) {
    // Traverse the prototype chain to find the entityKind
    while (cls) {
      if (entityKind in cls && cls[entityKind] === type[entityKind]) {
        return true;
      }

      cls = Object.getPrototypeOf(cls);
    }
  }

  return false;
}
