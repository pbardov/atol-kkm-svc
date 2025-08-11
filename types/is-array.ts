export default function isArray(v: unknown): v is unknown[] {
	return Array.isArray(v);
}
