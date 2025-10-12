import type { PropsWithChildren } from "react";
import { useAdmin } from "../context/AdminContext";
import { Navigate } from "react-router-dom";

export default function RedirectIfNotLogined({children}: PropsWithChildren){
    const {admin} = useAdmin()
    
    if(!admin){
        return <Navigate to={'/admin'} replace/>
    }

    return children

}