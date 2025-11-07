import Project from '../models/Project.js'
import Skill from '../models/Skill.js'
import Tool from '../models/Tool.js'
import Contact from '../models/Contact.js'

export const getDashboard = async (req, res, next) => {
  try {
    const [projects, skills, tools, contacts] = await Promise.all([
      Project.countDocuments(),
      Skill.countDocuments(),
      Tool.countDocuments(),
      Contact.countDocuments()
    ])

    res.render('pages/dashboard', {
      title: 'Dashboard',
      appName: 'Portfolio Admin',
      stats: { projects, skills, tools, contacts }
    })
  } catch (err) {
    next(err)
  }
}
