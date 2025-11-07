import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const uploadDir = path.join(__dirname, '../../public/uploads')

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname)
    const base = path.basename(file.originalname, ext).replace(/[^a-z0-9-_]/gi, '_')
    cb(null, `${Date.now()}_${base}${ext}`)
  }
})

function fileFilter (_req, file, cb) {
  const ok = [/^image\//].some(rx => rx.test(file.mimetype))
  if (!ok) return cb(new Error('Only image files are allowed'))
  cb(null, true)
}

export function single (field) {
  return multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }).single(field)
}
