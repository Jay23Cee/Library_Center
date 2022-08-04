 import { Layout, Menu, Breadcrumb } from 'antd';
 import React from 'react';
import '../App.scss'
import 'antd/dist/antd.min.css';
import BookTable, { Bookintro } from './BookTable'

import Newform, { NewItem } from './Newbook'
import { Link, Route } from 'react-router-dom';

// ROUTER needs to be improve
const { Header, Content, Footer } = Layout;
const Homepage = () => (
     
  <div >
   <Layout className="layout">
    <Header>
      <div className="layout-menu" />
      <Menu theme="dark" mode="horizontal" >
     
     
     <Menu.Item key="1"><Link to="/" >Home</Link></Menu.Item>
  
     <Menu.Item key="2"><Link to="/new">New</Link></Menu.Item>
   

      </Menu>
     <h3 className='layout-title'>Library Center</h3>

     
    </Header>
    <Content style={{ padding: '0 50px' }}>
      {/* <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>List</Breadcrumb.Item>
        <Breadcrumb.Item>App</Breadcrumb.Item>
      </Breadcrumb>
       */}
       <Route path="/New" component={NewItem}/>
        <Route exact path="/" component={Bookintro}/>
        
      
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