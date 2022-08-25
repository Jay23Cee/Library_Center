import React from "react";
import Homepage from "./components/Homepage";

import { HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
function App() {

  return (
    <Provider store={store}>
      <div>
     <HashRouter>

          <Homepage/>
     </HashRouter>
     
      </div>
    </Provider>
  );
}
export default App;
