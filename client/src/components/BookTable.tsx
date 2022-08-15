import React, { useState, useEffect ,useRef,} from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Button,Space, InputRef, Breadcrumb} from 'antd';
import {Book} from '../books/books';
import {  delete_book, edit_book, getbooks } from  '../books/data_handler';
import type { ColumnsType, ColumnType,TableProps } from 'antd/es/table';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export interface BookTableProps{
  Title: string;
  Author: string;
  Year: string;
  Publisher: string;
  Id: string;
  Key:string;

}



export const BookTable: React.FC<{}> = () =>{
const user  = useSelector((state) => state.user.currentUser);
console.log(user,' from book table')
 const  originData: Book[] =[];

    const EditableTable = () => {
      const [form] = Form.useForm();
      const [data, setData] = useState(originData);
      const [editingKey, setEditingKey] = useState('');
      const [searchText, setSearchText] = useState('');
      const [searchedColumn, setSearchedColumn] = useState('');
      const searchInput = useRef<InputRef>(null);


     useEffect(function effectFunction() {
        async function fetchBooks() {
           var data = await getbooks()
           setData(data);

        }
        fetchBooks();
    }, []);

      const isEditing = (record: Book) => record.ID === editingKey;
      const isDeleting  = (record: Book) => record.ID === editingKey;


      const onEdit = (record: Partial<Book> & { ID: React.Key }) => {
        form.setFieldsValue({ Title: '', Author: '', Date: '', ...record });
        setEditingKey(record.ID);

      };



      const onDelete =async (record: Partial<Book> & { ID: React.Key }) => {
        setEditingKey(record.ID);

        try {
          const row = (await form.validateFields()) as Book;

          const newData = [...data];
          const index = newData.findIndex(item =>record.ID === item.ID);

          if (index > -1) {

            const temp_book = {"book": newData[index]}
            const JSON_string = JSON.stringify(temp_book)

           delete_book(JSON_string)

           const update= await getbooks()
           setData(update)
           setData(update)
          // action.startEditBook(newData[index]);
           setEditingKey('');

          } else {
            newData.push(row);

            const update= await getbooks()
           setData(update)
           setData(update)
            setEditingKey('');

          }

        } catch (errInfo) {
          console.log('Validate Failed:', errInfo);
        }

      };



      const cancel = () => {
        setEditingKey('');
      };



      const save = async (id: React.Key) => {
        try {
          const row = (await form.validateFields()) as Book;

          const newData = [...data];
          const index = newData.findIndex(item => id === item.ID);

          if (index > -1) {
            const item = newData[index];
            newData.splice(index, 1, {
              ...item,
              ...row,
            });
            const temp_book = {"book": newData[index]}
            const JSON_string = JSON.stringify(temp_book)


            edit_book(JSON_string)
            setData(newData);
            setEditingKey('')
          } else {
            newData.push(row);
            setData(newData);
            setEditingKey('');
          }
        } catch (errInfo) {
          console.log('Validate Failed:', errInfo);
        }
      };


      /**************************
       ******* Columns **********
       ******** of the *********
       ********* Table *********/
      const columns = [
        {
          title: 'Action',

          dataIndex: 'action',
          render: (_: any, record: Book) => {
            const editable = isEditing(record) || isDeleting(record);
            return editable ? (
              <span>
                <a href="javascript:;" onClick={() => save(record.ID)} style={{ marginRight: 8 }}>
                  Save
                </a>
                <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                  <a>Cancel</a>
                </Popconfirm>
              </span>

            ) : (
              <Typography.Link >
                <Typography.Link disabled={editingKey !== ''} onClick={() =>onEdit(record)}>
                 Edit
                </Typography.Link>
                <br></br>
              <Popconfirm title="Sure to Delete?" onConfirm={() => onDelete(record)}>
                  <a>Delete</a>
                </Popconfirm>
              </Typography.Link>
            );
          },
        },
        {
          title: 'Title',
          dataIndex: 'Title',
          key:'Title',
          width: '35%',
          sorter: (a:any, b:any) => a.Title.localeCompare(b.Title),
          editable: true,

        },
        {
          title: 'Author',
          dataIndex: 'Author',
          key:'Author',
          width: '25%',
           sorter: (a:any, b:any) => a.Author.localeCompare(b.Author),
          editable: true,
        },
        {
          title: 'Publisher',
          dataIndex: 'Publisher',
          key:'Publisher',
          width: '25%',
          sorter: (a:any, b:any) => a.Publisher.localeCompare(b.Publisher),
          editable: true,
        },
        {
          title: 'Year',
          dataIndex: 'Year',
          key:'Year',
          width: '15%',
          sorter: (a:any, b:any) => a.Year.localeCompare(b.Year),
          editable: true,
        },


      ];

      const mergedColumns = columns.map(col => {

          if (!col.editable) {
            return col;
          }

          return {
            ...col,
            onCell: (record: Book) => ({
              record,
              inputType: col.dataIndex === 'date' ? 'number' : 'text',
              dataIndex: col.dataIndex,
              title: col.title,
              editing: isEditing(record),
              deleting: isDeleting(record),
            }),
          };
        });

      return (
     user &&  <Form form={form} component={false} >
        <Table
        rowKey={record => record.ID}
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
      );
    };


    return (
      <div>
        <EditableTable/>
      </div>
    );
  }







interface LinkStateProps {
originData: Book[];
}

interface LinkDispatchProps{
  startEditBook: (book : Book) => void;
  startDeleteBook: (id:string) => void;
}



///////////////////////////////////////////
/////BELOW IS THE Ant Design Table////////
///////////////////////////////////////////



interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  deleting: boolean;
  dataIndex: string;
  title: string;
  author:string;
  inputType: 'number' | 'text';
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
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

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




const onChange: TableProps<Book>['onChange'] = (pagination, filters, sorter, extra) => {
  console.log('params', pagination, filters, sorter, extra);
};



export const Bookintro = () =>{

  return(

    <Breadcrumb style={{ margin: '16px 0' }}>
    <Breadcrumb.Item>Welcome to Library Center</Breadcrumb.Item>
    </Breadcrumb>

  )
}



export default BookTable
