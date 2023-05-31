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
  return axiosInstance
    .get<Book[]>('/api/read')
    .then((response: AxiosResponse<Book[]>) => {
      const books = response.data.map((book) => {
        if (book.Img.length > 0) {
          try {
            book.Img = JSON.parse(book.Img);
          } catch (error) {
            console.error('Error parsing book image data:', error);
          }
        }
        return book;
      });

      cache.set('books', books);
      return books;
    })
    .catch((error) => {
      console.error(error);
      // You can decide to return an empty array or keep the Promise.reject based on your application's error handling strategy.
      // return [];
      return Promise.reject(error);
    });
}

// export async function deleteBook(jsonString: string) {
//   const headers = {
//     "Content-Type": "application/json",
//   };
//   let link = process.env.REACT_APP_URL;
//   if (link == null) {
//     throw new Error("REACT_APP_URL is not set in the environment");
//   }
//   let url = link + "/api/delete";

//   try {
//     const response = await axios.post(url, jsonString, { withCredentials: true, headers });
//     console.log(response);
//   } catch (error) {
//     if (error.response) {
//       // The request was made and the server responded with a status code
//       // that falls out of the range of 2xx
//       console.log(error.response.data);
//       console.log(error.response.status);
//       console.log(error.response.headers);
//     } else if (error.request) {
//       // The request was made but no response was received
//       // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
//       // http.ClientRequest in node.js
//       console.log(error.request);
//     } else {
//       // Something happened in setting up the request that triggered an Error
//       console.log('Error', error.message);
//     }
//     console.log(error.config);
//   }
// }

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

export async function edit_book(JSON_string: string) {
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

export async function add_book(values: { books: any; }) {
  let link = process.env.REACT_APP_URL as string;
  let url = link + `/api/add`;

  const formData = new FormData();
  
  Object.keys(values.books).forEach((key) => {
    if (key === "Img") {  // assuming Img is the file you're uploading
      formData.append(key, values.books[key], values.books[key].name);
    } else {
      formData.append(key, values.books[key]);
    }
  });

  await axios
    .post(url, formData, { withCredentials: true })
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
