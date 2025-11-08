import { Router } from 'express'
import Project from '../models/Project.js'
import Skill from '../models/Skill.js'
import Tool from '../models/Tool.js'
import { submitContact } from '../controllers/contactController.js'
import { chat as aiChat, listAvailableModels } from '../controllers/aiController.js'

const router = Router()

router.get('/projects', async (req, res, next) => {
  try {
    const items = await Project.find().sort({ createdAt: -1 })
    res.json(items)
  } catch (err) { next(err) }
})

router.get('/skills', async (req, res, next) => {
  try {
    const items = await Skill.find().sort({ createdAt: 1 })
    res.json(items)
  } catch (err) { next(err) }
})

router.get('/tools', async (req, res, next) => {
  try {
    const items = await Tool.find().sort({ createdAt: 1 })
    res.json(items)
  } catch (err) { next(err) }
})

router.post('/contact', submitContact)

// AI chatbot (Gemini) endpoint
router.post('/ai/chat', aiChat)
router.get('/ai/models', listAvailableModels)

export default router
