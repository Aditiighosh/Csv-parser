const userQueue = require('./queue');

userQueue.on('completed', (job, result) => {
    console.log(`Job completed with result ${result}`);
}
);
userQueue.on('failed', (job, err) => {
    console.log(`Job failed with error ${err.message}`);
}
);
console.log('Worker is running');