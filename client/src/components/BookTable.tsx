import React, { useState, useEffect } from "react";
import { Table, Input, InputNumber, Form, Breadcrumb, Card } from "antd";
import { Book } from "../models/books";
import { getbooks } from "../controllers/book_handler";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addBulkBooks } from "../redux/librarySlice";
import { addBook, clearBooks } from "../redux/bookSlice";

const { Meta } = Card;

const BookTable: React.FC<{}> = () => {
  const user = useSelector((state: any) => state.user.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const originData: Book[] = [];

  const [data, setData] = useState(originData);
  const library = useSelector((state: any) => state.library);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const books = await getbooks();
        setData(books);
        dispatch(addBulkBooks(books));
        console.log(books, "THIS IS DATA THAT COMES FROM GETBOOKS");
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    }

    if (!library.library.length) {
      fetchBooks();
    } else {
      setData(library.library);
    }
  }, []);

  const handleTitleClick = (record: Book) => {
    dispatch(addBook(record));
    navigate("/BookView");
  };

  const handleCoverClick = (record: Book) => {
    dispatch(addBook(record));
    navigate("/BookView");
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = "fallback-image-url"; // Replace with a fallback image URL or leave empty for no image
  };

  const cardList = data.map((book: Book) => (
    <Card
      key={book.ID}
      hoverable
      style={{ width: 240 }}
      cover={
        <img
          onClick={() => handleCoverClick(book)}
          alt={book.Img_url}
          src={book.Img_url}
          onError={handleImageError}
        />
      }
      actions={[]}
    >
      <Meta
        title={<a onClick={() => handleTitleClick(book)}>{book.Title}</a>}
        description={`${book.Author} - ${book.Publisher} (${book.Year})`}
      />
    </Card>
  ));

  return (
    <div>
      <Form component={false}>
        <div style={{ display: "flex", flexWrap: "wrap" }}>{cardList}</div>
      </Form>
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

export default BookTable;
