/* eslint-disable @typescript-eslint/ban-types */
export default function isNullable<T>(v: unknown, isT: (v: unknown) => v is T): v is T | null {
	return v === undefined || v === null || isT(v);
}

export const isNullableFactory = <T>(isT: (v: unknown) => v is T) => (v: unknown): v is T | null => isNullable(v, isT);
