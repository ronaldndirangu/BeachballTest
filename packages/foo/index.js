const { getSumOfNumbersInArray } = require("@rn/zoo");

const add = (a, b) => a + b;
const subtract = (a, b) => a - b;

const sumArray = (arr) => getSumOfNumbersInArray(arr);

module.exports = {
    add,
    subtract,
    sumArray
};