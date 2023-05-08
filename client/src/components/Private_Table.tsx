import React, { useState, useEffect, useRef } from "react";
import { Form, InputRef, Breadcrumb, Button, Card } from "antd";
import { Book } from "../models/books";
import { useDispatch, useSelector } from "react-redux";
import { deleteBook, edit_book, getbooks } from "../controllers/book_handler";
import { useNavigate } from "react-router-dom";
import { addBook, clearBooks } from "../redux/bookSlice";
import { addBulkBooks, clearBulkBooks } from "../redux/librarySlice";

const { Meta } = Card;

export interface BookTableProps {
  Title: string;
  Author: string;
  Year: string;
  Publisher: string;
  Id: string;
  Key: string;
}

export const Private_Table: React.FC<{}> = () => {
  const user = useSelector((state: any) => state.user.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const originData: Book[] = [];

  const EditableTable = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState(originData);
    const library = useSelector((state: any) => state.library);

    useEffect(function effectFunction() {
      dispatch(clearBooks());
      async function fetchBooks() {
        var data = await getbooks();
        setData(data);
        dispatch(addBulkBooks(data));
      }
      if (!library.library.length) {
        fetchBooks();
      } else {
        setData(library.library);
      }
    }, []);

    const cardList = data.map((book: Book) => (
      <Card
        key={book.ID}
        hoverable
        style={{ width: 240 }}
        cover={<img alt={book.Img_url} src={book.Img_url} />}
        actions={[
          <Button type="text" onClick={() => onAdvanceEdit(book)}>
            Edit
          </Button>,
          <Button type="text" onClick={() => onDelete(book)}>
            Delete
          </Button>,
        ]}
      >
        <Meta
          // title={<a onClick={() => handleTitleClick(book)}>{book.Title}</a>}
          description={`${book.Author} - ${book.Publisher} (${book.Year})`}
        />
      </Card>
    ));


    const onAdvanceEdit = (record: Partial<Book> & { ID: React.Key }) => {
      console.log(record);
      dispatch(addBook(record as Book));
      navigate("/Advance_Edit", { state: { record } });
    };

    const onDelete = async (record: Book) => {
      console.log("DELETe");
      try {
        const row = (await form.validateFields()) as Book;
        console.log(row);
        const newData = [...data];
        const index = newData.findIndex((item) => record.ID === item.ID);
        console.log(index);
        if (index > -1) {
          const temp_book = { book: newData[index] };
          const JSON_string = JSON.stringify(temp_book);
          console.log(JSON_string);
          dispatch(clearBulkBooks());
          console.log(library, " HERE IS LIBRARY");
          deleteBook(JSON_string);

          navigate("/PrivateTable");
        } else {
          newData.push(row);

          const update = await getbooks();

          setData(update);
        }
      } catch (errInfo) {
        console.error("Validate Failed:", errInfo);
      }
    };


    return (
      user && (
        <Form form={form} component={false}>
          <div style={{ display: "flex", flexWrap: "wrap" }}>{cardList}</div>
        </Form>
      )
    );
  };

  return (
    <div className="Book_Table">
      <EditableTable />
    </div>
  );
};


export const Bookintro = () => {
  return (
    <Breadcrumb style={{ margin: "16px 0" }}>
      <Breadcrumb.Item>Welcome to Library Center</Breadcrumb.Item>
    </Breadcrumb>
  );
};
