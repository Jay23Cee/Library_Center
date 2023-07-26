import React, { useState, useEffect } from "react";
import { Book } from "../models/books";
import { getbooks } from "../controllers/book_handler";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addBulkBooks } from "../redux/librarySlice";
import { addBook, clearBooks } from "../redux/bookSlice";
import { Navcolor } from "./Template";
import Book_View from "./Book_View";
import { Bookmenu } from "./SearchBar";
import { filter } from "lodash";

const BookTable: React.FC<{}> = () => {
  const user = useSelector((state: any) => state.user.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [year, setYear] = useState<string>('');

  const originData: Book[] = [];

  const [data, setData] = useState(originData);
  const library = useSelector((state: any) => state.library);
  Navcolor();

  const getStoredBooks = (): Book[] => {
    const storedBooks = localStorage.getItem("originalData");
    return storedBooks ? JSON.parse(storedBooks) : [];
  };

  const [originalData, setOriginalData] = useState<Book[]>(getStoredBooks());

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const books = await getbooks();
        console.log(books);
        setOriginalData(books);
        localStorage.setItem("originalData", JSON.stringify(books)); // Save books to localStorage
        const filteredBooks = books.filter((book) =>
          (searchTerm === '' || book.Title?.toLowerCase().includes(searchTerm.toLowerCase())) &&
          (category === '' || book.Category?.toLowerCase().includes(category.toLowerCase())) &&
          (year === '' || book.Year?.includes(year))
        );
        setData(filteredBooks);
        dispatch(addBulkBooks(filteredBooks));
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };
    if (!library.library.length) {
      fetchBooks();
    } else {
      const filteredBooks = originalData.filter((book: Book) =>
        (searchTerm === '' || book.Title?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (category === '' || book.Category?.toLowerCase().includes(category.toLowerCase())) &&
        (year === '' || book.Year?.includes(year))
      );
      setData(filteredBooks);
    }
  }, [searchTerm, category, year, library.library.length, originalData]);

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
          className="h-98 lg:h-94 xl:h-82 2xl:h-98 flex items-center justify-center bg-gray-300 shadow-md hover:shadow-xl hover:bg-gray-200 transition duration-300 cursor-pointer" // Added cursor-pointer
          onClick={() => handleCoverClick(book)}
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
            className="text-xl font-semibold mb-2 cursor-pointer" // Added cursor-pointer
            onClick={() => handleTitleClick(book)}
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
    <div className="w-full min-h-[calc(100vh-130px)] flex flex-col items-center  py-10">
      <Bookmenu
        onSearchTermChange={setSearchTerm}
        onCategoryChange={setCategory}
        onYearChange={setYear}
      />

      <div className="Book_Table mt-500 pt-20">
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
