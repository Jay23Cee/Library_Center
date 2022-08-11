import axios from "axios";
import { UserLogin } from "./users";

export async function User_Login(values:UserLogin){
    const headers = {
        'Content-Type': 'text/plain'
      };
      const JSON_string = JSON.stringify(values)
      let link = (process.env.REACT_APP_URL as string);
      let url = link +`/login`
     const res= axios.post(url,JSON_string,{headers}).then(response=>{
      console.log("Sucess ========>,")
     }).catch(error=>{
      throw new TypeError("Username or Password Incorrect")
     });

     return res
  }