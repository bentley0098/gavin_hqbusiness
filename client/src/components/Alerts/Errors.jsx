import React, {  useState, useEffect, useCallback } from 'react';
import { useHistory } from "react-router-dom";

import './alerts.css';

import Form from 'react-bootstrap/Form'
import moment from 'moment'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

import { AiOutlineFlag } from 'react-icons/ai'



//ReactDataGrid.io used for main grid
import ReactDataGrid from '@inovua/reactdatagrid-community'
import '@inovua/reactdatagrid-community/base.css'
import '@inovua/reactdatagrid-community/index.css'
import '@inovua/reactdatagrid-community/theme/default-dark.css'

const returnErrors = (code) => {
    return fetch('/returnErrors/' + code).then(response => {
      return response.json()
    });
}

const returnAlerts = () => {
    return fetch('/returnAlerts').then(response => {
      return response.json()
    });
}

  //const processErrorConfirmed = (key) => {
  //    const requestOptions = {
  //      method: 'PUT',
  //      headers: { 'Content-Type': 'application/json'},
  //      body: JSON.stringify({
  //        detail: key
  //      })
  //    }
  //    return fetch('/processErrorConfirmed', requestOptions)
  //  }

const getCount = (customer) => {
  return fetch('/getErrorCount/'+ customer).then(response => {
    return response.json()
  });
  
}

  //const processErrorReviewed = (key) => {
  //  const requestOptions = {
  //    method: 'PUT',
  //    headers: { 'Content-Type': 'application/json'},
  //    body: JSON.stringify({
  //      detail: key
  //    })
  //  }
  //  return fetch('/processErrorReviewed', requestOptions)
  //}

  const processErrors = (details, status) => {
    const string = JSON.stringify(details)
    
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({
        Details: string,
        Status: status
      })
    }
    return fetch('/processErrors', requestOptions)
  }

  const submitErrors = (status, selected) => {
    //console.log(selected);
    let detailsArray = [];
    Object.keys(selected).forEach(function(key) {
        //console.log(key);
        detailsArray.push(key);
    })
    //console.log(detailsArray);
    processErrors(detailsArray, status);
}

function Errors() {
  document.title = 'HQ Business - Errors';

    const [errorList, setErrorList] = useState([]);
    const [currentCustomer, setCurrentCustomer] = useState({});
    const [customers, setCustomers] = useState([]);
    const [count, setCount] = useState();


    //const history= useHistory();
    useEffect(() => {
        let mounted = true;
        //console.log(JSON.parse(localStorage.getItem('CustomerErrorCheck')).CustomerCode);
        let count=0
        if (count=0) {
            returnErrors(JSON.parse(localStorage.getItem('CustomerErrorCheck')).CustomerCode).then((data) => {
              if(mounted) {
                  setErrorList(data);   
              }       
          });

          returnAlerts()
              .then(customers => {
                if(mounted) {
                  setCustomers(customers)
                }
              })

            getCount(JSON.parse(localStorage.getItem('CustomerErrorCheck')).CustomerCode).then((x) => {
              //console.log(x[0][""]);
              setCount(x[0][""]);
            });


          //console.log(customers);

          setCurrentCustomer(JSON.parse(localStorage.getItem('CustomerErrorCheck')));
          count = count+1;
        }
        else {
            returnErrors(currentCustomer.CustomerCode).then((data) => {
              if(mounted) {
                  setErrorList(data);   
              }       
            });
          
            returnAlerts()
                .then(customers => {
                  if(mounted) {
                    setCustomers(customers)
                  }
                })
              
            getCount(currentCustomer.CustomerCode).then((x) => {
                //console.log(x[0][""]);
                setCount(x[0][""]);
            });

            //console.log(customers);
          }
        return () => mounted = false;
        //console.log(currentCustomer);
    }, [currentCustomer]);

    const reLoadGrid = (customer) => {
      //console.log("HELLO THERE!");  
      returnErrors(customer.CustomerCode).then((data) => {
                setErrorList(data);         
      });

      getCount(customer.CustomerCode).then((x) => {
          //console.log(x[0][""]);
          setCount(x[0][""]);
          if (x[0][""]===0) {
            setCurrentCustomer(AllCustomers);
          }
      });
      
    }

    const columns = [
        {name: 'Customer_Name', header: 'Customer', type: 'string', defaultFlex: 1},
        {name: 'Details', header: 'Details', type: 'string', defaultFlex: 9},
        //{name: 'Status', header: 'Status', maxWidth:75, type: 'string'},
        {name: 'ErrorDate', header: 'Error Date', type: 'string', defaultFlex: 1,
            sort: (a, b) => {
                a = moment(a, 'DD/MM/YYYY, HH:mm:ss', true).format();
                b = moment(b, 'DD/MM/YYYY, HH:mm:ss', true).format();
    
                return new Date(a) - new Date(b);
            }
        },
        {name: 'UploadDate', header: 'Upload Date', type: 'string', defaultFlex: 1,
            sort: (a, b) => {
                a = moment(a, 'DD/MM/YYYY, HH:mm:ss', true).format();
                b = moment(b, 'DD/MM/YYYY, HH:mm:ss', true).format();
    
                return new Date(a) - new Date(b);
            }
        }
    ]

    const gridStyle = { height: '100%' }
    const theme = 'default-dark'

    //Sets data for the rows that are checked
  const [selected, setSelected] = useState({});

    const onSelectionChange = useCallback(({ selected }) => {
        if(selected!==true){
          setSelected(selected);
        }
    
        //console.log(JSON.stringify(toArray(selected)));
        //console.log(selected)
          
      }, [])

    const [showPrompt, setShowPrompt] = useState(false);
    const handleClosePrompt = () => {
      setShowPrompt(false);
      setSelected({});
      setTimeout(()=> {
        reLoadGrid(currentCustomer);
        returnAlerts()
          .then(customers => {
              setCustomers(customers)
          })
      }, 500)
    }

//    const confirmErrors = () => {
//        Object.keys(selected).forEach(function(key) {
//            //console.log(key);
//            processErrorConfirmed(key);
//        })
//
//        handleClosePrompt();
//    }
//
//    const reviewErrors = () => {
//      Object.keys(selected).forEach(function(key) {
//          //console.log(key);
//          processErrorReviewed(key);
//      })
//
//      handleClosePrompt();
//  }

 

  //Allows button to be pressed when some tasks are selected
  let editIsDisabled = true;
  if(JSON.stringify(selected).length<3) {
    //console.log(selected);
    editIsDisabled = true;
  } else {
    editIsDisabled = false;
  }
  //----------//


  const AllCustomers = {
    CustomerCode: 0,
    Customer_Name: "All Errors",
    ErrorCount: 0
  }

    return(
        <>
        <div className='errors'>
        <div className="top-row">

        <div className="first-item">
          <h3>Total Errors: {count}</h3>
          <OverlayTrigger key='Make-Urgent' placement='bottom'
              overlay={
                <Tooltip id='tooltip-pdf'>
                  Flag Selected Errors
                </Tooltip>
              }
            >
        <Button variant ="secondary"  
          onClick={() => {
            setShowPrompt(true);
          }}
          disabled={editIsDisabled}
          className='button-to-the-right'
          >
              <AiOutlineFlag />
        </Button>
        </OverlayTrigger>
        </div>
        
        <div className="third-item">
          <Form.Control as="select" value={JSON.stringify(currentCustomer)} 
                onChange = {e=> {
                    setCurrentCustomer(JSON.parse(e.target.value));
                    //console.log(JSON.parse(e.target.value));
                    reLoadGrid(JSON.parse(e.target.value));
                }}>
              <option value={JSON.stringify(AllCustomers)}>{AllCustomers.Customer_Name}</option>
              {
                  customers.map((customer, index) => {
                      return(<option key={index} value={JSON.stringify(customer)}>{customer.Customer_Name}</option>)
                    })
                }
              </Form.Control>
        </div>

        </div>
        
            

              <ReactDataGrid 
                idProperty="Details"
                columns={columns}
                dataSource={errorList}
                style={gridStyle}
                theme={theme}
                selected={selected}
                checkboxColumn
                onSelectionChange={onSelectionChange}
                editable={true}
              />




        

            
       
        </div>
        <Modal show={showPrompt} onHide={handleClosePrompt}>
            <Modal.Header closeButton>
              <Modal.Title>Flag Errors</Modal.Title>
            </Modal.Header>
            <Modal.Body>How do you want to flag the selected Errors?</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClosePrompt}>
                Cancel
              </Button>
              <Button variant="primary" onClick={ () => {
                submitErrors('R', selected);
                handleClosePrompt();
              }}>
                Reviewed
              </Button>
              <Button variant="primary" onClick={ () => {
                submitErrors('C', selected);
                handleClosePrompt();
              }}>
                Confirmed
              </Button>
            </Modal.Footer>
        </Modal>
        </>

    )
}

export default Errors;