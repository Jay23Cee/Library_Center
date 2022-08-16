import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {
  Form,
  Input,
  Button,
  Radio,
  Select,
  Cascader,
  DatePicker,
  InputNumber,
  TreeSelect,
  Switch,
  Checkbox,
  Upload,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserSignUp } from '../models/users';
import { User_Signup } from '../controllers/user_handler';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const SignUp = () => {
  const navigate = useNavigate();


 const  validateEmail=(email: string)=>{
    const pattern = /[a-zA-Z0-9]+[\.]?([a-zA-Z0-9]+)?[\@][a-z]{3,9}[\.][a-z]{2,5}/g;
    const result = pattern.test(email);
    if(result===true){
      // this.setState({
      //   emailError:false,
      //   email:email
      // })
    } else{
      // this.setState({
      //   emailError:true
      // })
    }
  }
  const onFinish = async (values: UserSignUp) => {
    try {
      
   
    console.log('Success:', values);
    // this.props.startNewBook(values)
    console.log(values)
    var res = await User_Signup(values)
      console.log("this is the res in login", res)
    navigate("/")
  } catch (error) {
      console.log(error)
  }
   


  };

  return (
    <section>
    <h1>SignUp</h1>

      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal" 
        onFinish={onFinish}>

  
        <Form.Item label="Name" name={['users', 'Name']}>
          <Input />
        </Form.Item>
        <Form.Item 
        label="Email" 
        name={['users', 'Email']}   
        rules={[
          {
            type: 'email',
            message: 'The input is not valid E-mail!',
          },
          { required: true, message: 'Please input your Email!', 
        },
        ]}
     

        >
          <Input />
        </Form.Item>

        <Form.Item label="Password" name={['users', 'Password'] }>
          <Input />
        </Form.Item>
       
    
       
      
        <Form.Item label="Upload" valuePropName="fileList">
          <Upload action="/upload.do" listType="picture-card">
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>
        </Form.Item>
        <Form.Item label="Button" >
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
        </Form.Item>
      </Form>
    </section>
  );
};

export default SignUp;