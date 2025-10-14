import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAdmin } from "../context/AdminContext"

export default function AdminLoginForm(){

    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const {setAdmin} = useAdmin()

    async function submitForm(e: any){
        e.preventDefault()

        const res = await fetch('http://localhost:4000/admin/login', {
            method: "POST",
            credentials: 'include',  
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username, password})
        })

        if(!res.ok){
            throw new Error('Error while logging')
        }


        setAdmin({username: username})
        navigate('/admin/dashboard');
    }

    return(
        <div className="h-screen bg-amber-200 flex flex-col items-center justify-center">
            <form onSubmit={(e) => submitForm(e)} className="w-[300px] h-[400px] border border-black rounded-2xl flex flex-col px-3 justify-center gap-3">
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Login" className=" px-2 border border-black rounded-lg py-2"/>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="px-2 border border-black rounded-lg py-2"/>
                <button type="submit" className="border border-black py-2 rounded-lg self-center px-7 bg-purple-500 text-white">Login</button>
            </form>
        </div>
    )
}