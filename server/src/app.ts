import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import passport from './config/passport.config';
import initializeRoutes from './routes';
import errorHandler from './middleware/error-handler';
import rateLimiter from './config/rate-limiter';
import 'express-async-errors';

const app: Express = express();

app.set('trust proxy', 1);
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(helmet());
app.use(rateLimiter);

initializeRoutes(app);
app.use(errorHandler);

export default app;

//Create a public link for sharing posts share/post_id