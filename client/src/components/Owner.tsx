import { Form, Input, Menu, Breadcrumb, Button } from "antd";
import React, { useEffect } from "react";
import { message } from "antd";
import { Book } from "../models/books";
import { Link, useNavigate } from "react-router-dom";
import { add_book } from "../controllers/book_handler";
import { formatTimeStr } from "antd/lib/statistic/utils";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, logOut } from "../redux/userSlice";
import { Check_Login } from "../controllers/user_handler";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

export const NewItem = () => {
  return (
    <Breadcrumb style={{ margin: "16px 0" }}>
      <Breadcrumb.Item>OWNER</Breadcrumb.Item>
      <Breadcrumb.Item></Breadcrumb.Item>
      <Breadcrumb.Item></Breadcrumb.Item>
    </Breadcrumb>
  );
};

export const NewMenu = () => {
  return (
    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
      <Menu.Item key="1">Home</Menu.Item>
      <Link to="/new">
        <Menu.Item key="2">New</Menu.Item>
      </Link>
    </Menu>
  );
};

const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not a valid email!",
    number: "${label} is not a valid number!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};

const Owner = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(function effectFunction() {
    async function fetchUser() {}
    fetchUser();
  }, []);

  const user = useSelector((state) => state.user.currentUser);
  const [form] = Form.useForm();

  const onFinish = async (values: Book) => {
    const JSON_string = JSON.stringify(values);

    try {
      await add_book(JSON_string, values);
      message.success("Success ====>");
      form.resetFields();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {user && (
<div>
    <p>This is OWNER VIEWS</p>
</div>
      )}
    </div>
  );
};

export default Owner;

function dispatch(arg0: { payload: any; type: string }) {
  throw new Error("Function not implemented.");
}
