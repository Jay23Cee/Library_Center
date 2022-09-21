import React, { useEffect, useRef, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
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
} from "antd";
import { useNavigate } from "react-router-dom";
import { UserSignUp } from "../models/users";
import { User_Signup } from "../controllers/user_handler";

const SignUp = () => {
  const navigate = useNavigate();
  const [imgFile, setImgFile] = useState('');
  const [user, setUser] = useState("");
  const errRef = useRef<HTMLDivElement>(null);
  const [errMsg, setErrMsg] = useState("");


  useEffect(() => {
    setErrMsg("");
  }, []);



  
  const onFinish = async (values: any) => {
    try {
      console.log(values)
      console.log(typeof( values.users.img), " img data type")
      setImgFile(values.users.img)
      var x = await User_Signup(values);
      console.log(x);
      navigate("/");
    } catch (error) {
      console.error(error);
      setErrMsg("Email already exist");
    }
  };













  

  return (
    <section className="Sign-up-form">
      <h1>SignUp</h1>

      <p
        ref={errRef}
        className={errMsg ? "errmsg" : "offscreen"}
        aria-live="assertive"
      >
        {errMsg}
      </p>

      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        onFinish={onFinish}
        
      >
        <Form.Item label="First_name" name={["users", "First_name"]}>
          <Input />
        </Form.Item>
        <Form.Item label="Last_name" name={["users", "Last_name"]}>
          <Input />
        </Form.Item>
        <Form.Item label="Phone" name={["users", "Phone"]}
            rules={[{ 
              required: true, 
              message: "A value must be entered",
              pattern: new RegExp(/^[0-9]+$/)
          }]}>
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name={["users", "Email"]}
          rules={[
            {
              type: "email",
              message: "The input is not valid E-mail!",
            },
            { required: true, message: "Please input your Email!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Password" name={["users", "Password"]}>
          <Input.Password />
        </Form.Item>

       
        <Form.Item label="Complete:">
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>

      <img src={imgFile}/>
          </section>
  );
};

export default SignUp;
