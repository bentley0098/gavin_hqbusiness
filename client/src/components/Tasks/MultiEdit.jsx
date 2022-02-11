import React, {useState} from 'react';
import moment from 'moment'


import Button from 'react-bootstrap/Button'
import 'bootstrap/dist/css/bootstrap.min.css'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import DatePicker from 'react-datepicker'

import { editMultiple, makeUrgent } from './returnTasks.js'
import {FiEdit} from "react-icons/fi"



const MultiEdit = React.memo(props => {
  //Make Multiple Urgent
  const [urgent, setUrgent] = useState(0);

  //console.log("MultiEdit Render");
  //console.log(props);

  //----- EDIT MULTIPLE TASKS -----//
  //Handle Show/Hide modal
  const [showMultiEdit, setShowMultiEdit] = useState(false);
  const handleShowMultiEdit = () => {
    setShowMultiEdit(true);
    //console.log(selected);
  }

  const handleCloseMultiEdit = () => {
    setShowMultiEdit(false);
  }  
  //Hold temporary values for update
  const [tempPriority, setTempPriority] = useState();
  const [tempDueDate, setTempDueDate] = useState();

  //Function when submitting updates
  const onSubmitMultiEdit = () => {
    setShowMultiEdit(false);
    
    //Create array with TaskIDs or the selected tasks
    const selectedIds =[];
    
      Object.keys(props.selected).forEach(function(key) {
        selectedIds.push(key);
        if(urgent===1){
          /*
          //console.log(props.selected[key]);
          if(props.selected[key].Urgent===true){
            //console.log(key + " is Urgent");
            makeUrgent(key, null);
          } else {
            //console.log(key + " is NOT Urgent");
            makeUrgent(key, 1);
          }
          
          //makeUrgent(key, urgent);
          */
          makeUrgent(key, urgent);
        } else {
          makeUrgent(key, null);
        }
        //console.log(key);
      });
    
    

    //Correctly formatting the data
    let duedate = "";
    if(tempDueDate){
      duedate= moment(tempDueDate).format('YYYY-MM-DDThh:mm:ss.000');
    }
    
    //Function to update
    //console.log(tempPriority);
    //console.log(duedate);
    if(tempPriority!==undefined || duedate!==""){
      editMultiple(selectedIds, tempPriority, duedate);
      //console.log('Update happened');
      
    }
    

    //Reset temporary values and re-load grid data
    setTempPriority();
    setTempDueDate();
    setUrgent(0);

    setTimeout(()=> {
      props.onClick();  
    },500)
    
  }


    //Allows button to be pressed when some tasks are selected
    let editIsDisabled = true;
    if(JSON.stringify(props.selected).length<3) {
      //console.log(selected);
      editIsDisabled = true;
    } else {
      editIsDisabled = false;
    }
    //----------//

  


    return(
        <>
        
        <OverlayTrigger key='MultiEdit' placement='bottom'
          overlay={
            <Tooltip id='tooltip-multiedit'>
              Edit Multiple
            </Tooltip>
          }
        >
          <Button variant="secondary" style={{margin:'5px'}}
      	onClick={ () => {
          handleShowMultiEdit();
          //props.onClick();
        }}
        className="button-to-the-left"
        disabled={editIsDisabled}
        >
        <FiEdit/>
        </Button>
        </OverlayTrigger>
        
        
        
    <Modal show={showMultiEdit} onHide={handleCloseMultiEdit}>
      <Modal.Header closeButton>
        <Modal.Title>Update Selected Tasks</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form.Label>Priority:</Form.Label>
            <br/>
            <Form.Check
              inline
              label="1"
              type="radio"
              name="group1"
              id={'inline-radio-1'}
              onChange = {e=> setTempPriority(1)} 
            />
            <Form.Check
              inline
              label="2"
              type="radio"
              name="group1"
              id={'inline-radio-2'}
              onChange = {e=> setTempPriority(2)}             
            />
            <Form.Check
              inline
              label="3"
              type="radio"
              name="group1"
              id={'inline-radio-3'}
              onChange = {e=> setTempPriority(3)} 
            />
            <br/>
            <Form.Label>Due Date:&nbsp;&nbsp;&nbsp;</Form.Label>
            <DatePicker
              selected={tempDueDate}
              onChange={(date) => {
                setTempDueDate(date);
              }}
              dateFormat = 'dd/MM/yyyy'
              calendarStartDay={1}
            />

            <Form.Check 
              type="checkbox" 
              label="Mark Urgent"
              style={{margin:5 }}
              onChange = {e=> {
                  setUrgent(1);
              }}  
            />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseMultiEdit}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onSubmitMultiEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      </>
    )
});

export default MultiEdit; 