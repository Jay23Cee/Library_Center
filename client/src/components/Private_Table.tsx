import React, { useState, useEffect } from "react";
import { Book } from "../models/books";
import { useDispatch, useSelector } from "react-redux";
import { deleteBook, getbooks } from "../controllers/book_handler";
import { useNavigate } from "react-router-dom";
import { addBook, clearBooks } from "../redux/bookSlice";
import { addBulkBooks, clearBulkBooks, removeBook } from "../redux/librarySlice";

export const Private_Table: React.FC<{}> = () => {
  const user = useSelector((state: any) => state.user.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const originData: Book[] = [];

  const [data, setData] = useState<Book[]>(originData);
  const library = useSelector((state: any) => state.library);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setIsLoading(true); // Start loading animation
        const fetchedBooks = await getbooks();
        setData(fetchedBooks);
        dispatch(addBulkBooks(fetchedBooks));
      } finally {
        setIsLoading(false); // Stop loading animation
      }
    };

    if (library.library.length === 0) {
      fetchBooks();
    } else {
      setData(library.library);
      setIsLoading(false); // Stop loading animation
    }
  }, [library.library]);

  const onDelete = async (record: Book) => {
    console.log("DELETE");
    try {
      const newData = [...data];
      const index = newData.findIndex((item) => record.ID === item.ID);
      console.log(index);
      if (index > -1) {
        const temp_book = {
          book: {
            ID: newData[index].ID,
            Title: "",
            Author: "",
            Publisher: "",
            Year: "",
            Img: "",
            Img_url: "",
            Summary: "",
          },
        };
        const JSON_string = JSON.stringify(temp_book);
        console.log(JSON_string);
        console.log(library, " HERE IS LIBRARY");

        // Delete the book from the database
        await deleteBook(JSON_string);

        // Update the Redux store by dispatching the removeBook action
        dispatch(removeBook(record.ID));

        // Update the local state to reflect the changes in the UI
        newData.splice(index, 1);
        setData(newData);
      }
    } catch (errInfo) {
      console.error("Delete Failed:", errInfo);
    }
  };

  const cardList = data.map((book: any) => (
    <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4" key={book.ID}>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="h-48 lg:h-64 xl:h-72 2xl:h-80 flex items-center justify-center bg-gray-400 shadow-md hover:shadow-xl hover:bg-gray-200 transition duration-300">
          <img
            alt={book.Img_url}
            className="h-full w-full object-contain hover:scale-110 transition duration-300"
            src={book.Img_url}
          />
        </div>
        <div className="p-4 bg-gray-100">
          <div className="text-xl font-semibold mb-2">
            {book.Author} - {book.Publisher}
          </div>
          <div className="text-gray-600 text-sm">{book.Year}</div>
          <div className="flex justify-end mt-4">
          </div>
          <div className="flex justify-end mt-4">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 mr-2 rounded-lg border border-blue-500 hover:border-blue-600 transition duration-300"
              onClick={() => onAdvanceEdit(book)}
            >
              Edit
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg border border-red-500 hover:border-red-600 transition duration-300"
              onClick={() => onDelete(book)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
));



//   const cardList = data.map((book: any) => (
//     <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-4" key={book.ID}>
//       <div className="bg-white shadow-lg rounded-lg overflow-hidden">
//         <div className="h-64 lg:h-48 flex items-center justify-center bg-gray-200 shadow-md hover:shadow-xl transition duration-300">
//         <img
//   alt={book.Img_url}
//   className="h-full w-full object-contain hover:scale-105 transition duration-300"
//   src={book.Img_url}
// />

//         </div>
//         <div className="p-4 bg-gray-100">
//           <div className="text-xl font-semibold mb-2">
//             {book.Author} - {book.Publisher}
//           </div>
//           <div className="text-gray-600 text-sm">{book.Year}</div>
//           <div className="flex justify-end mt-4">
//             <button
//               className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 mr-2 rounded-lg border border-blue-500 hover:border-blue-600 transition duration-300"
//               onClick={() => onAdvanceEdit(book)}
//             >
//               Edit
//             </button>
//             <button
//               className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg border border-red-500 hover:border-red-600 transition duration-300"
//               onClick={() => onDelete(book)}
//             >
//               Delete
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   ));

  const onAdvanceEdit = (record: Partial<Book> & { ID: React.Key }) => {
    console.log(record);
    dispatch(addBook(record as Book));
    navigate("/Advance_Edit", { state: { record } });
  };

  return (
    <div className="Book_Table mt-20 pt-20">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap -mx-4">{cardList}</div>
        </div>
      )}
    </div>
  );
};
