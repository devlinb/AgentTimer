import redis from "redis";
const client = redis.createClient();

const initRedisClient = async () => {
    if( client.isReady ) return;

    await client.connect();
    client.on('error', (err) => console.log('Redis Client Error', err));
    return;
}

export const StartTimer = async (AgentId) => {
    if (!client.isReady) {
        await initRedisClient();
    }
    const currentTime = new Date().toISOString();
    client.set(`/AgentTimers/${AgentId}`, currentTime, (err) => {
        if (err) {
            console.error('Error setting timer in Redis:', err);
        } else {
            console.log(`Timer started for Agent ${AgentId} at ${currentTime}`);
        }
    });
};

export const GetElapsedTimeInSeconds = async (AgentId) => {
    if (!client.isReady) {
        await initRedisClient();
    }
    const startTime = await client.get(`/AgentTimers/${AgentId}`);
    if (startTime) {
        const currentTime = new Date().toISOString();
        const elapsedTime = (new Date(currentTime) - new Date(startTime)) / 1000;
        console.log(`Elapsed time for Agent ${AgentId} is ${elapsedTime} seconds.`);
        return elapsedTime;
    } else {
        console.log(`No timer found for Agent ${AgentId}.`);
        return "Sorry the time isn't being kept track of.";
    }
};
