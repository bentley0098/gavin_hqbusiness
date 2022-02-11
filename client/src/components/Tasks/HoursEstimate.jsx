import React, { useEffect, useState, PureComponent } from 'react'

//ReCharts
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Label, ResponsiveContainer } from 'recharts';

import { TailSpin } from  'react-loader-spinner'



class CustomizedAxisTick extends PureComponent {
    render() {
      const { x, y, stroke, payload } = this.props;
  
      return (
        <g transform={`translate(${x},${y})`}>
          <text x={0} y={0} dy={5} textAnchor="start" fill="#666" transform="rotate(90)">
            {payload.value}
          </text>
        </g>
      );
    }
  }

  function getEstimate(startDate, endDate, filterUser) {
    return fetch('/getEstimateSummary/')
      .then(data => data.json())
  }

function HoursEstimate() {

    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true);
        getEstimate().then(e=> {
            setUserData(e);
            setLoading(false)
        })
    }, [])

    let estimateGrid;
    if(loading===true){
        estimateGrid = <TailSpin color="#282c34" height={200} width={200} ariLabel='Loading'/>;
    } else {
        estimateGrid=  <BarChart width={400} height={250} data={userData}>
                            <CartesianGrid  />
                            <XAxis dataKey="Username" height={60} interval={0} tick={<CustomizedAxisTick/>} />
                            <YAxis  label={{ value: 'Hours', angle: -90, position: 'outsideLeft' }}/>
                            <Tooltip />
                            <Bar dataKey="Estimate" fill="#202c40" maxBarSize={50} />
                        </BarChart> 
    }
    return(
        <>
        {estimateGrid}
        </>
    )
}

export default HoursEstimate;