import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null) // { token, email, name, role }

  useEffect(() => {
    try {
      const stored = localStorage.getItem('sc_auth')
      if (stored) setAuth(JSON.parse(stored))
    } catch {
      localStorage.removeItem('sc_auth')
    }
  }, [])

  const login = (data) => {
    setAuth(data)
    localStorage.setItem('sc_auth', JSON.stringify(data))
  }

  const logout = () => {
    setAuth(null)
    localStorage.removeItem('sc_auth')
  }

  return (
    <AuthContext.Provider value={{
      auth,
      login,
      logout,
      isLoggedIn: !!auth,
      isAdmin: auth?.role === 'ADMIN',
      token: auth?.token ?? null,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
