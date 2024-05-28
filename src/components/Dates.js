import {differenceInCalendarDays,isToday,isYesterday,getDay,differenceInHours, differenceInMinutes} from 'date-fns';
export const checkDate=(time)=>{
          const tweetDate = new Date(time.toDate());
          const today = new Date();
          const difference=differenceInCalendarDays(today,tweetDate);
          const daysOfTheWeek=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

          let displayDate;
          if (isToday(tweetDate)) {
            const hoursDifference=differenceInHours(today,tweetDate);
            if(hoursDifference>0){
                displayDate=`${hoursDifference} hours ago`
            }
            else{
                const minutesDifference=differenceInMinutes(today,tweetDate);
                displayDate=`${minutesDifference} minutes ago`
            }
          } else if (isYesterday(tweetDate)) {
            displayDate = "Yesterday";
          } else if(difference>1 && difference<6) {
            const numberOfDayInWeek=getDay(tweetDate);
            displayDate=daysOfTheWeek[numberOfDayInWeek];
          }
          
          else {
            displayDate = tweetDate.toLocaleDateString(undefined, {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          });
          }

         return displayDate;
    }