const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;

const response = fs.readFileSync("./file.txt").toString(); // ~1MB

// No memory leak
app.get("/no-leak", (req, res) => {
  res.send(0 + "\n" + response);
});

// The counter counterAlmostNoLeak can get a super high value over the time and overflow
let counterAlmostNoLeak = 0;
app.get("/almost-no-leak", (req, res) => {
  counterAlmostNoLeak += 1;
  res.send(counterAlmostNoLeak + "\n" + response);
});

// The array storageSmallLeak has an increasing length, containing references to a long string
const storageSmallLeak = [];
app.get("/small-leak", (req, res) => {
  storageSmallLeak.push(response);
  const counterSmallLink = storageSmallLeak.length;
  res.send(counterSmallLink + "\n" + response);
});

// The array storageBigLeak has an increasing length, containing long strings (of 1 MB each)
const storageBigLeak = [];
app.get("/big-leak", (req, res) => {
  storageBigLeak.push(fs.readFileSync("./file.txt").toString());
  const counterBigLink = storageBigLeak.length;
  res.send(counterBigLink + "\n" + response);
});

app.listen(port, () => {
  console.log(`Example app with memory leak routes. Listening on port ${port}`);
});
