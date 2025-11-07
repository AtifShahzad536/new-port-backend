import Skill from '../models/Skill.js'

export async function listSkills (req, res, next) {
  try {
    const skills = await Skill.find().sort({ createdAt: -1 })
    res.render('pages/skills/list', { title: 'Skills', appName: 'Portfolio Admin', skills })
  } catch (err) { next(err) }
}

export function showCreateForm (req, res) {
  res.render('pages/skills/form', { title: 'New Skill', appName: 'Portfolio Admin', skill: {}, mode: 'create' })
}

export async function createSkill (req, res, next) {
  try {
    const { name, level, iconLib, iconName, iconUrl } = req.body
    await Skill.create({ name, level, iconLib, iconName, iconUrl })
    res.redirect('/skills')
  } catch (err) { next(err) }
}

export async function showEditForm (req, res, next) {
  try {
    const skill = await Skill.findById(req.params.id)
    if (!skill) return res.status(404).render('pages/404', { title: 'Not Found' })
    res.render('pages/skills/form', { title: 'Edit Skill', appName: 'Portfolio Admin', skill, mode: 'edit' })
  } catch (err) { next(err) }
}

export async function updateSkill (req, res, next) {
  try {
    const { name, level, iconLib, iconName, iconUrl } = req.body
    await Skill.findByIdAndUpdate(req.params.id, { name, level, iconLib, iconName, iconUrl }, { runValidators: true })
    res.redirect('/skills')
  } catch (err) { next(err) }
}

export async function deleteSkill (req, res, next) {
  try {
    await Skill.findByIdAndDelete(req.params.id)
    res.redirect('/skills')
  } catch (err) { next(err) }
}
