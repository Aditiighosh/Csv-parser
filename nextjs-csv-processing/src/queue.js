const Queue = require('bull');
const axios = require('axios');
const Redis = require('ioredis');

const redisClient = new Redis({
    host: '127.0.0.1',
    port: 6379,
    //password: 'aditig65',
});

const userQueue = new Queue('userQueue', {
    redis: {
        host: '127.0.0.1' ,
        port: 6379,
       // password: 'aditig65',
    },
});

userQueue.process(async (job) => {  
    const { data } = job.data;
    console.log('Processing job:', data);
    try{
    const response = await axios.post('http://localhost:3000/api/addUser', data, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    console.log("user added successfully", response.data);
}catch(error){
    console.error('Error adding user:', error);
    throw error;
}
});
module.exports = userQueue;
