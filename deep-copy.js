let a = [[1, 1], 2, 3];
let b = JSON.parse(JSON.stringify(a));

console.log(a); // => [[1, 1], 2, 3]
console.log(b); // => [[1, 1], 2, 3]

b[0][1] = 'X';
b[2] = 'X';

console.log(a); // => [[1, 1], 2, 3]
console.log(b); // => [[1, 'X'], 2, 'X']
