export default async function noThrow<R, E>(promise: Promise<R>, onThrow: E): Promise<R | E> {
	try {
		return await promise;
	} catch (e) {
		return onThrow;
	}
}
