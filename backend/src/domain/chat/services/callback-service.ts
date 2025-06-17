import { Injectable } from '@nestjs/common';
import * as uuid from 'uuid';
import { isBoolean, isString } from 'src/lib';

export type CallbackResult<T> = { id: string; result: Promise<T> };
export type CallbackType = 'boolean' | 'string';

@Injectable()
export class CallbackService {
  private readonly results: Record<string, { created: number; result: Result; type: CallbackType }> = {};

  public getTime = () => new Date().getTime();

  constructor() {
    setInterval(() => this.cleanup(), 1000);
  }

  complete(id: string, result: any) {
    const stored = this.results[id];

    if (!stored) {
      return;
    }

    if (isString(result) && stored.type === 'string') {
      stored.result.complete(result);
      delete this.results[id];
      return;
    }

    if (isBoolean(result) && stored.type === 'boolean') {
      stored.result.complete(result);
      delete this.results[id];
      return;
    }
  }

  cleanup() {
    const time = this.getTime();

    for (const [id, stored] of Object.entries(this.results)) {
      const age = time - stored.created;

      if (age < TIMEOUT) {
        continue;
      }

      stored.result.complete(false);
      delete this.results[id];
    }
  }

  confirm(): CallbackResult<boolean> {
    return this.request('boolean');
  }

  input(): CallbackResult<string> {
    return this.request('string');
  }

  private request(type: CallbackType) {
    const requestId = uuid.v4();
    const result = new Result();

    this.results[requestId] = { type, result, created: this.getTime() };

    return { id: requestId, result: result.promise };
  }
}

const TIMEOUT = 5 * 60 * 1000;

class Result {
  private resolve?: (value: any) => void;

  public promise = new Promise<any>((resolve) => {
    this.resolve = resolve;
  });

  public complete(result: any) {
    this.resolve?.(result);
  }
}
