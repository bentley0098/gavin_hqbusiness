import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Navigation, Tasks, Footer, Report1, QuickSupport, Errors, Products, Customers } from "./components";
import useToken from './useToken.js';
import Login from './components/Login/Login'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";




function App() {
  
  const { token, setToken } = useToken();
  
  if(token && token!=='q>)*8n[TfhTyZAW') {
    //console.log("HI THERE");
    alert("Invalid Log-in Token");
    localStorage.removeItem('token');
  }
  
  
  if(!token) {
    return <Login setToken={setToken} />
  }
  
  
  
  return (
    <div className="App">
      <Router>
        <Navigation />
          <div className="main-wrapper">
            <Switch>
              <Route path="/" exact component={() => <Tasks />} />
              <Route path="/Report1" exact component={() => <Report1 />} />
              <Route path="/Support" exact component={() => <QuickSupport />} />
              <Route path="/Products" exact component={() => <Products />} />
              <Route path="/Errors" exact component={() => <Errors />} />
              <Route path="/Customers" exact component={() => <Customers />} />
            </Switch>
          </div>
        <Footer /> 
      </Router>
    </div>
  );
}
export default App;