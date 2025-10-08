import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import OpenAI from 'openai';
import multer from 'multer';
import { processApplication } from './services/processApplication.js';
import { rejectApplication } from './services/rejectApplication.js';

const app = express()
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

const upload = multer({ storage: multer.memoryStorage() });
const PORT = 4000
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})

app.post('/submit',upload.single('resume'), async (req ,res) => {

    const {name, email , age, phone , description} = req.body
    const file = req.file

    if (!file) return res.status(400).json({ error: "resume is required" });

    const post = {
        id: Date.now(),
        created_at: new Date().toISOString(),
        name,
        email,
        age: Number(age),
        phone: phone || null,
        description: description || null,
        status: "received"
      };

    const response = await fetch('http://localhost:2000/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
    })
    if (!response.ok) {
        return res.status(500).json({ error: 'Failed to add record to db.json' })
    }

    res.status(202).json({ok: true})

    process.nextTick(() => processApplication({file}))
})


app.post('/admin/login', async (req, res) => {
    const envUser = String(process.env.ADMIN_USERNAME || '').trim()
    const envHash = String(process.env.ADMIN_PASS_HASH || '').trim()
    const username = String(req.body?.username ?? '').trim()
    const password = String(req.body?.password ?? '')
  
    if (!envUser || !envHash) {
      return res.status(500).json({ error: 'Server auth is not configured' })
    }
    if (envUser !== username) {
      return res.status(401).json({ error: 'Invalid username or password' })
    }
    const ok = await bcrypt.compare(password, envHash)
    if (!ok) {
      return res.status(401).json({ error: 'Invalid username or password' })
    }


    const token = jwt.sign({sub: envUser, role: 'admin'},process.env.JWT_SECRET, {expiresIn: "15m"})

    res.cookie('access', token, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000
    })
    return res.json({ ok: true, message: 'Logged in successfully!' })
})


function auth(req, res , next){
    const token = req.cookies?.access
    if (!token) return res.status(401).json({ error: 'No token' })

    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.user = payload
        next()
    }catch(e){
        return res.status(401).json({ error: 'Invalid or expired token' })
    }
}

app.post('/requirements', async(req, res) => {
    const {job , experience, stack} = req.body

    const result = await fetch('http://localhost:2000/requirements/1', {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({job, experience, stack})
    })

    if(!result.ok){
        return res.status(502).json({error: "Error on updating requirements"})
    }

    const data = await result.json()

    return res.json(data)
})

app.get('/applications', async (req, res) => {
    const result = await fetch('http://localhost:2000/applications', {
        method: "GET"
    })
    if(!result.ok) throw new Error('error while getting applications')
    const data = await result.json()
    return res.json(data)
})

app.patch(`/applications/:id/reject`, async (req , res) => {
    const {id} = req.params

    const result = await fetch(`http://localhost:2000/applications/${id}`, {
        method: "PATCH",
        headers: {"Content-Type": 'application/json'},
        body: JSON.stringify({status: "rejected"})
    })

    if(!result.ok){
        return res.status(500).json({error: "Error while rejecting candidate"})
    }

    const updatedApplications = await result.json()

    res.status(202).json(updatedApplications)

    process.nextTick(() => rejectApplication({email: 'maison78901@gmail.com'}))
})