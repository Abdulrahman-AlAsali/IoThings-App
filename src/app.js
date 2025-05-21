import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import devices from './routes/devices.js';
dotenv.config();

import './services/mqtt.js';

const app = express();
app.use(express.json());

app.use('/api', devices);

import simulate from './routes/simulate.js';   // or ./routes/events.js
app.use('/api', simulate);


// quick & dirty static swagger file
import swaggerDoc from '../swagger.json' with { type: 'json' };
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));  // :contentReference[oaicite:2]{index=2}

app.listen(process.env.PORT, () =>
  console.log(`API ready on http://localhost:${process.env.PORT}`)
);
