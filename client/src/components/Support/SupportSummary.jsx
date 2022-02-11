import React, {  useState, useEffect} from 'react';

//ReactDataGrid.io used for main grid
import ReactDataGrid from '@inovua/reactdatagrid-community'
import '@inovua/reactdatagrid-community/base.css'
import '@inovua/reactdatagrid-community/index.css'
import '@inovua/reactdatagrid-community/theme/default-dark.css'


async function returnSupportSummary(customer) {
    const response = await fetch('/returnSupportSummary/' + customer);
    const customers = await response.json();
    return customers
}

function SupportSummary(customer) {

    const [dataSource, setDataSource] = useState([]);

    const columns = [
        {name:'Username', header:'User', type: 'strin', defaultFlex: 1},
        {name:'Datetime', header:'When',  defaultFlex: 1},
        {name:'Details', header:'Details', defaultFlex: 5, editable:true},
        {name:'TimeSpent', header:'Time', defaultFlex: 1}
    ]

    const gridStyle = {
        minHeight: 700, 
        marginRight: 10,
        marginLeft: 10
    }

    const theme = 'default-dark'

    useEffect(() => {
        let mounted = true;
    
        //console.log(customer.customer);
    
        returnSupportSummary(customer.customer)
            .then(summary => {
              if(mounted) {
                //console.log(summary);
                setDataSource(summary);
              }
            })
        //console.log(dataSource);
        return () => mounted = false;
    },[customer])
    return(
        <>
        <ReactDataGrid
        
        //rowClassName={rowClassName}
        //handle={setGridRef}
        //idProperty="Task"
        columns={columns}
        dataSource={dataSource}
        style={gridStyle}
        theme={theme}
        //onRenderRow={onRenderRow}
        //selected={selected}
        //checkboxColumn
        //onSelectionChange={onSelectionChange}
        //defaultSortInfo={defaultSortInfo}
                
      />
      </>
    )
}

export default SupportSummary;