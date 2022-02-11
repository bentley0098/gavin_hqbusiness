import React, {  useState, useEffect, useCallback } from 'react';
//ReactDataGrid.io used for main grid
import ReactDataGrid from '@inovua/reactdatagrid-community'
import '@inovua/reactdatagrid-community/base.css'
import '@inovua/reactdatagrid-community/index.css'
import '@inovua/reactdatagrid-community/theme/default-dark.css'

//Bootstrap Used for buttons, modals and styling
import Button from 'react-bootstrap/Button'
import 'bootstrap/dist/css/bootstrap.min.css'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'

//React-DatePicker used for date inputs
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'

// Importing functions to fetch data from express.js server
import { addNewTask, openHistory, getNewTaskID, getHistory, addNote, updateTask, returnCustomers, returnDepartments, returnUsers, getSelectedTask, returnReasons, closeTask, reOpenTask, makeUrgent, getItems, closeItem, getTimeSpent } from './returnTasks.js'
// Function to export grid to excel
import { exportCSV, exportPDF, exportHistoryPDF } from '../excelExport.js'

import NewTask from './NewTask.jsx'
import MultiEdit from './MultiEdit.jsx'
import Summary from './Summary.jsx'
import {LoadDataSource} from './LoadDataSource'


import {RiFileExcel2Line} from 'react-icons/ri'
import {ImFilePdf} from 'react-icons/im'
import {IoReload} from 'react-icons/io5'
import {MdCancel} from 'react-icons/md'
import { FaExclamation, FaSave} from 'react-icons/fa'
import {HiOutlineMail} from "react-icons/hi";
import {AiFillCloseCircle, AiOutlineCopy} from "react-icons/ai";
import {BiPlus, BiMinus } from "react-icons/bi"




function addItem(task, details) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      Details: details,
      taskID: task
    })
  }
  return fetch('/addItem/', requestOptions)
   
}

//CSS File for changing row colours
 

//This function adds a className to a row that allows custom styling of that row
const rowClassName = ({data})=> {
  
  
  if (data.State === 'C') {
    return "global-custom-row-green"
  } else if(data.Urgent===true){
    return "global-custom-row-red"
  }
  return 'global-custom-row'
  
}

const itemRowClassName = ({data})=> {

  if(data.Complete===true) {
    return "global-custom-row-light-green"
  }

}



//Overall Tasks function that handles the 'Tasks' page
function Tasks() {
  //console.log("Tasks Render");
  document.title = 'HQ Business - Tasks';

  //----- GET CURRENT USER -----//
  const tokenString = sessionStorage.getItem('token');
  const userToken = JSON.parse(tokenString);
  //const Username = userToken.username;
  const UserID = userToken.userId;

  const AllCustomers = {
    "SupportCode":0,
    "Customer_Code":0,
    "CustomerName":"All Customers",
    "CustomerCode":0
  }
  const AllDepartments = {
    'Code': 0,
    'Department': 'All Departments'
  }
  const AllUsers = {
    'Username': 'None Selected',
    'UserId': 0
  }
  const currentUserObj = {
    'UserId': userToken.userId,
    'Username':  userToken.username
  }
  
  const [dataSource, setDataSource] = useState([]);
  const [itemDataSource, setItemDataSource] = useState([]);
  const [taskAmount, setTaskAmount] = useState();
  
  const [filterUser, setFilterUser] = useState(currentUserObj);
  const [filterPriority, setFilterPriority] = useState(1);
  const [filterCustomer, setFilterCustomer] = useState(AllCustomers);
  const [filterDepartment, setFilterDepartment] = useState(AllDepartments);
  const [showingClosed, setShowingClosed] = useState(false);
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [searchString, setSearchString] = useState('');


  //const [allCurrTasks, setAllCurrTasks] = useState({});

  const reLoadDataExt = () => {
    setDataSource(LoadDataSource(filterUser.UserId, filterPriority, showingClosed, filterCustomer.Customer_Code, filterDepartment.Code, urgentOnly, searchString).data);
    setSelected({});
  }
  
  // Use Effect Hook to load data for the grid when webpage is loaded
  useEffect(() => {
    let mounted = true;
    
    setDataSource(LoadDataSource(filterUser.UserId, filterPriority, showingClosed, filterCustomer.Customer_Code, filterDepartment.Code, urgentOnly, searchString).data);
    //console.log(dataSource);
    returnCustomers()
      .then(customers => {
        if(mounted) {
          setCustomers(customers)
        }
      })
    returnDepartments()
      .then(departments => {
        if(mounted) {
          setDepartments(departments);
        }
      })
    returnUsers()
      .then(users => { 
        if(mounted) {
          setUsers(users)
        }
      }) 
      if(filterPriority===1) {
        document.getElementById("inline-radio-1").click();
      }
      if(filterPriority===2) {
        document.getElementById("inline-radio-2").click();
      }
      if(filterPriority===3) {
        document.getElementById("inline-radio-3").click();
      }


      //let gridData=gridRef.current.data;
      //console.log(gridData);
      //let allTasks={};
      //for(let i=0; i<gridData.length; i++) {
      //  allTasks[gridData[i].Task] = gridData[i]
      //}
      //console.log(allTasks);
      //setAllCurrTasks(allTasks);
      //console.log(allCurrTasks);

      //console.log(dataSource);
    return () => mounted = false;
  }, [filterUser, filterPriority, showingClosed, filterCustomer.Customer_Code, filterDepartment.Code, urgentOnly, searchString])
  //Store reference to grid for exporting PDF/CSV
  const [gridRef, setGridRef] = useState(null);
  const [historyRef, setHistoryRef] = useState(null);

  const [noteValue, setNoteValue] = useState("");
  const [historyMinutes, setHistoryMinutes] = useState();

  
  



  //----- DOUBLE-CLICK ON ROW -----//
  
  //setting departments/users/customers for drop downs
  const [departments, setDepartments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [users, setUsers] = useState([]);
  //Store current taskID of row that has been double clicked
  var [taskID, setTaskID] = useState();
  //Store History of current task
  const [history, setHistory] = useState([]);
  //Dates to update
  const [updateDueDate, setUpdateDueDate] = useState(new Date());
  const [updateReqDate, setUpdateReqDate] = useState(new Date());
  //State to load in the task that will be updated
  const [taskToUpdate, setTaskToUpdate] = useState({});
  //Holds values of dropdowns to update task with
  const [editCustomer, setEditCustomer] = useState([]);
  const [editDepartment, setEditDepartment] = useState([]);
  const [editUser, setEditUser] = useState([]);
  const [departmentValue, setDepartmentValue] = useState({});
  const [tasksUser, setTasksUser] = useState({});


  const [closedStatus, setClosedStatus] = useState('O');


  //-- SHOW/HIDE MODAL --//
  const [show, setShow] = useState(false);
  const [showCloseTask, setShowCloseTask] = useState(false);

  const [emailBody, setEmailBody] = useState("");

  const handleClose = () => {
    setShow(false);
    setSelected({}); 
    setHistoryMinutes(); 
    setSelectedItems();
  }
  const handleShow = () => {setShow(true);}

  //-- ALLOW DOUBLE CLICK --//
  const onRowDoubleClick = useCallback((rowProps) => {   
    
    var taskID = rowProps.data.Task;

    setItemDataSource(getItems(rowProps.data.Task));

    getSelectedTask(taskID).then(task=> {
      setTaskToUpdate(task[0]);

      //console.log(task[0]);
      setUpdateDueDate(new Date(task[0].DueDate));
      setUpdateReqDate(new Date(task[0].Requested));
      for(let i=0; i<departments.length; i++) {
        if(departments[i].Code===task[0].Department) {
          setDepartmentValue(departments[i]);
        }
      }
      for(let j=0; j<users.length; j++) {
        if(task[0].ActionBy===users[j].UserId){
          setTasksUser(users[j]);
          
        }
      }
      
      setClosedStatus(task[0].State);

      
      
      let duedate= new Date(task[0].DueDate)
      let taskDate = moment(duedate).format("DD-MM-YYYY")
      
      setEmailBody(`mailto:?subject=Task:%20${task[0].Issue_No}&body=Company:%20${task[0].Company_Name}%0D%0AIssue:%20${task[0].Issue_No}%0D%0ADetails:%20${task[0].Details}%0D%0APriority:%20${task[0].Priority}%0D%0ADue:%20${taskDate}`);
    });

   

    //console.log(departmentValue);
    
    handleShow();    
       
    setTimeout(() => {
        document.getElementById('addHistory').focus();
        /*
        if(urgentStatus==true) {
          document.getElementById('mark-urgent-check').click();
        }
        */
    },20)
        
    setTaskID(taskID)
    //var items = getHistory(taskID)
    //setHistory(items)
    
    getHistory(taskID)
      .then(history => {  
        setHistory(history);        
      })  
      
  }, [departments, users]);

  const onRenderRow = useCallback((rowProps) => {
    const { onDoubleClick } = rowProps;
    
    setTaskAmount(rowProps.dataSourceArray.length);
    
    
    rowProps.onDoubleClick = (event) => {
      onRowDoubleClick(rowProps);
      if (onDoubleClick) {
        onDoubleClick(event);
      }
    };


    
  }, [onRowDoubleClick])
  
  //-- SUBMIT BUTTONS --//
  const onSubmit = () => {
    
    
    handleClose();
    //console.log(editUser);
    //console.log(tasksUser);
    

    if(editUser.UserId === undefined) {
      updateTask(taskToUpdate, editCustomer.CustomerName, editCustomer.CustomerCode, editDepartment.Code, tasksUser.UserId);
      //console.log(tasksUser);
    } else {
      updateTask(taskToUpdate, editCustomer.CustomerName, editCustomer.CustomerCode, editDepartment.Code, editUser.UserId);
      // console.log(editUser);

      //Add Note to History tracking change of User for the Task
      //  editUser.Username == User task was changed to.
      //  tasksUser.Username == User it was previously

      let userChanged = "From " + tasksUser.Username + " to " + editUser.Username; 
      
      addNote(userChanged, taskID, UserID);

    }
   
    
    if(noteValue !== "") {
      addNote(noteValue, taskID, UserID, historyMinutes);
      setNoteValue("");
    }
    setEditCustomer([]);
    setEditUser([]);
    
    setTimeout(()=> {
      setDataSource(LoadDataSource(filterUser.UserId, filterPriority, showingClosed, filterCustomer.Customer_Code, filterDepartment.Code, urgentOnly, searchString).data);
    },500)
  
  


    if(selectedItems!==undefined) {
      const selectedIds =[];

      Object.keys(selectedItems).forEach(function(key) {
        selectedIds.push(key);
        //console.log(selectedItems[key].Complete);
        if(selectedItems[key].Complete===false){
          closeItem(key, 1);
          //console.log(key);
          //console.log("is being closed");
        } else {
          closeItem(key, 0);
          //console.log(key);
          //console.log("is being opened");
        }
      });
    }

    //console.log(inputList);
    if(inputList[0].item!==''){
      //console.log("NEW ITEM(S) ADDED")
      inputList.forEach(e => {
        addItem(taskToUpdate.Issue_No, e.item);
      })

      setInputList([{item: ""}]);
    }
    

    //closeItem(selectedIds, 1);
  }

  //States for closing tasks
  const [reasons, setReasons] = useState([]);
  const [reasonToClose, setReasonToClose] = useState([]);
  const [closingMinutes, setClosingMinutes] = useState();
  
  const onSubmitCloseTask = () => {
    handleCloseCloseTask();
    
    let closingNote = "Task Closed: " + reasonToClose.Reason
    if(reasonToClose.Code!==undefined){
      addNote(closingNote, taskID, UserID, closingMinutes);
      closeTask(taskID, reasonToClose.Code, closingMinutes);
    } else {
      alert("Please select Reason for Closing Task");
      handleShowCloseTask();
    }
    
    setTimeout(()=> {
      setDataSource(LoadDataSource(filterUser.UserId, filterPriority, showingClosed, filterCustomer.Customer_Code, filterDepartment.Code, urgentOnly, searchString).data);
    },500)

    setClosingMinutes();
  }

  const [timeSpent, setTimeSpent] = useState(0);
  //Handles Show/Hide Modal for closing tasks
  const handleCloseCloseTask = () => {
    setShowCloseTask(false);
    //alert(reasonToClose.Reason + " " + reasonToClose.Code);
    setClosingMinutes(0);
    setReasonToClose([]);
    setTimeSpent(0);
  }
  const handleShowCloseTask = () => {
    getTimeSpent(taskID)
      .then(res=> {
        //console.log(res[0].TimeSpent);
        setTimeSpent(res[0].TimeSpent);
        setShowCloseTask(true);
      });    
    
    returnReasons()
      .then(reasons => {
        setReasons(reasons)
      })  
  }
  //----------//

  //Sets data for the rows that are checked
  const [selected, setSelected] = useState({});
  
  const onSelectionChange = useCallback(({ selected }) => {
    if(selected!==true){
      setSelected(selected);
    }

    //console.log(JSON.stringify(toArray(selected)));
    //console.log(selected)
      
  }, [])

//For Items Grid
  //Sets data for the rows that are checked
  const [selectedItems, setSelectedItems] = useState();
  
  const onSelectionItemChange = useCallback(({ selected }) => {
    
    if(selected!==true){
      setSelectedItems(selected);
    }

    //console.log(JSON.stringify(toArray(selected)));
    //console.log(selectedItems);
      
  }, [])


  //const [filterUserName, setFilterUserName] = useState(Username);
  //const [filterPriority, setFilterPriority] = useState(1);


  //----- GRID INFO -----//
  //Default Sorting Info for the grid
  const defaultSortInfo = { name: 'Task', dir: -1 }
  //Column set-up for the grid
  const columns = [
    {name:'Task', header:'ID', type: 'number', defaultFlex: 1, maxWidth:70},
    {name:'Customer', header:'Customer', defaultFlex: 1, maxWidth: 200, minWidth: 150},
    {name:'Details', header:'Details', defaultFlex: 1, minWidth: 500},
    {name:'Area', header:'Department', defaultFlex: 1, maxWidth: 130},
    {name:'Application', header:'Ref 1', defaultFlex: 1, maxWidth: 100},
    {name:'Reference2', header:'Ref 2', defaultFlex: 1, maxWidth: 100},
    {name:'Last Comment', header:'Last Comment', defaultFlex: 1},
    {name:'Requested', header:'Requested', defaultFlex: 1, maxWidth: 115, 
      sort: (a, b) => {
        a = moment(a, 'DD/MM/YYYY', true).format();
        b = moment(b, 'DD/MM/YYYY', true).format();

        return new Date(a) - new Date(b);
     }
    },
    {name:'Updated', header:'Updated', defaultFlex: 1, maxWidth: 115,
      sort: (a, b) => {
        a = moment(a, 'DD/MM/YYYY', true).format();
        b = moment(b, 'DD/MM/YYYY', true).format();

        return new Date(a) - new Date(b);
      }
    },
    {name:'DueDate', header:'Due Date', defaultFlex: 1, maxWidth: 115,  
      sort: (a, b) => {
        a = moment(a, 'DD/MM/YYYY', true).format();
        b = moment(b, 'DD/MM/YYYY', true).format();

        return new Date(a) - new Date(b);
      }
    },
    {name:'Mins', header:'Estimate', type: 'number', defaultFlex: 1, maxWidth: 120},
    {name:'Invoice', header:'Invoice', type: 'number', defaultFlex: 1},
    {name:'P', header:'P', type: 'number', defaultFlex: 1, maxWidth: 75},
    {name:'ActionByUsername', header:'User', defaultFlex: 1},
    {name:'Owner_Name', header:'Owner', defaultFlex: 1}
  ]
  //Styling that is used on main grid
  const gridStyle = {
    height: '100%', 
    marginRight: 10,
    marginLeft: 10
    //border: '1px solid black',
    //boxShadow:  '0 0 8px 2px rgba(0, 0, 0)'
  }

  const historyStyle = {
    minHeight: 400
  }
  const theme = 'default-dark'
  //Column set-up for the 'history' grid
  const itemsColumns = [
    {name: 'ID', header: 'ID', defaultVisible:false},
    {name: 'Details', header: 'Details', minWidth:730}
  ]

  const HQDetails={
    'SupportCode' : 0,
    'Customer_Code' : 340,
    'CustomerName' : "HQ Software",
    'CustomerCode': 340
  }

  const itemsStyle = {
    minHeight: 400
  }
  const historyColumns = [
    {name: 'Username', header: 'User'},
    {name: 'Time', header: 'When'},
    {name: 'Notes', header: 'Notes', minWidth: 315},
    {name: 'Minutes', header: 'Minutes'}
  ]

  const createEmail = () => { 
    //Send email here
    window.open(emailBody);
  } 
  
  const [showPrompt, setShowPrompt] = useState(false);
  const handleClosePrompt = () => setShowPrompt(false);
  
  //Copy the selected Task
  const copyTask = () => {
    //console.log(taskToUpdate);
    
    handleClosePrompt();
    
    getNewTaskID().then(task=> {
      setTaskID(task[0][""])
    
      //console.log(task.[0].[""]);
      addNewTask(task[0][""], taskToUpdate.Company_Name, taskToUpdate.Account, taskToUpdate.Details, taskToUpdate.Priority, taskToUpdate.DueDate, taskToUpdate.Requested, taskToUpdate.Department, taskToUpdate.Owner_Name, taskToUpdate.ActionBy, taskToUpdate.Reference, taskToUpdate.Reference3, taskToUpdate.Reference2, taskToUpdate.Notes, taskToUpdate.Reference4, taskToUpdate.Invoice, taskToUpdate.Urgent);
      openHistory(task[0][""], UserID);
      //onTaskCreate(task.[0].[""]);
      setTaskToUpdate(prevTask => {
        return { 
          ...prevTask, 
          Issue_No: task[0][""]
        }
      })
      let minutes = 0;
      getHistory(task[0][""])
        .then(history => {  
          setHistory(history);
          //console.log(history);
          history.forEach(item => {
            minutes=minutes+item.Minutes
          }); 
          setShow(true);
      }) 

      
      //Reload task data
      setTimeout(()=> {
        reLoadDataExt();
        //setShow(true);
      },300)
    });

  }

  //Adding new Items to task

  const [inputList, setInputList] = useState([{item: ""}]);
    

    // handle input change
    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...inputList];
        list[index][name] = value;
        setInputList(list);
    };

    // handle click event of the Remove button
    const handleRemoveClick = index => {
      const list = [...inputList];
      list.splice(index, 1);
      setInputList(list);
    };

    // handle click event of the Add button
    const handleAddClick = () => {
      setInputList([...inputList, { item: ""}]);
    };

  
  return(
    <>
    <h5 className='task-amount-heading'>Total: {taskAmount}</h5>
    <div className='filter-row'>
      <div className='button-group-left'>
        {/*New Task */}
      <NewTask filterUser={filterUser}  filterDepartment={filterDepartment} filterCustomer={filterCustomer} onClick={reLoadDataExt}/>
      {/* Edit Multiple */}
      <MultiEdit selected={selected} onClick={reLoadDataExt}/> 
      {/* Clear Filters */}
      <OverlayTrigger key='ClearFilters' placement='bottom'
        overlay={
          <Tooltip id='tooltip-clear'>
            Clear Filters
          </Tooltip>
        }
      >
           <Button variant="secondary" style={{margin:'5px'}}
        	onClick={ () => {
            setFilterCustomer(AllCustomers);
            setFilterUser(AllUsers);
            //setFilterUserName(Username);
            setFilterDepartment(AllDepartments);
            document.getElementById('inline-radio-4-all').click();
          }}
        >
          <MdCancel />
        </Button>    
      </OverlayTrigger>
      {/* Re-Load Grid */}
      <OverlayTrigger key='Refresh' placement='bottom'
              overlay={
                <Tooltip id='tooltip-refresh'>
                  Refresh
                </Tooltip>
              }
            >
              <Button variant="secondary" style={{margin:'5px'}}
              onClick={() => {
                setDataSource(LoadDataSource(filterUser.UserId, filterPriority, showingClosed, filterCustomer.Customer_Code, filterDepartment.Code, urgentOnly, searchString).data);
                //console.log(dataSource)
              }}>
                <IoReload/>
              </Button>
            </OverlayTrigger>
      </div>
       {/* Search Field */}
       <Form.Control  value={searchString} style={{width:300, margin: '5px'}} placeholder='Search...'
                onChange = {e=> {
                  setSearchString(e.target.value);
                  // console.log(e.target.value);
                }}>
              </Form.Control>
      {/* Customer Select */}
              <Form.Control as="select" value={JSON.stringify(filterCustomer)} style={{width:300, margin: '5px'}}
                onChange = {e=> {
                  setFilterCustomer(JSON.parse(e.target.value));
                  // console.log(e.target.value);
                }}>
              <option value={JSON.stringify(AllCustomers)}>{AllCustomers.CustomerName}</option>
              <option value={JSON.stringify(HQDetails)}>{HQDetails.CustomerName}</option>
              {
                customers.map((customer, index) => {
                  return(<option key={index} value={JSON.stringify(customer)}>{customer.CustomerName}</option>)
                })
              }
              </Form.Control>
      {/* User Select */}
      <Form.Control as="select" value={JSON.stringify(filterUser)}  style={{width:150, margin: '5px'}}
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
      {/* Department Select */}
        <Form.Control as="select" value={JSON.stringify(filterDepartment)} style={{width:200, margin: '5px'}}
                    onChange = {e=> setFilterDepartment(JSON.parse(e.target.value))}>
                  <option value={JSON.stringify(AllDepartments)}>{AllDepartments.Department}</option>
                  {
                    departments.map((department, index) => {
                      return(<option key={index} value={JSON.stringify(department)}>{department.Department}</option>)
                    })
                  }
        </Form.Control>
      {/* Priority Radios */}
        <div className='filter-P-radios' style={{margin: '5px'}}>
        <Form.Check
              inline
              label="1"
              type="radio"
              name="group1"
              id={'inline-radio-1'}
              onChange = {e=> setFilterPriority(1)} 
            />
            <Form.Check
              inline
              label="2"
              type="radio"
              name="group1"
              id={'inline-radio-2'}
              onChange = {e=> setFilterPriority(2)}             
            />
            <Form.Check
              inline
              label="3"
              type="radio"
              name="group1"
              id={'inline-radio-3'}
              onChange = {e=> setFilterPriority(3)} 
            />
            <Form.Check
              inline
              label="ALL"
              type="radio"
              name="group1"
              id={'inline-radio-4-all'}
              onChange = {e=> setFilterPriority(0)} 
            />
        </div>    
      {/* Closed Checkbox */}
      <Form.Check 
              type="checkbox" 
              label="Closed"
              onChange = {e=> {
                if (showingClosed===false) {
                  setShowingClosed(true);
                } else {
                  setShowingClosed(false);
                }
              }}  
              style={{margin: '5px'}}
      />
      {/* Urgent CheckBox */}
      <Form.Check 
              type="checkbox" 
              label="Urgent Only"
              onChange = {e=> {
                if (urgentOnly===false) {
                  setUrgentOnly(true);
                } else {
                  setUrgentOnly(false);
                  
                }
              }}  
              style={{margin: '5px'}}
      />
      <div className='button-group-right'>
             {/* Summary */}
      <Summary />
      {/* Export to Excel */}
      <OverlayTrigger key='CSVEXPORT' placement='bottom'
              overlay={
                <Tooltip id='tooltip-excel'>
                  Export to Excel
                </Tooltip>
              }
            >
        <Button variant="secondary"  style={{margin:'5px'}}
        	onClick={ () => {
            const gridData = gridRef;
            exportCSV(gridData);
          }}
          
        >
        <RiFileExcel2Line />
        </Button>
      </OverlayTrigger>
      {/* Export to PDF */}
      <OverlayTrigger key='PDFEXPORT' placement='bottom'
        overlay={
          <Tooltip id='tooltip-pdf'>
            Export to PDF
          </Tooltip>
        } 
      >
           <Button variant="secondary" style={{margin:'5px'}}
        	onClick={ () => {
            const gridData = gridRef;
            exportPDF(gridData, filterCustomer);
          }}
         
        >
          <ImFilePdf />
        </Button>    
      </OverlayTrigger>
      </div>
     
    
    </div>
      
           
            
            
            
            
          
              <div className='grid-div'>

      <ReactDataGrid
        
        rowClassName={rowClassName}
        handle={setGridRef}
        idProperty="Task"
        columns={columns}
        dataSource={dataSource}
        style={gridStyle}
        theme={theme}
        onRenderRow={onRenderRow}
        selected={selected}
        checkboxColumn
        onSelectionChange={onSelectionChange}
        defaultSortInfo={defaultSortInfo}
        
        />
        </div>

      
      <Modal show={show} onHide={handleClose} size="lg" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Task: {taskID}</Modal.Title> 
          
          <OverlayTrigger key='Make-Urgent' placement='bottom'
        overlay={
          <Tooltip id='tooltip-pdf'>
            Mark/Unmark as Urgent
          </Tooltip>
        }
      >
        <Button variant ="danger" style={{Margin:10 , position:'absolute', left: 160}} 
          onClick={() => {
            let input=null;
              if(taskToUpdate.Urgent===null) {
                input = 1;
              } else {
                input = null;
              }
            makeUrgent(taskID, input);
            handleClose();
            onSubmit();
          }}
          >
            <FaExclamation/>
          </Button>
        </OverlayTrigger>
        {
          closedStatus==='C' &&
          <Button variant ="danger" style={{Margin:10, position: 'absolute', left:210}}
          onClick={() => {
            handleClose();
            reOpenTask(taskID);
            setTimeout(() => {
              setDataSource(LoadDataSource(filterUser.UserId, filterPriority, showingClosed, filterCustomer.Customer_Code, filterDepartment.Code, urgentOnly, searchString).data);
            }, 50)
            
          }}
          >Reopen Task</Button>
        }
        {
          closedStatus==='O' &&
          <OverlayTrigger key='close-task' placement='bottom'
            overlay={
              <Tooltip id='tooltip-close'>
                Close this Task
              </Tooltip>
            }
          >
            <Button variant="danger" style={{Margin: 10, position: 'absolute', left:210}}
            onClick={ () => {
              handleClose(); 
              handleShowCloseTask();
              onSubmit();
              
            }}
            >
              <AiFillCloseCircle/>
            </Button>
          </OverlayTrigger>
          
        }

        {/* Export to PDF */}
      <OverlayTrigger key='PDFEXPORT' placement='bottom'
        overlay={
          <Tooltip id='tooltip-pdf'>
            Export history to PDF
          </Tooltip>
        } 
      >
           <Button variant="secondary" style={{position: 'absolute', right:200}}
        	onClick={ () => {
            const gridData = historyRef;

            //console.log(historyRef);
            //console.log(taskToUpdate);
            exportHistoryPDF(gridData, taskToUpdate);
          }}
         
        >
          <ImFilePdf />
        </Button>    
      </OverlayTrigger>

        <OverlayTrigger key='save-task' placement='bottom'
            overlay={
              <Tooltip id='tooltip-save'>
                Save Changes
              </Tooltip>
            }
        >
          <Button variant="secondary" onClick={handleClose && onSubmit} style={{position: 'absolute', right:50}}>
            <FaSave />
          </Button>
        </OverlayTrigger>

          <OverlayTrigger key='send-email' placement='bottom'
            overlay={
              <Tooltip id='tooltip-email'>
                Email Task
              </Tooltip>
            }
          >
            <Button variant='secondary' style={{position: 'absolute', right:100}} onClick={()=> createEmail()}>
              <HiOutlineMail/>
            </Button>
        </OverlayTrigger>

        <OverlayTrigger key='copy-task' placement='bottom'
            overlay={
              <Tooltip id='tooltip-save'>
                Copy Task
              </Tooltip>
            }
        >
          <Button variant="secondary" onClick={()=> {
            setShowPrompt(true); 
            setShow(false);
          }} style={{position: 'absolute', right:150}}>
            <AiOutlineCopy />
          </Button>
        </OverlayTrigger>
          
        </Modal.Header>
        <Modal.Body>
        <Tabs className="mb-3" onSelect={(k) => { 
          if(k==="editTask"){
            document.getElementById(`inline-editradio-${taskToUpdate.Priority}`).click();
          }
        }}>
            <Tab eventKey="history" title="History">
              <Form>
                
                <Form.Group className="mb-3" controlId="addHistory">
                  <Form.Label>Add History:</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={3} 
                    placeholder="Add History..."
                    value={noteValue}
                    onChange = {e=> setNoteValue(e.target.value)}
                    type="text"
                  />
                </Form.Group>

                
                <Form.Group className="mb-3" controlId="closeTask.Minutes">
                <Form.Label>Add Time Spent:</Form.Label>
                <Form.Control 
                  as="input" 
                  rows={1}
                  type="number"
                  placeholder="Minutes..."
                  value={historyMinutes}
                  onChange = {e=> setHistoryMinutes(e.target.value)}/>
            </Form.Group>
              </Form>
          
              <ReactDataGrid 
                columns={historyColumns}
                dataSource={history}
                editable={true}
                style={historyStyle}
                handle={setHistoryRef}
              />
            </Tab>
            <Tab eventKey="editTask" title="Edit">
            <Form>
              <Row>
                <Col>
                  <Form.Group controlId="editTask.CustomerSelect">
                  <h7>Customer:</h7>
                    <Form.Control size='sm' as="select" value={customers.CustomerName}
                      onChange = {e=> {
                        setEditCustomer(JSON.parse(e.target.value));
                      }}
                    >
                      <option>{taskToUpdate.Company_Name}</option>
                      <option value={JSON.stringify(HQDetails)}>{HQDetails.CustomerName}</option>
                      {
                        customers.map((customer, index) => {
                        return(<option key={index} value={JSON.stringify(customer)}>{customer.CustomerName}</option>)
                        })
                      }
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="editTask.Department">
                  <Form.Label style={{display:'inline'}}>Department:</Form.Label>
                    <Form.Control size='sm' as="select" value={departments.Department}
                      onChange = {e=> {
                        setEditDepartment(JSON.parse(e.target.value))
                        console.log(JSON.parse(e.target.value))  
                      }}
                    >
                      <option value={JSON.stringify(departmentValue)}>{departmentValue.Department}</option>
                      {
                        departments.map((department, index) => {
                        if(departmentValue.Department!==department.Department){
                          return(<option key={index} value={JSON.stringify(department)}>{department.Department}</option>)
                        }
                        else return null;
                        })
                      }
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="editTask.UserSelect">
                    <Form.Label style={{display:'inline'}}>For:</Form.Label>
                    <Form.Control size='sm' as="select" value={users.UserName}
                      onChange = {e=> {setEditUser(JSON.parse(e.target.value))
                      //console.log(JSON.parse(e.target.value));
                      }}
                    >
                      <option value={tasksUser}>{tasksUser.Username}</option>
                      {
                        users.map((user, index) => {
                        if(tasksUser.Username!==user.Username){
                          return(<option key={index} value={JSON.stringify(user)}>{user.Username}</option>)
                        }
                        else return null;
                        })
                      }
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="editTask.Details">
                    <Form.Label>Details:</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={3} 
                      placeholder="Details..."
                      value={taskToUpdate.Details}
                      onChange = {e=> setTaskToUpdate(prevTask => {
                        return { 
                          ...prevTask, 
                          Details: e.target.value
                        }
                      })}
                      type="text"
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3" controlId="editTask.Notes">
                    <Form.Label>Notes:</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={3} 
                      placeholder="Notes..."
                      value={taskToUpdate.Notes}
                      onChange = {e=> setTaskToUpdate(prevTask => {
                        return { 
                          ...prevTask, 
                          Notes: e.target.value
                        }
                      })}
                      type="text"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Label>Due Date:&nbsp;&nbsp;&nbsp;</Form.Label>
                  <DatePicker 
                    selected={updateDueDate} 
                    onChange={(date) => setTaskToUpdate(prevTask => {
                      setUpdateDueDate(new Date(date))

                      return {
                        ...prevTask,
                        DueDate: moment(date).format('YYYY-MM-DDThh:mm:ss.000')
                      }
                    
                    })} 
                    dateFormat = 'dd/MM/yyyy'
                    calendarStartDay={1}
                  />
                </Col>
                <Col>
                  <Form.Label>Requested Date:&nbsp;&nbsp;&nbsp;</Form.Label>
                  <DatePicker 
                    selected={updateReqDate} 
                    onChange={(date) => setTaskToUpdate(prevTask => {
                      setUpdateReqDate(date)

                      return {
                        ...prevTask,
                        Requested: moment(date).format('YYYY-MM-DDThh:mm:ss.000')
                      }
                    }
                    )}  
                    dateFormat = 'dd/MM/yyyy'  
                    calendarStartDay={1}
                  />
                </Col>
                <Col>
                  <Form.Label>Priority:&nbsp;&nbsp;</Form.Label>
                    <br/>
                  <Form.Check
                    inline
                    label="1"
                    type="radio"
                    name="group1"
                    id={'inline-editradio-1'}
                    onChange = {e=> setTaskToUpdate(prevTask => {
                      return { 
                        ...prevTask, 
                        Priority: 1
                      }
                    })} 
                  />
                  <Form.Check
                    inline
                    label="2"
                    type="radio"
                    name="group1"
                    id={'inline-editradio-2'}
                    onChange = {e=> setTaskToUpdate(prevTask => {
                      return { 
                        ...prevTask, 
                        Priority: 2
                      }
                    })}             
                  />
                  <Form.Check
                    inline
                    label="3"
                    type="radio"
                    name="group1"
                    id={'inline-editradio-3'}
                    onChange = {e=> setTaskToUpdate(prevTask => {
                      return { 
                        ...prevTask, 
                        Priority: 3
                      }
                    })} 
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="editTask.Section" style={{marginTop: 15}}>
                    <Form.Label>Reference 1:</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={1}
                        type="text"
                        value={taskToUpdate.Reference}
                        onChange = {e=> setTaskToUpdate(prevTask => {
                          return { 
                            ...prevTask, 
                            Reference: e.target.value
                          }
                        })}                
                      />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3" controlId="newTask.Area" style={{marginTop: 15}}>
                    <Form.Label>Reference 2:</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={1}
                        type="text"
                        value={taskToUpdate.Reference2}
                        onChange = {e=> setTaskToUpdate(prevTask => {
                          return { 
                            ...prevTask, 
                            Reference2: e.target.value
                          }
                        })} 
                      />
                  </Form.Group>
                </Col>
                
              </Row>
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="editTask.Contact">
                  <Form.Label>Requester:</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={1}
                      type="text"
                      value={taskToUpdate.Reference3}
                      onChange = {e=> setTaskToUpdate(prevTask => {
                        return { 
                          ...prevTask, 
                          Reference3: e.target.value
                        }
                      })}                
                    />
                  </Form.Group> 
                </Col>
                <Col>
                  	<Form.Group className="mb-3" controlId="newTask.Estimate">
                    <Form.Label>Estimate:</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={1}
                        type="text"
                        value={taskToUpdate.Estimate}
                        onChange = {e=> setTaskToUpdate(prevTask => {
                          return { 
                            ...prevTask, 
                            Estimate: e.target.value
                          }
                        })}                
                      />
                    </Form.Group> 
                </Col>
                <Col>
                  <Form.Group className="mb-3" controlId="newTask.Invoice">
                  <Form.Label>Invoice:</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={1}
                      type="text"
                      value={taskToUpdate.Invoice}
                      onChange = {e=> setTaskToUpdate(prevTask => {
                        return { 
                          ...prevTask, 
                          Invoice: e.target.value
                        }
                      })}                
                    />
                  </Form.Group> 
                </Col>
              </Row>   
          </Form> 
          <Form.Label>Items:</Form.Label>
        {inputList.map((x, i) => {
        return (
          <div className="box">
            <Form.Group as={Row} controlId="newItems" style={{marginTop: 5}}>
                <Col>
                <Form.Control
                    size="sm"
                    as="textarea" 
                    rows={1}
                    type="text"
                    name="item"
                    value={x.item}
                    onChange={e => handleInputChange(e, i)}
                />
                </Col>
                <Col xs={1}>
                    {inputList.length !== 1 && 
                      <OverlayTrigger key='RemoveItem' placement='bottom'
                      overlay={
                        <Tooltip id='tooltip-removeitem'>
                          Remove Item
                        </Tooltip>
                      }
                      > 
                        <Button size="sm" className="mr10" variant="secondary" onClick={() => handleRemoveClick(i)}><BiMinus/></Button>
                      </OverlayTrigger>
                    }
                </Col>
                
                <Col xs={1}>    
                    {inputList.length - 1 === i && 
                      <OverlayTrigger key='AddItem' placement='bottom'
                      overlay={
                        <Tooltip id='tooltip-additem'>
                          Add Item
                        </Tooltip>
                      }
                      > 
                      <Button size="sm" variant="secondary" onClick={handleAddClick}><BiPlus/></Button>
                      </OverlayTrigger>
                    }
                </Col>
            </Form.Group>
          </div>
        );
      })}        
          

         </Tab>
         
         <Tab eventKey="items" title="Items">
         <ReactDataGrid 
                idProperty="ID"
                selected={selectedItems}
                checkboxColumn
                onSelectionChange={onSelectionItemChange}
                columns={itemsColumns}
                dataSource={itemDataSource}
                style={itemsStyle}   
                rowClassName={itemRowClassName}
                editable={true}             
          />


              
         </Tab>
        </Tabs>
          
        </Modal.Body>
      </Modal>

      <Modal show={showCloseTask} onHide={handleCloseCloseTask}>
        <Modal.Header closeButton>
          <Modal.Title>Close Task: {taskID}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form.Group controlId="closeTask.ReasonSelect">  
            <Form.Control as="select" value={reasons.Reason}
                onChange = {e=> setReasonToClose(JSON.parse(e.target.value))}>
                <option value={{}}>Select Close Reason . . .</option>
              {
                reasons.map((reason, index) => {
                  return(<option key={index} value={JSON.stringify(reason)}>{reason.Reason}</option>)
                })
              }
            </Form.Control>
            </Form.Group>
            <Form.Label>Time Spent: {timeSpent}</Form.Label>
            <Form.Group className="mb-3" controlId="closeTask.Minutes">
              <Form.Label>Additional Minutes:</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={1}
                  type="text"
                  value={closingMinutes}
                  placeholder="Additional Minutes..."
                  onChange = {e=> setClosingMinutes(e.target.value)}                />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          
          <Button variant="secondary" onClick={handleCloseCloseTask}>
            Cancel
          </Button>
          
          <Button variant="danger" onClick={handleCloseCloseTask && onSubmitCloseTask}>
            Close Task
          </Button>
        </Modal.Footer>
      </Modal>


      <Modal show={showPrompt} onHide={handleClosePrompt}>
        <Modal.Header closeButton>
          <Modal.Title>Copying task {taskID}</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to copy Task: {taskID} ?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosePrompt}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleClosePrompt && copyTask}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>

     

      
    </>       
    
  )
}



export default Tasks;  