import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

import authRoutes from "./routes/auth.js"
import settingsRoutes from "./routes/settings.js"
import applicationRoutes from "./routes/applications.js"
import uploadRoutes from "./routes/upload.js"

const app = express()
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

const PORT = 4000

app.use('/admin', authRoutes)
app.use('/', settingsRoutes)
app.use('/applications', applicationRoutes)
app.use('/', uploadRoutes)


app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})

