import { Router } from "express"

const r = Router()

r.post('/requirements', async(req, res) => {
    const {email, company_name ,job , experience, stack} = req.body

    const result = await fetch('http://localhost:2000/requirements/1', {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email, company_name, job, experience, stack})
    })

    if(!result.ok){
        return res.status(502).json({error: "Error on updating requirements"})
    }

    const data = await result.json()
    return res.json(data)
})

r.get('/getRejectData', async(req, res) => {
    const result = await fetch('http://localhost:2000/requirements/1', {
        method: "GET"
    })
    const data = await result.json()
    
    return res.json({company_name: data.company_name, position: data.job})
})

export default r