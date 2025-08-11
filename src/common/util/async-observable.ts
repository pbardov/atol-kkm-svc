import {Observable, type Subscriber} from 'rxjs';
import {setImmediate} from 'timers/promises';
import rejectOnAbort from './reject-on-abort.js';

export type ImmediateFn = (noThrow?: boolean) => Promise<boolean>;
export type ExecutorFn<T> = (subscriber: Subscriber<T>, immediate: ImmediateFn) => Promise<T | undefined>;

export default function asyncObservable<T>(executor: ExecutorFn<T>): Observable<T> {
	return new Observable<T>(subscriber => {
		let finished = false;
		const abortController = new AbortController();
		const {signal} = abortController;

		const immediate = async (noThrow = false): Promise<boolean> => {
			let aborted = false;
			try {
				await setImmediate(null, {signal});
			} catch (e) {
				aborted = true;
				if (!noThrow) {
					throw e;
				}
			}

			return aborted;
		};

		Promise.race([
			executor(subscriber, immediate),
			rejectOnAbort<T>(signal),
		]).then(result => {
			if (!finished) {
				if (typeof result !== 'undefined') {
					subscriber.next(result);
				}

				subscriber.complete();
			}

			finished = true;
		}).catch(reason => {
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
