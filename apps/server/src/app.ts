import express from 'express';
import dotenv from 'dotenv';
import promptRoutes from './routes/promptRoutes';
import { connectDB } from './config/db';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler';


dotenv.config();
const app = express();

connectDB();

app.use(helmet());
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.MAX_REQUEST_LIMIT || 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(errorHandler);

app.use(express.json());
app.get('/',(req:any,res:any)=>res.send("Server is up!"))
app.use('/api/v1/', promptRoutes);

export default app;