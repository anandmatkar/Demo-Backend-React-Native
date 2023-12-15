import multer from 'multer';

const generateFileName = (file) => {
  const ext = file.mimetype.split('/')[1];
  return `${Date.now()}-${Math.floor(Math.random() * 1000)}.${ext}`;
};

const storage1 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profilePic');
  },
  filename: function (req, file, cb) {
    cb(null, generateFileName(file));
  },
});

const storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/uploadedFiles');
  },
  filename: function (req, file, cb) {
    cb(null, generateFileName(file));
  },
});

const postStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/postUpload');
  },
  filename: function (req, file, cb) {
    cb(null, generateFileName(file));
  },
});

const postUpload = multer({
  storage: postStorage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith('image/') ||
      file.mimetype.startsWith('video/')
    ) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

export const uploadPost = postUpload;

export const uploadProfilePic = multer({ storage: storage1 });

export const uploadMultipleFiles = multer({ storage: storage2 });
