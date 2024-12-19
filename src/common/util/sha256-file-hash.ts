import {createHash} from 'crypto';
import {createReadStream} from 'fs';
import getStreamData from '../streams/get-stream-data.js';

export default async function sha256FileHash(path: string, signal?: AbortSignal): Promise<Uint8Array> {
	const hash = createHash('sha256');
	const fileStream = createReadStream(path, {encoding: 'binary'});
	const outStream = fileStream.pipe(hash);
	return (await getStreamData(outStream)) as Uint8Array;
}
