const addDays = (date, days) => {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};
const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dec'];

const dateToString = date => `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`

const dateToStringShort = date =>  `${MONTHS[date.getMonth()]} ${date.getDate()}`;

const sameDay = (date1, date2) => date1.getDay() === date2.getDay() && date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();

const getWidth = () => window.innerWidth
  || document.documentElement.clientWidth
  || document.body.clientWidth;

const getNameInitials = name => {
  const words = name.toUpperCase().split(' ');
  return words.length > 1 ? `${words[0][0]}${words[1][0]}`:`${words[0][0]}`
}

const BGS = [ 'bg-danger','bg-warning', 'bg-success'];

const getRandomBackground = () => BGS[Math.floor(Math.random() * 10) % BGS.length ];

const getUniformBackground = count => [...Array(count).keys()].map(i => BGS[i % BGS.length ]);

const secuencialStringSearch = (pattern, text) => {
  pattern = pattern.toLowerCase().replace(/\s/g, '');
  text = text.toLowerCase();
  let i=0, j=0;
  while(i < pattern.length){
    while(j < text.length && pattern[i] !== text[j]) j++;
    if(j === text.length) return false;
    i++;
    j++;
  }
  return true;
}


module.exports = {
  addDays,
  dateToString,
  dateToStringShort,
  getWidth,
  getNameInitials,
  getRandomBackground,
  getUniformBackground,
  BGS,
  sameDay,
  secuencialStringSearch
};
