import React, { useEffect, useState } from 'react';
import './Customers.css';

//ReactDataGrid.io used for main grid
import ReactDataGrid from '@inovua/reactdatagrid-community'
import '@inovua/reactdatagrid-community/base.css'
import '@inovua/reactdatagrid-community/index.css'
import '@inovua/reactdatagrid-community/theme/default-dark.css'

import EditList from './EditList';

const getTopSupport = () => {
    return fetch('/getTopSupportCustomers').then(response => {
      return response.json()
    });
}
const getTopSelected = () => {
    return fetch('/getTopSelectedCustomers').then(response => {
      return response.json()
    });
}


function Customers  () {

    const [customerSupportData, setCustomerSupportData] = useState({});
    const [selectedCustomers, setSelectedCustomers] = useState([]);
    const [loading, setLoading] = useState(true);


    const gridStyle = { minHeight:500, margin:10 }

    const supportColumns = [
        {name: 'Customer_Name', header: 'Customer', type: 'string', defaultFlex: 5},
        {name: 'SupportTime', header: 'Support (Mins)', type: 'number', defaultFlex: 1}
    ]

    const selectedColumns = [
        {name: 'Web_List_Placement', header: '#', type: 'number', defaultFlex: 1},
        {name: 'Customer_Name', header: 'Customer', type: 'string', defaultFlex: 8}
    ]

    useEffect(() => {
        setLoading(true);
        getTopSupport().then(data => {
            setCustomerSupportData(data);
        })
        getTopSelected().then(data => {
            setSelectedCustomers(data);
            setLoading(false);
        })
        
    }, [])

    //----- GET CURRENT USER -----//
    const tokenString = sessionStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    //const Username = userToken.username;
    const UserID = userToken.userId;

    const update = () => {
        setLoading(true);
        getTopSelected().then(data => {
            setSelectedCustomers(data);
            setLoading(false);
        })
    }

    let Button1 = <div/>
    if(UserID===1 | UserID===2 | UserID===6){
        console.log(selectedCustomers)
        if(loading===false){
            Button1 = <EditList list={selectedCustomers} onChange={update}/>;
        }
    }
    return(
        <>
        <div className="wrapper">
            <div className="top-row">
                {
                    Button1
                }
            </div>
            <div className="grids">
                <div className="item top-cust">
                <h4 class="font-weight-light heading item" >Top Customers:</h4>
                    <ReactDataGrid 
                    idProperty="Customer_Code"
                    columns={selectedColumns}
                    dataSource={selectedCustomers}
                    style={gridStyle}
                    theme={'default-dark'}
                    />
                </div>
                <div className="item top-supp">
                <h4 class="font-weight-light heading item" >Time for Support in the Last Month:</h4>
                    <ReactDataGrid 
                    idProperty="CustomerCode"
                    columns={supportColumns}
                    dataSource={customerSupportData}
                    style={gridStyle}
                    theme={'default-dark'}
                    />
                </div>
            </div>
        </div>


        </>
    )
}

export default Customers;