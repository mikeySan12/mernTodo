import express from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodatabase.js';
import authRouter from './Routes/authRoutes.js';
import userRouter from './Routes/userRoutes.js';
import cors from 'cors';
import todoRoutes from './Routes/todoRoutes.js';



connectDB();

const app = express();

const allowedOrigins=['http://localhost:5173']


app.use(express.json());
app.use(cookieParser());
app.use(cors( {origin:allowedOrigins ,credentials:true}))



app.get('/',(req,res)=>{
    res.send("working");

})



// Routes
app.use('/api/auth', authRouter);
app.use('/api/user',userRouter);
app.use("/api/todos", todoRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
