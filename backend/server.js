import express from "express"
import cors from "cors"
import 'dotenv/config'
import connectDB from "./config/mongoDb.js"
import { connectCloudinary } from "./config/cloudinary.js"
import userRouter from "./routes/userRoutes.js"
import productRouter from "./routes/productRoutes.js"

// App config

const app = express()
const port = process.env.PORT || 4000
connectDB();
connectCloudinary()

//  App-middleware

app.use(express.json());
app.use(cors())

// api-endpoints

app.use('/api/user', userRouter);

app.use('/api/product', productRouter)



// App-api


app.get('/', (req, res) => {
    res.send('Api working')
 }
)

app.listen(port, () => {
    console.log("SERVER started on port ", port);
})