import express from 'express';
import { StartTimer, GetElapsedTimeInSeconds } from './timer.js';

const app = express();
app.use(express.json());

// Disable CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.post('/StartTimer', async (req, res) => {
    const { AgentId } = req.body;
    if (AgentId && AgentId.length <= 32) {
        try {
            await StartTimer(AgentId);
            res.status(200).send('Timer started');
        } catch (error) {
            console.log(`error: ${error}`);
            res.status(500).send('An error occurred while starting the timer');
        }
    } else {
        res.status(400).send('AgentId is required and must be no more than 32 characters long');
    }
});

app.get('/ElapsedTimeInSeconds', async (req, res) => {
    const { AgentId } = req.query;
    if (AgentId && AgentId.length <= 32) {
        try {
            const elapsedTime = await GetElapsedTimeInSeconds(AgentId);
            res.status(200).json({ elapsedTimeInSeconds: elapsedTime });
        } catch (error) {
            res.status(500).send('An error occurred while fetching the elapsed time');
        }
    } else {
        res.status(400).send('AgentId is required and must be no more than 32 characters long');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));