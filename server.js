import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Explicit Resume PDF download endpoints
app.get(['/download-resume', '/Bahatam_Nudrik_Raju_Resume.pdf', '/My_Resume.pdf'], (req, res) => {
  const filePath = path.join(__dirname, 'Bahatam_Nudrik_Raju_Resume.pdf');
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="Bahatam_Nudrik_Raju_Resume.pdf"');
  res.sendFile(filePath);
});

// Explicit Resume PDF view endpoint
app.get('/view-resume.pdf', (req, res) => {
  const filePath = path.join(__dirname, 'Bahatam_Nudrik_Raju_Resume.pdf');
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'inline; filename="Bahatam_Nudrik_Raju_Resume.pdf"');
  res.sendFile(filePath);
});

app.use(express.static(__dirname));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
