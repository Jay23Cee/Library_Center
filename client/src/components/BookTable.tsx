import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  Input,
  InputNumber,
  Form,
  Breadcrumb,
} from "antd";

import { Book } from "../models/books";
import {getbooks } from "../controllers/book_handler";
import { useDispatch, useSelector } from "react-redux";
import {  useNavigate } from "react-router-dom";
import { addBulkBooks } from "../redux/librarySlice";
import { addBook, clearBooks } from "../redux/bookSlice";

export interface BookTableProps {
  Title: string;
  Author: string;
  Year: string;
  Publisher: string;
  Id: string;
  Key: string;
}


export const Private_Table: React.FC<{}> = () => {
  const user = useSelector((state:any) => state.user.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const originData: Book[] = [];

  const EditableTable = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState(originData);
    const [editingKey, setEditingKey] = useState("");

    const library = useSelector((state: any) => state.library);

    useEffect(function effectFunction() {
dispatch(clearBooks())
      
          async function fetchBooks() {
            var data = await getbooks();
            setData(data);
            dispatch(addBulkBooks(data))
      
          }

      // Check if the library data is present in the store
      console.log(library)
      console.log(!library.library.length , " length is :", library.library.length)
      console.log(Boolean(library))
      if (!library.library.length) {
        fetchBooks();
        
      }else{
        setData(library.library)
      }
    
    }, []);



  

  const handleTitleClick = (record: Book) => {
    dispatch(addBook(record as Book));
    navigate("/BookView");
  };
  
  const handleCoverClick = (record: Book) => {
    dispatch(addBook(record as Book));
    navigate("/BookView");
  };

    const isEditing = (record: Book) => record.ID === editingKey;
    const isDeleting = (record: Book) => record.ID === editingKey;



    const cancel = () => {
      setEditingKey("");
    };




    /**************************
     ******* Columns **********
     ******** of the *********
     ********* Table *********/



 
      const columns = [

        {
          title: "Cover",
          
          key: "Img_url",
          width: "35%",
          editable: false,
          render:  (_: any, record: Book) => {
          return <img onClick={() => handleCoverClick(record)} alt={record.Img_url} style={{ width: '60%' ,height:'100%'}} src={record.Img_url} /> }
        },


        {
          title: "Title",
          dataIndex: "Title",
          key: "Title",
          width: "25%",
          sorter: (a: any, b: any) => a.Title.localeCompare(b.Title),
          editable: true,
          render: (_:any, record: Book) => (
            <a onClick={() => handleTitleClick(record)}>{record.Title}</a>
          ),
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


export const Bookintro = () => {
  return (
    <Breadcrumb style={{ margin: "16px 0" }}>
      <Breadcrumb.Item>Welcome to Library Center</Breadcrumb.Item>
    </Breadcrumb>
  );
};

export default Private_Table;

function setPreviewImage(arg0: string) {
  throw new Error("Function not implemented.");
}

