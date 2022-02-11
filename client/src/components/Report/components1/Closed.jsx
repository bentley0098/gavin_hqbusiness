import  React, {useEffect, useState}  from "react";

import {returnCustomers, returnUsers} from '../../Tasks/returnTasks';
import moment from 'moment'
//ReactDataGrid.io used for main grid
import ReactDataGrid from '@inovua/reactdatagrid-community'
import '@inovua/reactdatagrid-community/base.css'
import '@inovua/reactdatagrid-community/index.css'
import '@inovua/reactdatagrid-community/theme/default-dark.css'

import Form from 'react-bootstrap/Form'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import Button from 'react-bootstrap/Button'
import {ImFilePdf} from 'react-icons/im'
import {IoReload} from 'react-icons/io5'



//React-DatePicker used for date inputs
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import { exportClosedPDF } from '../../excelExport.js'
import '../Report1.css'
import { LoadDataSource } from "../../Tasks/LoadDataSource";


function getClosedTasks(customer, user, startDate, endDate) {
    
  
  
  return fetch('/getCloseTaskGrid/' + customer + '&' + user + '&' + startDate + '&' + endDate)
     .then(data => data.json())
  }

function Closed() {
  //----- GET CURRENT USER -----//
    const tokenString = sessionStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    //const Username = userToken.username;
    //const UserID = userToken.userId;

    const AllCustomers = {
        "SupportCode":0,
        "Customer_Code":0,
        "CustomerName":"All Customers",
        "CustomerCode":0
      }
      //const AllDepartments = {
      //  'Code': 0,
      //  'Department': 'All Departments'
      //}
      const AllUsers = {
        'Username': 'None Selected',
        'UserId': 0
      }
      const currentUserObj = {
        'UserId': userToken.userId,
        'Username':  userToken.username
      }

    

    const HQDetails={
        'SupportCode' : 0,
        'Customer_Code' : 340,
        'CustomerName' : "HQ Software",
        'CustomerCode': 340
    }

    
    const [dataSource, setDataSource] = useState([]);

    //Store reference to grid for exporting PDF/CSV
    const [gridRef, setGridRef] = useState(null);

    //setting departments/users/customers for drop downs
    //const [departments, setDepartments] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [users, setUsers] = useState([]);

    const [filterUser, setFilterUser] = useState(currentUserObj);
    const [filterCustomer, setFilterCustomer] = useState(AllCustomers);
    //const [filterDepartment, setFilterDepartment] = useState(AllDepartments);

    //Dates for DateRange
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate()+1);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(tomorrow);

    useEffect(() => {
        let mounted = true;
        
        
        LoadData(startDate, endDate, filterCustomer, filterUser);
        
        
        returnCustomers()
        .then(customers => {
            if(mounted) {
          setCustomers(customers)
            }
        })
        //returnDepartments()
        //  .then(departments => {
        //    if(mounted) {
        //      setDepartments(departments);
        //    }
        //  })
        returnUsers()
          .then(users => { 
            if(mounted) {
              setUsers(users)
            }
          })

          return () => mounted = false;
    },[filterUser, filterCustomer.Customer_Code, startDate, endDate])
    
    //Grid Info
    const theme = 'default-dark'

    const gridStyle = {
      minHeight: '80vh'
    }

    const columns = [
        {name:'Task', header:'ID', type: 'number', defaultFlex: 1, maxWidth:70},
        {name:'Customer', header:'Customer', defaultFlex: 1, maxWidth: 200, minWidth: 150},
        {name:'Details', header:'Details', defaultFlex: 1, minWidth: 500},
        {name:'Owner_Name', header:'Owner', defaultFlex: 1},
        {name:'ActionByUsername', header:'Allocated To', defaultFlex: 1},
        {name:'Requested', header:'Requested', defaultFlex: 1, maxWidth: 115, 
          sort: (a, b) => {
            a = moment(a, 'DD/MM/YYYY', true).format();
            b = moment(b, 'DD/MM/YYYY', true).format();
    
            return new Date(a) - new Date(b);
         }
        },
        {name:'DateCompleted', header:'Date Complete', defaultFlex: 1, maxWidth: 115, 
          sort: (a, b) => {
            a = moment(a, 'DD/MM/YYYY', true).format();
            b = moment(b, 'DD/MM/YYYY', true).format();
    
            return new Date(a) - new Date(b);
         }
        },
        {name:'Estimate', header:'Estimate', defaultFlex: 1, maxWidth: 130},
        {name:'TimeSpent', header:'Minutes Spent', defaultFlex: 1, maxWidth: 100},
        {name:'DaysToComplete', header:'Days To Complete', defaultFlex: 1, maxWidth: 100}
    ]

    const LoadData = (startDate, endDate, filterCustomer, filterUser) => {
      var sDate = moment(startDate).format('YYYY-MM-DDT00:00:00');
      var eDate = moment(endDate).format('YYYY-MM-DDT11:59:59');


      let data = getClosedTasks(filterCustomer.Customer_Code, filterUser.UserId, sDate, eDate);
      //console.log(data);
      setDataSource(data);
    }

    return (
        <div class="closed-report">
          
          <div className="first-row">
              
              <div className="item">
                <h1 class="font-weight-light">Closed Tasks</h1>    
              </div>

              <div className="item">
                 
                  <Form.Control as="select" value={JSON.stringify(filterCustomer)}
                    onChange = {e=> {
                      setFilterCustomer(JSON.parse(e.target.value));
                      //console.log(e.target.value);
                    }}>
                  <option value={JSON.stringify(AllCustomers)}>{AllCustomers.CustomerName}</option>
                  <option value={JSON.stringify(HQDetails)}>{HQDetails.CustomerName}</option>
                  {
                    customers.map((customer, index) => {
                      return(<option key={index} value={JSON.stringify(customer)}>{customer.CustomerName}</option>)
                    })
                  }
                  </Form.Control>
                
              </div>
                
              <div className="item">
                <Form.Control as="select" value={JSON.stringify(filterUser)}
                    onChange = {e=> {
                      //let temp=JSON.parse(e.target.value);
                      //setFilterUserName(temp.Username);
                      setFilterUser(JSON.parse(e.target.value));
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
                
            
              <div class="item">
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
            
              <div class="item">
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
          
              <div className="item">
                <OverlayTrigger key='PDFEXPORT'
                  overlay={
                  <Tooltip id='tooltip-pdf'>
                  Export to PDF
                  </Tooltip>
                  } 
                >
                  <Button variant="secondary"
              	    onClick={ () => {
                      const gridData = gridRef;
                      exportClosedPDF(gridData, filterCustomer);
                      //console.log(gridData);
                    }}
                    
                  >
                    <ImFilePdf />
                  </Button>    
                </OverlayTrigger>
              
                <OverlayTrigger key='refresh' 
                  overlay={
                  <Tooltip id='tooltip-refresh'>
                    Refresh
                  </Tooltip>
                  } 
                >
                  <Button variant="secondary" style={{marginLeft:'10px'}}
              	    onClick={ () => {
                      LoadData(startDate, endDate, filterCustomer, filterUser);
                    }}
                    
                  >
                    <IoReload />
                  </Button>    
                </OverlayTrigger>
              </div>
          </div>
            
        
          <div className="closed-grid">
            <ReactDataGrid
              //rowClassName={rowClassName}
              handle={setGridRef}
              idProperty="Task"
              columns={columns}
              dataSource={dataSource}
              style={gridStyle}
              theme={theme}
              //onRenderRow={onRenderRow}
              //selected={selected}
              //checkboxColumn
              //onSelectionChange={onSelectionChange}
              //defaultSortInfo={defaultSortInfo}
            />
          </div>
        
        </div>
    )
}

export default Closed;