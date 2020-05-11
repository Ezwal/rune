const canvas = document.getElementById('draw')
const {PI, cos, sin} = Math

const ctx = canvas.getContext('2d')
canvas.width = window.innerWidth - 20
canvas.height = window.innerHeight - 20

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

// FYI all runes are drawed from first point

u = 100
iota = 10

// fire runes
drawRune([0, 3*u], [[0, 0], [u/2, -u], [u, 0]], 'red')
drawRune([u, 3*u], [[0, 0], [u/4, -u], [u/2, 0], [3*u/4, -u], [u, 0]], 'red')
drawRune([2*u, 3*u-u/2-iota], [[0, 0], [u/2, -u/2], [u, iota], [0, iota], [u/4, u/2], [u/2, iota], [3*u/4, u/2], [u, iota]], 'red')

// earth runes
drawRune([0, 4*u], [[0,0], [0, u], [u, u], [u, 0]], 'brown')
drawRune([u, 4*u], [[0,0], [u, 0], [u, u/2], [0, u/2], [0, u], [u, u]], 'brown')
drawRune([2*u, 4*u], [[0,0], [0, u/2], [u, u/2], [u, 0], [u/2, 0], [u/2, u], [0, u]], 'brown')

// light runes
drawRune([u/2, 0], [[0, 0], [0, u], [-u/2, u/2], [u/2, u/2]], 'gold')
drawRune([u+u/2, 0], [[0, 0], [u/3.3, u/3.3], [-u/3.3, u/3.3], [0, 0], [0, u]], 'gold')
drawRune([2*u+u/2, 0], starPoint(u/2), 'gold')

// water runes
// drawCurveRune([5*u, iota+u], [[[-u/2, -u/2], [-3*u/2, 0], [-u/2, u/2]],
//                              [[3*iota, u-iota], [iota, u+4*iota], [-u/2, u+iota]],
//                               [[], [], []]], 'blue') // TODO


// mouse handling shit

let shapes = []
let currentShape = undefined
function handleShapes() {

    const eraseLastShape = () => {
        const shapesLength = shapes.filter(el => el).length
        if (shapesLength === 0 || currentShape) { return }
        const last = shapes[shapesLength-1]

        ctx.strokeStyle = 'white'
        ctx.lineWidth = 6 // this looks definitly very fucking hacky TODO change? also I doesnt work for sure

        ctx.beginPath()
        last.forEach(([x, y]) => ctx.lineTo(x, y))
        ctx.stroke()
        shapes = shapes.slice(0, shapesLength-1).filter(el => el)
        console.log(shapes);
    }
    canvas.addEventListener('mousedown', e => {
        if (e.buttons === 4 || e.buttons === 2) {
            return eraseLastShape()
        }
        ctx.lineWidth = 5
        ctx.strokeStyle = 'black'
        currentShape = [[e.offsetX, e.offsetY]]
        ctx.moveTo(e.offsetX, e.offsetY)
        ctx.beginPath()
    })

    canvas.addEventListener('mouseup', e => {
        shapes = shapes.filter(el=>el).concat([currentShape])
        currentShape = undefined
        ctx.stroke()
    })

    canvas.addEventListener('mousemove', e => {
        // console.log('mouse moved :', e.pageX, e.pageY);
        if (currentShape) {
            ctx.lineTo(e.pageX, e.pageY)
            currentShape = [...currentShape, [e.pageX, e.pageY]]
            ctx.stroke()
        }
    })
}

handleShapes()
