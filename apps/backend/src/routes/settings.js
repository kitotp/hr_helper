import { Router } from "express"
import { auth, requireAdmin } from "../middleware/auth.js"

const r = Router()

r.patch('/requirements', auth, requireAdmin, async(req, res) => {
    const body = req.body

    const payload = Object.fromEntries(
        Object.entries(body).filter(([_,value]) => value !== undefined)
    )

    const result = await fetch('http://localhost:2000/requirements/1', {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload)
    })

    if(!result.ok){
        return res.status(502).json({error: "Error on updating requirements"})
    }

    const data = await result.json()
    return res.json(data)
})


r.get('/getRejectData', auth, requireAdmin, async(req, res) => {
    const result = await fetch('http://localhost:2000/requirements/1', {
        method: "GET"
    })
    const data = await result.json()
    
    return res.json({company_name: data.company_name, position: data.job})
})

r.get('/getRequirements', auth , requireAdmin, async(req, res) => {
    const result = await fetch('http://localhost:2000/requirements/1', {
        method: "GET"
    })

    const data = await result.json()
    
    return res.json(data)
})

export default r