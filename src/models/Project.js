import mongoose from 'mongoose'

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    imageUrl: { type: String, trim: true },
    url: { type: String, trim: true },
    tags: [{ type: String }],
    featured: { type: Boolean, default: false }
  },
  { timestamps: true }
)

export default mongoose.model('Project', ProjectSchema)
