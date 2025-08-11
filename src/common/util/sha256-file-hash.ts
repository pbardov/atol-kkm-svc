import {createHash} from 'crypto';
import {createReadStream} from 'fs';
import getStreamData from '../streams/get-stream-data.js';

export default async function sha256FileHash(path: string, signal?: AbortSignal): Promise<Buffer> {
	const hash = createHash('sha256');
	const fileStream = createReadStream(path, {encoding: 'binary'});
	const outStream = fileStream.pipe(hash);
	const data: Buffer = (await getStreamData(outStream)) as Buffer;
	return data;
}
