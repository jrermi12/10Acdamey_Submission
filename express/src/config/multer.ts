import multer from 'multer';

// Configuration for handling file uploads with multer
const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage: storage });

export default upload;
