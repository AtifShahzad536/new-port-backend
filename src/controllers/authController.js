export function showLogin (req, res) {
  if (req.session && req.session.user) return res.redirect('/dashboard')
  res.render('pages/auth/login', { title: 'Login', appName: 'Portfolio Admin', error: null })
}

export function login (req, res) {
  const { email, password } = req.body
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

  if (email === adminEmail && password === adminPassword) {
    req.session.user = { email }
    return res.redirect('/dashboard')
  }
  return res.status(401).render('pages/auth/login', { title: 'Login', appName: 'Portfolio Admin', error: 'Invalid credentials' })
}

export function logout (req, res) {
  req.session.destroy(() => {
    res.redirect('/auth/login')
  })
}
