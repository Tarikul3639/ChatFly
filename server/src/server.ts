import express, { Request, Response } from 'express';
import config from 'config';

const app = express();
const PORT = config.get('app.port');
const HOST = config.get('app.host');

// Middleware
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to ChatFly API',
    app: config.get('app.name'),
    version: config.get('app.version'),
    environment: process.env.NODE_ENV
  });
});

app.listen(PORT, () => {
  console.log(`${config.get('app.name')} server running at http://${HOST}:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
}); 