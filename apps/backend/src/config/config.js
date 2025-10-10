import 'dotenv/config'

function requireEnv(name){
    const v = process.env[name]
    if(!v){
        throw new Error(`Missing env ${name}`)
    }
    return v
}

export const CONFIG = {
    PORT: Number(process.env.PORT || 4000),
    FRONT_ORIGIN: process.env.FRONT_ORIGIN || "http://localhost:5173",
    SENDGRID_KEY: requireEnv('SENDGRID_API_KEY'),
    JWT_SECRET: requireEnv('JWT_SECRET'),
    ADMIN_USERNAME: requireEnv('ADMIN_USERNAME'),
    DEFAULT_FROM_EMAIL: requireEnv('DEFAULT_FROM_EMAIL'),
    ADMIN_PASS_HASH: requireEnv('ADMIN_PASS_HASH'),
    OPENAI_API_KEY: requireEnv('OPENAI_API_KEY'),
    DATA_API: process.env.DATA_API || 'http://localhost:2000',
}