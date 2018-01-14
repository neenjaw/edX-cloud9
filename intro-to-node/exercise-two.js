function average(arrNums) {
    let numberOfNumbers = arrNums.length;
    let sum = 0;
    
    for (var i =0; i < numberOfNumbers; i++) {
        sum += arrNums[i];
    }
    
    return Math.round( sum / numberOfNumbers ); 
}

console.log(average([1,1,1]));
console.log(average([1,2,3]));
console.log(average([10,20,30]));
console.log(average([90,98,89,100,100,86,94]));
