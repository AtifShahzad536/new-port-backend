import { Router } from 'express'
import Project from '../models/Project.js'
import Skill from '../models/Skill.js'
import Tool from '../models/Tool.js'
import { submitContact } from '../controllers/contactController.js'

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

export default router
