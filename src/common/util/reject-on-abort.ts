export default async function rejectOnAbort<T = any>(signal: AbortSignal, condition = () => true): Promise<T> {
	return new Promise<T>((resolve, reject) => {
		const onAbort = () => {
			if (condition()) {
				// eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
				reject(signal.reason);
			}

			signal.removeEventListener('abort', onAbort);
		};

		signal.addEventListener('abort', onAbort);
	});
}
