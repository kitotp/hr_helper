import jwt from 'jsonwebtoken'
import { CONFIG } from '../config/config.js'

export function auth(req, res , next){
    const token = req.cookies?.access
    if (!token) return res.status(401).json({ error: 'No token' })

    try{
        const payload = jwt.verify(token, CONFIG.JWT_SECRET)
        req.user = payload
        next()
    }catch(e){
        res.clearCookie('access')
        return res.status(401).json({ error: 'Invalid or expired token' })
    }
}


export function requireAdmin(req, res, next) {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
}