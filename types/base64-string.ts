export type Base64String = string;

export const base64StringRe = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

export function isBase64String(v: unknown): v is Base64String {
	return typeof v === 'string'
		&& base64StringRe.test(v);
}
