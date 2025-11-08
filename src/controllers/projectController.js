import Project from '../models/Project.js'

export async function listProjects (req, res, next) {
  try {
    const projects = await Project.find().sort({ createdAt: -1 })
    res.render('pages/projects/list', { title: 'Projects', appName: 'Portfolio Admin', projects })
  } catch (err) {
    next(err)
  }
}

export async function showCreateForm (req, res) {
  res.render('pages/projects/form', { title: 'New Project', appName: 'Portfolio Admin', project: {}, mode: 'create' })
}

export async function createProject (req, res, next) {
  try {
    const { title, description, url, github, imageUrl, tags, features, technologies, featured } = req.body
    const uploadedUrl = req.file ? `/public/uploads/${req.file.filename}` : null
    const toArray = (v) => {
      if (Array.isArray(v)) return v.filter(Boolean).map(s => String(s).trim()).filter(Boolean)
      if (!v) return []
      // support comma or newline separated strings
      return String(v)
        .split(/[\n,]/)
        .map(s => s.trim())
        .filter(Boolean)
    }
    const doc = await Project.create({
      title,
      description,
      imageUrl: uploadedUrl || imageUrl || '',
      url,
      github,
      tags: (tags || '')
        .split(',')
        .map(t => t.trim())
        .filter(Boolean),
      features: toArray(features),
      technologies: toArray(technologies),
      featured: Boolean(featured)
    })
    res.redirect('/projects')
  } catch (err) {
    next(err)
  }
}

export async function showEditForm (req, res, next) {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) return res.status(404).render('pages/404', { title: 'Not Found' })
    res.render('pages/projects/form', { title: 'Edit Project', appName: 'Portfolio Admin', project, mode: 'edit' })
  } catch (err) {
    next(err)
  }
}

export async function updateProject (req, res, next) {
  try {
    const { title, description, url, github, imageUrl, tags, features, technologies, featured } = req.body
    const uploadedUrl = req.file ? `/public/uploads/${req.file.filename}` : null
    const toArray = (v) => {
      if (Array.isArray(v)) return v.filter(Boolean).map(s => String(s).trim()).filter(Boolean)
      if (!v) return []
      return String(v)
        .split(/[\n,]/)
        .map(s => s.trim())
        .filter(Boolean)
    }
    await Project.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        imageUrl: uploadedUrl || imageUrl || '',
        url,
        github,
        tags: (tags || '')
          .split(',')
          .map(t => t.trim())
          .filter(Boolean),
        features: toArray(features),
        technologies: toArray(technologies),
        featured: Boolean(featured)
      },
      { runValidators: true }
    )
    res.redirect('/projects')
  } catch (err) {
    next(err)
  }
}

export async function deleteProject (req, res, next) {
  try {
    await Project.findByIdAndDelete(req.params.id)
    res.redirect('/projects')
  } catch (err) {
    next(err)
  }
}
