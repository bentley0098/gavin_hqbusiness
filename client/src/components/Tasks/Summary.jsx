
import React, {useState, useEffect} from 'react';
import Button from 'react-bootstrap/Button'
import Toast from 'react-bootstrap/Toast'
import ReactDataGrid from '@inovua/reactdatagrid-community'
import '@inovua/reactdatagrid-community/theme/default-dark.css'
import '../custom-grid-styling.css';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'

import { getSummary, getTaskCount } from './returnTasks'
import {BsTable} from "react-icons/bs"

import { default as HoursEstimate } from './HoursEstimate.jsx'

import './custom-styling.css';


const Summary = React.memo( props => {
    
    //console.log("Summary Render");
    
    const [show, setShow] = useState(false);
    //const [dataSource, setDataSource] = useState([]);
    const [r1, setR1] = useState();
    const [r2, setR2] = useState();
    const [r3, setR3] = useState();
    const [w1, setW1] = useState();
    const [w2, setW2] = useState();
    const [w3, setW3] = useState();
    const [s1, setS1] = useState();
    const [s2, setS2] = useState();
    const [s3, setS3] = useState();
    const [g1, setG1] = useState();
    const [g2, setG2] = useState();
    const [g3, setG3] = useState();
    const [n1, setN1] = useState();
    const [n2, setN2] = useState();
    const [n3, setN3] = useState();

    const [fullCount, setFullCount] = useState();


    const handleShow = () => {
        if(show===false){
            setShow(true);
        } else {
            setShow(false);
        }
        
    }

    //GRID SET UP
    //Default Sorting Info for the grid
   const defaultSortInfo = { name: 'All', dir: -1 }

    const theme = 'default-dark'
    const columns = [
        {name: 'User', header: 'User', maxWidth:100, type: 'string'},
        {name: 'p1', header: '1', maxWidth:60, type: 'number'},
        {name: 'p2', header: '2', maxWidth:60, type: 'number'},
        {name: 'p3', header: '3', maxWidth:60, type: 'number'},
        {name: 'All', header: 'All', maxWidth:72, type: 'number'}
    ]
    const gridStyle = { minHeight:250, margin:5 }
    
    const userSource = [
        {id: 1, User: 'Richard', p1: 0, p2: 0, p3: 0},
        {id: 2, User: 'Wesley', p1: 0, p2: 0, p3: 0},
        {id: 5, User: 'Stephen', p1: 0, p2: 0, p3: 0},
        {id: 6, User: 'Gavin', p1: 0, p2: 0, p3: 0},
        {id: 7, User: 'Neil', p1: 0, p2: 0, p3: 0}
    ]
    
    // eslint-disable-next-line
    const getDataSource = () => {
        const priorities = [1,2,3];
        

        userSource.forEach(user => {   
            priorities.forEach(p => {
               getSummary(user.id, p)
                .then(result => {
                    //console.log(result);
                    if(user.id===1 && p===1){
                        setR1(result[0][""]);
                    }
                    if(user.id===1 && p===2){
                        setR2(result[0][""]);
                    }
                    if(user.id===1 && p===3){
                        setR3(result[0][""]);
                    }
                    if(user.id===2 && p===1){
                        setW1(result[0][""]);
                    }
                    if(user.id===2 && p===2){
                        setW2(result[0][""]);
                    }
                    if(user.id===2 && p===3){
                        setW3(result[0][""]);
                    }
                    if(user.id===5 && p===1){
                        setS1(result[0][""]);
                    }
                    if(user.id===5 && p===2){
                        setS2(result[0][""]);
                    }
                    if(user.id===5 && p===3){
                        setS3(result[0][""]);
                    }
                    if(user.id===6 && p===1){
                        setG1(result[0][""]);
                    }
                    if(user.id===6 && p===2){
                        setG2(result[0][""]);
                    }
                    if(user.id===6 && p===3){
                        setG3(result[0][""]);
                    }
                    if(user.id===7 && p===1){
                        setN1(result[0][""]);
                    }
                    if(user.id===7 && p===2){
                        setN2(result[0][""]);
                    }
                    if(user.id===7 && p===3){
                        setN3(result[0][""]);
                    }
                }) 
            })
        });        
    }
    
    
    const count = ()=> {
        getTaskCount().then(c=>{
            setFullCount(c[0][""]);            
        })
    }

    let x=0;
    useEffect(() => {
        if(x===0){
            getDataSource();  
            count();
            x=x+1; 
        }

        //console.log(x);
    })
    

    const dataSource = [
        {id: 1, User: 'Richard', p1: r1, p2: r2, p3: r3, All: [r1+r2+r3]},
        {id: 2, User: 'Wesley', p1: w1, p2: w2, p3: w3, All: [w1+w2+w3]},
        {id: 5, User: 'Stephen', p1: s1, p2: s2, p3: s3, All: [s1+s2+s3]},
        {id: 6, User: 'Gavin', p1: g1, p2: g2, p3: g3, All: [g1+g2+g3]},
        {id: 7, User: 'Neil', p1: n1, p2: n2, p3: n3, All: [n1+n2+n3]}
    ]

    //var numbers = [r1+r2+r3, w1+w2+w3, s1+s2+s3, g1+g2+g3, n1+n2+n3];
    //console.log(numbers);
    //numbers.sort(function(a, b) {
    //  return b - a;
    //});
    //console.log(numbers);

    

    return (
        <>
        
        <OverlayTrigger key='Summary' placement='bottom'
          overlay={
            <Tooltip id='tooltip-summary'>
              Show Summary Table
            </Tooltip>
          }
        >
            <Button  onClick={ () => {
            handleShow();
            getDataSource();  
            count();   
        }}
        style={{margin:'5px'}}
          variant={'secondary'}
          >
            <BsTable/>
          </Button>
        </OverlayTrigger>
        


        <div className="summary">
        <Toast onClose={() => setShow(false)} show={show} style={{width:'800px', height: '320px'}} >
          <Toast.Header>
            <strong className="me-auto">Summary&nbsp;-&nbsp;&nbsp;{fullCount}</strong>
            
          </Toast.Header>
          <Toast.Body>
          <div className="summary-grid">
              <ReactDataGrid 
                idProperty="id"
                columns={columns}
                dataSource={dataSource}
                style={gridStyle}
                theme={theme}
                defaultSortInfo={defaultSortInfo}
              />
            </div>
            <div className="estimate-chart">
                <HoursEstimate />
            </div>

              
          </Toast.Body>
        </Toast> 
        </div>
        
      </>
    )
});

export default Summary;