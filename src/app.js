import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import compression from 'compression'
import morgan from 'morgan'
import dotenv from 'dotenv'
import expressLayouts from 'express-ejs-layouts'
import session from 'express-session'

import router from './routes/index.js'
import notFound from './middlewares/notFound.js'
import errorHandler from './middlewares/errorHandler.js'
import { attachUser } from './middlewares/auth.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

const app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '../views'))
app.set('layout', 'layouts/main')
app.use(expressLayouts)

// default locals for all views
app.locals.appName = 'Portfolio Admin'
app.use((req, res, next) => {
  res.locals.appName = app.locals.appName
  next()
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}))
app.use(cors())
app.use(compression())
app.use(morgan('dev'))

// sessions (simple in-memory store for dev)
app.use(session({
  secret: process.env.SESSION_SECRET || 'change-me',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax' }
}))
app.use(attachUser)

app.use('/public', express.static(path.join(__dirname, '../public')))

// avoid noisy favicon errors
app.get('/favicon.ico', (req, res) => res.status(204).end())

app.use('/', router)

app.use(notFound)
app.use(errorHandler)

export default app
