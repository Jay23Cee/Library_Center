import { Layout, Menu, Breadcrumb } from "antd";
import React, { useEffect, useState } from "react";
import "../css/App.css";
import "antd/dist/antd.min.css";
import BookTable, { Bookintro } from "./BookTable";
import PrivateLogin from "./PrivateLogin";
import { Private_Table } from "./Private_Table";
import Newform, { NewItem } from "./Newbook";
import { Link, Route, Router, Routes, useNavigate } from "react-router-dom";
import Login_form from "./Login";
import SignUp from "./Signup";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, logOut } from "../redux/userSlice";
import {
  Check_Login, User_Login,User_Logout,
} from "../controllers/user_handler";
import NewBook from "./Newbook";
import { UserLogin } from "../models/users";
import ProtectedRoutes from "../ProtectedRoutes";
import { Private_Login } from "../controllers/Private_handler";
import Homepage from "./Homepage";
import Menu_icon from "../images/menu.png"

// ROUTER needs to be improve
const { Header, Content, Footer } = Layout;
const Template = () => {
  const [users, setUsers] = useState<any | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const nav = document.getElementsByClassName("ant-menu-submenu")
  const nav1 = document.getElementsByClassName("ant-menu-submenu-hidden")
  async function isLogin() {
    try {
      var token = await Check_Login();
      setUsers(token);
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
  console.log(user);
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

 const CheckAuth = (role: any, Utype: string[]) => {
    // if used in more components, this should be in context
    console.log(Utype)

    let ulen = Utype.length
    if (role != null) {
      console.log(role.User_type);
      if (role.User_type != null) {
        console.log(role.User_type, " typeof", typeof role.User_type);

        let x=0;
        for (x; x<ulen;x++){
          console.log(Utype[x])
          if (role.User_type == Utype[x]){
            return true
          }
        }
      
      }
    }
    console.log("FALSE");
    return false;
    return true;
  };

  function nav_trigger(){
    console.log("ACTIVE")
    console.log(nav)
  if(nav.length >0){
    for (let x=0; x<nav.length;x++){
      nav[x].classList.add("ant-menu-submenu-active")
      nav[x].classList.add("ant-menu-submenu-open")
    }
  }
  }

  return (
    <div>
    <Layout className="layout">
      <Header>
        <div className="layout-menu">

        <h3 className="layout-title">Library Center</h3>
       
        <Menu theme="dark" mode="horizontal">
          {!user && (
            <Menu.Item key="0">
              <Link to="/">Main</Link>
            </Menu.Item>
          )}
              {!user && (
            <Menu.Item key="1">
              <Link to="/login">Log In</Link>
            </Menu.Item>
          )}
          {!user && (
            <Menu.Item key="4">
              <Link to="/signup">Sign Up</Link>
            </Menu.Item>
          )}

          {CheckAuth(user, ["ADMIN"]) && (
            <Menu.Item key="2">
              <Link to="/new">New</Link>
            </Menu.Item>
          )}



          {CheckAuth(user, ["ADMIN"]) && (
            <Menu.Item key="6">
              <Link to="/PrivateTable">Private Table</Link>
            </Menu.Item>
          )}
          {CheckAuth(user,["ADMIN", "USER"]) && (
            <Menu.Item key="3">
              <Link to="/Btable">BookTable</Link>
            </Menu.Item>
          )}
          {user && (
            <Menu.Item key="5">
              <span onClick={logout}>Logout</span>
            </Menu.Item>
          )}
        </Menu>
        </div> 
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
          <Route path="/Btable" element={<Bookintro />} />
        </Routes>
        <div className="site-layout-content">
          <Routes>
            <Route path="/btable" element={<BookTable />} />

            <Route
              path="/New"
              element={<ProtectedRoutes props={"ADMIN"} direction={"/"} />}
            >
              <Route path="/New" element={<Newform />} />
            </Route>
            {/* <Route path="/New" element={<Newform />} /> */}

            <Route path="/signup" element={<SignUp />} />
            <Route path="/private/login" element={<PrivateLogin />} />

            <Route
              path="/PrivateTable"
              element={<ProtectedRoutes props={"ADMIN"} />}
            >
              <Route path="/PrivateTable" element={<Private_Table />} />
            </Route>

            <Route path="/login" element={<Login_form />} />

            <Route path="/" element={<Homepage />} />
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

export default Template;
