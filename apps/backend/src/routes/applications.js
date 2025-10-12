import { Router } from "express"
import { auth, requireAdmin } from "../middleware/auth.js"
import {rejectApplication} from "../services/rejectApplication.js"

const r = Router()

r.get('/',auth, requireAdmin, async (_, res) => {
    const result = await fetch('http://localhost:2000/applications', {
        method: "GET"
    })
    if(!result.ok) throw new Error('error while getting applications')
    const data = await result.json()
    return res.json(data)
})

r.patch(`/:id/reject`, auth, requireAdmin, async (req , res) => {
    const {id} = req.params
    const {name} = req.body

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

    process.nextTick(() => rejectApplication({name: name, email: 'maison78901@gmail.com'}))
})

export default r