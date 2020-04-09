const addDays = (date, days) => {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};
const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dec'];

const dateToString = date => `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`

const dateToStringShort = date =>  `${MONTHS[date.getMonth()]} ${date.getDate()}`;

module.exports = {
  addDays,
  dateToString,
  dateToStringShort
};
