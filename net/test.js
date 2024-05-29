
// Node.js program to demonstrate the      
// readable.pause() method   
  
// Include fs module 
const fs = require('fs'); 
  
// Create readable stream 
const readable = fs.createReadStream("data/tiks1.csv"); 
  
// Handling data event 
readable.on('data', (chunk) => { 
  console.log(`Received ${chunk.length} bytes of data.`); 
  
  // Calling pause method 
  readable.pause(); 
  
  // After this any data will be displayed  
  // after 1 sec. 
  console.log('No further data will be displayed for 1 second.'); 
  
  // Using setTimeout function 
  setTimeout(() => { 
    console.log('Now data starts flowing again.'); 
    readable.resume(); 
  }, 1000); 
}); 
  
// Displays that program  
// is ended 
console.log("Program ends!!"); 