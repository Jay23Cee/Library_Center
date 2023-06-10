import { Form, Input, Menu, Breadcrumb, Button, Card } from "antd";
import React, { useEffect, useState } from "react";
import { message } from "antd";
import { Book } from "../models/books";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { add_book, add_bulkbook, edit_book } from "../controllers/book_handler";
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

const AdvanceEdit = () => {
  const { state } = useLocation();
  const bookRaw = useSelector((state: RootState) => state.book.data[0]); // Read values passed on state

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [modal, setModal] = useState<JSX.Element | null>(null);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(bookRaw.Img_url);
  const [previewTitle, setPreviewTitle] = useState(bookRaw.Img_title);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [files_url, setFiles_url] = useState<string>(bookRaw.Img_url);

  const handleCancel = () => {
    setPreviewOpen(false);
    setFileList([]);
    setPreviewImage(bookRaw.Img_url);
    setPreviewTitle(bookRaw.Img_title);
    setFiles_url(bookRaw.Img_url);
  };

  // Deleted getBase64() function

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    let url = file.preview as string;

    //  setFiles(url )
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
    // setFiles(url )
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );

    console.log(files_url, " last 91");
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    // Reset fileList

    if (newFileList.length > 1) {
      const items = document.querySelectorAll(
        ".ant-upload-list-item-container"
      );
      for (let i = 0; i < items.length - 1; i++) {
        items[i].remove();
      }

      const singleFileList = [newFileList[newFileList.length - 1]];
      setFileList(singleFileList);
      console.log(singleFileList);
      handleImage(singleFileList[0]);
    } else {
      setFileList(newFileList);
      handleImage(newFileList[0]);
    }

    console.log(newFileList.length > 1);
    console.log(newFileList);
    console.log(fileList);
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

  // const user = useSelector((state) => state.user.currentUser);

  const [form] = Form.useForm();

  const onFinish = async (values: Book) => {
    const formData = new FormData();
    formData.append("Title", values.Title);
    formData.append("Author", values.Author);
    formData.append("Publisher", values.Publisher);
    formData.append("Year", values.Year);
    formData.append("Summary", values.Summary);
    formData.append("ID", bookRaw.ID);
    if (fileList.length > 0) {
      formData.append(
        "Img",
        fileList[0].originFileObj as any,
        fileList[0].name
      ); // append file to formData
    }

    try {
      await edit_book(formData);
      message.success("Success ====>");
      console.log("FUNCTION BEFORE DISPATCH");

      dispatch(clearBulkBooks());
      console.log("AFTER DISPATCH");
      navigate("/PrivateTable");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-130px)] flex flex-col gap-4 justify-center items-center ite mt-[5.8rem] py-10 loginBg">
      <h1 className="text-[26px] font-semibold text-blue-main">Book Editing</h1>
      <div className="w-full grid lg:gap-0 gap-10 grid-cols-1 justify-center items-center lg:grid-cols-2">
        <div className="w-full flex justify-center items-center">
          <Form
            className=" w-full flex flex-col justify-center items-center"
            {...layout}
            initialValues={bookRaw}
            form={form}
            onFinish={onFinish}
            validateMessages={validateMessages}
          >
            <Form.Item
              className="advanceEdit"
              name="Title"
              label="Title"
              rules={[{ required: true }]}
            >
              <TextArea autoSize />
            </Form.Item>
            <Form.Item
              className="advanceEdit -mt-4 md:-mt-0"
              name="Author"
              label="Author"
              rules={[{ required: true }]}
            >
              <TextArea autoSize />
            </Form.Item>
            <Form.Item
              className="advanceEdit -mt-4 md:-mt-0"
              name="Publisher"
              label="Publisher"
              style={{ overflow: "auto" }}
              rules={[{ required: true }]}
            >
              <TextArea autoSize />
            </Form.Item>
            <Form.Item
              className="advanceEdit -mt-4 md:-mt-0"
              name="Year"
              label="Year"
              rules={[{ required: true }]}
            >
              <TextArea autoSize />
            </Form.Item>
            <Form.Item
              className="advanceEdit -mt-4 md:-mt-0"
              name="Summary"
              label="Summary"
              rules={[{ required: true }]}
            >
              <TextArea autoSize />
            </Form.Item>

            <div className="w-full flex md:flex-row flex-col gap-3 justify-center items-center">
              <div>
                <Upload
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  fileList={fileList}
                  listType="picture-card"
                  accept=".jpg ,.jpeg, .png"
                  onPreview={handlePreview}
                  onChange={handleChange}
                >
                  {fileList.length >= 2 ? null : uploadButton}
                </Upload>
                {/* <Modal
            open={previewOpen}
            title={previewTitle}
            footer={null}
            onCancel={handleCancel}
          >
            <img alt="example" style={{ width: "100%" }} src={previewImage} />
          </Modal>
           */}
                {modal}
              </div>

              <div className="flex gap-2">
                <button
                  className="bg-blue-main rounded-[6px] text-white-main hover:bg-blue-main text-[16px] font-semibold flex justify-center items-center hover:opacity-90 w-[110px] h-[44px]"
                  type="submit"
                >
                  Submit
                </button>
                <button
                  className="bg-transparent border-[2px] border-blue-main hover:text-white-main rounded-[6px] text-black-main hover:bg-blue-main text-[16px] font-semibold flex justify-center items-center w-[110px] h-[44px]"
                  type="button"
                  onClick={() => {
                    // dispatch(clearBooks())
                    navigate("/privatetable");
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Form>
        </div>
        <Card
          className=" w-full bg-transparent h-full flex justify-center items-center"
          cover={<img src={previewImage} alt={previewImage} />}
          // cover={
          //   <img className="h-[450px]" src="/book.jpeg" alt={previewImage} />
          // }
        ></Card>
      </div>
    </div>
  );
};

export default AdvanceEdit;

function dispatch(arg0: { payload: any; type: string }) {
  throw new Error("Function not implemented.");
}
