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
  const [imgFile, setImgFile] = useState("");
  const [user, setUser] = useState("");
  const errRef = useRef<HTMLDivElement>(null);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    setErrMsg("");
  }, []);

  const onFinish = async (values: UserSignUp) => {
    try {
      var x = await User_Signup(values);
      //console.log(x);
      navigate("/");
    } catch (error) {
      console.error(error);
      setErrMsg("Email already exist");
    }
  };

  const onHandleChangeNumeric = () => {};

  return (
    <section className="flex min-h-[calc(100vh-130px)] loginBg flex-col gap-2 mt-[5.8rem] justify-center items-center px-10 sm:px-4">
      <h1 className="text-[30px] font-bold">SignUp</h1>

      <p
        ref={errRef}
        className={errMsg ? "errmsg" : "offscreen"}
        aria-live="assertive"
      >
        {errMsg}
      </p>

      <Form
        className="w-full flex flex-col justify-center items-center"
        name={"Sign-up-form-begin"}
        layout="horizontal"
        onFinish={onFinish}
        // className=" flex flex-col justify-center items-center"
      >
        <Form.Item
          className="w-full flex justify-center items-center"
          label="First_name"
          name={["users", "First_name"]}
          rules={[{ required: true, message: "Please enter your first name" }]}
        >
          <Input className="w-[300px] md:w-[400px] h-[44px]" />
        </Form.Item>
        <Form.Item
          className="w-full flex justify-center items-center -mt-8 md:-mt-4"
          label="Last_name"
          name={["users", "Last_name"]}
          rules={[{ required: true, message: "Please enter your last name" }]}
        >
          <Input className="w-[300px] md:w-[400px] h-[44px]" />
        </Form.Item>
        <Form.Item
          label="Phone"
          className="w-full flex justify-center items-center -mt-8 md:-mt-4"
          name={["users", "Phone"]}
          rules={[
            {
              required: true,
              message: "A value must be entered",
              pattern: new RegExp(/^[0-9]+$/),
            },
          ]}
        >
          <Input className="w-[300px] md:w-[400px] h-[44px]" />
        </Form.Item>

        <Form.Item
          label="Email"
          className="w-full flex justify-center items-center -mt-8 md:-mt-4"
          name={["users", "Email"]}
          rules={[
            {
              type: "email",
              message: "The input is not valid E-mail!",
            },
            { required: true, message: "Please input your Email!" },
          ]}
        >
          <Input className="w-[300px] md:w-[400px] h-[44px]" />
        </Form.Item>

        <Form.Item
          label="Password"
          className="w-full flex justify-center items-center -mt-8 md:-mt-4"
          name={["users", "Password"]}
          rules={[{ required: true, message: "Please enter a password" }]}
        >
          <Input.Password className="w-[300px] md:w-[400px] h-[44px]" />
        </Form.Item>

        <Form.Item className="sign-up-button">
          <button
            className="bg-blue-main rounded-[6px] text-white-main hover:bg-blue-main text-[16px] font-semibold flex justify-center items-center hover:opacity-90 w-[110px] h-[44px]"
            type="submit"
          >
            Submit
          </button>
        </Form.Item>
      </Form>

      <img src={imgFile} />
    </section>
  );
};

export default SignUp;
