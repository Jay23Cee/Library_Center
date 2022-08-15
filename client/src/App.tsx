import React from "react";
import Homepage from "./components/Homepage";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
function App() {
  return (
    <Provider store={store}>
      <div>
        <Router>
          <Homepage />
        </Router>
      </div>
    </Provider>
  );
}
export default App;
