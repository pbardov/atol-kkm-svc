import {Logger} from '@nestjs/common';

export default abstract class WithWorkLoop {
	private readonly logger: Logger;
	private abortController?: AbortController;
	private workLoopPromise?: Promise<void>;

	protected constructor(loggerContext?: string) {
		this.logger = new Logger(loggerContext ?? this.constructor.name);
	}

	isRunning(): boolean {
		if (this.abortController) {
			return this.abortController.signal.aborted;
		}

		return false;
	}

	startWorkLoop(): boolean {
		this.logger.log('Start work loop');
		if (this.isRunning()) {
			return false;
		}

		this.abortController = new AbortController();
		this.workLoopPromise = this.workLoop(this.abortController.signal);
		return true;
	}

	async stopWorkLoop(waitForComplete = true): Promise<boolean> {
		this.logger.log('Stop work loop');
		if (!this.isRunning() || !this.abortController) {
			return false;
		}

		// noinspection TypeScriptValidateTypes
		this.abortController.abort();
		if (waitForComplete && this.workLoopPromise) {
			await this.workLoopPromise;
		}

		return true;
	}

	async workLoop(signal: AbortSignal) {
		while (!signal.aborted) {
			if ((await this.workTask(signal)) === false) {
				this.logger.log('Work task abort work loop');
				void this.stopWorkLoop(false);
				break;
			}
		}
	}

	abstract workTask(signal: AbortSignal): Promise<void | false>;
}
