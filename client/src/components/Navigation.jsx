import React from "react";
import { Link, withRouter } from "react-router-dom";



import './components.css'
import Alerter from "./Alerts/Alerter";

function Navigation(props) {
  const tokenString = sessionStorage.getItem('token');
  const userToken = JSON.parse(tokenString);
  const Username = userToken.username;

  const logout = () => {
    sessionStorage.removeItem('token');
    window.location.reload(false);
  }

  return (
    <div className="navigation">
      <nav class="navbar navbar-expand navbar-dark grid-bg-colour">
        <div class="container">
          <Link class="navbar-brand" to="/">
            {Username}'s HQ BUSINESS
          </Link>
          
          
          <div>
            <ul class="navbar-nav ml-auto">
              <li
                class={`nav-item  ${
                  props.location.pathname === "/" ? "active" : ""
                }`}
              >
                <Link class="nav-link" to="/">
                  Tasks
                  <span class="sr-only">(current)</span>
                </Link>
              </li>

              <li
                class={`nav-item  ${
                  props.location.pathname === "/Report1" ? "active" : ""
                }`}
              >
                <Link class="nav-link" to="/Report1">
                    Reports
                </Link>
              </li>

              <li
                class={`nav-item  ${
                  props.location.pathname === "/Support" ? "active" : ""
                }`}
              >
                <Link class="nav-link" to="/Support">
                    Support
                </Link>
              </li>

              <li
                class={`nav-item  ${
                  props.location.pathname === "/Products" ? "active" : ""
                }`}
              >
                <Link class="nav-link" to="/Products">
                  Products
                </Link>
              </li>

              <li
                class={`nav-item  ${
                  props.location.pathname === "/Customers" ? "active" : ""
                }`}
              >
                <Link class="nav-link" to="/Customers">
                  Customers
                </Link>
              </li>

              <li>
                <Alerter />
              </li>
              <li>
                <div className="spacer"></div>
              </li>
              <li
                class={`nav-item  ${
                  props.location.pathname === "/Login" ? "active" : ""
                }`}
              >
                <Link class="nav-link" to="/" onClick={logout}>
                    Sign Out
                </Link>
              </li>
            </ul>
            
          </div>
        </div>
      </nav>
    </div>
  );
}

export default withRouter(Navigation);