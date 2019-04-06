'use strict';

let fs = require('fs-extra');
let primesFile =                    './data/primes.json';
let primesIntervalsFile =           './data/primesIntervals.json';
let primesIntervalsSumsFile =       './data/primesIntervalsSums.json';
let sumsIntervalsFile =             './data/sumsIntervals.json';
let sumsSumsFile =                  './data/sumsSums.json';
let sumsSumsIntervalsFile =         './data/sumsSumsIntervals.json';

async function generatePrimes(n, file) {
    let count = 0;
    let maxCount = n;
    let primes = [];

    let i = 2;

    while(count<maxCount) {
        if( isPrime(i) ) {
            primes.push(i);
            count++;
        }
        i++;
    }

    function isPrime (n) {
        if ( n%1 || n<2 ) return false;

        let q = Math.sqrt(n);

        for (let i = 2; i <= q; i++) {
            if (n % i === 0) {
                return false;
            }
        }
        return true;
    }

    await fs.writeFile(file, JSON.stringify(primes));
}

(async () => {
    await fs.mkdirs('./data');

    const primesExists = await fs.exists(primesFile);
    if (!primesExists) {
        await generatePrimes(2000000, primesFile);
    }

    let primesData = await fs.readFile(primesFile);
    primesData = primesData.toString();
    let primes = JSON.parse(primesData);

    let primesIntervals = [];
    for (let i = 1; i < primes.length; i++) {
        primesIntervals.push(primes[i] - primes[i - 1]);
    }
    await fs.writeFile(primesIntervalsFile, JSON.stringify(primesIntervals));

    primes = []; // clear memory

    let tempSum = 0;
    let primesIntervalSums = [];
    for (let primeIntervalSum of primesIntervals) {
        tempSum += primeIntervalSum;
        primesIntervalSums.push(tempSum);
    }
    await fs.writeFile(primesIntervalsSumsFile, JSON.stringify(primesIntervalSums));

    primesIntervals = [];  // clear memory

    let sumsIntervals = [];
    for (let i = 1; i < primesIntervalSums.length; i++) {
        sumsIntervals.push(primesIntervalSums[i] - primesIntervalSums[i - 1]);
    }
    await fs.writeFile(sumsIntervalsFile, JSON.stringify(sumsIntervals));

    primesIntervalSums = [];  // clear memory

    tempSum = 0;
    let sumsSums = [];
    for (let interval of sumsIntervals) {
        tempSum += interval;
        sumsSums.push(tempSum);
    }
    await fs.writeFile(sumsSumsFile, JSON.stringify(sumsSums));

    let sumsSumsIntervals = [];
    for (let i = 1; i < sumsSums.length; i++) {
        sumsSumsIntervals.push(sumsSums[i] - sumsSums[i - 1]);
    }
    await fs.writeFile(sumsSumsIntervalsFile, JSON.stringify(sumsSumsIntervals));

    sumsSums = []; // clear memory
    sumsSumsIntervals = [];  // clear memory
})();