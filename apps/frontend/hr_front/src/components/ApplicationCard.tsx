import type { Application } from "../AdminPage"

type Props = {
    card: Application
}

export default function ApplicationCard({card}: Props){

    return(
        <div className="border border-black h-[60px] flex flex-row justify-between px-2">
            <div className="flex flex-col items-start justify-center">
                <h1>{card.name}</h1>
                <p>{card.created_at}</p>
            </div>
            <button className="border border-black bg-purple-400 text-white font-semibold px-2 py-1 ">Analize</button>
            <button className="border border-black bg-red-400 text-white font-semibold px-2 py-1 ">Reject</button>
        </div>
    )
}