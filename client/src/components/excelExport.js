import jsPDF from 'jspdf'
import 'jspdf-autotable'
import PDFLogo from './Logos/PDFLogo.png'

import * as XLSX from 'xlsx';

import moment from 'moment'

export const exportCSV = (gridRef) => {
    //const columns = gridRef.current.visibleColumns;

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    
    // Reformatting GridRef for inputing into csv file
    gridRef.current.data.map((data) => {
      data.Details = data.Details.toString().replace(',','');
      data["Last Comment"] = data["Last Comment"].toString().replace(',','');
      data.Details = data.Details.replace(/(\r\n|\n|\r)/gm, "");
      return null;
    });

    //const header = columns.map((c) => c.name).join(',');
    //const rows = gridRef.current.data.map((data) => columns.map((c) => data[c.id]).join(','));
    //const contents = [header].concat(rows).join('\n');

    const ws = XLSX.utils.json_to_sheet(gridRef.current.data);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], {type: fileType});

    //const blob = new Blob([contents], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob);
};


const downloadBlob = (blob, fileName = 'HQB_TASKS.xlsx') => {
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.position = 'absolute';
    link.style.visibility = 'hidden';
  
    document.body.appendChild(link);
  
    link.click();
  
    document.body.removeChild(link);
};


export function  exportPDF(gridData, customer) {
  var doc = new jsPDF('landscape', 'pt');
  var closedIndex = [];
  var urgentIndex = [];
  var p1Index = [];
  
  //console.log(gridData.current.data);
  var bodyData = [];
  if(customer.Customer_Code===0){
    bodyData= [[
      gridData.current.data[0].Task, 
      gridData.current.data[0].Customer,
      gridData.current.data[0].Details, 
      gridData.current.data[0].Area, 
      gridData.current.data[0].Application,
      gridData.current.data[0].Requested,
      gridData.current.data[0].Contact,
      gridData.current.data[0]["Last Comment"],
      gridData.current.data[0].Updated,
      gridData.current.data[0].DueDate,
      gridData.current.data[0].Invoice,
      gridData.current.data[0].Priority,
      gridData.current.data[0].ActionByUsername,
      gridData.current.data[0].Owner_Name
    ]];
  } else {
    bodyData= [[
      gridData.current.data[0].Task, 
      gridData.current.data[0].Details, 
      gridData.current.data[0].Area, 
      gridData.current.data[0].Application,
      gridData.current.data[0].Requested,
      gridData.current.data[0].Contact,
      gridData.current.data[0]["Last Comment"],
      gridData.current.data[0].Updated,
      gridData.current.data[0].DueDate,
      gridData.current.data[0].Invoice,
      gridData.current.data[0].Priority,
      gridData.current.data[0].ActionByUsername,
      gridData.current.data[0].Owner_Name
    ]];
  }

  if(gridData.current.data[0].State==="C") {
    closedIndex.push(0);
  }

  if(gridData.current.data[0].Urgent===true) {
    urgentIndex.push(0);
  }

  if(gridData.current.data[0].P===1) {
    p1Index.push(0);
  }

  var rowData = [];
  for(let i=1; i<gridData.current.data.length; i++){
    if(customer.Customer_Code===0){
      rowData = [
        gridData.current.data[i].Task, 
        gridData.current.data[i].Customer, 
        gridData.current.data[i].Details, 
        gridData.current.data[i].Area, 
        gridData.current.data[i].Application,
        gridData.current.data[i].Requested,
        gridData.current.data[i].Contact,
        gridData.current.data[i]["Last Comment"], 
        gridData.current.data[i].Updated,
        gridData.current.data[i].DueDate,
        gridData.current.data[i].Invoice,
        gridData.current.data[i].Priority,
        gridData.current.data[i].ActionByUsername,
        gridData.current.data[i].Owner_Name
      ];
    } else {
      rowData = [
        gridData.current.data[i].Task, 
        gridData.current.data[i].Details, 
        gridData.current.data[i].Area, 
        gridData.current.data[i].Application,
        gridData.current.data[i].Requested,
        gridData.current.data[i].Contact,
        gridData.current.data[i]["Last Comment"], 
        gridData.current.data[i].Updated,
        gridData.current.data[i].DueDate,
        gridData.current.data[i].Invoice,
        gridData.current.data[i].Priority,
        gridData.current.data[i].ActionByUsername,
        gridData.current.data[i].Owner_Name
      ];
    }

    
    
    if(gridData.current.data[i].State==="C") {
      closedIndex.push(i);
    }

    if(gridData.current.data[i].Urgent===true) {
      urgentIndex.push(i);
    }

    if(gridData.current.data[i].P===1) {
      p1Index.push(i);
    }
    
    bodyData.push(rowData);

  }

  let formatDate = moment(new Date()).format("Do MMMM YYYY"); 
  
  let headerText = customer.CustomerName + " Report    -    " + formatDate;

  let header=[];
  if(customer.Customer_Code===0){
    header= ['Task', 'Customer', 'Details', 'Area', 'Section', 'Requested', 'Requestor', 'Status', 'Updated', 'Due Date', 'Invoice', 'P', 'User', 'Owner']
  } else {
    header= ['Task', 'Details', 'Area', 'Section', 'Requested', 'Requestor', 'Status', 'Updated', 'Due Date', 'P', 'User', 'Invoice', 'Owner']
  }
  
  doc.autoTable({
    styles: { fontSize: 8 },
    theme: 'grid',
    headStyles: {fillColor: [55, 55, 55]},
    head: [header],
    body: bodyData,
    didParseCell: function(data) {
      
      for (let i=0; i<closedIndex.length; i++) {
        if(data.row.index===closedIndex[i]){
          data.cell.styles.fillColor= [87, 222, 107]
        }
      }
      for (let i=0; i<urgentIndex.length; i++) {
        if(data.row.index===urgentIndex[i]){
          data.cell.styles.fontStyle= "bold";
        }
      }
      for (let i=0; i<p1Index.length; i++) {
        if(data.row.index===p1Index[i] && data.cell.raw===1){
          //console.log(data);
          data.cell.styles.fillColor= [255, 157, 156]
        }
      }
    },
    didDrawPage: function (data) {
      // Header
      doc.setFontSize(18)
      doc.setTextColor(40)
      if (PDFLogo) {
        doc.addImage(PDFLogo, 'png', 20, 20, 46.5, 48, PDFLogo, 'FAST', 0)
      }
      doc.text(headerText, data.settings.margin.left + 50, 50)

      doc.setFontSize(8)

     
    },
    margin: { top: 80 }
  })

  var docName = '';

  let titleDate = moment(new Date()).format("DDMMYYYY"); 

  if(customer.Customer_Code===0){
    docName = 'HQSoftware_TASKS.pdf';
  } else {
    docName = customer.CustomerName + '_TASKS_' + titleDate
  }

  doc.save(docName)
}


export function  exportClosedPDF(gridData, customer) {
  var doc = new jsPDF('landscape', 'pt');
  var closedIndex = [];
  
  

  var bodyData= [[
    gridData.current.data[0].Task, 
    gridData.current.data[0].Details, 
    gridData.current.data[0].Requested,
    gridData.current.data[0].DateCompleted, 
    gridData.current.data[0].DaysToComplete,
    gridData.current.data[0].TimeSpent,
    gridData.current.data[0].ActionByUsername
  ]];

  if(gridData.current.data[0].State==="C") {
    closedIndex.push(0);
  }

  for(let i=1; i<gridData.current.data.length; i++){
    var rowData = [
    gridData.current.data[i].Task, 
    gridData.current.data[i].Details, 
    gridData.current.data[i].Requested,
    gridData.current.data[i].DateCompleted, 
    gridData.current.data[i].DaysToComplete,
    gridData.current.data[i].TimeSpent,
    gridData.current.data[i].ActionByUsername
    ];
    
    if(gridData.current.data[i].State==="C") {
      closedIndex.push(i);
    }
    bodyData.push(rowData);

  }

  let formatDate = moment(new Date()).format("Do MMMM YYYY"); 
  
  let headerText = customer.CustomerName + " Closed Tasks    -    " + formatDate;

  
  
  doc.autoTable({
    styles: { fontSize: 8 },
    theme: 'grid',
    headStyles: {fillColor: [55, 55, 55]},
    head: [['Task', 'Details', 'Requested', 'Completed', 'Days', 'Time', 'User']],
    body: bodyData,
    didParseCell: function(data) {
      
      for (let i=0; i<closedIndex.length; i++) {
        if(data.row.index===closedIndex[i]){
          data.cell.styles.fillColor= [87, 222, 107]
        }
      }
    },
    didDrawPage: function (data) {
      // Header
      doc.setFontSize(18)
      doc.setTextColor(40)
      if (PDFLogo) {
        doc.addImage(PDFLogo, 'png', 20, 20, 46.5, 48, PDFLogo, 'FAST', 0)
      }
      doc.text(headerText, data.settings.margin.left + 50, 50)

      doc.setFontSize(8)

     
    },
    margin: { top: 80 }
  })

  var docName = '';

  let titleDate = moment(new Date()).format("DDMMYYYY"); 

  if(customer.Customer_Code===0){
    docName = 'HQSoftware_CLOSEDTASKS.pdf';
  } else {
    docName = customer.CustomerName + '_CLOSEDTASKS_' + titleDate
  }

  doc.save(docName)
}

export function  exportHistoryPDF(gridData, task) {
  var doc = new jsPDF('landscape', 'pt');
  let closedIndex = []
  
  let headerText = task.Issue_No + "  -  " + task.Details;

 
  

  
  let totalTime =gridData.current.data[0].Minutes;

  var bodyData= [[
    gridData.current.data[0].Username, 
    gridData.current.data[0].Time, 
    gridData.current.data[0].Notes,
    gridData.current.data[0].Minutes 
  ]];

  if(gridData.current.data[0].State==="C") {
    closedIndex.push(0);
  }

  for(let i=1; i<gridData.current.data.length; i++){
    var rowData = [
      gridData.current.data[i].Username, 
      gridData.current.data[i].Time, 
      gridData.current.data[i].Notes,
      gridData.current.data[i].Minutes 
    ];
    bodyData.push(rowData);

    totalTime = totalTime + gridData.current.data[i].Minutes;
  }

  totalTime = Math.round((totalTime/60)*100)/100;
  //let formatDate = moment(new Date()).format("Do MMMM YYYY"); 
  
  

  let minutes = 'Time Spent - ' + totalTime + ' hours';

  

  doc.autoTable({
    styles: { fontSize: 8 },
    theme: 'grid',
    headStyles: {fillColor: [55, 55, 55]},
    head: [['User', 'When', 'Notes', 'Minutes']],
    body: bodyData,
    didDrawPage: function (data) {
      // Header
      doc.setFontSize(18)
      doc.setTextColor(40)
      if (PDFLogo) {
        doc.addImage(PDFLogo, 'png', 20, 20, 46.5, 48, PDFLogo, 'FAST', 0)
      }
      //doc.text(headerText, data.settings.margin.left + 50, 50)
      doc.setFontSize(8)

      doc.setFontSize(18)
      doc.text(headerText, data.settings.margin.left + 50, 30)
      doc.setFontSize(11)
      doc.setTextColor(100)

      // jsPDF 1.4+ uses getWidth, <1.4 uses .width
      var pageSize = doc.internal.pageSize
      var pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth()
      var text = doc.splitTextToSize(task.Notes, pageWidth - 100, {})
      doc.text(text, data.settings.margin.left + 50, 50)

      doc.text(minutes, 700, data.settings.margin.left)

      

     
    },
    startY: 80
  })

  var docName = task.Issue_No;

  //let titleDate = moment(new Date()).format("DDMMYYYY"); 


  doc.save(docName)
}