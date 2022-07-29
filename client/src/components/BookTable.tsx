import React, { useState, useEffect ,useRef,} from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Button,Space, InputRef} from 'antd';
import {Book} from '../books/books';
import {  delete_book, edit_book, getbooks } from  '../books/data_handler';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import type { ColumnsType, ColumnType,TableProps } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import { SorterResult } from 'antd/lib/table/interface';


interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}


type DataIndex = keyof Book;
export interface BookTableProps{
  Title: string;
  Author: string;
  Year: string;
  Publisher: string;
  Id: string;
  Key:string; 

}

type Props = BookTableProps & LinkStateProps & LinkDispatchProps;

export const BookTable: React.FC<Props> = () =>{

 const  originData: Book[] =[];
    
    const EditableTable = () => {
      const [form] = Form.useForm();
      const [data, setData] = useState(originData);
      const [editingKey, setEditingKey] = useState('');
      const [searchText, setSearchText] = useState('');
      const [searchedColumn, setSearchedColumn] = useState('');
      const searchInput = useRef<InputRef>(null);
      const [sortedInfo, setSortedInfo] = useState<SorterResult<Book>>({});
      
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
        // action.startEditBook(newData[index]);
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

      const handleSearch = (
        selectedKeys: string[],
        confirm: (param?: FilterConfirmProps) => void,
        dataIndex: DataIndex,
      ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
      };
    
      const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
      };

      const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<Book> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <div style={{ padding: 8 }}>
            <Input
              ref={searchInput}
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
              style={{ marginBottom: 8, display: 'block' }}
            />
            <Space>
              <Button
                type="primary"
                onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                icon={<SearchOutlined />}
                size="small"
                style={{ width: 90 }}
              >
                Search
              </Button>
              <Button
                onClick={() => clearFilters && handleReset(clearFilters)}
                size="small"
                style={{ width: 90 }}
              >
                Reset
              </Button>
              <Button
                type="link"
                size="small"
                onClick={() => {
                  confirm({ closeDropdown: false });
                  setSearchText((selectedKeys as string[])[0]);
                  setSearchedColumn(dataIndex);
                }}
              >
                Filter
              </Button>
            </Space>
          </div>
        ),
        filterIcon: (filtered: boolean) => (
          <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
          record[dataIndex]
            .toString()
            .toLowerCase()
            .includes((value as string).toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => searchInput.current?.select(), 100);
          }
        },
        render: text =>
          searchedColumn === dataIndex ? (
            <Highlighter
              highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={text ? text.toString() : ''}
            />
          ) : (
            text
          ),
      });

    
      /**************************
       ******* Columns **********
       ******** of the *********
       ********* Table *********/
      const columns = [
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
        {
          title: 'action',
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
        <Form form={form} component={false} >
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
export default BookTable
