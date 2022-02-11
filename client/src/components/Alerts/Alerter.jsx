import React, {useState, useEffect, useCallback} from 'react'
import { Link } from "react-router-dom";
//ReactDataGrid.io used for main grid
import ReactDataGrid from '@inovua/reactdatagrid-community'
import '@inovua/reactdatagrid-community/base.css'
import '@inovua/reactdatagrid-community/index.css'
import '@inovua/reactdatagrid-community/theme/default-dark.css'

import {FaRegBell} from 'react-icons/fa';
import './alerts.css';

import NotificationBadge from 'react-notification-badge';
import {Effect} from 'react-notification-badge';

import Toast from 'react-bootstrap/Toast'
import Alert from 'react-bootstrap/Alert'

import { useHistory } from 'react-router-dom';

const returnAlerts = () => {
  return fetch('/returnAlerts').then(response => {
    return response.json()
  });
}

const getCount = () => {
  return fetch('/getErrorCount/0').then(response => {
    return response.json()
  });
}

const Alerter = React.memo( props => {


    const [ countNotification, setCountNotification ] = useState(0);
    const [show, setShow] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    const [alerts, setAlerts] = useState([]);

    const showAlertList = () => {
        //console.log("SHOW ME MY ALERTS");
        returnAlerts().then((data) => {
          setCount(count + 1);
          setAlerts(data);
          setShow(true);
        });
    }

    const [count, setCount] = useState(0);
    const [errorCount, setErrorCount] = useState();

    //const [tempName, setTempName] = useState("");

    
    useEffect(() => {
      if (count === 0) { // condition for checking if the API call being made is initial one or not.
        getCount().then((data) => {
          //console.log(data[0][""]);
          setErrorCount(data[0][""]);
        });
        setCount(count + 1);

        //returnAlerts().then((data) => {
        //  setCount(count + 1);
        //  setAlerts(data);
        //});
        //console.log(count);
      } else {
        //console.log(count);
        
        setTimeout(() => {
          setCount(count + 1);
          
          getCount().then((data) => {  
            // Check if count has changed
            if(data[0][""]>errorCount && errorCount!==undefined) {
              setErrorCount(data[0][""]);
              // Show popup for new error
              setCountNotification(countNotification+1);
            }
          });
          /* -------- OLD WAY -------- */
              /*
          returnAlerts().then((data) => {
            setCount(count + 1);
            clearTimeout(timer);
            //console.log(test);

            if(alerts!==[]) {
                            
              //loop through 'alerts', check against data before setting new data as alerts

              //console.log(data);
              //console.log(alerts.length);

              if(alerts.length<data.length && count>3){
               
                setTempName("New_Customer_in_HQS_ERRORS"); 
                
                setShowAlert(true);
              }

              for(let i=0; i<alerts.length; i++) {
                for(let j=0; j<data.length; j++) {
                  if(alerts[i].CustomerCode===data[j].CustomerCode){
                    //same customer code
                    if(alerts[i].ErrorCount<data[j].ErrorCount){
                      //alert("You have a new error for: " + data[j].Customer_Name);
                      setTempName(data[j].Customer_Name);
                      //setShowAlert(true);
                      setCountNotification(countNotification+1);
                      
                    }
                  }
                }
              }
            
            }
            */
            

            //console.log("ALERT CHECK");
            //setAlerts(data);
          //});
        }, 5000);
      }

      //console.log(alerts);
    }, [count, countNotification, errorCount]);
    
    const theme = 'default-dark';
    const columns = [
      {name: 'Customer_Name', header: 'Company', defaultFlex:2, type: 'string'},
      {name: 'ErrorCount', header: 'Errors', defaultFlex:1, type: 'number'}
    ]
    const gridStyle = { minHeight:250, margin:5 }
    

    const history = useHistory();


    const onRowDoubleClick = useCallback((rowProps) => { 
      
      if (window.location.pathname=='/Errors') {
        window.location.reload(false);
      } else {
        history.push("/Errors");
      }
      localStorage.setItem('CustomerErrorCheck', JSON.stringify(rowProps.data));
      setShow(false);
    }, [history]);

    //Double click to bring up Error List
    const onRenderRow = useCallback((rowProps) => {
      const { onDoubleClick } = rowProps;      
      
      rowProps.onDoubleClick = (event) => {
        onRowDoubleClick(rowProps);
        if (onDoubleClick) {
          onDoubleClick(event);
        }
      };
      
    }, [onRowDoubleClick])
    
    const onRowClick = useCallback((rowProps, event) => {
      //Use this function if single click is needed
    }, [])


    
    return(
        <>
        <Link class="nav-link" onClick={() => {
          showAlertList();
          setCountNotification(0);
        }}>
          <NotificationBadge count={countNotification} effect={Effect.SCALE} />
          <FaRegBell />
        </Link>


        <div className="alerts-toast">
            <Toast onClose={() => setShow(false)} show={show} style={{width:'330px', height: '330px'}} >
          <Toast.Header>
            <strong className="me-auto">Alerts</strong>
          </Toast.Header>
          <Toast.Body>
          <ReactDataGrid 
                idProperty="id"
                columns={columns}
                dataSource={alerts}
                style={gridStyle}
                theme={theme}
                onRenderRow={onRenderRow}
                onRowClick={onRowClick}
              />
          </Toast.Body>
        </Toast> 
        </div>

        { 
            showAlert &&   
            <div className={'alert-notification'}>
                <Alert key={1} onClose={() => setShowAlert(false)} variant={'danger'} dismissible closeLabel={'Dismiss'}>
                There is a new error!
                </Alert>
            </div>
        }
        
        </>
    )
})

export default Alerter;