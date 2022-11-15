/*
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
*/

'use strict';

import { addExitHandler, getExitErrors } from './shutdown-async.js';

//------------------------------------------------------------------------------
// Four exit handlers that each do something different.
//------------------------------------------------------------------------------

function waitOneAndResolve() {
  return new Promise((resolve, reject) => {
    console.log('Resolving after one second...');
    setTimeout(resolve, 1000);
  });
}

function waitOneAndReject() {
  return new Promise((resolve, reject) => {
    console.log('Rejecting after one second...');
    setTimeout(reject, 1000);
  });
}

function throwException() {
  console.log('Throwing an error...');
  throw new Error('error');
}

function doNothing() {
  console.log('Doing nothing...');
}

//------------------------------------------------------------------------------
// Register the exit handlers.
//------------------------------------------------------------------------------

addExitHandler(waitOneAndResolve);
addExitHandler(waitOneAndReject);
addExitHandler(throwException);
addExitHandler(doNothing);

//------------------------------------------------------------------------------
// Simulate Ctrl+C after two seconds.
//------------------------------------------------------------------------------

setTimeout(() => {
  console.log('Simulating Ctrl+C');
  process.emit('SIGINT');
}, 2000);

//------------------------------------------------------------------------------
// Catch the process exit event and verify that we have two errors.
// Exit with a zero status so npm test doesn't indicate an error.
//------------------------------------------------------------------------------

process.on('exit', () => {
  const nerrors = getExitErrors().length;
  const expected = 2;
  console.log(`process.exit(${nerrors})`);
  if (nerrors === expected) {
    console.log('TEST PASSED');
    process.exit(0);
  } else {
    console.log(`TEST FAILED (expected ${expected} errors but got ${nerrors} instead)`);
    process.exit(1);
  }
});

//------------------------------------------------------------------------------
// Start the test.
//------------------------------------------------------------------------------

console.log('Process running...');
