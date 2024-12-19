export type Stream = NodeJS.WritableStream & {
	writableFinished: boolean | undefined;
};

export default async function waitStreamFinish<T extends Stream>(stream: T): Promise<void> {
	return new Promise<void>(resolve => {
		// noinspection TypeScriptUnresolvedVariable
		if (typeof stream.writableFinished === 'boolean' && stream.writableFinished) {
			resolve();
		}

		stream.once('finish', resolve);
	});
}
