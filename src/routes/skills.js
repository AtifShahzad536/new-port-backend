import { Router } from 'express'
import { listSkills, showCreateForm, createSkill, showEditForm, updateSkill, deleteSkill } from '../controllers/skillController.js'

const router = Router()

router.get('/', listSkills)
router.get('/new', showCreateForm)
router.post('/', createSkill)
router.get('/:id/edit', showEditForm)
router.post('/:id', updateSkill)
router.post('/:id/delete', deleteSkill)

export default router
