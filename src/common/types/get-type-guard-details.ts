export default function getTypeGuardDetails(f: (...args: any[]) => any): string {
	return `${f.name}\n${f.toString().substring(0, 16)}`;
}
