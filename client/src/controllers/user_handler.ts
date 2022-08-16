import axios from "axios";
import { UserLogin, UsersLogin } from "../models/users";

export async function User_Login(values:UserLogin){
    const headers = {
        'Content-Type': 'text/plain',
        
      };
      const JSON_string = JSON.stringify(values)
      let link = (process.env.REACT_APP_URL as string);
      let url = link +`/login`
     const res= axios.post(url,JSON_string,{'withCredentials': true ,headers}).then(response=>{
      console.log("Sucess ========>,")
     }).catch(error=>{
      throw new TypeError("Username or Password Incorrect")
     });

     return res
  }

  export async function User_Logout(){

      let link = (process.env.REACT_APP_URL as string);
      console.log(link)
      try {
         
          const res = await axios.get(link+"/logout");
             
    }catch (error) {
        throw error
      
    }
  }

  

  export async function User_Signup(values:UserLogin){
    const headers = {
        'Content-Type': 'text/plain'
      };
      const JSON_string = JSON.stringify(values)
      let link = (process.env.REACT_APP_URL as string);
      let url = link +`/signup`
     const res= axios.post(url,JSON_string,{'withCredentials': true ,headers}).then(response=>{
      console.log("Sucess ========>,")
     }).catch(error=>{
      
     });

     return res
  }

  export async function Check_Login(){
    const headers = {
        'Content-Type': 'text/plain',
        
      };
      let link = (process.env.REACT_APP_URL as string);
      
      let url = link +`/user`
      const {data} = await axios.get(url,{'withCredentials': true ,headers});
  
      let User = JSON.stringify(data)
      let parse:UserLogin = JSON.parse(User)
    //  var len =  Object.keys(data).length
      console.log(parse)

     return Promise.resolve(parse);
  }