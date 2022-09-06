import React from "react";
import Template from "./components/Template";

import { HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
function App() {

  return (
    
    <Provider store={store}>
      <div>
     <HashRouter>

          <Template/>
     </HashRouter>
     
      </div>
    </Provider>
  );
}
export default App;
