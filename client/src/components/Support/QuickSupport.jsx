import  React, {useEffect, useState, useRef}  from "react";

//Bootstrap Used for buttons, modals and styling
import Button from 'react-bootstrap/Button'
import 'bootstrap/dist/css/bootstrap.min.css'
import Form from 'react-bootstrap/Form'
//import Row from 'react-bootstrap/Row'
//import Col from 'react-bootstrap/Col'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'

//React-DatePicker used for date inputs
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'

import { FaSave } from 'react-icons/fa'

import SupportSummary from './SupportSummary.jsx'


async function returnCustomers() {
    const response = await fetch('/returnCustomers');
    const customers = await response.json();
    return customers
}
async function returnReasons() {
    const response = await fetch('/returnSupportReasons');
    const reasons = await response.json();
    return reasons
}

function addQuickSupport(support, details, formatDate, minutes, phone, email, remote, siteVisit, outOfHours, Reason, UserID) {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        SupportCode: support,
        User: UserID,
        Date: formatDate,
        Details: details,
        Phone: phone,
        Email: email,
        Site: siteVisit,
        Minutes: minutes,
        Remote: remote,
        Reason: Reason,
        OutOfHours: outOfHours
      })
    }
    return fetch('/addQuickSupport/', requestOptions)
     
  }

function QuickSupport() {
    document.title = 'HQ Business - Support';
    //----- GET CURRENT USER -----//
    const tokenString = sessionStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    //const Username = userToken.username;
    const UserID = userToken.userId;

    const AllCustomers = {
        "SupportCode":0,
        "Customer_Code":0,
        "CustomerName":"Select Customer",
        "CustomerCode":0
    }
    
    const AllReasons = {Code: 0, Reason: 'Select Reason'}
    
    const [customer, setCustomer] = useState(AllCustomers);
    const [customers, setCustomers] = useState([]);
    const [details, setDetails] = useState("");
    const [date, setDate] = useState(new Date());
    const [reasons, setReasons] = useState([]);
    const [selectedReason, setSelectedReason] = useState(AllReasons);
    const [minutes, setMinutes] = useState(0);
    const [showOther, setShowOther] = useState(false);
    const [phone, setPhone] = useState('N');
    const [email, setEmail] = useState('N');
    const [remote, setRemote] = useState('N');
    const [siteVisit, setSiteVisit] = useState('N');
    const [outOfHours, setOutOfHours] = useState('N');

    const [validated, setValidated] = useState(false);
    const formRef = useRef(null);

    useEffect(() => {

        let mounted = true;

        returnCustomers()
            .then(customers => {
                if(mounted) {
                setCustomers(customers)
                }
            })
        returnReasons()
            .then(reasons => {
              if(mounted) {
                setReasons(reasons)
              }  
            })

        return () => mounted = false;

    },[])

    
    const onSubmit = () => {
        //Set Date to correct format
        var formatDate = moment(date).format('YYYY-MM-DD hh:mm:ss');

        console.log(minutes);
        if(customer.CustomerName==="Select Customer"){
            alert("Please Select a Customer");
        } else if(details==="") {
            alert("Please add Details");
        } else if(minutes===0) {
            alert("Please add Time");
        } else if(selectedReason.Code===0) {
            alert("Please Select a Reason");
        } else {
            
            addQuickSupport(customer.SupportCode, details, formatDate, minutes, phone, email, remote, siteVisit, outOfHours, selectedReason.Code, UserID);
            handleReset();
        }
        
        

        
    }

    const handleReset = () => {
        formRef.current.reset();
        setValidated(false);

        setDetails("");
        setDate(new Date());
        setSelectedReason(AllReasons);
        setMinutes(0);
        setPhone('N');
        setEmail('N');
        setRemote('N');
        setSiteVisit('N');
        setOutOfHours('N');


        let currentCustomer = customer;
        setCustomer(AllCustomers);
        setTimeout(()=>{
            setCustomer(currentCustomer);
        }, 50)
    }


    
    return(
        <>
        <div style={{width:'35%',position: 'fixed', right: '60%', marginTop: '2%', marginBottom:'100'}}>
        <Form ref={formRef} validated={validated}>
        <Form.Group controlId="select.customer">
            <Form.Label>Customer: </Form.Label>
            <Form.Control as="select" value={JSON.stringify(customer)} style={{display:'inline', margin:5, width:'80%'}}
                onChange = {e=> {
                  setCustomer(JSON.parse(e.target.value));
                  // console.log(e.target.value);
                  
                  document.getElementById('editTask.Details').focus();
                
                }}>
              <option value={JSON.stringify(AllCustomers)}>{AllCustomers.CustomerName}</option>
              {
                customers.map((customer, index) => {
                  return(<option key={index} value={JSON.stringify(customer)}>{customer.CustomerName}</option>)
                })
              }
            </Form.Control>
        </Form.Group>
        <Form.Group className="mb-3" controlId="editTask.Details">
            <Form.Control 
                as="textarea" 
                rows={5} 
                placeholder="Details..."
                value={details}
                onChange = {e=> setDetails(e.target.value)}
                type="text"
                style={{backgroundColor:'#fbff85'}}
            />
        </Form.Group>
        <Form.Group>
            <DatePicker 
                selected={date} 
                onChange={(date) => setDate(date)} 
                dateFormat = 'dd/MM/yyyy'
                calendarStartDay={1}
            />
        </Form.Group>
        <Form.Group>
        <Form.Label>Minutes:&nbsp;&nbsp;&nbsp;</Form.Label>
            <Form.Check
                inline
                label="5"
                name="group1"
                type='radio'
                id={`inline-radio-5m`}
                onChange={e=> {
                    setMinutes(5);
                    setShowOther(false);
                }}
            />
            <Form.Check
                inline
                label="10"
                name="group1"
                type='radio'
                id={`inline-radio-10m`}
                onChange={e=> {
                    setMinutes(10);
                    setShowOther(false);
                }}
            />
            <Form.Check
                inline
                label="15"
                name="group1"
                type='radio'
                id={`inline-radio-15m`}
                onChange={e=> {
                    setMinutes(15);
                    setShowOther(false);
                }}
            />
            <Form.Check
                inline
                label="30"
                name="group1"
                type='radio'
                id={`inline-radio-30m`}
                onChange={e=> {
                    setMinutes(30);
                    setShowOther(false);
                }}
            />
            <Form.Check
                inline
                label="45"
                name="group1"
                type='radio'
                id={`inline-radio-45m`}
                onChange={e=> {
                    setMinutes(45);
                    setShowOther(false);
                }}
            />
            <Form.Check
                inline
                label="60"
                name="group1"
                type='radio'
                id={`inline-radio-60m`}
                onChange={e=> {
                    setMinutes(60);
                    setShowOther(false);
                }}
            />
            <Form.Check
                inline
                label="90"
                name="group1"
                type='radio'
                id={`inline-radio-90m`}
                onChange={e=> {
                    setMinutes(90);
                    setShowOther(false);
                }}
            />
            <Form.Check
                inline
                label="120"
                name="group1"
                type='radio'
                id={`inline-radio-120m`}
                onChange={e=> {
                    setMinutes(120);
                    setShowOther(false);
                }}
            />
            <Form.Check
                inline
                label="Other"
                name="group1"
                type='radio'
                id={`inline-radio-other`}
                onChange={e=> {
                    setMinutes();
                    setShowOther(true);
                }}
            />
            {
                showOther===true &&
                <Form.Control 
                as="textarea" 
                rows={1} 
                placeholder="Minutes"
                value={minutes}
                onChange = {e=> setMinutes(e.target.value)}
                type="text"
                style={{position:'absolute', right:0,  width: 120, display: 'inline'}}
                />
            }
        </Form.Group>
        <Form.Group>
            <Form.Label>Actions: &nbsp;&nbsp;&nbsp;</Form.Label>
            <Form.Check
                inline
                label="Phone"
                name="group2"
                type='checkbox'
                id={`inline-check-phone`}
                onChange = {e=> {
                    if (phone==='N') {
                      setPhone('Y');
                    } else {
                      setPhone('N');
                    }
                }} 
            />
            <Form.Check
                inline
                label="Email"
                name="group2"
                type='checkbox'
                id={`inline-check-email`}
                onChange = {e=> {
                    if (email==='N') {
                      setEmail('Y');
                    } else {
                      setEmail('N');
                    }
                }} 
            />
            <Form.Check
                inline
                label="Remote Access"
                name="group2"
                type='checkbox'
                id={`inline-check-remote`}
                onChange = {e=> {
                    if (remote==='N') {
                      setRemote('Y');
                    } else {
                      setRemote('N');
                    }
                }}
            />
            <Form.Check
                inline
                label="Site Visit"
                name="group2"
                type='checkbox'
                id={`inline-check-sitevisit`}
                onChange = {e=> {
                    if (siteVisit==='N') {
                      setSiteVisit('Y');
                    } else {
                      setSiteVisit('N');
                    }
                }}
            />
            <Form.Check
                inline
                label="Out of Hours"
                name="group2"
                type='checkbox'
                id={`inline-check-outofhours`}
                onChange = {e=> {
                    if (outOfHours==='N') {
                      setOutOfHours('Y');
                    } else {
                      setOutOfHours('N');
                    }
                }}
            />
        </Form.Group>
        <Form.Group controlId="support.ReasonSelect">  
            <Form.Label>Reason: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Form.Label>
            <Form.Control as="select" value={reasons.Reason} style={{display:'inline', margin:5, width:'80%'}}
                onChange = {e=> setSelectedReason(JSON.parse(e.target.value))}>
                <option value={AllReasons}>{AllReasons.Reason}</option>
              {
                reasons.map((reason, index) => {
                  return(<option key={index} value={JSON.stringify(reason)}>{reason.Reason}</option>)
                })
              }
            </Form.Control>
        </Form.Group>
        <OverlayTrigger key='save-task' placement='bottom'
            overlay={
              <Tooltip id='tooltip-save'>
                Save
              </Tooltip>
            }
        >
            <Button onClick={onSubmit} className="button-to-the-right" variant="secondary" >
                <h4><FaSave /></h4>
            </Button>
        </OverlayTrigger>
        
        </Form>
        </div>
        <div style={{width:'40%',position: 'absolute', left: '50%', marginTop: '2%'}}>
            <SupportSummary customer={customer.SupportCode} />
        </div>
        </>
    )
}

export default QuickSupport;