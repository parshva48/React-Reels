import React,{useEffect, useState,createContext} from 'react'
import auth from "./firebase"
import uuid from 'react-uuid'
import CircularProgress from '@mui/material/CircularProgress';

export const AuthContext= createContext();
export default function AuthProvider({children}) {
  const [user,setUser]=useState(null);
  const [loader,setLoader] =useState(true);

  async function login(email,password){
      return await auth.signInWithEmailAndPassword(email,password);
  }
   async function SignUp(email,password){
       return await auth.createUserWithEmailAndPassword(email,password);
   }
  async function logout(){
       await auth.signOut();

  }
  let value={
      login,
      logout,
      user,
      SignUp
  }

  useEffect(function(){
    const unsubscribe = auth.onAuthStateChanged(function(user){
          setUser(user);
          setLoader(false);
      })
      return function () {
        console.log("Hello");
        unsubscribe();
    }
  },[])

console.log("inside auth"+loader);
  return (
      <AuthContext.Provider value={value}>
       {loader==true ?   <div style={{
            display:"flex",
            justifyContent:"center",
            alignContent:"center"
       }}> <CircularProgress></CircularProgress></div> : 
         children }
      </AuthContext.Provider>
      
  )
}
