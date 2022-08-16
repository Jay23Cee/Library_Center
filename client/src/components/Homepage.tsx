import { Layout, Menu, Breadcrumb } from 'antd';
import React from 'react';
import '../App.scss'
import 'antd/dist/antd.min.css';
import BookTable, { Bookintro } from './BookTable'

import Newform, { NewItem } from './Newbook'
import { Link, Route , Routes, useNavigate} from 'react-router-dom';
import LoginDemo from './Login';
import { GuestTable } from './GuestTable';
import SignUp from './Signup';
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '../redux/userSlice';
import { User_Logout } from '../controllers/user_handler';
import NewBook from './Newbook';


// ROUTER needs to be improve
const { Header, Content, Footer } = Layout;
const Homepage = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

const user = useSelector((state) => state.user.currentUser);
console.log(user)

const logout = async () => {
    // if used in more components, this should be in context 
    // axios to /logout endpoint
    var ok = await User_Logout()
    if (ok != null){
        return ok
    }
    dispatch(logOut());
    navigate('/');
}

return (

<div >
<Layout className="layout">
<Header>
<div className="layout-menu" />
<Menu theme="dark" mode="horizontal" >


{!user &&<Menu.Item key="1"><Link to="/" >Login</Link></Menu.Item>}
{user &&<Menu.Item key="2"><Link to="/new">New</Link></Menu.Item>}


{user && <Menu.Item key="3"><Link to="/admin">Main</Link></Menu.Item>}

{!user && <Menu.Item key="4"><Link to="/signup">Sign Up</Link></Menu.Item>}
{user && <Menu.Item key="5"><span onClick={logout}>Logout</span></Menu.Item>}


</Menu>
<h3 className='layout-title'>Library Center</h3>


</Header>
<Content style={{ padding: '0 50px' }}>
{/* <Breadcrumb style={{ margin: '16px 0' }}>
<Breadcrumb.Item>Home</Breadcrumb.Item>
<Breadcrumb.Item>List</Breadcrumb.Item>
<Breadcrumb.Item>App</Breadcrumb.Item>
</Breadcrumb>
*/} <Routes>

<Route path="/New" element={<NewItem/>}/>
<Route path="/admin" element={<Bookintro/>}/>
</Routes>


<div className="site-layout-content">
<Routes>
<Route path="/admin" element={<BookTable/>}/>
<Route path="/guest" element={<GuestTable/>}/>
<Route path="/New" element={<Newform/>}/>
<Route path="/signup" element={<SignUp/>}/>


<Route path="/" element={<LoginDemo/>}/>

</Routes>

</div>
</Content>
<Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
</Layout>
</div>

);
}

export default Homepage;