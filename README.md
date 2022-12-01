# shutdown-async

Asynchronous shutdown handlers for node.js processes.

## Example

Consider a database close operation that is an asynchronous function that must be run at shutdown. That shutdown can be invoked by calling `process.exit` or by pressing `^C`.

```javascript
/**
 * Simulate closing a database in an asynchronous function returning a promise.
 */
function closeDatabase() {
  return new Promise((resolve) => {
    console.log('Closing database...');
    setTimeout(() => {
      console.log('Database closed');
      resolve();
    }, 1000);
  });
}
```

Now we call that function in our exit handler.

```javascript
/**
 * Close the database on exit. Note: This will not work correctly as you
 * cannot call asynchronous functions from an exit handler.
 */
process.on('exit', async () => {
  console.log('Shutting down...');
  await closeDatabase();
  console.log('Shutdown');
});
```

The output on shutdown will be as follows:

```
Shutting down...
Closing database...
```

Clearly, this isn't what we want. That is where this module comes in to help. The following is an example of using this module to accomplish the asynchronous database close action.

```javascript
import { addExitHandler, exitGracefully } from '../shutdown-async.js';

function closeDatabase() {
  return new Promise((resolve) => {
    console.log('Closing database...');
    setTimeout(() => {
      console.log('Database closed');
      resolve();
    }, 1000);
  });
}

addExitHandler(closeDatabase);
```

When the program is stopped (either by a signal or by calling `exitGracefully` - discussed below), the output will be as follows:

```
Closing database...
Database closed
```

The code for both the non-working and working examples is in the `examples` folder.

## Details

Processes must perform asynchronous tasks on exit (stopping a server or closing a database, for example). These asynchronous tasks cannot be performed by handling the `'exit'` event as only synchronous operations are permitted.

This module manages both synchronous and asynchronous exit handlers. An asynchronous exit handler is a function returning a promise. Both exceptions thrown by synchronous exit handlers and promises rejected by asynchronous exit handlers are retained.

The exit handlers are run when an exit signal (`SIGINT`, `SIGTERM`, `SIGHUP`, or `SIGBREAK`) is received or you call `exitGracefully`. (Calling `process.exit` instead of calling `exitGracefully` will not work as the asynchronous exit handlers will not be called.)

Once all exit handlers have been called, the `process.exit` method is called with the number of errors encountered as the exit status. This will be zero for a successful shutdown or a positive integer for a shutdown where errors occurred.

An additional feature is that a carriage return (`\r`) is written to `stdout` on `SIGINT` so that the echoed `^C` character does not offset any console output on shutdown.

## Install

```
npm install --save shutdown-async
```

## API

```javascript
import { addExitHandler } from 'shutdown-async';

addExitHandler(handler);
```

- Adds the specified handler to the queue. The exit handler can be a synchronous function that can throw an exception or an asynchronous function that returns a promise.

```javascript
import { exitGracefully } from 'shutdown-async';

exitGracefully();
```

- Called automatically on `SIGINT`, `SIGTERM`, `SIGHUP`, or `SIGBREAK`. Runs the exit handlers in the order they were added and then calls `process.exit(count)` where `count` is the number of errors (exceptions thrown or promises rejected) encountered while running the exit handlers. Calling this function from your code is optional but not required.

```javascript
import { getExitErrors } from 'shutdown-async';

getExitErrors();
```

- Returns an array of errors encountered while running the exit handlers. Useful for testing. You need not call this function from your code.

## Example

The code in the `test.js` file serves as an example and is the module run by `npm test`.

## License

MIT License

Copyright (c) 2022 Frank Hellwig

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
