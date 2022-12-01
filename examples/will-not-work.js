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

/**
 * Close the database on exit. Note: This will not work correctly as you
 * cannot call asynchronous functions from an exit handler.
 */
process.on('exit', async () => {
  console.log('Shutting down...');
  await closeDatabase();
  console.log('Shutdown');
});

setTimeout(() => {
  process.exit(0);
}, 1000);
