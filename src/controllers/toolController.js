import Tool from '../models/Tool.js'

export async function listTools (req, res, next) {
  try {
    const tools = await Tool.find().sort({ createdAt: -1 })
    res.render('pages/tools/list', { title: 'Tools', appName: 'Portfolio Admin', tools })
  } catch (err) { next(err) }
}

export function showCreateForm (req, res) {
  res.render('pages/tools/form', { title: 'New Tool', appName: 'Portfolio Admin', tool: {}, mode: 'create' })
}

export async function createTool (req, res, next) {
  try {
    const { name, iconLib, iconName, iconUrl, website } = req.body
    await Tool.create({ name, iconLib, iconName, iconUrl, website })
    res.redirect('/tools')
  } catch (err) { next(err) }
}

export async function showEditForm (req, res, next) {
  try {
    const tool = await Tool.findById(req.params.id)
    if (!tool) return res.status(404).render('pages/404', { title: 'Not Found' })
    res.render('pages/tools/form', { title: 'Edit Tool', appName: 'Portfolio Admin', tool, mode: 'edit' })
  } catch (err) { next(err) }
}

export async function updateTool (req, res, next) {
  try {
    const { name, iconLib, iconName, iconUrl, website } = req.body
    await Tool.findByIdAndUpdate(req.params.id, { name, iconLib, iconName, iconUrl, website }, { runValidators: true })
    res.redirect('/tools')
  } catch (err) { next(err) }
}

export async function deleteTool (req, res, next) {
  try {
    await Tool.findByIdAndDelete(req.params.id)
    res.redirect('/tools')
  } catch (err) { next(err) }
}
