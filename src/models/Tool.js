import mongoose from 'mongoose'

const ToolSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    iconLib: { type: String, trim: true }, // e.g. 'fa', 'si', 'io5'
    iconName: { type: String, trim: true }, // e.g. 'FaNode', 'SiVite'
    iconUrl: { type: String, trim: true },
    website: { type: String, trim: true }
  },
  { timestamps: true }
)

export default mongoose.model('Tool', ToolSchema)
