export const parseCount = (value: number) => {
  if (value < 10) {
    return `0${value}`;
  }
  return value;
};

export const calculateAverageTime = (listTime: string[]) => {
  let hours = 0,
    minutes = 0,
    seconds = 0,
    total = listTime.length;
  // console.log(listTime);
  listTime.forEach((item) => {
    hours += Number(item.slice(0, 2));
    minutes += Number(item.slice(3, 5));
    seconds += Number(item.slice(6, 8));
  });
  const averageSeconds = (seconds + minutes * 60 + hours * 60 * 60) / total;
  let hour = Math.floor(averageSeconds/60/60);
  let minute = Math.floor((averageSeconds - hour * 60 * 60)/60);
  let second = Math.floor((averageSeconds - hour * 60 *60 - minute * 60))
  // console.log(hour, minute, second);
  return `${parseCount(hour)}:${parseCount(minute)}:${parseCount(second)}`;
};
