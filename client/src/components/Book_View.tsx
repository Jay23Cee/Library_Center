import { Form, Input, Menu, Breadcrumb, Card } from "antd";
import React, { useState } from "react";
import { message } from "antd";
import { Book } from "../models/books";
import { Link, useNavigate } from "react-router-dom";
import { edit_book } from "../controllers/book_handler";
import { useDispatch, useSelector } from "react-redux";
import type { RcFile, UploadProps } from "antd/es/upload";
import type { UploadFile } from "antd/es/upload/interface";
import { clearBooks } from "../redux/bookSlice";

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

type RootState = {
  book: {
    data: Book[];
  };
};

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

export const NewItem = () => {
  return (
    <Breadcrumb style={{ margin: "16px 0" }}>
      <Breadcrumb.Item>Advance Edit</Breadcrumb.Item>
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

const Book_View = () => {
  const bookRaw = useSelector((state: RootState) => state.book.data[0]); // Read values passed on state
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [previewImage, setPreviewImage] = useState(bookRaw.Img_url);
  const [previewTitle, setPreviewTitle] = useState(bookRaw.Img_title);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [files_url, setFiles_url] = useState<string>(bookRaw.Img_url);

  const handleImage = async (file: UploadFile) => {
    console.log(file);
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    let url = file.preview as string;

    setFiles_url(url);
    setPreviewImage(file.url || (file.preview as string));

    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    handleImage(fileList[0]);
  };

  ////////////////////
  //////Text Area/////
  ////////////////////
  const TextArea = Input.TextArea;
  const [form] = Form.useForm();

  const onFinish = async (values: Book) => {
    const book = {
      Title: values.Title,
      Author: values.Author,
      Publisher: values.Publisher,
      Year: values.Year,
      Summary: values.Summary,
      Img_url: files_url,
      Img: JSON.stringify(fileList[0]),
      ID: bookRaw.ID,
    };

    const payload = {
      book,
    };

    console.log(book, "| new payload");
    console.log(bookRaw, " |\n RawBook");

    const JSON_string = JSON.stringify(payload);

    try {
      // await edit_book(JSON_string);
      message.success("Success ====>");
      console.log("FUNCTION BEFORE DISPATCH");

      dispatch(clearBooks());

      console.log("AFTER DISPATCH");
      navigate("/PrivateTable");
      // form.resetFields();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-130px)] grid grid-cols-1 lg:gap-0 gap-10 lg:grid-cols-2 justify-center items-center ite mt-[5.8rem] py-10 loginBg">
      <Form
        className=" w-full flex flex-col justify-center items-center"
        {...layout}
        initialValues={bookRaw}
        form={form}
        onFinish={onFinish}
        validateMessages={validateMessages}
      >
        <Form.Item className="bookView" name="Title" label="Title">
          <TextArea name="Title-input" readOnly autoSize />
        </Form.Item>
        <Form.Item
          className="bookView -mt-4 md:-mt-0"
          name="Author"
          label="Author"
        >
          <TextArea readOnly autoSize />
        </Form.Item>
        <Form.Item
          className="bookView -mt-4 md:-mt-0"
          name="Publisher"
          label="Publisher"
        >
          <TextArea readOnly autoSize />
        </Form.Item>
        <Form.Item className="bookView -mt-4 md:-mt-0" name="Year" label="Year">
          <TextArea readOnly autoSize />
        </Form.Item>
        <Form.Item
          className="bookView -mt-4 md:-mt-0"
          name="Summary"
          label="Summary"
        >
          <TextArea
            readOnly
            autoSize
            className="summary-textarea"
            value={bookRaw.Summary}
          />
        </Form.Item>
      </Form>
      <Card
        className=" w-full bg-transparent h-full flex justify-center items-center"
        cover={
          <img
            className="w-full max-w-[400px] h-[450px]"
            src={previewImage}
          
            alt={previewImage}
          />
        }
      ></Card>
    </div>
  );
};

export default Book_View;
