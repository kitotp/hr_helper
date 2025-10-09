import { useState } from "react";
import type { Application } from "../AdminPage"

type Props = {
    card: Application
}

export default function ApplicationCard({card}: Props){

    const date = new Date(card.created_at);
    const [status, setStatus] = useState(card.status)
    
    async function rejectCandidate(){

        const res = await fetch(`http://localhost:4000/applications/${card.id}/reject`, {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({name: card.name})
        })

        const data = await res.json()
        const {status}= data
        setStatus(status)
    }

    return(
        <div className="border border-black h-[60px] flex flex-row items-center justify-between px-2">
            <div className="flex flex-col items-start justify-center">
                <h1 className="font-semibold">{card.name}</h1>
                <p className="text-[14px] text-gray-500">{date.toLocaleString()}</p>
            </div>
            <p className={`${status === "rejected" ? "text-red-500" : "text-blue-400"}`}>{status}</p>
            <button className="border border-black bg-purple-400 text-white font-semibold px-2 py-1 ">Analize</button>
            <button onClick={() => rejectCandidate()} className="border border-black bg-red-400 text-white font-semibold px-2 py-1 ">Reject</button>
        </div>
    )
}