import { Router } from 'express'
import {
  listProjects,
  showCreateForm,
  createProject,
  showEditForm,
  updateProject,
  deleteProject
} from '../controllers/projectController.js'
import { single as uploadSingle } from '../middlewares/upload.js'

const router = Router()

router.get('/', listProjects)
router.get('/new', showCreateForm)
router.post('/', uploadSingle('image'), createProject)
router.get('/:id/edit', showEditForm)
router.post('/:id', uploadSingle('image'), updateProject)
router.post('/:id/delete', deleteProject)

export default router
