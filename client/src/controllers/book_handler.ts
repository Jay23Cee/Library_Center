import { Book } from "../models/books";
import "setimmediate";
import axios from "axios";

/**************************
 ******* Connect DATABASE ***
 **************************/
export async function getbooks() {
  const headers = {
    withCredentials: true,
    "Content-Type": "text/plain",
  };
  const BookRedeucerDefaultState: Book[] = [];

  let link = process.env.REACT_APP_URL as string;

  try {
    let url = link + `/api/read`;
    const { data } = await axios.get(url, headers);
    var len = Object.keys(data).length;

    for (let i = 0; i < len; i++) {
      BookRedeucerDefaultState.push(data[i]);
    }
  } catch (error) {
    console.error(error);
  }

  return Promise.resolve(BookRedeucerDefaultState);
}

export async function delete_book(JSON_string: string) {
  const headers = {
    "Content-Type": "text/plain",
  };
  let link = process.env.REACT_APP_URL as string;
  let url = link + `/api/delete`;

  await axios
    .post(url, JSON_string, { withCredentials: true, headers })
    .then((response) => {})
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

export async function add_book(JSON_string: string, values: Book) {
  const headers = {
    "Content-Type": "text/plain",
  };
  let link = process.env.REACT_APP_URL as string;
  let url = link + `/api/add`;

  await axios
    .post(url, values, { withCredentials: true, headers })
    .then((response) => {})
    .catch((error) => {
      console.error("Error ========>", error);
    });
}
