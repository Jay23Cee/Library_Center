import React, { useState, useEffect } from "react";

import { Book } from "../models/books";
import { getbooks } from "../controllers/book_handler";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addBulkBooks } from "../redux/librarySlice";
import { addBook, clearBooks } from "../redux/bookSlice";


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

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = "fallback-image-url"; // Replace with a fallback image URL or leave empty for no image
  };

  const cardList = data.map((book: Book) => (
    <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4" key={book.ID}>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div
          className="h-48 lg:h-64 xl:h-72 2xl:h-80 flex items-center justify-center bg-gray-300 shadow-md hover:shadow-xl hover:bg-gray-200 transition duration-300"
          onClick={() => handleCoverClick(book)} // handleCoverClick function is used here
        >
          <img
            alt={book.Img_url}
            className="h-full w-full object-contain hover:scale-110 transition duration-300"
            src={book.Img_url}
            onError={handleImageError}
          />
        </div>
        <div className="p-4 bg-gray-100">
          <div
            className="text-xl font-semibold mb-2"
            onClick={() => handleTitleClick(book)} // handleTitleClick function is used here
          >
            {book.Author} - {book.Publisher}
          </div>
          <div className="text-gray-600 text-sm">{book.Year}</div>
          <div className="flex justify-end mt-4"></div>
        </div>
      </div>
    </div>
));


  return (
    <div className="w-full min-h-[calc(100vh-130px)] flex flex-col items-center mt-[5.8rem] py-10">
   <div className="Book_Table mt-20 pt-20">
    
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap -mx-4">{cardList}</div>
        </div>
     
    </div>
    </div>
  );
};

export const Bookintro = () => {
  return (
<> </>
  );
};

export default BookTable;
