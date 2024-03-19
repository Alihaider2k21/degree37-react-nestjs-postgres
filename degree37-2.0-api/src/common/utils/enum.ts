/**
 * The function `enumKeyByValue` returns the key of an enum value.
 * @param {any} _enum - The `_enum` parameter is an object representing an enum. It can be any object
 * that has key-value pairs, where the keys are the enum names and the values are the corresponding
 * enum values.
 * @param {any} value - The `value` parameter is the value that you want to find the corresponding key
 * for in the enum.
 * @returns The function `enumKeyByValue` returns the key of the enum value that matches the given
 * value.
 */
export const enumKeyByValue = (_enum: any, value: any) => {
  const index = Object.values(_enum).indexOf(value);
  return Object.keys(_enum)[index];
};
