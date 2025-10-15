import { Router } from "express"
import { auth, requireAdmin } from "../middleware/auth.js"
import { prisma } from "../prisma.js"

const r = Router()

r.patch('/requirements', auth, requireAdmin, async (req, res) => {
    const body = req.body

    const payload = Object.fromEntries(
        Object.entries(body).filter(([_, value]) => value !== undefined)
    )

    const result = await prisma.requirements.upsert({
        where: { id: "1" },
        update: { ...payload },
        create: {
            id: "1",
            email: payload.email,
            company_name: payload.company_name,
            job: payload.job,
            experience: payload.experience,
            stack: payload.stack
        }
    })
    if (!result) return res.status(404).json({ error: 'Requirements not found' });

    return res.status(200).json({ ok: true })
})

r.get('/getRequirements', auth, requireAdmin, async (req, res) => {
    const result = await prisma.requirements.findUnique({
        where: {
            id: "1"
        }
    })
    if (!result) return res.status(404).json({ error: 'Requirements not found' });
    return res.json(result)
})

export default r