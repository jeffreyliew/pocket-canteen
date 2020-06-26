const getCurrentWeek = () => {
  let curr = new Date();
  let week = [];

  for (let i = 1; i <= 5; i++) {
    let day = curr.getDate() - curr.getDay() + i;
    let date = new Date(curr.setDate(day)).toISOString().slice(0, 10);
    week.push(date);
  }

  return week;
};

export default getCurrentWeek;
