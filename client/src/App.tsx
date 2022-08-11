import React from 'react';
import Homepage from './components/Homepage'
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';

function App() {
  
  return (
  
    <div >
            <Router>
     <Homepage/>
  </Router>
    </div>

  );
}
export default App;