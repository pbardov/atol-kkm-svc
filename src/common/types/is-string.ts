/**
 * Checks if the provided value is a string.
 *
 * @param v The value to check.
 * @returns `true` if the value is a string, otherwise `false`.
 */
export default function isString(v: unknown): v is string {
	return typeof v === 'string';
}
