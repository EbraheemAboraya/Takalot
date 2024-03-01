const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/api/upload-image', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No image uploaded.');
  }

  const filePath = path.join(__dirname, '..', req.file.path);

  try {
    const formData = new FormData();
    formData.append('image', fs.createReadStream(filePath));

    const response = await axios.post('https://image-python.onrender.com/predict', formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    const category = response.data.category;
    res.json({ category: category });
  } catch (error) {
    console.error('Error forwarding image to Flask app:', error);
    res.status(500).send('Error processing image.');
  } finally {
    // Cleanup: delete the uploaded file after processing
    fs.unlink(filePath, err => {
      if (err) console.error('Error deleting file:', err);
    });
  }
});

module.exports = router;
