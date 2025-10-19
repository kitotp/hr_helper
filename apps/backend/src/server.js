import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

import authRoutes from "./routes/auth.js"
import settingsRoutes from "./routes/settings.js"
import applicationRoutes from "./routes/applications.js"
import uploadRoutes from "./routes/upload.js"
import { auth, requireAdmin } from './middleware/auth.js';

const app = express()
app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

const PORT = 3000

app.use('/', uploadRoutes)
app.use('/admin', authRoutes)
app.use('/settings', auth, requireAdmin, settingsRoutes)
app.use('/applications', auth, requireAdmin, applicationRoutes)


app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})

