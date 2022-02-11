import React, {useState, useEffect} from 'react';
import moment from 'moment'


import Button from 'react-bootstrap/Button'
import 'bootstrap/dist/css/bootstrap.min.css'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import DatePicker from 'react-datepicker'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'



import {addNewTask, getNewTaskID, returnCustomers, returnDepartments, returnUsers, openHistory} from './returnTasks.js'

import {HiOutlineMail} from "react-icons/hi";
import {RiFileAddLine} from "react-icons/ri"
import {BiPlus, BiMinus } from "react-icons/bi"




const HQDetails={
    'SupportCode' : 0,
    'Customer_Code' : 340,
    'CustomerName' : "HQ Software",
    'CustomerCode': 340
}


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




const NewTask = React.memo( props => {
  //console.log("NewTask Render");
  //console.log(props);
  
  const currentUserObj = {
    'UserId': props.filterUser.UserId,
    'Username':  props.filterUser.Username
  }
  const currentDepFilter = props.filterDepartment;
  const currentCustFilter = props.filterCustomer;
  
  //----- GET CURRENT USER -----//
  const tokenString = sessionStorage.getItem('token');
  const userToken = JSON.parse(tokenString);
  const Username = userToken.username;
  const UserID = userToken.userId;
  //-----------//
    //setting departments/users/customers for drop downs
  const [departments, setDepartments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [users, setUsers] = useState([]);
   // Use Effect Hook to load data for the grid when webpage is loaded
   useEffect(() => {
    let mounted = true;
    
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

    return () => mounted = false;
  }, [])

//-----NEW TASK-----//  

    const [showNewTask, setShowNewTask] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    
    //States inserting new values into the new task created

    var fortnight = new Date();
    fortnight.setDate(fortnight.getDate()+14);

    const [dueDate, setDueDate] = useState(fortnight);
    const [reqDate, setReqDate] = useState(new Date());
    const [newDetails, setNewDetails] = useState("");
    const [newTaskNo, setNewTaskNo] = useState();
    const [newCustomer, setNewCustomer] = useState({});
    const [newDepartment, setNewDepartment] = useState({});
    const [newUser, setNewUser] = useState([]);
    const [newRef1, setNewRef1] = useState("");
    const [newContact, setNewContact] = useState("");
    const [newRef2, setNewRef2] = useState("");
    const [newNotes, setNewNotes] = useState("");
    const [newInvoice, setNewInvoice] = useState("");
    const [newEstimate, setNewEstimate] = useState("");
    const [newTaskPriority, setNewTaskPriority] = useState(2);

    const [urgent, setUrgent] = useState(null);

    

    const [emailBody, setEmailBody] = useState("");

    //Functions to handle show/hide modal
    const handleCloseNewTask = () => { 
        setShowNewTask(false); 

        setTimeout(()=> {
          //Resets all values after modal is closed
          var fortnight = new Date();
          fortnight.setDate(fortnight.getDate()+14);

          setNewDetails("");
          setNewTaskPriority(2);
          setDueDate(fortnight);
          setReqDate(new Date());
          setNewRef1("");
          setNewContact("");
          setNewRef2("");
          setNewNotes("");
          setNewEstimate("");
          setNewInvoice("");
          setNewDepartment({});
          setNewCustomer({});
          
          setUrgent(null);

          setInputList([{item: ""}]);
        }, 200)
          
    }
    
    const handleShowNewTask = () => {
      setShowNewTask(true);
      setNewUser(currentUserObj);
      
      setTimeout(()=> {
        document.getElementById(`inline-newTask-radio-${newTaskPriority}`).click();
      },10)
    }

    //Function that handles the submit button for adding a new task
    const onSubmitNewTask = () => {
       

        //Set Dates to correct format
        var newDueDate = moment(dueDate).format('YYYY-MM-DD hh:mm:ss');
        var newReqDate = moment(reqDate).format('YYYY-MM-DD hh:mm:ss'); 
        
        var DepToAdd = {};
        var CustToAdd = {};
        
        //console.log(newCustomer);
        //console.log(currentCustFilter);
        if(newCustomer.CustomerCode===undefined) {
          CustToAdd = currentCustFilter;
        } else {
          CustToAdd = newCustomer;
        }
        //console.log(CustToAdd);
        if(newDepartment.Code===undefined){
          DepToAdd = currentDepFilter;
        } else {
          DepToAdd = newDepartment;
        }
        //console.log(DepToAdd);
        //console.log(newUser);
        getNewTaskID().then(task=> {
          setNewTaskNo(task[0][""])
        //Check if Customer and Department have been Selected before adding new task
          if(CustToAdd.CustomerCode===0){
            alert("Please Select a Customer");
          } else if(DepToAdd.Code===0) {
            alert ("Please Select a Department");
          } else if(newUser.UserId === 0) {
            alert ("Please Select a User");
          }else{
            //console.log(task.[0].[""]);
            addNewTask(task[0][""], CustToAdd.CustomerName, CustToAdd.CustomerCode, newDetails, newTaskPriority, newDueDate, newReqDate, DepToAdd.Code, Username, newUser.UserId, newRef1, newContact, newRef2, newNotes, newEstimate, newInvoice, urgent);
            openHistory(task[0][""], UserID);
            onTaskCreate(task[0][""]);
            
            //console.log(inputList[0].item);
            if(inputList[0].item!==''){
              //console.log('test');
              inputList.forEach(e => {
                addItem(task[0][""], e.item);
              })
            }
            

            handleCloseNewTask();
          }
        
          //Reload task data
          setTimeout(()=> {
            props.onClick();
          },500)
        });
        //console.log(urgent);
        
    }
//----------//

//----- Send Email of New Task -----//
    const onTaskCreate = (nextTaskNum) => {
      var thisDueDate = moment(dueDate).format('DD/MM/YYYY');
      
      setEmailBody(`mailto:?subject=Task:%20${nextTaskNum}&body=Issue:%20${newTaskNo}%0D%0ADetails:%20${newDetails}%0D%0APriority:%20${newTaskPriority}%0D%0ABy:%20${newUser.Username}%0D%0ADue:%20${thisDueDate}`);
      
      const textToCopy = `Task: ${nextTaskNum}\r\nDetails: ${newDetails}\r\nPriority: ${newTaskPriority}\r\nBy: ${newUser.Username}\r\nDue: ${thisDueDate}`; 
      
      copyToClipboard(textToCopy)
        .catch(() => console.log('error'));
      setShowAlert(true);  
    }
    const createEmail = () => { 
      //Send email here
      window.open(emailBody);
    }

    function copyToClipboard(textToCopy) {
      // navigator clipboard api needs a secure context (https)
      if (navigator.clipboard && window.isSecureContext) {
          // navigator clipboard api method'
          return navigator.clipboard.writeText(textToCopy);
      } else {
          // text area method
          let textArea = document.createElement("textarea");
          textArea.value = textToCopy;
          // make the textarea out of viewport
          textArea.style.position = "fixed";
          textArea.style.left = "-999999px";
          textArea.style.top = "-999999px";
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          return new Promise((res, rej) => {
              // here the magic happens
              document.execCommand('copy') ? res() : rej();
              textArea.remove();
          });
      }
  }

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


    return (
        <>
        <OverlayTrigger key='NewTask' placement='bottom'
          overlay={
            <Tooltip id='tooltip-newtask'>
              New Task
            </Tooltip>
          }
        >
        <Button variant="secondary" style={{margin:'5px'}}
      	onClick={ () => {
          handleShowNewTask();  
          //getNewTaskID().then(task=> setNewTaskNo(task.[0].[""])); 
          setNewContact(Username);  
        }}
        className="button-to-the-left"
        >
           <RiFileAddLine/>
        </Button>
        </OverlayTrigger>

        <Modal show={showNewTask} onHide={handleCloseNewTask} size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>Create New Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          
          
          <Form>
          <Row>
            <Col>
              <Form.Group controlId="newTask.CustomerSelect">
              <h7>Customer:</h7>
                <Form.Control size="sm" as="select" value={customers.CustomerName}
                    onChange = {e=> setNewCustomer(JSON.parse(e.target.value))}>
                  <option value ={JSON.stringify(currentCustFilter)}>{currentCustFilter.CustomerName}</option>
                  
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
              <Form.Group controlId="newTask.DepartmentSelect">
              <h7>Department:</h7>
                <Form.Control size="sm" as="select" value={departments.Department}
                    onChange = {e=> setNewDepartment(JSON.parse(e.target.value))}>
                  <option value ={JSON.stringify(currentDepFilter)}>{currentDepFilter.Department}</option>
                  {
                    departments.map((department, index) => {
                      if(department.Department!==currentDepFilter.Department){
                        return(<option key={index} value={JSON.stringify(department)}>{department.Department}</option>)
                      } else {
                        return null;
                      } 
                    })
                  }
                </Form.Control>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="newTask.UserSelect">
                <h7>For:</h7>
                <Form.Control size="sm" as="select" value={users.Username}
                    onChange = {e=> setNewUser(JSON.parse(e.target.value))}>
                  <option value ={JSON.stringify(currentUserObj)}>{currentUserObj.Username}</option>
                  {
                    users.map((user, index) => {
                    if(user.Username!==currentUserObj.Username) {
                      return(<option key={index} value={JSON.stringify(user)}>{user.Username}</option>)
                    } else return null;
                    })
                  }
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="newTask.Details">
                <h7>Details:</h7>
                <Form.Control 
                  as="textarea" 
                  rows={3} 
                  placeholder="Add Details..."
                  value={newDetails}
                  onChange = {e=> setNewDetails(e.target.value)}
                  type="text"
                  size="sm"
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3" controlId="newTask.Notes">
                <h7>Notes:</h7>
                <Form.Control 
                  as="textarea" 
                  rows={3} 
                  placeholder="Add Notes..."
                  value={newNotes}
                  onChange = {e=> setNewNotes(e.target.value)}
                  type="text"
                  size="sm"
                />
              </Form.Group>
            </Col>
          </Row>
          

          <Form.Group as={Row} className="mb-3" controlId="newTask.Dates" style={{marginTop: 5}}>
                  <Col xs={2}>
                    <Form.Label>Due:</Form.Label>
                  </Col>
                  <Col >
                    <DatePicker 
                      selected={dueDate} 
                      onChange={(date) => setDueDate(date)} 
                      dateFormat = 'dd/MM/yyyy' 
                      calendarStartDay={1} 
                      
                    />
                  </Col>
                  <Col xs={2}>
                    <Form.Label>Requested:</Form.Label>
                  </Col>
                  <Col>
                    <DatePicker 
                      selected={reqDate} 
                      onChange={(date) => setReqDate(date)} 
                      dateFormat = 'dd/MM/yyyy'  
                      calendarStartDay={1}
                    />
                  </Col>
                  
          </Form.Group>    
            
              <Form.Group as={Row} className="mb-3" controlId="newTask.Reference1-2" style={{marginTop: 5}}>
              <Col xs={1}>
                    <Form.Label>P:</Form.Label>
                  </Col>
                  <Col xs={3}>
                    <Form.Check
                      size="sm"
                      inline
                      label="1"
                      type="radio"
                      name="group1"
                      id={'inline-newTask-radio-1'}
                      onChange = {e=> setNewTaskPriority(1)}
                    />
                    <Form.Check
                      size="sm"
                      inline
                      label="2"
                      type="radio"
                      name="group1"
                      id={'inline-newTask-radio-2'}
                      onChange = {e=> setNewTaskPriority(2)}
                    />
                    <Form.Check
                      size="sm"
                      inline
                      label="3"
                      type="radio"
                      name="group1"
                      id={'inline-newTask-radio-3'}
                      onChange = {e=> setNewTaskPriority(3)}
                    />
                  </Col>
                <Col xs={2}>
                  <h7>Reference 1:</h7>
                </Col>
                <Col>  
                  <Form.Control 
                    style={{display:'inline'}}
                    size="sm"
                    as="textarea" 
                    rows={1}
                    type="text"
                    value={newRef1}
                    onChange = {e=> setNewRef1(e.target.value)}
                  />
                </Col>
                <Col xs={2}>
              <Form.Label>Reference 2:</Form.Label>
            </Col>
            <Col>
                  <Form.Control 
                    as="textarea" 
                    rows={1}
                    type="text"
                    value={newRef2}
                    onChange = {e=> setNewRef2(e.target.value)}
                    size="sm"
                  />
            </Col>
              </Form.Group>          
            
            <Form.Group as={Row} className="mb-3" controlId="newTask.Contact" style={{marginTop: 5}}>
                <Col xs={2}>
                  <Form.Label>Requester:</Form.Label>
                </Col>
                <Col>
                  <Form.Control 
                    as="textarea" 
                    rows={1}
                    type="text"
                    value={newContact}
                    onChange = {e=> setNewContact(e.target.value)}
                    size="sm"
                  />
                </Col>
                <Col xs={1}>
                  <Form.Label>Estimate:</Form.Label>
                </Col>
                <Col xs={2}>
                  <Form.Control 
                    as="textarea" 
                    rows={1}
                    type="text"
                    value={newEstimate}
                    onChange = {e=> setNewEstimate(e.target.value)}
                    size="sm"
                  />
                </Col>
                <Col xs={1}>
                  <Form.Label>Invoice:</Form.Label>
                </Col>
                <Col>
                  <Form.Control 
                    as="textarea" 
                    rows={1}
                    type="text"
                    value={newInvoice}
                    onChange = {e=> setNewInvoice(e.target.value)}
                    size="sm"
                  />
                </Col>        
            </Form.Group> 
        </Form>

         <div>
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
      
    </div>
    
        </Modal.Body>
        <Modal.Footer>

          <Form.Check 
              type="checkbox" 
              label="Make Urgent"
              style={{margin:5, right:450 }}
              onChange = {e=> {
                if(urgent===null){
                  setUrgent(1);
                } else {
                  setUrgent(null);
                }
              }}  
          />
          
          <Button variant="secondary" onClick={handleCloseNewTask}>
            Close
          </Button>
          <Button variant="primary" onClick={()=>{ 
            onSubmitNewTask();
          }}>
            Create Task
          </Button>
        </Modal.Footer>
      </Modal>


      <Modal
        size="sm"
        show={showAlert}
        onHide={() => setShowAlert(false)}
        aria-labelledby="success-alert"
      >
        <Modal.Header closeButton>
          <Modal.Title id="success-alert-title">
            Task {newTaskNo} Created
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Details copied to clipboard
          <br/>
          <Button variant='success' onClick={()=> createEmail()} className="button-to-the-right">
          <HiOutlineMail/>
          </Button>
        </Modal.Body>
      </Modal>

    </>
    )
});


export default NewTask;  