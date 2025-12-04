export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Solo POST permitido' })
  }

  const { name, level, score, code } = req.body

  console.log('Nuevo jugador:', { name, level, score, code })

  // Acá más adelante se puede conectar a Google Sheets o una base de datos
  // Por ahora solo confirma que llegó bien

  return res.status(200).json({ success: true })
}
