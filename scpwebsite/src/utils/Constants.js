const currentDate = new Date();
const formattedDate = currentDate.toISOString().split('T')[0];
const formattedTime = currentDate.toTimeString().split(' ')[0].substring(0, 5);

export const exactDatetime = {
  date: formattedDate,
  time: formattedTime
    
}
