import { Router } from "express";
import { processApplication } from '../services/processApplication.js';
import multer from 'multer';

const r = Router()
const upload = multer({ storage: multer.memoryStorage() });

r.post('/submit',upload.single('resume'), async (req ,res) => {

    const {name, email , age, phone , description} = req.body
    const file = req.file

    if (!file) return res.status(400).json({ error: "resume is required" });

    const post = {
        id: String(Date.now()),
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

export default r