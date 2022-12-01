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

setTimeout(() => {
  exitGracefully();
}, 1000);
