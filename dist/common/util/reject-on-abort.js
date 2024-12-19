export default async function rejectOnAbort(signal, condition = () => true) {
    return new Promise((resolve, reject) => {
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
