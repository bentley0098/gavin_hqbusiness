import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Reports, Closed, ReportMenu, Schedule } from "./components1";
import './Report1.css'

function Report1() {
    document.title = 'HQ Business - Reports';
    return (
        <div className="Report1">
          
          <Router>
            <ReportMenu />
            <Switch>
             
              <Route path="/Report1" exact component={() => <Reports />} />
              <Route path="/Report1/Closed" exact component={() => <Closed />} />
              <Route path="/Report1/Schedule" exact component={() => <Schedule />} />
             
            </Switch>
          </Router>
        </div>

      );
}

export default Report1;