import { createContext, useContext, useEffect, useState, type Dispatch, type PropsWithChildren, type SetStateAction } from "react";

type Admin = {
    username: string
}

type AdminContextType ={
    admin: Admin | null,
    setAdmin: Dispatch<SetStateAction<Admin | null>>,
    isCheckingAuth: boolean,
}

const AdminContext = createContext<AdminContextType | null>(null)


export function AdminProvider({children}: PropsWithChildren){
    const [admin, setAdmin] = useState<Admin | null>(() => {
        const stored = localStorage.getItem('admin')
        return stored ? JSON.parse(stored) : null 
    })

    const [isCheckingAuth, setIsCheckingAuth] = useState(true)

    useEffect(() => {
        let isMounted = true

        async function verifySession(){
            try {
                const res = await fetch('/api/admin/session', {
                    method: 'GET',
                    credentials: 'include'
                })

                if (!res.ok) {
                    throw new Error('Unauthorized')
                }

                const data = await res.json()
                if (!isMounted) {
                    return
                }

                if (typeof data?.username === 'string' && data.username.length > 0) {
                    setAdmin({ username: data.username })
                } else {
                    setAdmin(null)
                }
            } catch (error) {
                if (isMounted) {
                    setAdmin(null)
                    localStorage.removeItem('admin')
                }
            } finally {
                if (isMounted) {
                    setIsCheckingAuth(false)
                }
            }
        }

        verifySession()

        return () => {
            isMounted = false
        }
    }, [])

    

    useEffect(() => {
        if (admin){
            localStorage.setItem('admin', JSON.stringify(admin))
        }else {
            localStorage.removeItem("admin");
          }
    }, [admin])

    return(
        <AdminContext.Provider value={{admin, setAdmin, isCheckingAuth}}>
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