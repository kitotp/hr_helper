import { Router } from "express"
import { auth, requireAdmin } from "../middleware/auth.js"
import { rejectApplication } from "../services/rejectApplication.js"
import { prisma } from "../prisma.js"

const r = Router()

r.get('/', auth, requireAdmin, async (_, res) => {
    const result = await prisma.applications.findMany()
    return res.json(result)
})

r.patch(`/:id/reject`, auth, requireAdmin, async (req, res) => {
    const { id } = req.params
    const { name } = req.body

    const result = await prisma.applications.update({
        where: { id },
        data: { status: "rejected" }
    })

    res.status(202).json(result)

    process.nextTick(() => rejectApplication({ name: name, email: 'maison78901@gmail.com' }))
})

export default r