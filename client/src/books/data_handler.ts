import { Book } from "./books"
import "setimmediate"
import axios from "axios"




/**************************
 ******* Connect DATABASE ***
 **************************/
 export async function getbooks(){

    const BookRedeucerDefaultState: Book[]  = [];
   let port = process.env.PORT as String
   if (port === ""|| port == undefined){
    port = "8080"
   }
   console.log(port)
    let link = (process.env.REACT_APP_URL as string);// "https://librarycenterapp.herokuapp.com"
    console.log(link)
    try {
       
        const { data } = await axios.get(link+"/read");
        var len =  Object.keys(data).length
       
        for (let i = 0; i < len; i++) {
          
           BookRedeucerDefaultState.push(
               data[i]
            );
          }
        
    } catch (error) {
        console.log(error)
    }
  
    return   Promise.resolve(BookRedeucerDefaultState);
  }


  export async function delete_book(JSON_string:string){
   
    const headers = {
      'Content-Type': 'text/plain'
    };
    let link = (process.env.REACT_APP_URL as string); //"https://librarycenterapp.herokuapp.com"
    let url = link +`/delete`
    
   const res= axios.post(url,JSON_string,{headers}).then(response=>{
    console.log("Sucess ========>,", response.data)

   

   }).catch(error=>{
    console.log("Error ========>", error)
   });
  }



 export async function edit_book(JSON_string:string){
    const headers = {
        'Content-Type': 'text/plain'
      };
      let link = "https://librarycenterapp.herokuapp.com"//(process.env.REACT_APP_URL as string);
      let url = link +`/edit`
     const res= axios.post(url,JSON_string,{headers}).then(response=>{
      console.log("Sucess ========>,")
     }).catch(error=>{
      console.log("Error ========>", error)
     });
  }


export async function add_book(JSON_string:string, values:Book) {
 
    const headers = {
        'Content-Type': 'text/plain'
      };
      let link =  (process.env.REACT_APP_URL as string); //"https://librarycenterapp.herokuapp.com"//(process.env.REACT_APP_URL as string);
     let url = link+`/add`

     const res= await axios.post(url,values,{headers}).then(response=>{
       console.log("Sucess ========>,")
       
     }).catch(error=>{
      console.log("Error ========>", error)
     });

   

}