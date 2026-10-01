import {createContext,useContext,useEffect,useState} from 'react';
import api from '../services/api';
const AuthContext=createContext();
export function AuthProvider({children}){
 const [user,setUser]=useState(null); const [loading,setLoading]=useState(true);
 useEffect(()=>{const token=localStorage.getItem('token'); if(token) api.get('/auth/me').then(r=>setUser(r.data)).catch(()=>localStorage.removeItem('token')).finally(()=>setLoading(false)); else setLoading(false)},[]);
 const login=async(data)=>{const r=await api.post('/auth/login',data); localStorage.setItem('token',r.data.token); setUser(r.data.user); return r.data};
 const register=async(data)=>api.post('/auth/register',data);
 const logout=()=>{localStorage.removeItem('token');setUser(null)};
 return <AuthContext.Provider value={{user,loading,login,register,logout}}>{children}</AuthContext.Provider>
}
export const useAuth=()=>useContext(AuthContext);