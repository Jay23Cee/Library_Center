import { Form, Input, Menu, Breadcrumb, Button } from "antd";
import React, { useEffect, useState } from "react";
import { message } from "antd";
import { Book } from "../models/books";
import { Link, useNavigate } from "react-router-dom";
import { add_book, add_bulkbook } from "../controllers/book_handler";
import { formatTimeStr } from "antd/lib/statistic/utils";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, logOut } from "../redux/userSlice";
import { Check_Login } from "../controllers/user_handler";
import { PlusOutlined } from "@ant-design/icons";
import { Modal, Upload } from "antd";
import type { RcFile, UploadProps } from "antd/es/upload";
import type { UploadFile } from "antd/es/upload/interface";
import TextArea from "antd/lib/input/TextArea";
import { json } from "body-parser";
import { clearBooks } from "../redux/bookSlice";
import { addBulkBooks, clearBulkBooks } from "../redux/librarySlice";

export const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

export const NewItem = () => {
  return (
    <Breadcrumb style={{ margin: "16px 0" }}>
      <Breadcrumb.Item>New</Breadcrumb.Item>
      <Breadcrumb.Item>Library</Breadcrumb.Item>
      <Breadcrumb.Item>Book</Breadcrumb.Item>
    </Breadcrumb>
  );
};

export const NewMenu = () => {
  return (
    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
      <Menu items={[{ key: "1" }]}>Home</Menu>
      <Link to="/new">
        <Menu items={[{ key: "2" }]}>New</Menu>
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

const NewBulkBook = () => {
  const books1 = [];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { TextArea } = Input;
  const [jsonData, setJsonData] = useState("");

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [files_url, setFiles] = useState<string>("");

  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    let url = file.preview as string;

    setFiles(url);
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );

    // console.log(files_url , " last 91")
    // console.log(previewTitle)
    // console.log(previewImage)
  };

  const handleImage = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    // console.log(file.preview)
    let url = file.preview as string;
    // console.log(url)
    setFiles(url);
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );

    // console.log(files_url , " last 91")
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    handleImage(fileList[0]);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload Cover</div>
    </div>
  );

  useEffect(function effectFunction() {
    async function fetchUser() {}
    fetchUser();
  }, []);

  const user = useSelector((state: any) => state.user.currentUser);

  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    console.log(jsonData);
    console.log(values);

    const books: Book[] = JSON.parse(jsonData);
    console.log(books);
    add_bulkbook(jsonData, books);
  };

  const handleupload = (file: any, fileList: any) => {};

  return (
    <div className="mt-[5.8rem] min-h-[calc(100vh-130px)] p-4 loginBg">
      <Form form={form} onFinish={onFinish}>
        <Form.Item label="JSON Data" name="jsonData">
          <TextArea
            placeholder="Enter JSON data here"
            onChange={(e) => setJsonData(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <button
            className="bg-blue-main rounded-[6px] text-white-main hover:bg-blue-main text-[16px] font-semibold flex justify-center items-center hover:opacity-90 w-[110px] h-[40px]"
            type="submit"
          >
            Submit
          </button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default NewBulkBook;

function dispatch(arg0: { payload: any; type: string }) {
  throw new Error("Function not implemented.");
}
