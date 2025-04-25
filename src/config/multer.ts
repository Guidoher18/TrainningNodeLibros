import multer from 'multer';
import path from 'path';

// Configuración de almacenamiento de imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${__dirname}/../assets/uploads`); // Carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Renombrar el archivo con timestamp
  }
});

// Filtros para aceptar solo imágenes
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const allowedTypes = /jpeg|jpg|png/;

  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase().replace('.', '')
  );

  const allowedMime = new RegExp('multipart/form-data');
  const mimetype = allowedMime.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    return cb(new Error('Only images in JPEG, JPG or PNG format are allowed.'));
  }
};

// Configurar Multer con límites de tamaño (ej: 5MB)
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

export default upload;
