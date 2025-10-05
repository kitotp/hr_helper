import { createContext, useContext, useState, type Dispatch, type PropsWithChildren, type SetStateAction } from "react";

type Admin = {
    username: string
}

type AdminContextType ={
    admin: Admin | null,
    setAdmin: Dispatch<SetStateAction<Admin | null>>
}

const AdminContext = createContext<AdminContextType | null>(null)



export function AdminProvider({children}: PropsWithChildren){
    const [admin, setAdmin] = useState<Admin | null>(null)

    return(
        <AdminContext.Provider value={{admin, setAdmin}}>
            {children}
        </AdminContext.Provider>
    )
}

export function useAdmin(){
    const context = useContext(AdminContext)
    if (!context) {
        throw new Error("useAdmin must be used within an AdminProvider");
      }
    return context
}