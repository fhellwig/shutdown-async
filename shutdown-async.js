/*
MIT License

Copyright (c) 2020 Frank Hellwig

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

'use strict';

class ShutdownQueue {
  constructor() {
    this._queue = [];
    this._errors = [];
  }

  addHandler(handler) {
    if (typeof handler === 'function') {
      this._queue.push(handler);
    } else {
      throw new Error('Expected a function for shutdown handler.');
    }
  }

  exitGracefully() {
    const handler = this._queue.shift();
    if (handler) {
      try {
        const result = handler();
        if (isPromise(result)) {
          result
            .then(() => {
              this.exitGracefully();
            })
            .catch((err) => {
              this._errors.push(err);
              this.exitGracefully();
            });
        } else {
          this.exitGracefully();
        }
      } catch (err) {
        this._errors.push(err);
        this.exitGracefully();
      }
    } else {
      process.exit(this._errors.length);
    }
  }

  getErrors() {
    return this._errors;
  }
}

function isPromise(result) {
  return result != null && typeof result === 'object' && typeof result.then === 'function';
}

const shutdownQueue = new ShutdownQueue();

const addHandler = shutdownQueue.addHandler.bind(shutdownQueue);
const exitGracefully = shutdownQueue.exitGracefully.bind(shutdownQueue);
const getErrors = shutdownQueue.getErrors.bind(shutdownQueue);

process.once('SIGINT', exitGracefully);
process.once('SIGTERM', exitGracefully);
process.once('SIGHUP', exitGracefully);
process.once('SIGBREAK', exitGracefully);

module.exports = {
  addHandler,
  exitGracefully,
  getErrors
};