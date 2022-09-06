import { Layout, Menu } from 'antd'
import { Content, Footer, Header } from 'antd/lib/layout/layout'
import React from 'react'
import { Link, Route, Routes, useNavigate } from 'react-router-dom'
import ProtectedRoutes from '../ProtectedRoutes';
import BookTable, { Bookintro } from './BookTable';
import Homepage from './Homepage';
import Login_form from './Login';
import NewBook, { NewItem } from './Newbook';
import PrivateLogin from './PrivateLogin';
import Private_Table from './Private_Table';
import SignUp from './Signup';
import { User_Logout } from '../controllers/user_handler';
import { logOut } from '../redux/userSlice';




function Custom_header(user:any) {
    const navigate = useNavigate()
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


    const CheckAuth = (role: any, Utype: string) => {
        // if used in more components, this should be in context
        if (role != null) {
          console.log(role.User_type);
          if (role.User_type != null) {
            console.log(role.User_type, " typeof", typeof role.User_type);
            console.log(Utype, " typeof", typeof Utype);
            if (String(role.User_type) == Utype) {
              return true;
            }
          
        }
        console.log("FALSE");
        return false;
      };
    
    
      return (
        <div>
          <Custom_header user={user}/>
        <Layout className="layout">
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
                  <Route path="/New" element={<NewBook />} />
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


  return (
    <div>      <Header>
    <div className="layout-menu" />
    <Menu theme="dark" mode="horizontal">
      {!user && (
        <Menu.Item key="1">
          <Link to="/">Main</Link>
        </Menu.Item>
      )}
       {!user && (
        <Menu.Item key="3">
          <Link to="/login">Login</Link>
        </Menu.Item>
      )}
      {!user && (
        <Menu.Item key="4">
          <Link to="/signup">Sign Up</Link>
        </Menu.Item>
      )}

      {CheckAuth(user, "ADMIN") && (
        <Menu.Item key="2">
          <Link to="/new">New</Link>
        </Menu.Item>
      )}



      {CheckAuth(user, "ADMIN") && (
        <Menu.Item key="6">
          <Link to="/PrivateTable">Private Table</Link>
        </Menu.Item>
      )}
      {CheckAuth(user,"USER") && (
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
    <h3 className="layout-title">Library Center</h3>
  </Header></div>
  )
}

export default Custom_header

function dispatch(arg0: any) {
    throw new Error('Function not implemented.');
}
