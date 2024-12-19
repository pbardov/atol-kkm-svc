export default async function waitStreamFinish(stream) {
    return new Promise(resolve => {
        // noinspection TypeScriptUnresolvedVariable
        if (typeof stream.writableFinished === 'boolean' && stream.writableFinished) {
            resolve();
        }
        stream.once('finish', resolve);
    });
}
