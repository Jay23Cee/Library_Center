import { Button, Checkbox, Form, Input, message } from 'antd';
import form from 'antd/lib/form';
import React from 'react';
import {useRef, useState,useEffect} from 'react';
import { Link, Navigate } from 'react-router-dom';
import { add_book } from '../books/data_handler';
import { UserLogin } from '../users/users';
import { User_Login } from '../users/user_handler';
import {Routes, Route, useNavigate} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginFailure, loginStart, loginSuccess } from '../redux/userSlice';


const LoginDemo: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userRef = useRef<HTMLDivElement>(null);
  const errRef = useRef<HTMLDivElement>(null);

  const [user,setUser] = useState('')
  const [pwd, setPwd] = useState('')
  const [errMsg,setErrMsg] = useState('')



useEffect(()=>{
  setErrMsg('')
},[user,pwd])

  const onFinish = async (values: UserLogin) => {
       dispatch(loginStart())
    try {


  
    dispatch(loginSuccess(values.users.Email))
    // this.props.startNewBook(values)

    var res = await User_Login(values)
      console.log("this is the res in login", res)
    navigate("/admin")
  } catch (error) {
    dispatch(loginFailure())
      setErrMsg("Email or Password are not correct")
  }



  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <section>
      <h1 className="LogIn-Title">Log In</h1>
    <p ref={errRef} className={errMsg ? "errmsg":"offscreen"} aria-live="assertive">{errMsg}</p>
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      >
      <Form.Item
        label="Email"
        name={['users', 'Email']}
        rules={[{ required: true, message: 'Please input your Email!' }]}
        >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name={['users', 'Password']}
        rules={[{ required: true, message: 'Please input your password!' }]}
        >
        <Input.Password />
      </Form.Item>

      <Form.Item name={['users', 'Remember']} valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
    </section>
  );
};

export default LoginDemo;