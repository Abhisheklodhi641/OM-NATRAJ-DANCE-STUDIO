import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure local uploads directory exists
const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Disk Storage for local fallback / temporary holding
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
    const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1e5)}`;
    cb(null, `${cleanName}_${uniqueSuffix}${ext}`);
  }
});

// File validation
const fileFilter = (req, file, cb) => {
  const allowedExtensions = /\.(jpg|jpeg|png|webp|mp4|webm|mov)$/i;
  const isImage = file.mimetype.startsWith('image/');
  const isVideo = file.mimetype.startsWith('video/');

  if ((isImage || isVideo) && allowedExtensions.test(path.extname(file.originalname))) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Allowed formats: jpg, jpeg, png, webp, mp4, webm, mov'), false);
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max for videos
  },
  fileFilter
});

/**
 * Helper to upload a local file to Cloudinary (if configured)
 * Returns the final URL to save in database.
 */
export const processUploadedFile = async (file) => {
  if (!file) return null;

  if (isCloudinaryConfigured) {
    try {
      const isVideo = file.mimetype.startsWith('video/');
      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: isVideo ? 'video' : 'image',
        folder: 'om_natraj_dance_studio'
      });
      // Clean up local temp file after cloud upload
      try {
        fs.unlinkSync(file.path);
      } catch (err) {
        // ignore
      }
      return {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        resourceType: isVideo ? 'video' : 'image'
      };
    } catch (cloudErr) {
      console.error('[Cloudinary Upload Error]', cloudErr.message);
      if (process.env.NODE_ENV === 'production' || process.env.DISABLE_LOCAL_FALLBACK === 'true') {
        throw new Error(`Cloudinary upload failed: ${cloudErr.message}`);
      }
      console.warn('Falling back to local file URL.');
    }
  }

  if (process.env.NODE_ENV === 'production' || process.env.DISABLE_LOCAL_FALLBACK === 'true') {
    throw new Error('Cloudinary is not configured or failed in production. Local uploads fallback is not allowed.');
  }

  // Fallback: Return server-relative URL
  const localUrl = `/uploads/${file.filename}`;
  return {
    url: localUrl,
    publicId: file.filename,
    format: path.extname(file.filename).replace('.', ''),
    resourceType: file.mimetype.startsWith('video/') ? 'video' : 'image'
  };
};

/**
 * Helper to delete an asset from Cloudinary or local storage
 */
export const deleteUploadedFile = async (publicId, resourceType = 'image') => {
  if (!publicId) return false;

  if (isCloudinaryConfigured && !publicId.startsWith('/') && !publicId.includes('\\')) {
    try {
      const res = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
      return res;
    } catch (cloudErr) {
      console.warn('[Cloudinary Delete Warning]', cloudErr.message);
      if (process.env.NODE_ENV === 'production' || process.env.DISABLE_LOCAL_FALLBACK === 'true') {
        throw new Error(`Cloudinary deletion failed: ${cloudErr.message}`);
      }
    }
  }

  // Local storage cleanup
  const localPath = path.join(uploadDir, path.basename(publicId));
  if (fs.existsSync(localPath)) {
    try {
      fs.unlinkSync(localPath);
      return true;
    } catch (err) {
      // ignore
    }
  }
  return false;
};
