import React, { useEffect, useState, PureComponent } from 'react'
import './schedule.css'
import moment from 'moment'
//ReCharts
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TailSpin } from  'react-loader-spinner'


const getScheduledTime = (startDate, endDate) => {
    return fetch('/getScheduledTimeByWeek/'+startDate+'&'+endDate)
    .then(data => data.json())
}

const pushNewWeek = (dataArray, number, weekDay) => {
    let newest = {
        Week: number, 
        Richard: 0,
        Wesley: 0,
        Stephen: 0,
        Neil: 0,
        Gavin: 0
    }

        var curr = new Date; // get current date
        var first = (curr.getDate()+weekDay) - curr.getDay()+1; // First day is the day of the month - the day of the week
        var last = first + 6; // last day is the first day + 6
        var sDate = moment(curr.setDate(first)).format('YYYY-MM-DDT00:00:00');
        var eDate = moment(curr.setDate(last)).format('YYYY-MM-DDT11:59:59');


    getScheduledTime(sDate, eDate).then(res => {
        res.map((x) => {
            //console.log(x);
            if(x.Username==='Richard'){
                newest.Richard = x.Hours;
            }
             else if(x.Username==='Wesley'){
                newest.Wesley = x.Hours;
            }
            else if(x.Username==='Stephen'){
                newest.Stephen = x.Hours;
            }
            else if(x.Username==='Gavin'){
                newest.Gavin = x.Hours;
            }
            else if(x.Username==='Neil'){
                newest.Neil = x.Hours;
            }
        })
        //console.log(newest);
    })

    dataArray.push(newest);

    //console.log(dataArray);
    return dataArray;
    
}

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

function Schedule() {

    const[ graphData, setGraphData ] = useState([]);
    const [loading, setLoading ] = useState(false)
    
    useEffect(() => {
        setLoading(true);
        let data = [];
        let weekCount = [0, 7, 14, 21, 28, 35, 42, 49, 56, 63];

        for(let i=0; i<weekCount.length; i++) {
            //data = pushNewWeek(data, i+1, weekCount[i]);
            setGraphData(pushNewWeek(data, i+1, weekCount[i]));
            
        }
        //console.log(data);
        //setGraphData(data);
        setTimeout(() => {
            setLoading(false);
          }, 3000);
    }, [])
    
    let chartLoaded;

    if(loading===false) {
        
          chartLoaded = <ResponsiveContainer width="100%" height="100%">
                        <BarChart width={1600} height={700} data={graphData}>
                            <CartesianGrid  />
                            <XAxis dataKey="Week" height={60} interval={0}  label={{ value: 'Week (1 = Current Week)', angle: 0, position: 'outsideLeft' }}/>
                            <YAxis  label={{ value: 'Hours', angle: -90, position: 'insideLeft' }}/>
                            <Tooltip />
                            <Legend />
                                <Bar dataKey="Richard" fill="#ff3c2e" />
                                <Bar dataKey="Wesley" fill="#dbbe00" />
                                <Bar dataKey="Stephen" fill="#2eff35" />
                                <Bar dataKey="Gavin" fill="#2e9dff" />
                                <Bar dataKey="Neil" fill="#202c40" />
                        </BarChart> 
          </ResponsiveContainer>
  
      } else {
        chartLoaded = 
        <div className="bar-chart-wrap spinner">
          <TailSpin color="#282c34" height={200} width={200} ariLabel='Loading'/>
        </div>
      }
  

    return(
        <div className="main">

            {chartLoaded}    
        
        </div>
    )
    
}

export default Schedule;