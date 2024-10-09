process.nextTick(() => console.log('tick1'));
console.log(1);
setImmediate(() => console.log('immediate1'));
setTimeout(() => setTimeout(() => console.log('timeout(0)1')), 0);
process.nextTick(() => console.log('tick2'));
setImmediate(() => console.log('immediate2'));
setTimeout(() => console.log('timeout(100)1'), 100);
setImmediate(() => process.nextTick(() => console.log('itick1')));
process.nextTick(() => console.log('tick3'));

console.log(1);
setTimeout(() => console.log('timeout(0)2'), 0);
setImmediate(() => console.log('immediate4'));
setTimeout(() => console.log('timeout(100)2'), 100);
process.nextTick(() => console.log('tick4'));
setImmediate(() => console.log('immediate5'));
process.nextTick(() => console.log('tick5'));
