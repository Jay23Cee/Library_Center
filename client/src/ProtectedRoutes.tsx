import { Navigate , Outlet, Route, useLocation, Redirect} from "react-router-dom";
import connect, { useSelector } from"react-redux";


const useAuth=(s :string)=>{
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


const ProtectedRoutes = (props:any) => {
  
    const auth = useAuth(props.Utype);
    return auth ? <Outlet/> : <Navigate to="/" replace />;
  };

//   const ProtectedRoutes = ({Utype}:{Utype:string},{ children }: { children: JSX.Element }) => {
//     console.log(Utype)
//     const auth = useAuth("USER");
//     return auth ? children : <Navigate to="/" replace />;
//   };
export default ProtectedRoutes;