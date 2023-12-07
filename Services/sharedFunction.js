function containsNumber(str) {
  const regex = /\d/;
  return regex.test(str);
}
function checkMobile(mobile) {
  return mobile.toString().length === 10;
}
function generateOrdinalArray(number) {
  const instNo = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];

  number = Math.max(1, Math.floor(number));

  const resultArray = instNo.slice(0, number).map((ordinal, index) => {
    return `${index + 1}${ordinal.slice(1)}`;
  });

  return resultArray;
}

module.exports = { containsNumber,checkMobile,generateOrdinalArray };
