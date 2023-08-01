import cors, { CorsOptions } from 'cors';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();
app.use(express.json());

const corsOptions: CorsOptions = {
    allowedHeaders: ['Content-Type']
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`[server]: Server is running on http://localhost:${port}`);
});