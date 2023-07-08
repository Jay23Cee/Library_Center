import { Form, Input, Menu, Breadcrumb, Button, Select } from "antd";

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
import { clearBulkBooks } from "../redux/librarySlice";
import { Navcolor } from "./Template";

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


export    const bookCategories = [
  "Action and Adventure",
  "Classics",
  "Detective and Mystery",
  "Fantasy",
  "Historical Fiction",
  "Horror",
  "Romance",
  "Science Fiction",
  "Thriller",
  "Young Adult",
];


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

const NewBook = () => {
  const books1 = [];
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

    console.log(files_url, " last 91");
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

  const onFinish = async (values: Book) => {
    console.log(values);
    console.log(values.Title);
    const formData = new FormData();
    console.log(formData);
    formData.append("Title", values.Title);
    console.log(formData);
    formData.append("Author", values.Author);
    console.log(formData);
    formData.append("Publisher", values.Publisher);
    console.log(formData);
    formData.append("Year", values.Year);
    formData.append("Summary", values.Summary);
    if (fileList[0]?.originFileObj) {
      // Check if originFileObj is defined
      formData.append("Img", fileList[0].originFileObj, fileList[0].name); // Append the file if it exists
    }
    console.log([...formData.entries()]);
    try {
      await add_book(formData);
      // navigate("/booktable");
      // form.resetFields();
    } catch (error) {
      console.error(error);
    }
  };

  // const onFinish = async (values: Book) => {

  //   const books =  {

  //         Title: values.Title,
  //         Author: values.Author,
  //         Publisher: values.Publisher,
  //         Year: values.Year,
  //         Summary: values.Summary,
  //         Img_url: files_url as string,
  //         Img: JSON.stringify(fileList[0])
  //       }

  //       const payload = {
  //         books
  //       };

  //       console.log(books)

  //   const JSON_string = JSON.stringify(payload);

  //   try {

  //     await add_book(JSON_string, payload);
  //   //  dispatch(clearBulkBooks());
  //   //   navigate("/booktable")
  //     // form.resetFields();
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };


  const handleupload = (file: any, fileList: any) => {};
Navcolor()
  return (
    <div className="w-full min-h-[calc(100vh-130px)] flex justify-center ite mt-[5.8rem] py-10 loginBg">
<Form
  className="w-full flex flex-col justify-center items-center"
  {...layout}
  form={form}
  name="NewBook_Form_Input"
  onFinish={onFinish}
  validateMessages={validateMessages}
>
  <Form.Item name="Title" label="Title" rules={[{ required: true }]}>
    <Input className="w-[300px] sm:w-[500px] h-[45px] text-sm sm:text-lg" />
  </Form.Item>
  <Form.Item name="Author" label="Author" rules={[{ required: true }]}>
    <Input className="w-[300px] sm:w-[500px] h-[45px] text-sm sm:text-lg" />
  </Form.Item>
  <Form.Item
    name="Publisher"
    label="Publisher"
    rules={[{ required: true }]}
  >
    <Input className="w-[300px] sm:w-[500px] h-[45px] text-sm sm:text-lg" />
  </Form.Item>
  <Form.Item name="Year" label="Year" rules={[{ required: true }]}>
    <Input className="w-[300px] sm:w-[500px] h-[45px] text-sm sm:text-lg" />
  </Form.Item>
  {/* Category Dropdown Form Item */}
  <Form.Item name="Category" label="Category" rules={[{ required: true }]}>
    <Select className="form-category h-[45px] text-sm sm:text-lg" placeholder="Select a book category">
      {bookCategories.map((category) =>(
        <Select.Option value={category} key={category}>
          {category}
        </Select.Option>
      ))}
    </Select>
  </Form.Item>
  <Form.Item
    className="newBook"
    name="Summary"
    label="Summary"
    rules={[{ required: true }]}
  >
    <TextArea className="w-[300px] sm:w-[500px] h-[90px] text-sm sm:text-lg" />
  </Form.Item>

  {/* Link Form Item */}
  <Form.Item name="Link" label="Link" rules={[{ required: true, type: 'url', message: 'Please enter a valid URL!' }]}>
    <Input className="w-[300px] sm:w-[500px] h-[45px] text-sm sm:text-lg" />
  </Form.Item>

  <Form.Item>
    <Upload
      className="upload-button"
      listType="picture-card"
      accept=".jpg,.jpeg,.png"
      onPreview={handlePreview}
      onChange={handleChange}
      beforeUpload={handleupload}
    >
      {fileList.length >= 8 ? null : uploadButton}
    </Upload>

    <Modal
      open={previewOpen}
      title={previewTitle}
      footer={null}
      onCancel={handleCancel}
    >
      <img alt="example" style={{ width: "100%" }} src={previewImage} />
    </Modal>
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

    </div>
  );
};

export default NewBook;

function dispatch(arg0: { payload: any; type: string }) {
  throw new Error("Function not implemented.");
}
