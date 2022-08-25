import { Layout, Menu, Breadcrumb } from "antd";
import React, { useEffect, useState } from "react";
import "../App.scss";
import "antd/dist/antd.min.css";
import BookTable, { Bookintro } from "./BookTable";
import PrivateLogin from "./PrivateLogin";
import Newform, { NewItem } from "./Newbook";
import { Link, Route, Router, Routes, useNavigate } from "react-router-dom";
import LoginDemo from "./Login";
import { GuestTable } from "./GuestTable";
import SignUp from "./Signup";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, logOut } from "../redux/userSlice";
import {
  Check_Login,
  User_Login,
  User_Logout,
} from "../controllers/user_handler";
import NewBook from "./Newbook";
import { UserLogin } from "../models/users";
import ProtectedRoutes from "../ProtectedRoutes";
import { Private_Login } from "../controllers/Private_handler";

// ROUTER needs to be improve
const { Header, Content, Footer } = Layout;
const Homepage = () => {
  const [users, setUsers] = useState<any | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function isLogin() {
    try {
      var token = await Check_Login();
      setUsers(token)
      if (token.Email) { 
        dispatch(loginSuccess(token));
      } else {
        dispatch(logOut());
        navigate("/");
      }
    } catch (error) {
      console.error(error.message);
    }
  }
  
  const user = useSelector((state) => state.user.currentUser);
  console.log(user)
  useEffect(function effectFunction() {
    async function fetchUser() {
      await isLogin();
    }
    fetchUser();
  }, []);

  const logout = async () => {
    // if used in more components, this should be in context
    // axios to /logout endpoint
    var ok = await User_Logout();
    if (ok != null) {
      return ok;
    }
    dispatch(logOut());
    navigate("/");
    return;
  };


  const CheckAuth = (role:any, Utype:string) => {
    // if used in more components, this should be in context
    if (role != null){
      console.log(role.User_type)
      if (role.User_type !=null){
    
        console.log(role.User_type, " typeof",typeof(role.User_type))
        console.log(Utype, " typeof",typeof(Utype))
        if(String(role.User_type) == Utype){
          return true
        }
      }
    
    }
    console.log("FALSE")
    return false
  };


  return (
    <div>
      <Layout className="layout">
        <Header>
          <div className="layout-menu" />
          <Menu theme="dark" mode="horizontal">
            {!user && (
              <Menu.Item key="1">
                <Link to="/">Login</Link>
              </Menu.Item>
            )}
            {!user && (
              <Menu.Item key="4">
                <Link to="/signup">Sign Up</Link>
              </Menu.Item>
            )}

            
             { CheckAuth(user,"USER") &&

               <Menu.Item key="2">
                <Link to="/new">New</Link>
              </Menu.Item>
              }
            
            {user && (
              <Menu.Item key="3">
                <Link to="/admin">Main</Link>
              </Menu.Item>
            )}
            {user && (
              <Menu.Item key="5">
                <span onClick={logout}>Logout</span>
              </Menu.Item>
            )}
          </Menu>
          <h3 className="layout-title">Library Center</h3>
        </Header>
        <Content style={{ padding: "0 50px" }}>
          {/* <Breadcrumb style={{ margin: '16px 0' }}>
<Breadcrumb.Item>Home</Breadcrumb.Item>
<Breadcrumb.Item>List</Breadcrumb.Item>
<Breadcrumb.Item>App</Breadcrumb.Item>
</Breadcrumb>
*/}{" "}
          <Routes>
            <Route path="/New" element={<NewItem />} />
            <Route path="/admin" element={<Bookintro />} />
          </Routes>
          <div className="site-layout-content">
            <Routes>
              <Route path="/admin" element={<BookTable />} />
              <Route path="/guest" element={<GuestTable />} />
             
            
              <Route path="/New" element={<ProtectedRoutes Utype={"USER"}/>}>
                 <Route path="/New" element={<Newform />} />
              </Route>
              {/* <Route path="/New" element={<Newform />} /> */}
            
              
              <Route path="/signup" element={<SignUp />} />
              <Route path="/private/login"  element={<PrivateLogin />} />
              <Route path="/" element={<LoginDemo />} />
            </Routes>
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©2018 Created by Ant UED
        </Footer>
      </Layout>
    </div>
  );
};

export default Homepage;
