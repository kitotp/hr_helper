import type { PropsWithChildren } from "react";
import { useAdmin } from "../context/AdminContext";
import { Navigate } from "react-router-dom";

export default function RedirectIfAdmin({children}: PropsWithChildren){
    const {admin, isCheckingAuth} = useAdmin()

    if (isCheckingAuth) {
        return null
    }
    
    if(admin){
        return <Navigate to={'/admin/dashboard'} replace/>
    }

    return <>{children}</>

}