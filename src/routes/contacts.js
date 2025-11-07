import { Router } from 'express'
import { listContacts, markRead, deleteContact } from '../controllers/contactController.js'

const router = Router()

router.get('/', listContacts)
router.post('/:id/read', markRead)
router.post('/:id/delete', deleteContact)

export default router
