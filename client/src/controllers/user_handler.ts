import axios from "axios";
import { User, UserLogin } from "../models/users";

export async function User_Login(values: UserLogin) {
  try {
    const headers = {
      "Content-Type": "text/plain",
    };
    const JSON_string = JSON.stringify(values);
    let link = process.env.REACT_APP_URL as string;
    let url = link + `/login`;
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

export async function User_Login_DEMO() {
  try {
    const headers = {
      "Content-Type": "text/plain",
    };
    const JSON_string = JSON.stringify('');
    let link = process.env.REACT_APP_URL as string;
    console.log(link)
    let url = link + `/login/demo`;
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


export async function User_Logout() {
  const headers = {
    "Content-Type": "text/plain",
  };

  let link = process.env.REACT_APP_URL as string;

  let url = link + `/logout`;

  try {
    await axios.get(url, { withCredentials: true, headers });
    return
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function User_Signup(values:any) {
  const headers = {
    'Content-Type': 'multipart/form-data'
  };
  const JSON_string = JSON.stringify(values);
  let link = process.env.REACT_APP_URL as string;
  let url = link + `/signup`;
  let res = await axios.post(url, values, { headers }).catch((error) => {
    return Promise.reject(error);
  });

}

export async function Check_Login() {
  const headers = {
    "Content-Type": "text/plain",
  };
  let link = process.env.REACT_APP_URL as string;

  let url = link + `/user`;

  try {
    const res = await axios
    .post(url, "",{ withCredentials: true, headers })
    .then((response) => {
      // console.log(response)
      console.log("Sucess ========>,");
      return response.data
    })
    .catch((error) => {
      console.error("Error ========>", error);
    });
  
    return Promise.resolve(res)
  } catch (error) {
    return Promise.reject(error);
  }

 
}


export async function Check_Refresh() {
  const headers = {
    "Content-Type": "text/plain",
  };
  let link = process.env.REACT_APP_URL as string;

  let url = link + `/refresh`;

  
    const res = axios
    .post(url, "",{ withCredentials: true, headers })
    .then((response) => {
      console.log("Sucess ========>,");
    })
    .catch((error) => {
      console.error("Error ========>", error);
    });

  
}
