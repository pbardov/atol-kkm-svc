/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
export default async function getStreamData<T extends NodeJS.ReadableStream>(stream: T): Promise<Uint8Array | string> {
	const chunks: Array<Uint8Array | string> = [];

	return new Promise<Uint8Array | string>((resolve, reject) => {
		try {
			stream.on('data', (data: Uint8Array | string) => {
				chunks.push(data);
			});
			stream.on('end', () => {
				const isStringData = !chunks.length || typeof chunks[0] === 'string';
				if (isStringData) {
					resolve(chunks.join(''));
				} else {
					resolve(Buffer.concat(chunks as Uint8Array[]));
				}
			});
			stream.on('error', err => {
				reject(err);
			});
		} catch (e) {
			reject(e);
		}
	});
}
