import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  Input,
  InputNumber,
  Popconfirm,
  Form,
  Typography,
  Button,
  Space,
  InputRef,
  Breadcrumb,
} from "antd";

import { Book } from "../models/books";
import { delete_book, edit_book, getbooks } from "../controllers/book_handler";
import type { ColumnsType, ColumnType, TableProps } from "antd/es/table";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { loginSuccess, logOut } from "../redux/userSlice";
import { Check_Login } from "../controllers/user_handler";
import UseAuth from "../ProtectedRoutes"
import { UploadFile } from "antd/lib/upload/interface";

export interface BookTableProps {
  Title: string;
  Author: string;
  Year: string;
  Publisher: string;
  Id: string;
  Key: string;
}


export const Private_Table: React.FC<{}> = () => {
  const user = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const originData: Book[] = [];

  const EditableTable = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState(originData);
    const [editingKey, setEditingKey] = useState("");
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef<InputRef>(null);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    useEffect(function effectFunction() {
      async function fetchBooks() {


        var data = await getbooks();
        setData(data);
        console.log(data)
      }
      fetchBooks();
    
    }, []);



     const handlePreview = async (file: UploadFile) => {
    console.log(file)
    console.log(typeof file)
 

    setPreviewImage(file.url || (file.preview as string));
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));

    console.log(previewTitle)
    console.log(previewImage)
   
  };

    const isEditing = (record: Book) => record.ID === editingKey;
    const isDeleting = (record: Book) => record.ID === editingKey;

    const onEdit = (record: Partial<Book> & { ID: React.Key }) => {
      form.setFieldsValue({ Title: "", Author: "", Date: "", ...record });
      setEditingKey(record.ID);
    };

    const onDelete = async (record: Partial<Book> & { ID: React.Key }) => {
      setEditingKey(record.ID);
  
      try {
        const row = (await form.validateFields()) as Book;

        const newData = [...data];
        const index = newData.findIndex((item) => record.ID === item.ID);

        if (index > -1) {
          const temp_book = { book: newData[index] };
          const JSON_string = JSON.stringify(temp_book);

          delete_book(JSON_string);

          const update = await getbooks();
          setData(update);
          setData(update);
          // action.startEditBook(newData[index]);
          setEditingKey("");
        } else {
          newData.push(row);

          const update = await getbooks();
          setData(update);
          setData(update);
          setEditingKey("");
        }
      } catch (errInfo) {
        console.error("Validate Failed:", errInfo);
      }
    };

    const cancel = () => {
      setEditingKey("");
    };

    const save = async (id: React.Key) => {
      try {
        const row = (await form.validateFields()) as Book;

        const newData = [...data];
        const index = newData.findIndex((item) => id === item.ID);

        if (index > -1) {
          const item = newData[index];
          newData.splice(index, 1, {
            ...item,
            ...row,
          });
          const temp_book = { book: newData[index] };
          const JSON_string = JSON.stringify(temp_book);

          edit_book(JSON_string);
          setData(newData);
          setEditingKey("");
        } else {
          newData.push(row);
          setData(newData);
          setEditingKey("");
        }
      } catch (errInfo) {
        console.error("Validate Failed:", errInfo);
      }
    };



    /**************************
     ******* Columns **********
     ******** of the *********
     ********* Table *********/



 
      const columns = [
        {
          title: "Action",
  
          dataIndex: "action",
          render: (_: any, record: Book) => {
            const editable = isEditing(record) || isDeleting(record);
            return editable ? (
              <span>
                <a
                  href="javascript:;"
                  onClick={() => save(record.ID)}
                  style={{ marginRight: 8 }}
                >
                  Save
                </a>
                <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                  <a>Cancel</a>
                </Popconfirm>
              </span>
            ) : (
              <Typography.Link>
                <Typography.Link
                  disabled={editingKey !== ""}
                  onClick={() => onEdit(record)}
                >
                  Edit
                </Typography.Link>
                <br></br>
                <Popconfirm
                  title="Sure to Delete?"
                  onConfirm={() => onDelete(record)}
                >
                  <a>Delete</a>
                </Popconfirm>
              </Typography.Link>
            );
          },
        },

        {
          title: "Title",
          dataIndex: "Title",
          key: "Title",
          width: "35%",
          sorter: (a: any, b: any) => a.Title.localeCompare(b.Title),
          editable: true,
        },
        {
          title: "Author",
          dataIndex: "Author",
          key: "Author",
          width: "25%",
          sorter: (a: any, b: any) => a.Author.localeCompare(b.Author),
          editable: true,
        },
        {
          title: "Publisher",
          dataIndex: "Publisher",
          key: "Publisher",
          width: "25%",
          sorter: (a: any, b: any) => a.Publisher.localeCompare(b.Publisher),
          editable: true,
        },
        {
          title: "Year",
          dataIndex: "Year",
          key: "Year",
          width: "15%",
          sorter: (a: any, b: any) => a.Year.localeCompare(b.Year),
          editable: true,
        },
        {
          title: "Img_url",
          dataIndex:"Img_url",
          key: "Img_url",
          width: "45%",
          editable: true,
          render:  (_: any, record: Book) => {
          console.log(record)
          return <img alt={record.Img_url} style={{ width: '100%' ,height:'100%'}} src={record.Img_url} /> }
        },
      ];
  
      
    //   return columns})
    

    const mergedColumns = columns.map((col) => {
      try {
        if (!col.editable) {
          return col;
        }
  
      } catch (error) {
        console.error(error.message())
      }
    
      const Getcolumn =(() => {
          

       
          return  mergedColumns;
        })

      return {
        ...col,
        onCell: (record: Book) => ({
          record,
          inputType: col.dataIndex === "date" ? "number" : "text",
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record),
          deleting: isDeleting(record),
        }),
      };
    });

    return (
      user && (
        <Form form={form} component={false}>
          <Table
            rowKey={(record) => record.ID}
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            bordered
            dataSource={data}
            columns={mergedColumns}
            rowClassName="editable-row"
            pagination={{
              onChange: cancel,
            }}
          />
        </Form>
      )
    );
  };

  return (
    <div>
      <EditableTable />
    </div>
  );
};

interface LinkStateProps {
  originData: Book[];
}

interface LinkDispatchProps {
  startEditBook: (book: Book) => void;
  startDeleteBook: (id: string) => void;
}

///////////////////////////////////////////
/////BELOW IS THE Ant Design Table////////
///////////////////////////////////////////

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  deleting: boolean;
  dataIndex: string;
  title: string;
  author: string;
  img:any;
  inputType: "number" | "text";
  record: Book;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  deleting,
  dataIndex,
  title,
  author,
  inputType,
  img,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const onChange: TableProps<Book>["onChange"] = (
  pagination,
  filters,
  sorter,
  extra
) => {
  console.log("params", pagination, filters, sorter, extra);
};

export const Bookintro = () => {
  return (
    <Breadcrumb style={{ margin: "16px 0" }}>
      <Breadcrumb.Item>Welcome to Library Center</Breadcrumb.Item>
    </Breadcrumb>
  );
};

export default Private_Table;
function dispatch(arg0: any) {
  throw new Error("Function not implemented.");
}
