import { parse,stringify } from "flatted";

/**
 * Helper methods for managing circular references.
 */

/**
 * Stringified object with a type reference for deserialization.
 */
export type Stringified<T> = string & T

/**
 * Stringifies the provided item as a JSON string while preserving the type information.
 * This allows for the serialized string to be treated as both a string and as an object
 * of type `T` during type checking.
 *
 * @template T The type of the item to be stringified.
 * @param item The item of generic type `T` to be stringified.
 * @returns A `Stringified` representation of the input item that retains type `T`.
 */
export const stringifyAsType = <T extends unknown>(item: T): Stringified<T> => {
  return stringify(item) as Stringified<T>;
}

/**
 * Parses a stringified item that was previously converted to a JSON string
 * using `stringifyAsType`. This reverses the stringification process and
 * returns the original object with its type information intact.
 *
 * @template T The expected type of the parsed object.
 * @param flatItem A `Stringified` JSON string that represents an object of type `T`.
 * @returns The original object of type `T` that was stringified.
 */
export const parseFlatted = <T>(flatItem: Stringified<T>): T => {
  return parse(flatItem);
}
