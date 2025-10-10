import {Router} from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { CONFIG } from "../config/config.js"

const r = Router()

r.post('/login', async (req, res) => {
    const envUser = String(CONFIG.ADMIN_USERNAME || '').trim()
    const envHash = String(CONFIG.ADMIN_PASS_HASH || '').trim()
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


    const token = jwt.sign({sub: envUser, role: 'admin'},CONFIG.JWT_SECRET, {expiresIn: "15m"})

    res.cookie('access', token, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000
    })
    return res.json({ ok: true, message: 'Logged in successfully!' })
})

export default r