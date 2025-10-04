const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
require('dotenv').config()


const app = express()
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
  
app.use(express.json())
app.use(cookieParser())

const PORT = 4000

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})

app.post('/submit', async (req ,res) => {
    const post = {
        id: Date.now(),
        ...req.body,
        created_at: Date.now()
    }

    const response = await fetch('http://localhost:2000/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
    })
    if (!response.ok) {
        return res.status(500).json({ error: 'Failed to add record to db.json' })
    }
    
    const data = await response.json()
    res.json({ ok: true, message: 'Application saved', application: data })

    
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

//middleware for protected routes
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