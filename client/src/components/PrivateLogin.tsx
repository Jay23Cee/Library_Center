import { Button, Checkbox, Form, Input, message } from "antd";
import form from "antd/lib/form";
import React from "react";
import { useRef, useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { add_book } from "../controllers/book_handler";
import { UserLogin } from "../models/users";
import { User_Login } from "../controllers/user_handler";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginFailure, loginStart, loginSuccess } from "../redux/userSlice";
import { Private_Login } from "../controllers/Private_handler";

const PrivateLogin: React.FC = () => {
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

      var res = await Private_Login(values);

      dispatch(loginSuccess(res.data));

      navigate("/PrivateTable");
    } catch (error) {
      dispatch(loginFailure());
      setErrMsg("Email or Password are not correct");
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.error("Failed:", errorInfo);
  };

  return (
    <section className="flex min-h-[calc(100vh-130px)] loginBg flex-col gap-3 mt-[5.8rem] justify-center items-center px-10 sm:px-4">
      <h1 className="text-[30px] font-bold">Log In</h1>
      <p
        ref={errRef}
        className={errMsg ? "errmsg" : "offscreen"}
        aria-live="assertive"
      >
        {errMsg}
      </p>
      <Form
        className="w-full flex-col flex justify-center items-center"
        name="basic"
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
          <Input className="w-[300px] h-[45px]" />
        </Form.Item>

        <Form.Item
          label="Password"
          name={["users", "Password"]}
          className="-mt-4"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password className="w-[300px] h-[45px]" />
        </Form.Item>

        <Form.Item name={["users", "Remember"]} valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item>
          <button
            className="bg-blue-main rounded-[6px] text-white-main hover:bg-blue-main text-[16px] font-semibold flex justify-center items-center hover:opacity-90 w-[110px] h-[44px]"
            type="submit"
          >
            Submit
          </button>
        </Form.Item>
      </Form>
    </section>
  );
};

export default PrivateLogin;
