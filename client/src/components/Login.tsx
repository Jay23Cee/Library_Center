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
      //console.log(res.data);
      dispatch(loginSuccess(res.data));

      navigate("/booktable");
    } catch (error) {
      dispatch(loginFailure());
      setErrMsg("Email or Password are not correct");
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.error("Failed:", errorInfo);
  };

  const UserDemo = async () => {
    var res = await User_Login_DEMO();
    dispatch(loginSuccess(res.data));

    navigate("/booktable");
  };

  const PrivateDemo = async () => {
    var res = await Private_Login_DEMO();

    dispatch(loginSuccess(res.data));

    navigate("/booktable");
  };
  return (
    <section className="flex min-h-[calc(100vh-130px)] loginBg flex-col mt-[5.8rem] justify-center items-center px-10 sm:px-4">
      <div className="max-w-[450px] w-full flex gap-4 justify-center items-center flex-col">
        <h1 className="text-[30px] font-bold">Log In</h1>
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
          className=" w-full block flex-col justify-center items-center"
        >
          <Form.Item
            label="Email"
            className="w-full flex justify-center items-center"
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
            className="w-full flex justify-center items-center -mt-8 md:-mt-4"
            label="Password"
            name={["users", "Password"]}
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password className="w-[300px] h-[45px]" />
          </Form.Item>

          <Form.Item className="w-full flex justify-center items-center">
            <button
              className="bg-blue-main rounded-[6px] text-white-main hover:bg-blue-main text-[16px] font-semibold flex justify-center items-center hover:opacity-90 w-[110px] h-[44px]"
              type="submit"
            >
              Login
            </button>
          </Form.Item>
        </Form>

        <h1 className="text-[26px] font-bold text-black -mt-4">
          {" "}
          Demo: Login as
        </h1>
        <div className="flex justify-center items-center gap-4">
          <button
            onClick={() => {
              UserDemo();
            }}
            className="bg-blue-main rounded-[6px] text-white-main hover:bg-blue-main text-[16px] font-semibold flex justify-center items-center hover:opacity-90 w-[110px] h-[44px]"
          >
            *Client*
          </button>
          <button
            className="bg-blue-main rounded-[6px] text-white-main hover:bg-blue-main text-[16px] font-semibold flex justify-center items-center hover:opacity-90 w-[110px] h-[44px]"
            onClick={() => {
              PrivateDemo();
            }}
          >
            *Admin*
          </button>
        </div>
      </div>
    </section>
  );
};

export default Login_form;
