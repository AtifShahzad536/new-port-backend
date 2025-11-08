import Project from '../models/Project.js'
import Skill from '../models/Skill.js'
import Tool from '../models/Tool.js'

function buildSiteContext({ projects = [], skills = [], tools = [] }) {
  const projectsText = projects.map(p => `- ${p.title} | ${p.url || 'no demo'} | ${p.github || 'no github'} | tags: ${(p.tags||[]).join(', ')} | tech: ${(p.technologies||[]).join(', ')} | features: ${(p.features||[]).join('; ')}` ).join('\n')
  const skillsText = skills.map(s => `- ${s.name} (${s.level || 0}%)`).join('\n')
  const toolsText = tools.map(t => `- ${t.name} ${t.website ? `| ${t.website}` : ''}`).join('\n')
  return `You are an AI assistant for Atif's portfolio website. Use the following site data to answer accurately about the site, projects, skills, and tools. If something is unknown, say you are not sure.\n\n[Projects]\n${projectsText}\n\n[Skills]\n${skillsText}\n\n[Tools]\n${toolsText}`
}

// GET /api/ai/models -> list available model ids supporting generateContent
export async function listAvailableModels (req, res, next) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY not configured' })
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`
    const resp = await fetch(url)
    const data = await resp.json()
    if (!resp.ok) {
      return res.status(resp.status).json({ error: data?.error?.message || 'Failed to list models' })
    }
    const supportsGen = m => Array.isArray(m?.supportedGenerationMethods) && m.supportedGenerationMethods.includes('generateContent')
    const ids = (data.models || []).filter(supportsGen).map(m => m.name.split('/').pop())
    return res.json({ models: ids })
  } catch (err) {
    next(err)
  }
}

export async function chat(req, res, next) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY not configured' })

    const { message, model: requestedModel } = req.body || {}
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'message is required' })
    }

    // Load site data to ground the model
    const [projects, skills, tools] = await Promise.all([
      Project.find().sort({ createdAt: -1 }).lean(),
      Skill.find().sort({ createdAt: 1 }).lean(),
      Tool.find().sort({ createdAt: 1 }).lean()
    ])

    const system = buildSiteContext({ projects, skills, tools })
    const tone = 'Speak concisely and naturally like a friendly human assistant.'
    const cta = '\n\nIf helpful, you can also ask about Atif Shahzad for more info.'
    const prompt = `${system}\n\nInstruction: ${tone}\n\nUser: ${message}\nAssistant:`

    // Discover available models and try them by priority
    async function listModels () {
      const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`
      const resp = await fetch(url)
      const data = await resp.json()
      if (!resp.ok) throw new Error(data?.error?.message || 'Failed to list models')
      return Array.isArray(data?.models) ? data.models : []
    }

    const models = await listModels()
    const supportsGen = m => Array.isArray(m?.supportedGenerationMethods) && m.supportedGenerationMethods.includes('generateContent')
    const preferred = [
      'gemini-2.5-flash-preview-05-20',
      'gemini-2.5-flash',
      'gemini-2.5-pro',
      'gemini-flash-latest',
      'gemini-pro-latest',
      'gemini-2.0-flash',
      'gemini-2.0-flash-001'
    ]
    // build candidate list by preferred order, then any other generateContent models
    const preferredCandidates = preferred
      .map(name => models.find(m => m.name?.endsWith(`/models/${name}`) && supportsGen(m)))
      .filter(Boolean)
      .map(m => m.name.split('/').pop())
    const otherCandidates = models
      .filter(m => supportsGen(m) && !preferred.some(n => m.name?.endsWith(`/models/${n}`)))
      .map(m => m.name.split('/').pop())
    let candidates = [...preferredCandidates, ...otherCandidates]
    // If a specific model is requested and available, try it first
    if (requestedModel) {
      const rqName = requestedModel.startsWith('models/') ? requestedModel.split('/').pop() : requestedModel
      const has = models.find(m => m.name?.endsWith(`/models/${rqName}`) && supportsGen(m))
      if (has) {
        candidates = [rqName, ...candidates.filter(n => n !== rqName)]
      }
    }
    if (!candidates.length) {
      return res.status(503).json({ error: 'AI_UNAVAILABLE', message: 'No Gemini model available for generateContent' })
    }

    // try candidates until success; continue on 429/403
    let lastError = null
    for (const model of candidates) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`
      try {
        const resp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }] })
        })
        const data = await resp.json()
        if (!resp.ok) {
          // continue on quota or forbidden to next model
          if (resp.status === 429 || resp.status === 403) { lastError = data; continue }
          return res.status(resp.status).json({ error: 'AI_UNAVAILABLE', message: data?.error?.message || 'Gemini API error' })
        }
        let text = data?.candidates?.[0]?.content?.parts?.map(p => p.text).join('\n') || 'Sorry, I could not generate a response.'
        // Append CTA while keeping the answer
        text = `${text}${cta}`
        return res.json({ reply: text, model })
      } catch (errApi) {
        lastError = { message: errApi?.message }
        continue
      }
    }
    return res.status(502).json({ error: 'AI_UNAVAILABLE', message: (lastError && (lastError.error?.message || lastError.message)) || 'All Gemini models failed' })
  } catch (err) {
    next(err)
  }
}
