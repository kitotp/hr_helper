import { useEffect, useState } from "react"
import ApplicationCard from "./components/ApplicationCard"
import { useAdmin } from "./context/AdminContext"
import { useForm } from "react-hook-form"

export type Application = {
    id: string,
    name: string,
    email: string,
    age: string,
    resume: string,
    description: string,
    created_at:string,
    status: string
}

export default function AdminPage(){

    const [applications, setApplications] = useState([])
    const {admin} = useAdmin()

    const {register, handleSubmit} = useForm()

    useEffect(() => {
        async function fetchApplications(){
            const res = await fetch('http://localhost:4000/applications', {
                method: "GET"
            })
            if(!res.ok) throw new Error('error while getting applications')
            const data = await res.json()
            setApplications(data)
        }

        fetchApplications()
    }, [])

    async function submitForm(data: any){
        const res = await fetch('http://localhost:4000/requirements', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        })

        if(!res.ok){
            throw new Error('Error while updating requirements')
        }

        const dataRes = await res.json()

    
        return dataRes
    }   


    

    return(
        <div className="bg-yellow-200 h-screen flex flex-row items-center justify-center gap-8">
            <div className="w-[500px] h-[800px] border border-black py-3 px-3 overflow-y-auto">
                <h1 className="text-black font-semibold text-[24px]">Applications List of {admin?.username}</h1>
                {applications.map((application: Application) => (<ApplicationCard key={application.id} card={application}/>))}
            </div>
            <div className="w-[500px] h-[800px] border border-black py-3 px-3">
                <h1 className="text-black font-semibold text-[24px]">Settings</h1>
                <input type="text" placeholder="Email" className="border border-black rounded-xl py-1 px-2"/>

                <form onSubmit={handleSubmit(submitForm)} className="flex flex-col">
                    <h1 className="text-2xl font-bold mt-5">AI Agent analizing parameters</h1>
                    <h2>Job you are looking for</h2>
                    <input placeholder="Ex. Frontend Engineer" type="text" className="border border-black p-2" {...register('job')}/>

                    <h2>Experience</h2>
                    <input type="text" placeholder="Ex. 2 years" className="border border-black p-2" {...register('experience')}/>

                    <h2>Stack you are looking for</h2>
                    <textarea placeholder="Ex. React, TypeScript, Redux ToolKit" className="border border-black p-2" {...register('stack')}/>

                    <button type="submit" className="border mt-5 self-center border-black py-3 px-8 text-white rounded-lg bg-purple-500">Save</button>
                </form>

            </div>
        </div>
    )
}