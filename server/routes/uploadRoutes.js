import express from 'express';
import { upload, processUploadedFile, deleteUploadedFile } from '../middleware/uploadMiddleware.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/upload - Single file (Image or Video)
router.post('/', protectAdmin, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const processed = await processUploadedFile(req.file);

    res.json({
      success: true,
      message: 'File uploaded successfully',
      file: processed
    });
  } catch (error) {
    console.error('File upload route error:', error);
    res.status(500).json({ success: false, message: error.message || 'File upload failed' });
  }
});

// POST /api/upload/multiple - Multiple images
router.post('/multiple', protectAdmin, upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const results = [];
    for (const file of req.files) {
      const processed = await processUploadedFile(file);
      results.push(processed);
    }

    res.json({
      success: true,
      message: `${results.length} files uploaded successfully`,
      files: results
    });
  } catch (error) {
    console.error('Multiple upload error:', error);
    res.status(500).json({ success: false, message: error.message || 'Upload failed' });
  }
});

// DELETE /api/upload/:publicId - Delete image/video from Cloudinary or local storage
router.delete('/:publicId(*)', protectAdmin, async (req, res) => {
  try {
    const { publicId } = req.params;
    const resourceType = req.query.type || 'image';
    await deleteUploadedFile(publicId, resourceType);
    res.json({ success: true, message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete upload error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete file' });
  }
});

export default router;
