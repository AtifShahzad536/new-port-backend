export function showLogin (req, res) {
  if (req.session && req.session.user) return res.redirect('/dashboard')
  res.render('pages/auth/login', { title: 'Login', appName: 'Portfolio Admin', error: null })
}

export function login (req, res) {
  try {
    const { email, password } = req.body
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

    if (!email || !password) {
      return res.status(400).render('pages/auth/login', { 
        title: 'Login', 
        appName: 'Portfolio Admin', 
        error: 'Email and password are required' 
      })
    }

    if (email === adminEmail && password === adminPassword) {
      req.session.regenerate((err) => {
        if (err) {
          console.error('Session regeneration error:', err)
          return res.status(500).render('pages/auth/login', { 
            title: 'Login', 
            appName: 'Portfolio Admin', 
            error: 'An error occurred during login. Please try again.' 
          })
        }
        
        req.session.user = { email }
        req.session.save((err) => {
          if (err) {
            console.error('Session save error:', err)
            return res.status(500).render('pages/auth/login', { 
              title: 'Login', 
              appName: 'Portfolio Admin', 
              error: 'An error occurred during login. Please try again.' 
            })
          }
          return res.redirect('/dashboard')
        })
      })
    } else {
      return res.status(401).render('pages/auth/login', { 
        title: 'Login', 
        appName: 'Portfolio Admin', 
        error: 'Invalid credentials' 
      })
    }
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).render('pages/auth/login', { 
      title: 'Login', 
      appName: 'Portfolio Admin', 
      error: 'An unexpected error occurred. Please try again.' 
    })
  }
}

export function logout (req, res) {
  req.session.destroy(() => {
    res.redirect('/auth/login')
  })
}
