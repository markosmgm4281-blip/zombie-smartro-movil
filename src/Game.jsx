import { useEffect, useRef, useState } from 'react'

const W = 320
const H = 480

export default function Game() {
  const canvasRef = useRef(null)
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [lives, setLives] = useState(3)
  const [gameOver, setGameOver] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    let player = { x: W / 2 - 15, y: H - 40, w: 30, h: 30 }
    let bullets = []
    let zombies = []
    let keys = {}
    let spawnRate = 60

    function spawnZombie() {
      zombies.push({
        x: Math.random() * (W - 30),
        y: -30,
        w: 30,
        h: 30,
        speed: 1 + level * 0.4
      })
    }

    function shoot() {
      bullets.push({
        x: player.x + 14,
        y: player.y,
        speed: 7
      })
    }

    function update() {
      if (gameOver) return

      if (keys['ArrowLeft']) player.x -= 5
      if (keys['ArrowRight']) player.x += 5
      if (player.x < 0) player.x = 0
      if (player.x > W - player.w) player.x = W - player.w

      bullets.forEach(b => (b.y -= b.speed))
      zombies.forEach(z => (z.y += z.speed))

      bullets = bullets.filter(b => b.y > -10)
      zombies = zombies.filter(z => z.y < H + 10)

      zombies.forEach((z, zi) => {
        bullets.forEach((b, bi) => {
          if (b.x > z.x && b.x < z.x + z.w && b.y > z.y && b.y < z.y + z.h) {
            zombies.splice(zi, 1)
            bullets.splice(bi, 1)
            setScore(s => s + 10)
          }
        })
      })

      zombies.forEach((z, zi) => {
        if (
          z.x < player.x + player.w &&
          z.x + z.w > player.x &&
          z.y < player.y + player.h &&
          z.y + z.h > player.y
        ) {
          zombies.splice(zi, 1)
          setLives(l => l - 1)
        }
      })

      if (score > level * 100) setLevel(l => l + 1)

      if (spawnRate > 20) spawnRate--

      if (Math.random() * spawnRate < 1) spawnZombie()
    }

    function draw() {
      ctx.clearRect(0, 0, W, H)
      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, W, H)

      ctx.fillStyle = '#0f0'
      ctx.fillRect(player.x, player.y, player.w, player.h)

      ctx.fillStyle = '#ff0'
      bullets.forEach(b => ctx.fillRect(b.x, b.y, 4, 8))

      ctx.fillStyle = '#f00'
      zombies.forEach(z => ctx.fillRect(z.x, z.y, z.w, z.h))

      ctx.fillStyle = '#fff'
      ctx.fillText(`Score: ${score}`, 10, 15)
      ctx.fillText(`Nivel: ${level}`, 10, 30)
      ctx.fillText(`Vidas: ${lives}`, 10, 45)

      if (lives <= 0) {
        ctx.fillText('GAME OVER', 100, 200)
        setGameOver(true)
      }
    }

    function loop() {
      update()
      draw()
      requestAnimationFrame(loop)
    }

    window.addEventListener('keydown', e => {
      keys[e.key] = true
      if (e.key === ' ') shoot()
    })

    window.addEventListener('keyup', e => {
      keys[e.key] = false
    })

    loop()
  }, [score, level, lives, gameOver])

  return (
    <div style={{ textAlign: 'center' }}>
      <canvas ref={canvasRef} width={W} height={H} style={{ border: '2px solid white' }} />

      {gameOver && (
        <div style={{ marginTop: 20 }}>
          <h2>¡Perdiste!</h2>
          {level >= 3 && (
            <>
              <p>Ganaste un código de descuento:</p>
              <strong>SMART-ZOMBIE-{level}</strong>
              <p>Usalo en SmARTRonica M&M</p>
              <p>WhatsApp: 1137659959</p>
            </>
          )}

          <button onClick={() => window.location.reload()} style={{ marginTop: 15 }}>
            Volver a jugar
          </button>
        </div>
      )}

      <div style={{ marginTop: 20, border: '2px dashed #777', padding: 10 }}>
        Publicidad aquí
      </div>
    </div>
  )
}
