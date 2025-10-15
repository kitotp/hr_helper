import { useEffect, useState } from "react"
import ApplicationCard from "../components/ApplicationCard"
import { useAdmin } from "../context/AdminContext"
import { useForm } from "react-hook-form"

export type Application = {
    id: string,
    name: string,
    email: string,
    age: string,
    resume: string,
    description: string,
    created_at: string,
    status: string,
}

type Requirements = {
    email: string,
    company_name: string,
    job: string,
    experience: string,
    stack: string
}

export default function AdminPage() {

    const [applications, setApplications] = useState([])
    const { admin } = useAdmin()

    const { register, handleSubmit, reset } = useForm<Requirements>({
        defaultValues: {
            email: "",
            company_name: "",
            job: "",
            experience: "",
            stack: "",
        }
    })

    useEffect(() => {
        async function fetchApplications() {
            const res = await fetch('http://localhost:4000/applications', {
                method: "GET",
                credentials: 'include',
            })
            if (!res.ok) throw new Error('error while getting applications')
            const data = await res.json()
            setApplications(data)
        }

        fetchApplications()
        getDefaultData()
    }, [])

    async function getDefaultData() {
        const res = await fetch('http://localhost:4000/settings/getRequirements', {
            method: "GET",
            credentials: 'include',
        })
        if (!res.ok) throw new Error('error while getting applications')
        const data: Partial<Requirements> = await res.json()

        reset({
            email: data.email ?? "",
            company_name: data.company_name ?? "",
            job: data.job ?? "",
            experience: data.experience ?? "",
            stack: data.stack ?? "",

        })
    }

    async function submitForm(data: any) {

        const changed = Object.fromEntries(
            Object.entries(data).filter(([_, value]) => value !== "")
        )

        const res = await fetch('http://localhost:4000/settings/requirements', {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: 'include',
            body: JSON.stringify(changed)
        })

        if (!res.ok) {
            throw new Error('Error while updating requirements')
        }

        const dataRes = await res.json()


        return dataRes
    }




    return (
        <div className="h-screen w-full flex flex-col items-center bg-gray-100 justify-center md:px-50 md:py-20">
            <div className="bg-white w-full h-full px-5 py-5 flex flex-col items-center">
                <h1 className="text-3xl font-semibold self-start">Hiring Dashboard</h1>
                <p className="w-full h-[1px] bg-gray-300"></p>
                <div className="h-fit w-fit rounded-2xl flex flex-row mt-5 items-center justify-center gap-8">
                    <div className="w-[500px] h-[700px] rounded-2xl bg-white border border-gray-300 py-3 px-3 overflow-y-auto">
                        <h1 className="text-black font-semibold text-[24px]">Applications List of {admin?.username}</h1>
                        <div className="flex flex-col justify-center gap-2">
                            {applications.map((application: Application) => (<ApplicationCard key={application.id} card={application} />))}
                        </div>
                    </div>
                    <div className="w-[500px] h-[700px] rounded-2xl border border-gray-300 py-3 px-3">
                        <h1 className="text-black font-semibold text-[24px]">Settings</h1>

                        <form onSubmit={handleSubmit(submitForm)} className="flex flex-col">
                            <input type="text" placeholder="Email" className="border border-black rounded-xl py-1 px-2" {...register('email')} />
                            <input type="text" placeholder="Company name" className="border border-black rounded-xl py-1 mt-2 px-2" {...register('company_name')} />
                            <h1 className="text-2xl font-bold mt-5">AI Agent analizing parameters</h1>
                            <h2>Job you are looking for</h2>
                            <input placeholder="Ex. Frontend Engineer" type="text" className="border rounded-xl border-black p-2" {...register('job')} />

                            <h2>Experience</h2>
                            <input type="text" placeholder="Ex. 2 years" className="border border-black rounded-xl p-2" {...register('experience')} />

                            <h2>Stack you are looking for</h2>
                            <textarea placeholder="Ex. React, TypeScript, Redux ToolKit" className="border rounded-xl border-black p-2" {...register('stack')} />

                            <button type="submit" className="border mt-5 self-center border-black py-3 px-8 text-white rounded-lg bg-purple-500">Save</button>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    )
}