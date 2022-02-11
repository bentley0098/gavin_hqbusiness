import React, {useState} from 'react'

import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import Button from 'react-bootstrap/Button'
import 'bootstrap/dist/css/bootstrap.min.css'
import Modal from 'react-bootstrap/Modal'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'

import {RiFileAddLine} from "react-icons/ri"

const newUpdateID = () => {
  return fetch('/newUpdateId').then(response => {
    return response.json()
  });
}

function addUpdateHeader(username, version, productID) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      Username: username,
      Version: version,
      ProductID: productID
    })
  }
  return fetch('/addUpdateHeader/', requestOptions)
   
}

function addUpdateDetail(updateId, details, comment) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      UpdateId: updateId,
      Details: details,
      Comment: comment
    })
  }
  return fetch('/addUpdateDetail/', requestOptions)
   
}

function addUpdateSQL(updateId, sql) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      UpdateId: updateId,
      Sql: sql
    })
  }
  return fetch('/addUpdateSQL/', requestOptions)
   
}

function NewVersion (props) {

  //----- GET CURRENT USER -----//
  const tokenString = sessionStorage.getItem('token');
  const userToken = JSON.parse(tokenString);
  const Username = userToken.username;
  //const UserID = userToken.userId;

  let isDisabled = true;
  if(props.product.ProductID!==null){
    isDisabled = false;
  }
 

    const [show, setShow] = useState(false);

    const [version, setVersion] = useState("");
    const [details, setDetails] = useState("");
    const [sql, setSQL] = useState("");
    const [comment, setComment] = useState("");

    const handleClose= () => {
      setShow(false);
      setVersion("");
      setDetails("");
      setSQL("");
      setComment("");

      
    }

    const onSubmit = () => {
      newUpdateID().then(id=> {
          //console.log(id.[0].[""]);
        addUpdateHeader(Username, version, props.product.ProductID).then( ()=> {
          addUpdateDetail(id[0][""], details, comment).then( ()=> {
            addUpdateSQL(id[0][""], sql).then( () => {
              props.reLoad(props.product);
            });
          });
        });
      });

      handleClose();
      
    }

    return(
        <>
        <OverlayTrigger key='NewVersion' placement='bottom'
          overlay={
            <Tooltip id='tooltip-newversion'>
              New Version
            </Tooltip>
          }
        >
        <Button variant="secondary" style={{margin:5}} 
      	onClick={ () => {
          setShow(true);  
          setTimeout(() => {
            document.getElementById('newVersionInput').focus();
          }, 20);
        }}
        className="button-to-the-left"
        disabled={isDisabled}
        >
           <RiFileAddLine/>
        </Button>
        </OverlayTrigger>


        <Modal show={show} onHide={handleClose} size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>New Version - {props.product.ProductName} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          
          
          <Form>
          <Row>
            <Col xs={2}>
              <h7>Version:</h7>
            </Col>
            <Col> 
              <Form.Group className="mb-3" controlId="newVersionInput">
                <Form.Control 
                style={{display:'inline'}}
                size="sm"
                as="textarea" 
                rows={1}
                type="text"
                value={version}
                onChange = {e=> setVersion(e.target.value)}
                controlId="newVersionInput"
              />
              </Form.Group> 
              
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="newTask.Details">
                <h7>Description:</h7>
                <Form.Control 
                  as="textarea" 
                  rows={3} 
                  placeholder="Add Decription..."
                  value={details}
                  onChange = {e=> setDetails(e.target.value)}
                  type="text"
                  size="sm"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>  
            <Col>
              <Form.Group className="mb-3" controlId="newTask.Notes">
                <h7>SQL:</h7>
                <Form.Control 
                  as="textarea" 
                  rows={3} 
                  placeholder="Add SQL..."
                  value={sql}
                  onChange = {e=> setSQL(e.target.value)}
                  type="text"
                  size="sm"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>  
            <Col>
              <Form.Group className="mb-3" controlId="newTask.Notes">
                <h7>Comment:</h7>
                <Form.Control 
                  as="textarea" 
                  rows={3} 
                  placeholder="Add Comment..."
                  value={comment}
                  onChange = {e=> setComment(e.target.value)}
                  type="text"
                  size="sm"
                />
              </Form.Group>
            </Col>
          </Row>
          </Form>
    
        </Modal.Body>
        <Modal.Footer>          
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={()=>{
            onSubmit();
            handleClose();
          }}>
            Create Version
          </Button>
        </Modal.Footer>
      </Modal>
        </>
    )
}

export default NewVersion;