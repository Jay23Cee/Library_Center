import React from 'react'
import library_image from '../images/library.jpg'
import mind_image from '../images/mind.jpg'
import idea from '../images/idea.jpg'
import cube from '../images/cube.jpg'
import chess from '../images/chess.jpg'
import reading from '../images/book.jpg'
import panda from '../images/panda.png'
import {Link, useNavigate} from "react-router-dom";

function Homepage() {
  const navigate = useNavigate()
  return (
    <div className="Homepage">

    <section className="intro">
      
        <img src={library_image} alt='library' />
        <div className='intro-text'> 
        
        <h3>Read Up</h3>
        
        <p>Come in to your local Library Center and look at the hundreds of titles left and grab a book or five</p></div>
       
    </section>



    <section className="Ideas">

      <h1>The benefits of reading...</h1>
      <div className='Ideas-example'>
        <div className='ideas-example-1' >
          
        <img src={reading} alt='library'/>
        
        
        <h1>Studies have shown that reading for 30 minutes lowers blood pressure, heart rate, and feelings of stress.</h1>
        
          </div>
        <div className='ideas-example-2'>
        <img src={cube} alt='library'/>
         <h1>Reading increases a person's ability to focus and pay attention.</h1>
         
         </div>
        <div className='ideas-example-3'>
        <img src={chess} alt='library'/>

          <h1>There is a wealth of knowledge to be found in books, newspapers, and articles.</h1>
          </div>

          </div>
        </section>


    <section className="sign-up">
      <a> <img src={panda} alt='library' onClick={()=>{navigate("/signup")}}/></a>
   
    <div className='sign-up-text'> 
    
    <h1>Make sure to  
 <Link to="/signup"> Sign Up</Link>
</h1>
</div>

    
        </section>


    </div>
  )
}

export default Homepage