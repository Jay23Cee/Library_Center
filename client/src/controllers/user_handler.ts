import axios from "axios";
import { UserLogin } from "../models/users";

export async function User_Login(values: UserLogin) {
  const headers = {
    "Content-Type": "text/plain",
  };
  const JSON_string = JSON.stringify(values);
  let link = process.env.REACT_APP_URL as string;
  let url = link + `/login`;
  const res = axios
    .post(url, JSON_string, { withCredentials: true, headers })
    .then((response) => {
      console.log("Sucess ========>,");
    })
    .catch((error) => {
      throw new TypeError("Username or Password Incorrect");
    });

  return res;
}

export async function User_Logout() {
  const headers = {
    "Content-Type": "text/plain",
  };

  let link = process.env.REACT_APP_URL as string;

  let url = link + `/logout`;

  try {
    const res = await axios.get(url, { withCredentials: true, headers });
    console.log(res);
  } catch (error) {
    throw error;
  }
}

export async function User_Signup(values: UserLogin) {
  const headers = {
    "Content-Type": "text/plain",
  };
  const JSON_string = JSON.stringify(values);
  let link = process.env.REACT_APP_URL as string;
  let url = link + `/signup`;
  const res = axios
    .post(url, JSON_string, { headers })
    .then((response) => {
      console.log("Sucess ========>,");
    })
    .catch((error) => {
      console.log("Error singing up");
      return new Error("Error Singing Up");
    });

  return res;
}

export async function Check_Login() {
  const headers = {
    "Content-Type": "text/plain",
  };
  let link = process.env.REACT_APP_URL as string;

  let url = link + `/user`;
  const { data } = await axios.get(url, { withCredentials: true, headers });

  let User = JSON.stringify(data);
  let parse: UserLogin = JSON.parse(User);

  return Promise.resolve(parse);
}
