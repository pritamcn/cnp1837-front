import moment from "moment";

export const getFormattedDate = (dt) => {
    if (dt && dt !== undefined && dt !== "") {
      let date = new Date(dt);
      var year = date.getFullYear();
      var month = (1 + date.getMonth()).toString();
      month = month.length > 1 ? month : "0" + month;
      var day = date.getDate().toString();
      day = day.length > 1 ? day : "0" + day;
      return month + "/" + day + "/" + year;
    } else {
      return "--";
    }
  };
  export const dateextractor=(dt,type)=>{
    if(dt ===null){
      return null
    }
    else {
      let parts = dt.split(/[-T:.Z]/);
      let year = parseInt(parts[0]);
      let month = parseInt(parts[1]-1);
      let day = parseInt(parts[2])+1;
      let value="new Date"+`(${year},${month},${day},${type==="start"?0:23},${type==="start"?0:59})`
      return value;
    }
    
  }
  export const emptychecker=(data,type)=>{
    let newFormValues=data
    const format = "H:mm";
    let checkvalues=newFormValues?.filter((item)=>item.start !==null || item.end !==null)
    let error=""
    if(checkvalues?.length >0){
      let validation = checkvalues?.every(item => item.start && item.end);
      if(!validation) error="nullerror"
    }
    if(type==="holiday" && checkvalues?.every(item => item.start && item.end))
    {
      let existsWithinIntervals = false;

      for (let i = 0; i < checkvalues.length; i++) {
        const currentInterval = checkvalues[i];
        const currentStart = currentInterval.start ? new Date(currentInterval.start) : null;
        const currentEnd = currentInterval.end ? new Date(currentInterval.end) : null;
      
        for (let j = 0; j < checkvalues.length; j++) {
          if (i === j) {
            continue;
          }
      
          const otherInterval = checkvalues[j];
          const otherStart = otherInterval.start ? new Date(otherInterval.start) : null;
          const otherEnd = otherInterval.end ? new Date(otherInterval.end) : null;
      
          if (
            (currentStart && otherStart && currentStart >= otherStart && currentStart <= otherEnd) ||
            (currentEnd && otherStart && currentEnd >= otherStart && currentEnd <= otherEnd)
          ) {
            existsWithinIntervals = true;
            break;
          }
        }
      
        if (existsWithinIntervals) {
          break;
        }
      }
      if (existsWithinIntervals) {
        error="intervalerror"
      } 
    }
    if(type==="day" && checkvalues?.every(item => item.start && item.end)){
     const timeIntervals=checkvalues.map(item => {
      return {     
        "start": item.start ===null ? null:item.start.format(format),
        "end": item.end ===null?null:item.end.format(format)
      };
    })
let existsWithinIntervals = false;

for (let i = 0; i < timeIntervals.length; i++) {
  const currentInterval = timeIntervals[i];
  const currentStart = currentInterval.start;
  const currentEnd = currentInterval.end;

  for (let j = 0; j < timeIntervals.length; j++) {
    if (i === j) {
      continue;
    }

    const otherInterval = timeIntervals[j];
    const otherStart = otherInterval.start;
    const otherEnd = otherInterval.end;

    if (
      (currentStart && otherStart && currentStart >= otherStart && currentStart <= otherEnd) ||
      (currentEnd && otherStart && currentEnd >= otherStart && currentEnd <= otherEnd)
    ) {
      existsWithinIntervals = true;
      break;
    }
  }

  if (existsWithinIntervals) {
    break;
  }
}

// Output the result
if (existsWithinIntervals) {
  error="intervalerror"
} 
    }
    return error
  }
  export const getdaysbetween=(date1,date2)=>{
    const oneDay = 24 * 60 * 60 * 1000;
    let start = moment(date1).format("YYYY/MM/DD");
    let end = moment(date2).format("YYYY/MM/DD");
     const firstDate = new Date(start?.split('/')[0], start?.split('/')[1]-1, start?.split('/')[2]);
  const secondDate = new Date(end?.split('/')[0], end?.split('/')[1]-1, end?.split('/')[2]);
  const diffDays = (firstDate - secondDate) / oneDay;
     return diffDays
  }
  export const getminutesbetween=(hour1,hour2)=>{
    const old_hour=hour1?.toString().split(':')[0];
    const old_minute=hour1?.toString().split(':')[1];
    const new_hour=hour2?.toString().split(':')[0];
    const new_minute=hour2?.toString().split(':')[1];
   const min_diff=((new_hour *60)+ Number(new_minute)) - ((old_hour * 60) + Number(old_minute))
   return min_diff 
   }
   export const minuteextractor=(datetime)=>{
    let extractedTime = moment(datetime).format('h:mm A');
    return extractedTime
   }
   export const durationextractor=(starttime,endtime)=>{

const startTime = moment(starttime);
const endTime = moment(endtime);
     let duration = moment.duration(endTime?.diff(startTime));
const hours = duration.hours();
const minutes = duration.minutes();
if(hours ===0){
  return `${minutes} minutes`
}
else return `${hours} hours, ${minutes} minutes`
   }
   export const removeTags=(str)=>{
    if ((str===null) || (str===''))
    return false;
    else
    str = str.toString();
    return str.replace( /(<([^>]+)>)/ig, '');
   }

   export function validate_password(password) {
    let checkpassword = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/
    if (password.match(checkpassword)) {
       return true
    } else {
      return false
    }
  }




