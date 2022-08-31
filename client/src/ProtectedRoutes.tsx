import { Navigate , Outlet, Route, useLocation, } from "react-router-dom";
import connect, { useSelector } from"react-redux";


export const UseAuth=(s :string)=>{
    const user  = useSelector((state) => state.user);
    console.log(user.currentUser)
    if (user.currentUser!= null){
        console.log(user.currentUser.User_type)
       let type = String(user.currentUser.User_type)
        if (type ==s){
            return true
        }
    }
    return false ;
}


const ProtectedRoutes = ({props, direction=""}:{props:any,direction?:string}) => {
    console.log(props)
    const auth = UseAuth(props);
   const redirect = "/"+direction
   console.log(auth)
    return auth ? <Outlet/> : <Navigate to={redirect} replace />;
  };

//   const ProtectedRoutes = ({Utype}:{Utype:string},{ children }: { children: JSX.Element }) => {
//     console.log(Utype)
//     const auth = useAuth("USER");
//     return auth ? children : <Navigate to="/" replace />;
//   };
export default ProtectedRoutes;