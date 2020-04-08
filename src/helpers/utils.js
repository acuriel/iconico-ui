const addDays = (date, days) => {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const dateToString = date => date.toISOString().substring(0, 10)

module.exports = {
  addDays,
  dateToString
};
