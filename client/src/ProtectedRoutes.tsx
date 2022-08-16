import { Navigate , Outlet, useLocation} from "react-router-dom";
import connect, { useSelector } from"react-redux";


const useAuth=()=>{
    const user  = useSelector((state) => state.user.login);
    return user ;
}

const ProtectedRoutes = ( props: { children: React.ReactNode }): JSX.Element => {
    const isAuth = useAuth();
   
        console.log(isAuth)
        return isAuth ? <Outlet/> : <Navigate to ="/"/>
  }

//  const ProtectedRoutes =()=>{
//     const isAuth = useAuth();
//     return isAuth ? <Outlet/> : <Navigate to ="/"/>
// };

export default ProtectedRoutes;