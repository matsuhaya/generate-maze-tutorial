let a = [[1, 1], 2, 3];
let b = Array.from(a);

console.log(a); // => [[1, 1], 2, 3]
console.log(b); // => [[1, 1], 2, 3]
console.log(a === b); // => false

b[0][1] = 'X';
b[2] = 'X';

console.log(a); // => [[ 1, 'X'], 2, 3]
console.log(b); // => [[ 1, 'X'], 2, 'X']
