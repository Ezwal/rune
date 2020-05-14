const canvas = document.getElementById('draw')
const {abs, PI, cos, sin, min, max, sqrt} = Math
const square = x => x*x

const ctx = canvas.getContext('2d')
canvas.width = window.innerWidth - 20
canvas.height = window.innerHeight - 20


let shapes = []
let currentShape = undefined

const blankCanvas = () => {
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}
const beginDrawing = (x, y) => {
    ctx.lineWidth = 5
    ctx.strokeStyle = 'black'
    currentShape = [[x, y]]
    ctx.moveTo(x, y)
    ctx.beginPath()
}

const continueDrawing = (x, y) => {
        if (currentShape) {
            ctx.lineTo(x, y)
            currentShape = [...currentShape, [x, y]]
            ctx.stroke()
        }
}
const finishDrawing = () => {
    shapes = shapes.filter(el=>el).concat([currentShape])
    shapeRecognition(knownRunes, currentShape)
    if (shapes.length % 2 === 0) { // TODO rm this is for debug
        drawShapeComparison(...shapes.slice(-2))
    }
    currentShape = undefined
    ctx.stroke()
}

const eraseLastShape = () => {
    const shapesLength = shapes.filter(el => el).length
    if (shapesLength === 0 || currentShape) { return }

    blankCanvas()
    shapes = shapes.slice(0, shapesLength-1).filter(el => el)
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 5
    shapes.forEach(shape => {
        ctx.beginPath()
        shape.forEach(([x, y]) => ctx.lineTo(x, y))
        ctx.stroke()
    })
}

function handleShapes() {
    canvas.addEventListener('mousedown', e => {
         return (e.buttons === 4 || e.buttons === 2) ?
            eraseLastShape()
            : beginDrawing(e.offsetX, e.offsetY)
    })

    canvas.addEventListener('mouseup', e => {
        if (e.buttons === 0 && currentShape) {
            finishDrawing()
        }
    })
    canvas.addEventListener('mousemove', e => continueDrawing(e.offsetX, e.offsetY))
}

const drawShapeComparison = (shapeA, shapeB) => {
    const comparison = compareShape(shapeA)(shapeB)
    const [xfa, yfa] = shapeA[0]
    const [xfb, yfb] = shapeB[0]
    const middlePoint = [(xfa + xfb) / 2, (yfa + yfb) /2]
    ctx.font = '24px serif'
    ctx.fillText(comparison.toString(), ...middlePoint)
}

function shapeRecognition(referenceShapes, unknownShape, options = {threshold: 0.50}) {
    const compare = compareShape(unknownShape)
    const closestShape = referenceShapes
        .reduce((mostSimilar, shape) => {
            const similarity = compare(shape.design)
            if (similarity < mostSimilar.similarity) {
                return {...shape, similarity}
            }
            return mostSimilar
        }, {similarity: Infinity})
    console.log('shape', closestShape.name, 'similarity :', closestShape.similarity);
    if (closestShape.similarity > options.threshold) {
        return closestShape
    }
}

handleShapes()
