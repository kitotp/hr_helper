import { useState } from "react";
import type { Application } from "../pages/AdminPage"

type Props = {
    card: Application
}

export default function ApplicationCard({card}: Props){

    const date = new Date(card.created_at);
    const [status, setStatus] = useState(card.status)
    
    async function rejectCandidate(){

        const res = await fetch(`/api/applications/${card.id}/reject`, {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            credentials: "include",
            body: JSON.stringify({name: card.name})
        })

        const data = await res.json()
        const {status}= data
        setStatus(status)
    }

    return(
        <div className="border border-black h-[60px] bg-gray-200 flex flex-row items-center justify-between px-2">
            <div className="flex flex-col items-start justify-center">
                <h1 className="font-semibold">{card.name}</h1>
                <p className="text-[14px] text-gray-500">{date.toLocaleString()}</p>
            </div>
            <p className={`${status === "rejected" ? "text-red-500" : "text-blue-400"}`}>{status}</p>
            <button className="border border-black bg-purple-400 text-white font-semibold px-2 py-1 ">Analize</button>
            <button onClick={() => rejectCandidate()} className={`border border-black bg-red-400 text-white font-semibold px-2 py-1 ${status === "rejected" ? "hidden" : ""}`}>Reject</button>
        </div>
    )
}