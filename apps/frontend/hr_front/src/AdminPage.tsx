import { useEffect, useState } from "react"

type Application = {
    name: string,
    email: string,
    age: string,
    resume: string,
    description: string,
}

export default function AdminPage(){

    const [applications, setApplications] = useState([])

    useEffect(() => {
        async function fetchApplications(){
            const res = await fetch('http://localhost:2000/applications', {
                method: "GET"
            })
            if(!res.ok) throw new Error('error while getting applications')
            const data = await res.json()
            setApplications(data)
        }

        fetchApplications()
    }, [])

    return(
        <div className="bg-yellow-200 h-screen flex fex-col items-center justify-center">
            <div className="w-[500px] h-[800px] border border-black py-3 px-3">
                <h1 className="text-black font-semibold text-[24px]">Applications List</h1>
                {applications.map((application: Application) => (<div>
                    <p>{application.name}</p>
                </div>))}
            </div>
        </div>
    )
}