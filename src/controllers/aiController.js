import { GoogleGenerativeAI } from '@google/generative-ai'
import Project from '../models/Project.js'
import Skill from '../models/Skill.js'
import Tool from '../models/Tool.js'

function buildSiteContext({ projects = [], skills = [], tools = [] }) {
  const projectsText = projects.map(p => `- ${p.title} | ${p.url || 'no demo'} | ${p.github || 'no github'} | tags: ${(p.tags||[]).join(', ')} | tech: ${(p.technologies||[]).join(', ')} | features: ${(p.features||[]).join('; ')}` ).join('\n')
  const skillsText = skills.map(s => `- ${s.name} (${s.level || 0}%)`).join('\n')
  const toolsText = tools.map(t => `- ${t.name} ${t.website ? `| ${t.website}` : ''}`).join('\n')
  return `You are an AI assistant for Atif's portfolio website. Use the following site data to answer accurately about the site, projects, skills, and tools. If something is unknown, say you are not sure.
\n[Projects]\n${projectsText}\n\n[Skills]\n${skillsText}\n\n[Tools]\n${toolsText}`
}

export async function chat(req, res, next) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY not configured' })

    const { message } = req.body || {}
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'message is required' })
    }

    // Load site data to ground the model
    const [projects, skills, tools] = await Promise.all([
      Project.find().sort({ createdAt: -1 }).lean(),
      Skill.find().sort({ createdAt: 1 }).lean(),
      Tool.find().sort({ createdAt: 1 }).lean()
    ])

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' })

    const system = buildSiteContext({ projects, skills, tools })
    const prompt = `${system}\n\nUser: ${message}\nAssistant:`

    const result = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: prompt }] }] })
    const text = result?.response?.text?.() || 'Sorry, I could not generate a response.'
    return res.json({ reply: text })
  } catch (err) {
    next(err)
  }
}
