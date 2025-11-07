import { Router } from 'express'
import { getDashboard } from '../controllers/dashboardController.js'
import projectsRouter from './projects.js'
import skillsRouter from './skills.js'
import toolsRouter from './tools.js'
import contactsRouter from './contacts.js'
import apiRouter from './api.js'
import authRouter from './auth.js'
import { requireAuth } from '../middlewares/auth.js'

const router = Router()

router.get('/', (req, res) => res.redirect('/dashboard'))
router.use('/auth', authRouter)

router.get('/dashboard', requireAuth, getDashboard)
router.use('/projects', requireAuth, projectsRouter)
router.use('/skills', requireAuth, skillsRouter)
router.use('/tools', requireAuth, toolsRouter)
router.use('/contacts', requireAuth, contactsRouter)
router.use('/api', apiRouter)

export default router
