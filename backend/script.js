import express from 'express';
import cors from 'cors';
// import fs from 'fs'

const app = express();
app.use(cors());
app.use(express.json());

app.post('/recieve', (req, res) => {
  console.log('Received node sequence:', req.body);
  // fs.writeFile('output.json', req.body, (err) => {
  //   if (err) {
  //     console.error('Error writing to file:', err);
  //   } else {
  //     console.log('Array saved to myArray.json');
  //   }
  // };


    res.json({ message: 'Nodes received successfully!' })
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
