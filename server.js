//server.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

// Create a function to generate unique filenames
const generateFileName = (file) => {
  const timestamp = Date.now();
  const originalname = path.parse(file.originalname).name;
  const extension = path.extname(file.originalname);
  return `${originalname}_${timestamp}${extension}`;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, generateFileName(file));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = ['pdf'];
    const fileType = path.extname(file.originalname).toLowerCase().substring(1);
    if (!allowedFileTypes.includes(fileType)) {
      return cb(new Error('Invalid file type. Only PDF files are allowed.'));
    }
    cb(null, true);
  },
});

app.use('/uploads', express.static('uploads'));

app.post('/upload', upload.single('pdfFile'), (req, res) => {
  try {
    if (!req.file) {
      throw new Error('No file uploaded.');
    }

    const filePath = path.join(__dirname, 'uploads', req.file.filename);
    res.json({ status: 'success', message: 'File uploaded successfully.', filePath });
  } catch (error) {
    console.error('Error uploading file:', error.message);
    res.status(400).json({ status: 'error', message: error.message });
  }
});

// Additional endpoint to get a list of uploaded files
app.get('/files', (req, res) => {
  const files = fs.readdirSync(path.join(__dirname, 'uploads'));
  res.json({ files });
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ status: 'error', message: 'Not Found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
