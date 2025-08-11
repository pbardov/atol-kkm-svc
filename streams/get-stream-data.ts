export default async function getStreamData<T extends NodeJS.ReadableStream>(stream: T): Promise<Buffer | string> {
	const chunks: Array<Buffer | string> = [];

	return new Promise<Buffer | string>((resolve, reject) => {
		try {
			stream.on('data', (data: Buffer | string) => {
				chunks.push(data);
			});
			stream.on('end', () => {
				const isStringData = !chunks.length || typeof chunks[0] === 'string';
				if (isStringData) {
					resolve(chunks.join(''));
				} else {
					resolve(Buffer.concat(chunks as Buffer[]));
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
