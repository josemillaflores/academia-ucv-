import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing env vars')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function createVerifiedUser() {
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'admin@academia.com',
    password: 'password123',
    email_confirm: true
  })

  if (error) {
    console.error('Error:', error.message)
  } else {
    console.log('✅ Usuario creado exitosamente:')
    console.log('Email:', data.user.email)
    console.log('Contraseña:', 'password123')
    console.log('¡Ya puedes usar este correo para iniciar sesión (Login)!')
  }
}

createVerifiedUser()
