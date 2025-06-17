import { Response } from 'express';

function keepAliveFn(res: Response, state: { finished: boolean }) {
  setTimeout(() => {
    if (state.finished) {
      return;
    }

    if (!res.headersSent) {
      res.set('Content-Type', 'application/json');
      res.set('Transfer-Encoding', 'chunked');
      res.flushHeaders();
    }

    // write newline to keep connection alive while result is being processed
    res.write('\n');
    keepAliveFn(res, state);
  }, 3000);
}

function writeResponse<T>(res: Response, data: T) {
  if (!res.headersSent) {
    res.set('Content-Type', 'application/json');
  }
  res.write(JSON.stringify(data));
  res.end();
}

export async function keepAlive<T>(res: Response, promise: () => Promise<T>) {
  const state = { finished: false };
  keepAliveFn(res, state);

  try {
    const result = await promise();
    state.finished = true;
    writeResponse(res, result);
  } catch (err) {
    state.finished = true;
    throw err;
  }
}
