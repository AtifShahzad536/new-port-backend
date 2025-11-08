import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { connectDB } from '../config/db.js'
import Project from '../models/Project.js'
import Skill from '../models/Skill.js'
import Tool from '../models/Tool.js'

dotenv.config()

async function run() {
  try {
    await connectDB()

    const [pCount, sCount, tCount] = await Promise.all([
      Project.countDocuments(),
      Skill.countDocuments(),
      Tool.countDocuments()
    ])

    const ops = []

    if (pCount === 0) {
      ops.push(Project.insertMany([
        {
          title: 'Portfolio Website',
          description: 'Personal portfolio built with React, Express, and MongoDB. Responsive UI with animations and admin dashboard.',
          imageUrl: '',
          url: 'https://your-portfolio.example.com',
          github: 'https://github.com/youruser/portfolio',
          tags: ['portfolio', 'fullstack'],
          features: [
            'Animated sections and modern design',
            'Admin dashboard with CRUD for projects/skills/tools',
            'Deployed on Vercel'
          ],
          technologies: ['React', 'Express', 'MongoDB', 'TailwindCSS'],
          featured: true
        },
        {
          title: 'Task Manager',
          description: 'MERN stack todo app with authentication and real-time updates.',
          imageUrl: '',
          url: '',
          github: 'https://github.com/youruser/task-manager',
          tags: ['productivity'],
          features: ['JWT auth', 'Real-time updates', 'Drag & drop'],
          technologies: ['React', 'Node.js', 'MongoDB', 'Socket.IO'],
          featured: false
        }
      ]))
    }

    if (sCount === 0) {
      ops.push(Skill.insertMany([
        { name: 'JavaScript', level: 90, iconLib: 'si', iconName: 'SiJavascript', iconUrl: '' },
        { name: 'React', level: 85, iconLib: 'si', iconName: 'SiReact', iconUrl: '' },
        { name: 'Node.js', level: 85, iconLib: 'si', iconName: 'SiNodedotjs', iconUrl: '' },
        { name: 'MongoDB', level: 80, iconLib: 'si', iconName: 'SiMongodb', iconUrl: '' }
      ]))
    }

    if (tCount === 0) {
      ops.push(Tool.insertMany([
        { name: 'Git', iconLib: 'si', iconName: 'SiGit', iconUrl: '', website: 'https://git-scm.com' },
        { name: 'Vercel', iconLib: 'si', iconName: 'SiVercel', iconUrl: '', website: 'https://vercel.com' },
        { name: 'Tailwind CSS', iconLib: 'si', iconName: 'SiTailwindcss', iconUrl: '', website: 'https://tailwindcss.com' }
      ]))
    }

    if (ops.length) {
      await Promise.all(ops)
      console.log('✅ Seed complete: inserted initial Projects/Skills/Tools')
    } else {
      console.log('ℹ️  Seed skipped: collections already contain data')
    }
  } catch (err) {
    console.error('❌ Seed failed:', err)
    process.exitCode = 1
  } finally {
    await mongoose.connection.close().catch(() => {})
  }
}

run()
