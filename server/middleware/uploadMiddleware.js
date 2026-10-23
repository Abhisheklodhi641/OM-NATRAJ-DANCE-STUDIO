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
  const allowedExtensions = /\.(jpg|jpeg|png|webp|mp4|webm|mov|m4v|3gp|quicktime)$/i;
  const isImage = file.mimetype.startsWith('image/');
  const isVideo = file.mimetype.startsWith('video/') || file.mimetype === 'application/octet-stream' || /\.(mp4|webm|mov|m4v|3gp|quicktime)$/i.test(file.originalname);

  if ((isImage || isVideo) && allowedExtensions.test(path.extname(file.originalname))) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Allowed formats: jpg, jpeg, png, webp, mp4, webm, mov, m4v, 3gp'), false);
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
      const isVideo = file.mimetype.startsWith('video/') || /\.(mp4|mov|webm|m4v|3gp|quicktime)$/i.test(file.originalname);
      const isAlreadyMp4 = /\.mp4$/i.test(file.originalname) || file.mimetype === 'video/mp4';
      const uploadOptions = {
        resource_type: isVideo ? 'video' : 'image',
        folder: 'om_natraj_dance_studio'
      };
      if (isVideo && !isAlreadyMp4) {
        uploadOptions.format = 'mp4';
      }
      const result = await cloudinary.uploader.upload(file.path, uploadOptions);
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
    resourceType: (file.mimetype.startsWith('video/') || /\.(mp4|mov|webm|m4v|3gp|quicktime)$/i.test(file.originalname)) ? 'video' : 'image'
  };
};

/**
 * Helper to reliably extract public_id and resource_type from a Cloudinary URL or raw identifier
 */
export const extractCloudinaryAsset = (input, fallbackType = 'image') => {
  if (!input || typeof input !== 'string') return null;
  const str = input.trim();
  if (!str) return null;

  // Local static paths are not Cloudinary assets
  if (str.startsWith('/images/') || str.startsWith('images/') || str.startsWith('/uploads/') || str.startsWith('uploads/')) {
    return null;
  }

  let resourceType = fallbackType;
  if (str.includes('/video/') || /\.(mp4|mov|webm|m4v|3gp|quicktime)(\?.*)?$/i.test(str)) {
    resourceType = 'video';
  } else if (str.includes('/image/') || /\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i.test(str)) {
    resourceType = 'image';
  }

  if (str.includes('cloudinary.com')) {
    const uploadIdx = str.indexOf('/upload/');
    if (uploadIdx === -1) return null;
    const afterUpload = str.slice(uploadIdx + 8);
    const cleanPath = afterUpload.split('?')[0].split('#')[0];
    const parts = cleanPath.split('/');

    let publicIdParts = [];
    const folderIdx = parts.findIndex(p => p === 'om_natraj_dance_studio');
    if (folderIdx !== -1) {
      publicIdParts = parts.slice(folderIdx);
    } else {
      const versionIdx = parts.findIndex(p => /^v\d+$/.test(p));
      if (versionIdx !== -1) {
        publicIdParts = parts.slice(versionIdx + 1);
      } else {
        publicIdParts = parts.filter(p => !p.includes(',') && !/^v\d+$/.test(p));
      }
    }

    if (publicIdParts.length === 0) return null;
    let rawPublicId = publicIdParts.join('/');
    // Strip file extension
    rawPublicId = rawPublicId.replace(/\.[^/.]+$/, '');
    return { publicId: rawPublicId, resourceType };
  }

  // Raw public_id
  if (!str.startsWith('/') && !str.includes('\\')) {
    return { publicId: str.replace(/\.[^/.]+$/, ''), resourceType };
  }

  return null;
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

/**
 * Helper to delete media by URL or publicId from Cloudinary or local storage.
 * Automatically detects whether it is Cloudinary or local, extracts the correct publicId & resourceType,
 * and permanently destroys the asset.
 */
export const deleteMediaByUrl = async (urlOrPublicId, fallbackType = 'image') => {
  if (!urlOrPublicId || typeof urlOrPublicId !== 'string') return false;
  const str = urlOrPublicId.trim();
  if (!str) return false;

  // Never delete default local images from /images/
  if (str.startsWith('/images/') || str.startsWith('images/')) {
    return false;
  }

  // Check if Cloudinary asset
  const cloudAsset = extractCloudinaryAsset(str, fallbackType);
  if (cloudAsset) {
    // Protect static studio assets from deletion
    if (cloudAsset.publicId.startsWith('om_natraj_dance_studio/static/')) {
      return false;
    }
    return await deleteUploadedFile(cloudAsset.publicId, cloudAsset.resourceType);
  }

  // Check if local upload in /uploads/
  if (str.startsWith('/uploads/') || str.startsWith('uploads/')) {
    const filename = path.basename(str);
    const localPath = path.join(uploadDir, filename);
    if (fs.existsSync(localPath)) {
      try {
        fs.unlinkSync(localPath);
        return true;
      } catch (err) {
        console.warn('[Local Media Delete Warning]', err.message);
      }
    }
  }

  return false;
};
