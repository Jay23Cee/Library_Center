import React from 'react';
import Homepage from './components/Homepage'
import { BrowserRouter, Link, Route } from 'react-router-dom';

function App() {
  
  return (
  
    <div >
            <BrowserRouter>
     <Homepage/>
  </BrowserRouter>
    </div>

  );
}
export default App;