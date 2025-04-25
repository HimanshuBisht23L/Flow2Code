import express from 'express';
import cors from 'cors';
import fs from 'fs'; 

const app = express();
app.use(cors());
app.use(express.json());

app.post('/recieve', (req, res) => {
  console.log('Received node sequence:', req.body);

  fs.writeFile('output.json', JSON.stringify(req.body, null, 2), (err) => {
    if (err) {
      console.error('Error writing to file:', err);
      return res.status(500).json({ message: 'Failed to save file' });
    } else {
      console.log('Data saved to output.json');
      return res.json({ message: 'Nodes received successfully!' });
    }
  });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
