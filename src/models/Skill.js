import mongoose from 'mongoose'

const SkillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    level: { type: Number, min: 0, max: 100, default: 0 },
    iconLib: { type: String, trim: true }, // e.g. 'fa', 'si', 'io5'
    iconName: { type: String, trim: true }, // e.g. 'FaReact', 'SiMongodb'
    iconUrl: { type: String, trim: true } // optional fallback
  },
  { timestamps: true }
)

export default mongoose.model('Skill', SkillSchema)
