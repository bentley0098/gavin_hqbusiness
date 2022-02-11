//export function getTasks() {
//    return fetch('/queryTasks')
//      .then(data => data.json())
//  }

export function getHistory(taskID) {
  return fetch('/taskHistory/' + taskID)
    .then(data => data.json())
}

export function addNote(note, taskID, UserID, Minutes) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      Notes: note,
      Task: taskID,
      userid: UserID,
      minutes: Minutes
    })
  }
  return fetch('/addHistory/', requestOptions)
   
}

export function updateTask(taskObject, customerName, customerCode, departmentCode, userId) {

  if(!customerName) {
    customerName=taskObject.Company_Name;
    customerCode=taskObject.Account;
  }
  if(!departmentCode) {
    departmentCode = taskObject.Department;
  }
  if(!userId) {
    userId = taskObject.ActionByUserID;
  }
  //console.log(taskObject);
  const requestOptions = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({
      Task : taskObject.Issue_No,
      Details: taskObject.Details,
      Notes: taskObject.Notes,
      Area: taskObject.Reference2,
      Application: taskObject.Reference,
      Contact: taskObject.Reference3,
      Estimate: taskObject.Estimate,
      Priority: taskObject.Priority,
      Invoice: taskObject.Invoice,
      DueDate: taskObject.DueDate,
      Requested: taskObject.Requested,
      Company_Name: customerName,
      Account: customerCode,
      Department: departmentCode,
      User: userId
    })
  }
  return fetch('/updateTask/', requestOptions)
}


export function addNewTask(newTaskNo, CustomerName,CustomerCode, newDetails, newPriority, dueDate, reqDate, departmentCode, user, userID, ref1, contact, ref2, notes, estimate, invoice, urgent) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      Details: newDetails,
      Task: newTaskNo,
      CustomerName: CustomerName,
      CustomerCode: CustomerCode,
      Priority: newPriority,
      DueDate: dueDate,
      ReqDate: reqDate,
      Department: departmentCode,
      User: user,
      Reference1: ref1,
      Contact: contact,
      Reference2: ref2,
      Notes: notes,
      Estimate: estimate,
      Invoice: invoice,
      UserID: userID,
      Urgent: urgent
    })
  }
  return fetch('/addNewTask/', requestOptions)
   
}

export async function getNewTaskID() {
  const response = await fetch('/newTaskId');
  const newtaskID = await response.json();
  return newtaskID
}

export async function returnCustomers() {
  const response = await fetch('/returnCustomers');
  const customers = await response.json();
  return customers
}

export async function returnDepartments() {
  const response = await fetch('/returnDepartments');
  const departments = await response.json();
  return departments
}

export async function returnUsers() {
  const response = await fetch('/returnUsers');
  const departments = await response.json();
  return departments
}

export async function getSelectedTask(id) {
  const response = await fetch('/returnSelectedTask/' + id);
  const thisTask = await response.json();
  return thisTask
}
    
export async function returnReasons() {
  const response = await fetch('/returnReasons');
  const reasons = await response.json();
  return reasons
}

export function closeTask(taskID, reasonCode, minutes) {
  var date = new Date();
  
  const requestOptions = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({
      Task : taskID,
      Code: reasonCode,
      Minutes: minutes,
      Date: date
    })
  }
  return fetch('/closeTask/', requestOptions)
}

export function editMultiple( selectedIds, newPriority, newduedate ) {
  let string = JSON.stringify(selectedIds);
  //console.log(JSON.parse(string));
  //console.log(newPriority);
  const requestOptions = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({
      tasks: string,
      priority: newPriority,
      duedate: newduedate
    })
  }

  //console.log(requestOptions);
  return fetch('/editMultiple', requestOptions)
}

export function openHistory(newTaskNo, UserID) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({
      taskID: newTaskNo,
      userid: UserID
    })
  }

  return fetch('/openHistory', requestOptions)
}

export function reOpenTask(task) {
  const requestOptions = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({
      taskID: task
    })
  }
  return fetch('/reOpenTask', requestOptions)
}


export const getSummary = (userID, priority) =>{
  return fetch('/getSummary/' + userID + '&' + priority).then(response => {
      return response.json()
  });
}

export const getTaskCount = () =>{
  return fetch('/getTaskCount').then(response => {
      return response.json()
  });
}

export function makeUrgent (taskId, input) {
  const requestOptions = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({
      taskID: taskId,
      input: input
    })
  }
  return fetch('/makeUrgent', requestOptions)
}

export function getItems (taskId) {
  return fetch('/getItems/' + taskId).then(response => {
    return response.json()
  });
}

export function closeItem (itemId, input) {
  let string = JSON.stringify(itemId);
 
  const requestOptions = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({
      itemID: string,
      input: input
    })
  }
  return fetch('/closeItem', requestOptions)
}

export function getTimeSpent (taskId) {
  return fetch('/getTimeSpent/' + taskId).then(response => {
    return response.json()
  });
}