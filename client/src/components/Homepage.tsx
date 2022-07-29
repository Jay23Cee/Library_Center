 import { Layout, Menu, Breadcrumb } from 'antd';
 import React from 'react';
import '../App.css'
import 'antd/dist/antd.min.css';
import BookTable from './BookTable'

import Newform from './Newbook'
import { Link, Route } from 'react-router-dom';

// ROUTER needs to be improve
const { Header, Content, Footer } = Layout;
const Homepage = () => (
     
  <div >
   <Layout className="layout">
    <Header>
      <div className="logo" />
      <Menu theme="dark" mode="horizontal" >
     
     
      <Menu.Item key="1"><Link to="/">Home</Link></Menu.Item>
  
     <Menu.Item key="2"><Link to="/new">New</Link></Menu.Item>

      </Menu>
    </Header>
    <Content style={{ padding: '0 50px' }}>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>List</Breadcrumb.Item>
        <Breadcrumb.Item>App</Breadcrumb.Item>
      </Breadcrumb>
      
      <div className="site-layout-content">
       <Route exact path="/" component={BookTable}/> 
       <Route path="/New" component={Newform}/>
       
        </div>
    </Content>
    <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
  </Layout>
  </div>
        
);

export default Homepage;