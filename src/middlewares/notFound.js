export default function notFound (req, res, next) {
  res.status(404)
  if (req.accepts('html')) {
    return res.render('pages/404', { title: 'Not Found' })
  }
  if (req.accepts('json')) {
    return res.json({ error: 'Not Found' })
  }
  return res.type('txt').send('Not Found')
}
