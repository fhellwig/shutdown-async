# shutdown-async

Asynchronous shutdown handlers for node.js processes.

Processes must perform asynchronous tasks on exit (stopping a server or closing a database, for example). These asynchronous tasks cannot be performed by handling the `'exit'` event as only synchronous operations are permitted.

This module manages both synchronous and asynchronous exit handlers. An asynchronous exit handler is a function returning a promise. Both exceptions thrown by synchronous exit handlers and promises rejected by asynchronous exit handlers are retained.

The exit handlers are run when an exit signal (`SIGINT`, `SIGTERM`, `SIGHUP`, or `SIGBREAK`) is received. The `process.exit()` method is then called with the number of errors encountered as the exit status. This will be zero for a successful shutdown or a positive integer for a shutdown where errors occurred.

An additional feature is that a carriage return (`\r`) is written to `stdout` on `SIGINT` so that the echoed `^C` character does not offset any console output on shutdown.

## Install

```
npm install --save shutdown-async
```

## API

This package supports both CommonJS (`require`) and ES modules (`import`).

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
