import { Navigate , Outlet, useLocation} from "react-router-dom";

const useAuth=()=>{
    const user = { loggedIn: false};
    return user && user.loggedIn;
}

const ProtectedRoutes = (props: { children: React.ReactNode }): JSX.Element => {
    const isAuth = useAuth();
        return isAuth ? <Outlet/> : <Navigate to ="/"/>
  }

//  const ProtectedRoutes =()=>{
//     const isAuth = useAuth();
//     return isAuth ? <Outlet/> : <Navigate to ="/"/>
// };

export default ProtectedRoutes;