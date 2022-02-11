export function getUserReport(startDate, endDate, filterUser) {
    return fetch('/getUserReport/'+startDate+'&'+endDate+'&'+filterUser)
      .then(data => data.json())
  }

export function getSupportReport(startDate, endDate, filterUser) {
  return fetch('/getSupportReport/'+startDate+'&'+endDate+'&'+filterUser)
    .then(data => data.json())
}

export function getUserPie(startDate, endDate) {
  return fetch('/getSupportReport/'+startDate+'&'+endDate)
    .then(data => data.json())
}