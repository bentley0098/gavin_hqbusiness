import React, { useState, useEffect, PureComponent } from "react";

//React-DatePicker used for date inputs
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import Form from 'react-bootstrap/Form'
import '../Report1.css'
import {returnUsers} from '../../Tasks/returnTasks.js'

//Charts
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Label, ResponsiveContainer } from 'recharts';

import { TailSpin } from  'react-loader-spinner'




function getTimeSpent(startDate, endDate, filterUser) {
  return fetch('/getTimeReport/'+startDate+'&'+endDate+'&'+filterUser)
    .then(data => data.json())
}
function getUserTimeSpent(startDate, endDate) {
  return fetch('/getUserTimeReport/'+startDate+'&'+endDate)
    .then(data => data.json())
}

class CustomizedAxisTick extends PureComponent {
  render() {
    const { x, y, stroke, payload } = this.props;

    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={5} textAnchor="start" fill="#666" transform="rotate(90)">
          {payload.value}
        </text>
      </g>
    );
  }
}

function Reports() {
    
  
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate()+1);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(tomorrow);
    const [loading, setLoading] = useState(true);
    const [loadingUser, setLoadingUser] = useState(true);
    const [users, setUsers] = useState([]);
    const [chartType, setChartType] = useState(3);

    
    
    //----- GET CURRENT USER -----//
    const tokenString = sessionStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    //const Username = userToken.username;

    const currentUserObj = {
        'UserId': userToken.userId,
        'Username':  userToken.username
    }
    const [filterUser, setFilterUser] = useState(currentUserObj);

    const [data, setData] = useState([]);
    const [userData, setUserData] = useState([]);
    

    useEffect(()=> {
      
      setLoading(true);
      setLoadingUser(true);
      var sDate = moment(startDate).format('YYYY-MM-DDT00:00:00');
      var eDate = moment(endDate).format('YYYY-MM-DDT11:59:59');

      getTimeSpent(sDate, eDate, filterUser.UserId).then(report=> {
        setData(report);
        setLoading(false);
      })

      getUserTimeSpent(sDate, eDate).then(report=> {
        setUserData(report);
        setLoadingUser(false);
      })

      returnUsers()
      .then(users => { 
          setUsers(users)     
      }) 

      if(chartType===1) {
        document.getElementById("inline-radio-1").click();
      }
      if(chartType===2) {
        document.getElementById("inline-radio-2").click();
      }
      if(chartType===3) {
        document.getElementById("inline-radio-3").click();
      }

      console.log(userData);
    }, [startDate, endDate, filterUser]) 

    const AllUsers = {
      'Username': 'none',
      'UserId': '0'
    }
    

    let selectedChart;
    if(chartType===3){
      selectedChart = <div className="bar-chart-wrap ">
                        <div className="main-chart item">
                          
                          <BarChart width={1100} height={700} data={data}>
                            <CartesianGrid  />
                            <XAxis dataKey="Customer" height={250} interval={0} tick={<CustomizedAxisTick/>} />
                            <YAxis />
                            <Tooltip />

                            <Bar dataKey="SupportTime" fill="#202c40" maxBarSize={50} />
                            <Bar dataKey="TaskTime" fill="#c9b428" maxBarSize={50} />
                          </BarChart> 
                          </div>
                    <div className="user-chart item">
                    <BarChart width={400} height={400} data={userData}>
                            <CartesianGrid  />
                            <XAxis dataKey="Username" height={150} interval={0} tick={<CustomizedAxisTick/>} />
                            <YAxis />
                            <Tooltip />

                            <Bar dataKey="SupportMinutes" fill="#202c40" maxBarSize={50} />
                            <Bar dataKey="TaskMinutes" fill="#c9b428" maxBarSize={50} />
                          </BarChart> 
                    </div>
                  </div>;

    } else if (chartType===2) {
      selectedChart = <div className="bar-chart-wrap ">
                        <div className="main-chart item">
                          <BarChart width={1100} height={700} data={data}>
                            <CartesianGrid  />
                            <XAxis dataKey="Customer" height={150} interval={0} tick={<CustomizedAxisTick/>} />
                            <YAxis />
                            <Tooltip />
                        
                            <Bar dataKey="TaskTime" fill="#c9b428" maxBarSize={50}/>
                          </BarChart>
                          </div>
                    <div className="user-chart item">
                    <BarChart width={400} height={400} data={userData}>
                            <CartesianGrid  />
                            <XAxis dataKey="Username" height={40} interval={0} tick={<CustomizedAxisTick/>} />
                            <YAxis />
                            <Tooltip />

                            
                            <Bar dataKey="TaskMinutes" fill="#c9b428" maxBarSize={50} />
                          </BarChart> 
                    </div>
                  </div>;

    } else if (chartType===1) {
      selectedChart = 
                  <div className="bar-chart-wrap ">
                    <div className="main-chart item"> 

                      <BarChart width={1100} height={700} data={data}>
                        <CartesianGrid  />
                        <XAxis dataKey="Customer" height={150} interval={0} tick={<CustomizedAxisTick/>} />
                        <YAxis />
                        <Tooltip />

                        <Bar dataKey="SupportTime" fill="#202c40" maxBarSize={50}/>
                        
                      </BarChart> 
                      
                    </div>
                    <div className="user-chart item">
                        <BarChart width={400} height={400} data={userData}>
                          <CartesianGrid  />
                          <XAxis dataKey="Username" height={50} interval={0} tick={<CustomizedAxisTick/>} />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="SupportMinutes" fill="#202c40" maxBarSize={50} />
                         
                        </BarChart> 
                    </div>
                  </div> ;
    }


    let chartLoaded;

    //console.log(data.length);
    if(loading===false) {
      if(data.length===0){
        chartLoaded = <div className="bar-chart-wrap spinner">
                        <h3>No Data for this selection</h3>
                      </div>;
      } else {
        chartLoaded = selectedChart;
      }

    } else {
      chartLoaded = 
      <div className="bar-chart-wrap spinner">
        <TailSpin color="#282c34" height={200} width={200} ariLabel='Loading'/>
      </div>
    }

    
      
  
  return (
    <div class="time-report">
        <div className="first-row">
          <h1 class="font-weight-light heading item" >Time Spent</h1>
            
            <div class="date item">
            <DatePicker
              selected={startDate}
              onChange={(date) => {
                setStartDate(date);
              }}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              dateFormat = 'dd/MM/yyyy'
              />
            </div>
            
            <div class="date item">
            <DatePicker
              selected={endDate}
              onChange={(date) => {
                setEndDate(date);
              }}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              dateFormat = 'dd/MM/yyyy'
              />
            
            </div>
            
            <div className="item radios">
              <Form.Check
                inline
                label="Support"
                type="radio"
                name="group1"
                id={'inline-radio-1'}
                onChange = {e=> setChartType(1)} 
              />
              <Form.Check
                inline
                label="Tasks"
                type="radio"
                name="group1"
                id={'inline-radio-2'}
                onChange = {e=> setChartType(2)}             
              />
              <Form.Check
                inline
                label="Both"
                type="radio"
                name="group1"
                id={'inline-radio-3'}
                onChange = {e=> setChartType(3)} 
              />
            </div>

            <div className="user-select item">

              <Form.Control as="select" value={users.Username}  
                  onChange = {e=> {
                    let temp=JSON.parse(e.target.value);
                    setFilterUser(temp);
                  }}>
                <option value ={JSON.stringify(currentUserObj)}>{currentUserObj.Username}</option>
                {
                  users.map((user, index) => {
                    if(user.Username!==currentUserObj.Username) {
                      return(<option key={index} value={JSON.stringify(user)}>{user.Username}</option>)
                    }
                    else return null;
                  })
                }
                <option value={JSON.stringify(AllUsers)}>All Users</option>
                </Form.Control>
            </div>

            
            
        </div>
                
        {chartLoaded}

    </div>
    
  );
}

export default Reports