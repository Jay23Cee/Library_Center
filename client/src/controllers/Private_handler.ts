import axios from "axios";
import { UserLogin } from "../models/users";

export async function Private_Login(values: UserLogin) {
    try {
      const headers = {
        "Content-Type": "text/plain",
      };
      const JSON_string = JSON.stringify(values);
      let link = process.env.REACT_APP_URL as string;
      let url = link + `/private/login`;
      const res = axios
        .post(url, JSON_string, { withCredentials: true, headers })
        .catch((error) => {
          throw new TypeError("Username or Password Incorrect");
        });
  
      return res;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  export async function Private_Login_DEMO() {
    try {
      const headers = {
        "Content-Type": "text/plain",
      };
      const JSON_string = JSON.stringify('');
      let link = process.env.REACT_APP_URL as string;
      console.log(link, " THIS IS THE LINK")
      let url = link + `/private/login/demo`;
      const res = axios
        .post(url, JSON_string, { withCredentials: true, headers })
        .catch((error) => {
          throw new TypeError("Unable to Login");
        });
  
      return res;
    } catch (error) {
      return Promise.reject(error);
    }
  }
  