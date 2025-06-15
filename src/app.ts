import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';

const app = express();

// Middlewares
app.use(
  cors({
    origin: ['https://chat-pals.vercel.app', 'http://localhost:5173'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  }),
);
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.options('*', cors());

// Routes
app.use('/api', router);

// Health check route
app.get('/', (req: Request, res: Response) => {
  res.send('ChatPals server is running!');
});

// Error handlers
app.use(globalErrorHandler);
app.use(notFound);

export default app;
