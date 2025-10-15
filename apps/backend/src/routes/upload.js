import { Router } from "express";
import { processApplication } from '../services/processApplication.js';
import multer from 'multer';
import { prisma } from "../prisma.js";

const r = Router()
const upload = multer({ storage: multer.memoryStorage() });

r.post('/submit', upload.single('resume'), async (req, res) => {

    const { name, email, age, phone, description } = req.body
    const file = req.file

    if (!file) return res.status(400).json({ error: "resume is required" });


    const created = await prisma.applications.create({
        data: {
            created_at: new Date(),
            name: name,
            email: email,
            age: Number(age),
            phone: phone || null,
            description: description || null,
            status: "received",
        }
    })

    res.status(202).json({ ok: true, id: created.id })

    process.nextTick(() => processApplication({ file }))
})

export default r