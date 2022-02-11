import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import 'bootstrap/dist/css/bootstrap.min.css'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import {FiEdit} from "react-icons/fi"
import './Customers.css'

async function returnCustomers() {
    const response = await fetch('/returnCustomers');
    const customers = await response.json();
    return customers
} 

const resetCustomerList = () =>{
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json'},
    }

    return fetch('/resetCustomerList', requestOptions)
}

const updateCustomerList = (list) =>{
    //console.log(list);
    //Update Web_List_Placement' values from 'list'
    

    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
            one: list[0].Customer_Code,
            two: list[1].Customer_Code,
            three: list[2].Customer_Code,
            four: list[3].Customer_Code,
            five: list[4].Customer_Code,
            six: list[5].Customer_Code,
            seven: list[6].Customer_Code,
            eight: list[7].Customer_Code,
            nine: list[8].Customer_Code,
            ten: list[9].Customer_Code
        })
      }
    
      //console.log(requestOptions);
      return fetch('/updateCustomerList', requestOptions)
}

const EditList = React.memo(props => {
    const [show, setShow] = useState(false);
    const [list, setList] = useState(props.list);
    const [customers, setCustomers] = useState([]);

    const handleShow = () => {
        setShow(true);
    }

    const handleClose = () => {
        setShow(false);
        setList(props.list);
    }

    const onSubmit = () => {
        handleClose();

        resetCustomerList().then(()=>{
            updateCustomerList(list).then(() => {
                props.onChange();
            })
        })

    }

    useEffect(() => {
        setList(props.list)
        
        returnCustomers()
            .then(customers => {
                setCustomers(customers);
            })
    }, [])

    return(
        <>

        <OverlayTrigger key='MultiEdit' placement='bottom'
          overlay={
            <Tooltip id='tooltip-multiedit'>
              Edit Customers
            </Tooltip>
          }
        >
          <Button variant="secondary" style={{margin:'5px'}}
      	onClick={ () => {
          handleShow();
          //props.onClick();
        }}
        className="button-to-the-left"
        //disabled={editIsDisabled}
        >
        <FiEdit/>
        </Button>
        </OverlayTrigger>


        <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update Selected Customers</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="modal-wrapper">
            <div className="item-row">
            <div className="left-col">
            <Form.Label>1: </Form.Label>
            </div>
            <div className="right-col">
            <Form.Control as="select"  style={{display:'inline', margin:5}}
                onChange = {e=> {        
                    let value = JSON.parse(e.target.value);                
                    list[0] = {
                        Web_List_Placement : 1,
                        Customer_Code : value.Customer_Code,
                        Customer_Name : value.CustomerName
                    }
                }}>
                  <option></option>
              {
                  customers.map((customer, index) => {
                      return(<option key={index} value={JSON.stringify(customer)}>{customer.CustomerName}</option>)
                    })
                }
            </Form.Control>
            </div>
            </div>
            <div className="item-row">
            <div className="left-col">
            <Form.Label>2: </Form.Label>
            </div>
            <div className="right-col">
            <Form.Control as="select" style={{display:'inline', margin:5}}
                onChange = {e=> {        
                    let value = JSON.parse(e.target.value);                
                    list[1] = {
                        Web_List_Placement : 2,
                        Customer_Code : value.Customer_Code,
                        Customer_Name : value.CustomerName
                    }
                }}>
                    <option></option>
              {
                  customers.map((customer, index) => {
                      return(<option key={index} value={JSON.stringify(customer)}>{customer.CustomerName}</option>)
                    })
                }
            </Form.Control>
            </div>
            </div><div className="item-row">
            <div className="left-col">
            <Form.Label>3: </Form.Label>
            </div>
            <div className="right-col">
            <Form.Control as="select" style={{display:'inline', margin:5}}
                onChange = {e=> {        
                    let value = JSON.parse(e.target.value);                
                    list[2] = {
                        Web_List_Placement : 3,
                        Customer_Code : value.Customer_Code,
                        Customer_Name : value.CustomerName
                    }          
                }}>
                    <option></option>              
                {
                  customers.map((customer, index) => {
                      return(<option key={index} value={JSON.stringify(customer)}>{customer.CustomerName}</option>)
                    })
                }
            </Form.Control>
            </div>
            </div><div className="item-row">
            <div className="left-col">
            <Form.Label>4: </Form.Label>
            </div>
            <div className="right-col">
            <Form.Control as="select" style={{display:'inline', margin:5}}
                onChange = {e=> {        
                    let value = JSON.parse(e.target.value);                
                    list[3] = {
                        Web_List_Placement : 4,
                        Customer_Code : value.Customer_Code,
                        Customer_Name : value.CustomerName
                    }         
                }}>
              <option></option>
              {
                  customers.map((customer, index) => {
                      return(<option key={index} value={JSON.stringify(customer)}>{customer.CustomerName}</option>)
                    })
                }
            </Form.Control>
            </div>
            </div><div className="item-row">
            <div className="left-col">
            <Form.Label>5: </Form.Label>
            </div>
            <div className="right-col">
            <Form.Control as="select" style={{display:'inline', margin:5}}
                onChange = {e=> {        
                    let value = JSON.parse(e.target.value);                
                    list[4] = {
                        Web_List_Placement : 5,
                        Customer_Code : value.Customer_Code,
                        Customer_Name : value.CustomerName
                    }             
                }}>
                <option></option>
              {
                  customers.map((customer, index) => {
                      return(<option key={index} value={JSON.stringify(customer)}>{customer.CustomerName}</option>)
                    })
                }
            </Form.Control>
            </div>
            </div><div className="item-row">
            <div className="left-col">
            <Form.Label>6: </Form.Label>
            </div>
            <div className="right-col">
            <Form.Control as="select" style={{display:'inline', margin:5}}
                onChange = {e=> {        
                    let value = JSON.parse(e.target.value);                
                    list[5] = {
                        Web_List_Placement : 6,
                        Customer_Code : value.Customer_Code,
                        Customer_Name : value.CustomerName
                    }             
                }}>
                <option></option>
              {
                  customers.map((customer, index) => {
                      return(<option key={index} value={JSON.stringify(customer)}>{customer.CustomerName}</option>)
                    })
                }
            </Form.Control>
            </div>
            </div><div className="item-row">
            <div className="left-col">
            <Form.Label>7: </Form.Label>
            </div>
            <div className="right-col">
            <Form.Control as="select" style={{display:'inline', margin:5}}
                onChange = {e=> {        
                    let value = JSON.parse(e.target.value);                
                    list[6] = {
                        Web_List_Placement : 7,
                        Customer_Code : value.Customer_Code,
                        Customer_Name : value.CustomerName
                    }           
                }}>
                
                <option></option>
              {
                  customers.map((customer, index) => {
                      return(<option key={index} value={JSON.stringify(customer)}>{customer.CustomerName}</option>)
                    })
                }
            </Form.Control>
            </div>
            </div><div className="item-row">
            <div className="left-col">
            <Form.Label>8: </Form.Label>
            </div>
            <div className="right-col">
            <Form.Control as="select" style={{display:'inline', margin:5}}
                onChange = {e=> {        
                    let value = JSON.parse(e.target.value);                
                    list[7] = {
                        Web_List_Placement : 8,
                        Customer_Code : value.Customer_Code,
                        Customer_Name : value.CustomerName
                    }                
                }}>
                <option></option>
              {
                  customers.map((customer, index) => {
                      return(<option key={index} value={JSON.stringify(customer)}>{customer.CustomerName}</option>)
                    })
                }
            </Form.Control>
            </div>
            </div><div className="item-row">
            <div className="left-col">
            <Form.Label>9: </Form.Label>
            </div>
            <div className="right-col">
            <Form.Control as="select" style={{display:'inline', margin:5}}
                onChange = {e=> {        
                    let value = JSON.parse(e.target.value);                
                    list[8] = {
                        Web_List_Placement : 9,
                        Customer_Code : value.Customer_Code,
                        Customer_Name : value.CustomerName
                    }             
                }}>
                <option></option>
              {
                  customers.map((customer, index) => {
                      return(<option key={index} value={JSON.stringify(customer)}>{customer.CustomerName}</option>)
                    })
                }
            </Form.Control>
            </div>
            </div><div className="item-row">
            <div className="left-col">
            <Form.Label>10: </Form.Label>
            </div>
            <div className="right-col">
            <Form.Control as="select" style={{display:'inline', margin:5}}
                onChange = {e=> {        
                    let value = JSON.parse(e.target.value);                
                    list[9] = {
                        Web_List_Placement : 10,
                        Customer_Code : value.Customer_Code,
                        Customer_Name : value.CustomerName
                    }              
                }}>
                <option></option>
              {
                  customers.map((customer, index) => {
                      return(<option key={index} value={JSON.stringify(customer)}>{customer.CustomerName}</option>)
                    })
                }
            </Form.Control>
            </div>
            </div>
            </div>
        </Modal.Body>
        <Modal.Footer>
          {/*<Button variant="secondary" onClick={handleClose}>
            Cancel
            </Button>*/}
          <Button variant="primary" onClick={onSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      </>
    )
});

export default EditList;