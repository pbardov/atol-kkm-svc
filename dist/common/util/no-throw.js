export default async function noThrow(promise, onThrow) {
    try {
        return await promise;
    }
    catch (e) {
        return onThrow;
    }
}
