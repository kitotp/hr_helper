const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sgMail = require('@sendgrid/mail')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const pdfParse = require('pdf-parse')
const { default: OpenAI } = require('openai')
const multer = require('multer')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

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

    const parsed = await pdfParse(file.buffer)
    const pdfText = parsed.text || ''

    const post = {
        id: Date.now(),
        created_at: new Date().toISOString(),
        name,
        email,
        age: Number(age),
        phone: phone || null,
        description: description || null,
      };

    const response = await fetch('http://localhost:2000/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
    })
    if (!response.ok) {
        return res.status(500).json({ error: 'Failed to add record to db.json' })
    }

    const prompt = `Analize the resume with the following demanded stack: React, 2 years of experience, Javascript ` +
      `Return ONLY a rate from 0 to 10(10 - the best CV for the demanded stack) and the reason why you give this rate.\n\n` + pdfText;
    
    const analize = await openai.responses.create({
        model: 'gpt-4o-mini',
        input: prompt
    })

    const msg = {
        to: 'maison78901@gmail.com',
        from: process.env.DEFAULT_FROM_EMAIL,
        subject: 'New Apllication!',
        text: analize.output_text,
    }

    sgMail.send(msg)
    console.log('sent!!')

    return res.json({ok: true})
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
