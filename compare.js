const minMaxShape = shape => shape.reduce(([maxX, maxY, minX, minY], [x, y]) =>
                                             ([max(x, maxX), max(y, maxY),
                                               min(x, minX), min(y, minY)]),
                                            [-Infinity, -Infinity, Infinity, Infinity])

const normalizeShape = shape => {
    const [maxX, maxY, minX, minY] = minMaxShape(shape)
    const deltaX = abs(maxX-minX)
    const deltaY = abs(maxY-minY)
    return shape
        .map(([x,y]) => ([(x-minX)/deltaX,
                          (y-minY)/deltaY]))
}

const distance = ([xa, ya]) => ([xb, yb]) => sqrt(square(xb - xa) + square(yb - ya))

const range = (i, f) => [...Array(f).keys()].slice(i)
const sizedArray = (n, fn) => Array.from({length: n}, fn)

function frechet(shapeA, shapeB) {
    const na = shapeA.length
    const nb = shapeB.length
    const ca = sizedArray(na, () => sizedArray(nb, () => -1))

    ca[0][0] = distance(shapeA[0])(shapeB[0])
    range(1, na)
        .forEach(i => {
            ca[i][0] = max(ca[i-1][0], distance(shapeA[i])(shapeB[0]))
        })
    range(1, nb)
        .forEach(j => {
            ca[0][j] = max(ca[0][j-1], distance(shapeA[0])(shapeB[j]))
        })

    for (const i of range(1, na)) {
        for (const j of range(1, nb)) {
            ca[i][j] = max(
                min(ca[i-1][j], ca[i-1][j-1], ca[i][j-1]),
                distance(shapeA[i])(shapeB[j])
            )
        }
    }

    return ca[na-1][nb-1]
}

const compareShape = shapeA => shapeB => {
    const normA = normalizeShape(shapeA)
    const normB = normalizeShape(shapeB)
    return frechet(normA, normB)
}
