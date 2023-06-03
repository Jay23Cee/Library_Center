import React from 'react'
import library_image from '../images/library1.jpg'
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
        
        <h3 id="xpress">Library <span className="x">X</span>press</h3>
        
        <p>
        Discover endless knowledge at Library <span className="x">X</span>press
         </p></div>
       
    </section>



    <section className="Ideas">

      <h1>The benefits of reading...</h1>
      <div className='Ideas-example'>
        <div className='ideas-example-1' >
          
        <img src={reading} alt='library'/>
        
        
        <h1>Reading for Wellness</h1>
        <p>By incorporating reading into your routine, you can reap the numerous benefits it has for mental and emotional wellness, such as stress reduction and improved focus. Make it a regular part of your routine for overall well-being.</p>
          </div>
        <div className='ideas-example-2'>
        <img src={cube} alt='library'/>
         <h1>Reading for Self-Care</h1>
         <p>Reading can be a powerful tool for self-care, providing relaxation, personal growth, and an escape from daily life. Make it a habit to nourish your mind and soul through literature</p>
         
         </div>
        <div className='ideas-example-3'>
        <img src={chess} alt='library'/>

          <h1>Wealth Through Reading</h1>
          <p>Reading can expand our minds, provide valuable knowledge and insights, and lead to personal and financial success. Make it a habit to continually invest in yourself through reading</p>
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