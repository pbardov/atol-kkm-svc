/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
export default async function getStreamData(stream) {
    const chunks = [];
    return new Promise((resolve, reject) => {
        try {
            stream.on('data', (data) => {
                chunks.push(data);
            });
            stream.on('end', () => {
                const isStringData = !chunks.length || typeof chunks[0] === 'string';
                if (isStringData) {
                    resolve(chunks.join(''));
                }
                else {
                    resolve(Buffer.concat(chunks));
                }
            });
            stream.on('error', err => {
                reject(err);
            });
        }
        catch (e) {
            reject(e);
        }
    });
}
