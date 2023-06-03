import { Book } from "../models/books";
import "setimmediate";
import axios, { AxiosResponse } from "axios";

import { UploadFile } from "antd/lib/upload/interface";
import { useSelector } from 'react-redux';
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_URL,
  withCredentials: true,
});

const handlePreview = (file: UploadFile) => {
  // console.log(file)
  // console.log(typeof file)
  let previewImage = (file.url || (file.preview as string));

  let previewTitle=(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));

  // console.log(previewTitle)
  // console.log(previewImage)

  return [previewImage, previewTitle]
 
};

// Create a cache to store the results of the API call
const cache = new Map<string, Book[]>();

/**************************
 ******* Connect DATABASE ***
 **************************/



 export function getbooks(): Promise<Book[]> {
  const headers = {
    withCredentials: true,
    'Content-Type': 'text/plain',
  };

  let link = process.env.REACT_APP_URL as string;

  let url = link + '/api/read';
  // Make the HTTP request using the `then` method
  return axios
    .get(url, headers)
    .then((response: AxiosResponse<any>) => {
      // Use the `Array.map` method to transform the data
      const books = Object.keys(response.data).map((key) => {
        const book = response.data[key];
        console.log(book, "THIS IS THE GETBOOK CLIENT SIDE CALL")
        if (book.Img.length > 0) {
          try {
            book.Img = JSON.parse(book.Img);
          } catch (error) {
            console.error('Error parsing image:', error);
            // Handle the case where `Img` is not in JSON format
            // For now, you can skip processing or assign a default value
            book.Img = ""; // Assign an empty string or a default image URL
          }
        }
        return book;
      });

      // Add the results to the cache
      cache.set('books', books);
      return books;
    })
    .catch((error) => {
      console.error(error);
      return Promise.reject(error);
    });
}


export async function deleteBook(JSON_string: string) {
  const headers = {
    "Content-Type": "text/plain",
  };
  let link = process.env.REACT_APP_URL as string;
  let url = link + `/api/delete`;
  const res = axios
    .post(url, JSON_string, { withCredentials: true, headers })
    .then((response) => {
      console.log("Sucess ========>,");
    })
    .catch((error) => {
      console.error("Error ========>", error);
    });
}

export async function edit_book(JSON_string:FormData) {
  const headers = {
    "Content-Type": "text/plain",
  };
  let link = process.env.REACT_APP_URL as string;
  let url = link + `/api/edit`;
  const res = axios
    .post(url, JSON_string, { withCredentials: true, headers })
    .then((response) => {
      console.log("Sucess ========>,");
    })
    .catch((error) => {
      console.error("Error ========>", error);
    });
}

export async function add_book(values: FormData) {
  let link = process.env.REACT_APP_URL as string;
  let url = link + `/api/add`;

  console.log(" INSIDE ADDBOOK");
  console.log(values, " INSIDE ADDBOOK");

  console.log([...values.entries()], " INSIDE ADDBOOK");
  await axios
    .post(url, values, { withCredentials: true })
    .then((response) => {})
    .catch((error) => {
      console.error("Error ========>", error);
    });
}


export async function add_bulkbook(JSON_string: string, values: any) {
  // console.log(values)
  const headers = {
    "Content-Type": "text/plain",
  };
  let link = process.env.REACT_APP_URL as string;
  // let url = link + `/api/add`;
  let url = link + `/api/addbooksbulk`;

console.log(values)
  await axios
    .post(url, values, { withCredentials: true, headers })
    .then((response) => {})
    .catch((error) => {
      console.error("Error ========>", error);
    });
}
