import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/recieve', (req, res) => {
  console.log('Received node sequence:', req.body);
  res.json({ message: 'Nodes received successfully!' });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
