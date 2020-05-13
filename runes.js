const rotated = (deg, fn) => {
    ctx.rotate((PI / 180) * deg)
    fn()
    ctx.restore()
}

const snap = (origin, color, fn) => {
    ctx.strokeStyle = color
    ctx.save()
    ctx.beginPath()
    ctx.translate(...origin)
    fn()
    ctx.stroke()
    ctx.restore()
}

const drawRune = (origin, points, color) => snap(origin, color, () => {
    for (const point of points) {
        ctx.lineTo(...point)
    }
})

const drawCurveRune = (origin, points, color) => snap(origin, color, () => {
    ctx.moveTo(0, 0)
    for (const [[cp1x, cp1y], [cp2x, cp2y], [endx, endy]] of points) {
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endx, endy)
    }
})

const starPoint = r => [0, 2, 4, 1, 3, 0]
      .map(n => 2*PI*n/5 - PI/2)
      .map(angle => ([r * cos(angle), r * sin(angle) + r]))

ctx.lineWidth = 10

u = 100
iota = 10

const knownRunes = [
    {name: 'fireball', design: [[0, 0], [u/2, -u], [u, 0]]},
    {name: 'explosion', design: [[0, 0], [u/4, -u], [u/2, 0], [3*u/4, -u], [u, 0]]},
    {name: 'lava', design: [[0, 0], [u/2, -u/2], [u, iota], [0, iota], [u/4, u/2], [u/2, iota], [3*u/4, u/2], [u, iota]]},
    {name: 'wall', design: [[0,0], [0, u], [u, u], [u, 0]]},
    {name: 'armor', design: [[0,0], [u, 0], [u, u/2], [0, u/2], [0, u], [u, u]]},
    {name: 'boulder', design: [[0,0], [0, u/2], [u, u/2], [u, 0], [u/2, 0], [u/2, u], [0, u]]},
    {name: 'heal', design: [[0, 0], [0, u], [-u/2, u/2], [u/2, u/2]]},
    {name: 'buff', design: [[0, 0], [u/3.3, u/3.3], [-u/3.3, u/3.3], [0, 0], [0, u]]},
    {name: 'restore', design: starPoint(u/2)},
]

// drawCurveRune([5*u, iota+u], [[[-u/2, -u/2], [-3*u/2, 0], [-u/2, u/2]],
//                              [[3*iota, u-iota], [iota, u+4*iota], [-u/2, u+iota]],
//                               [[], [], []]], 'blue') // TODO
