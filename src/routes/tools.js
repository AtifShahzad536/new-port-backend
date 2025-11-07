import { Router } from 'express'
import { listTools, showCreateForm, createTool, showEditForm, updateTool, deleteTool } from '../controllers/toolController.js'

const router = Router()

router.get('/', listTools)
router.get('/new', showCreateForm)
router.post('/', createTool)
router.get('/:id/edit', showEditForm)
router.post('/:id', updateTool)
router.post('/:id/delete', deleteTool)

export default router
