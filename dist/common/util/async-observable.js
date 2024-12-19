import { Observable } from 'rxjs';
import { setImmediate } from 'timers/promises';
import rejectOnAbort from './reject-on-abort.js';
export default function asyncObservable(executor) {
    return new Observable(subscriber => {
        let finished = false;
        const abortController = new AbortController();
        const { signal } = abortController;
        const immediate = async (noThrow = false) => {
            let aborted = false;
            try {
                await setImmediate(null, { signal });
            }
            catch (e) {
                aborted = true;
                if (!noThrow) {
                    throw e;
                }
            }
            return aborted;
        };
        Promise.race([
            executor(subscriber, immediate),
            rejectOnAbort(signal),
        ]).then(result => {
            if (!finished) {
                if (typeof result !== 'undefined') {
                    subscriber.next(result);
                }
                subscriber.complete();
            }
            finished = true;
        }).catch((reason) => {
            if (!finished) {
                subscriber.error(reason);
            }
            finished = true;
        });
        return () => {
            finished = true;
            abortController.abort();
        };
    });
}
