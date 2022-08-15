import { Form, Input, Menu, Breadcrumb, Button } from 'antd';
import React from 'react';
import {message} from "antd"
import {Book} from '../books/books';
import {Link} from "react-router-dom";
import { add_book } from '../books/data_handler';
import { formatTimeStr } from 'antd/lib/statistic/utils';
import { useSelector } from 'react-redux';


const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

export const NewItem = () =>{


  return(

            <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>New</Breadcrumb.Item>
        <Breadcrumb.Item>Library</Breadcrumb.Item>
        <Breadcrumb.Item>Book</Breadcrumb.Item>
      </Breadcrumb>


  )
}


export const NewMenu=() =>{

  return(
  <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
  <Menu.Item key="1">Home</Menu.Item>
  <Link to="/new"><Menu.Item key="2">New</Menu.Item></Link>

</Menu>

)
  }

const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not a valid email!',
    number: '${label} is not a valid number!',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
};


const NewBook=()=>{
  const user = useSelector((state) => state.user.currentUser);
     const [form] = Form.useForm()

      const onFinish = async(values: Book) => {

        const JSON_string = JSON.stringify(values)
        // this.props.startNewBook(values)
        console.log(JSON_string)
        await add_book(JSON_string, values)
        message.success("Book has been added")
        form.resetFields();
      }


    return (


      <div>

    { user &&  <Form {...layout} form={form} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
      <Form.Item name={['book', 'title']} label="Title" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name={['book', 'author']} label="Author" rules={[{ required: true}]}>
        <Input />
      </Form.Item>
      <Form.Item name={['book', 'publisher']} label="Publisher" rules={[{ required: true }]}>
        <Input />
       </Form.Item>
       <Form.Item name={['book', 'year']} label="Year" rules={[{ required: true }]}>
        <Input />
       </Form.Item>
      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>    }
  </div>

    );
  }

export default NewBook