const { createClient } = require("redis");

const client = createClient({
    username: 'default',
    password: 'kXx8NCIXmfhCTGPS9GYgrJv4ifnbb8Qh',
    socket: {
        host: 'redis-13752.c246.us-east-1-4.ec2.redns.redis-cloud.com',
        port: 13752
    }
});

client
    .on('error', err => console.log('Redis Client Error', err))
    .on("connect",() => console.log("Redis connected"));
 
client.connect();
module.exports = client;   
// await client.connect();

// await client.set('foo', 'bar');
// const result = await client.get('foo');
// console.log(result)  // >>> bar

