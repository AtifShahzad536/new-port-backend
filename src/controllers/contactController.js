import Contact from '../models/Contact.js'

export async function listContacts (req, res, next) {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 })
    res.render('pages/contacts/list', { title: 'Contacts', appName: 'Portfolio Admin', contacts })
  } catch (err) { next(err) }
}

export async function markRead (req, res, next) {
  try {
    await Contact.findByIdAndUpdate(req.params.id, { read: true })
    res.redirect('/contacts')
  } catch (err) { next(err) }
}

export async function deleteContact (req, res, next) {
  try {
    await Contact.findByIdAndDelete(req.params.id)
    res.redirect('/contacts')
  } catch (err) { next(err) }
}

// Public endpoint handler (for API route)
export async function submitContact (req, res, next) {
  try {
    const { name, email, message } = req.body
    const doc = await Contact.create({ name, email, message })
    res.status(201).json({ ok: true })
  } catch (err) { next(err) }
}
