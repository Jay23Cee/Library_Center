import { Navigate , Outlet, Route, useLocation, } from "react-router-dom";
import connect, { useSelector } from"react-redux";
import React from "react";


export const UseAuth=(s :string)=>{
    const user  = useSelector((state:any  ) => state.user);
    // console.log(user.currentUser)
    if (user.currentUser!= null){
   //     console.log(user.currentUser.User_type)
       let type = String(user.currentUser.User_type)
        if (type ==s){
            return true
        }
    }
    return false ;
}


const ProtectedRoutes = ({props, direction=""}:{props:string[],direction?:string}) => {
   
   let auth = false
   if (props.length >0){
    for (let x=0; x<props.length;x++){

     auth = UseAuth(props[x]);
 
      if (auth){
        break
      }
      continue
    }

   }
   const redirect = "/"+direction

    return auth ? <Outlet/> : <Navigate to={redirect} replace />;
  };


export default ProtectedRoutes;