import express, { Express } from 'express';
import connectMongo from './utils/connectMongo';
import urlRouter from './routes/urls';
import * as dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port: number = Number(process.env.PORT) || 5000;

app.use(express.json());
app.use('/api/urls', urlRouter);

app.get('/', (req, res) => {
  res.send('Server is running');
});

const startServer = async () => {
  try {
    await connectMongo();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
};

startServer();
