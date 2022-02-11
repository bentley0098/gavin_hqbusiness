export function LoadDataSource (user, priority, showingClosed, filterCustCode, department, urgent, search) {

    //-----LOAD TASKS FOR THE GRID -----//
    //const [dataSource, setDataSource] = useState([]);
    //const [taskAmount, setTaskAmount] = useState(0);

    let dataSource = []
    let taskAmount = 0;

    const filterUser = user;
    const filterPriority = priority;
    const isShowClosed = showingClosed;
    const filterCustomer = filterCustCode;
    const departmentCode = department;
    const urgentOnly = urgent;
    let Search = search;
    if(search === '') {
      Search = 'nosearchentered';
    }
    
      const newDataSource = (filterUser, filterPriority, isShowClosed, filterCustomer, departmentCode, urgentOnly, Search) =>{
        return fetch('/queryTasks/' + filterUser + '&' + filterPriority + '&' + isShowClosed + '&' + filterCustomer + '&' + departmentCode + '&' + urgentOnly + '&' + Search).then(response => {

          return response.json().then(data => {
            taskAmount = data.length;
            return { data, count: data.length };
          })
        });
      }
      dataSource = newDataSource(filterUser, filterPriority, isShowClosed, filterCustomer, departmentCode, urgentOnly, Search);
    
    //----------//

    let returnValues = {
      data: dataSource,
      count: taskAmount
    }

    return returnValues;
}