import { createContext, useContext, useEffect, useState, type Dispatch, type PropsWithChildren, type SetStateAction } from "react";

type Admin = {
    username: string
}

type AdminContextType ={
    admin: Admin | null,
    setAdmin: Dispatch<SetStateAction<Admin | null>>
}

const AdminContext = createContext<AdminContextType | null>(null)


export function AdminProvider({children}: PropsWithChildren){
    const [admin, setAdmin] = useState<Admin | null>(() => {
        const stored = localStorage.getItem('admin')
        return stored ? JSON.parse(stored) : null 
    })

    useEffect(() => {
        if (admin){
            localStorage.setItem('admin', JSON.stringify(admin))
        }else {
            localStorage.removeItem("admin");
          }
    }, [admin])

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