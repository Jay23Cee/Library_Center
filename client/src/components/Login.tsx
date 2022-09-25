import { Button, Checkbox, Form, Input, message } from "antd";
import form from "antd/lib/form";
import React from "react";
import { useRef, useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { add_book } from "../controllers/book_handler";
import { UserLogin } from "../models/users";
import { Private_Login_DEMO } from "../controllers/Private_handler";
import { User_Login, User_Login_DEMO } from "../controllers/user_handler";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginFailure, loginStart, loginSuccess } from "../redux/userSlice";

const Login_form: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userRef = useRef<HTMLDivElement>(null);
  const errRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const onFinish = async (values: UserLogin) => {
    dispatch(loginStart());
    try {
      // this.props.startNewBook(values)

      var res = await User_Login(values);
      console.log(res.data);
      dispatch(loginSuccess(res.data));

      navigate("/Btable");
    } catch (error) {
      dispatch(loginFailure());
      setErrMsg("Email or Password are not correct");
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.error("Failed:", errorInfo);
  };

  const UserDemo = async() => {
    console.log("LOG IN AS USER");
   var res = await User_Login_DEMO();
    console.log(res.data);
    dispatch(loginSuccess(res.data));

    navigate("/Btable");
  };

  const PrivateDemo = async() => {
    console.log("LOG IN AS Admin")
   var res = await Private_Login_DEMO()
    console.log(res.data);
    dispatch(loginSuccess(res.data));

    navigate("/Btable");
  };
  return (
    <section className="Login-Form">
      <h1 className="LogIn-Title">Log In</h1>
      <p
        ref={errRef}
        className={errMsg ? "errmsg" : "offscreen"}
        aria-live="assertive"
      >
        {errMsg}
      </p>
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

        <Form.Item
          label="Password"
          name={["users", "Password"]}
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>

      <div className="Demo-Login">
        <h1> Demo: Login as</h1>
        <Button
          type="primary"
          onClick={() => {
            UserDemo();
          }}
        >
          *Client*
        </Button>
        <Button
          type="primary"
          onClick={() => {
            PrivateDemo();
          }}
        >
          *Admin*
        </Button>
      </div>
    </section>
  );
};

export default Login_form;
