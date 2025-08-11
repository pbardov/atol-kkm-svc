/**
 * Checks if the provided value is a number.
 *
 * @param v The value to check.
 * @returns `true` if the value is a number, otherwise `false`.
 */
export default function isNumber(v: unknown): v is number {
	return typeof v === 'number';
}
