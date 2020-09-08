const PNG = require('pngjs-image')

const hash = /^#/
const d1 = /.{1}/g
const d2 = /.{1,2}/g

const dim = 10001
const [width, height] = [dim, dim]
const img = PNG.createImage(width, height)
const center = [xxx(width), xxx(height)]
const [cx, cy] = center

const coord = (x, y) => `(${x},${y})`
const sCoord = (x, y) => coord(Math.floor(x/sectionSize), Math.floor(y/sectionSize))

const red = hexToRGBA('f00')
const halfRed = hexToRGBA('800')
const blue = hexToRGBA('00f')
const halfBlue = hexToRGBA('008')
const white = hexToRGBA('fff')
const black = hexToRGBA('000')

const tiles = new Map()

const dotSize = 10
const n = 200
const mx = 20
const sectionSize = dim

for (let x = 0; x < width; x++) {
		for (let y = 0; y < width; y++) {
				img.setAt(x, y, white)
		}
}

for (let x = -mx; x <= mx; x ++) {
		for (let y = -mx; y <= mx; y++) {
				const distance = Math.abs(x) + Math.abs(y)
				if (distance > mx) continue

				const angle = Math.atan2(y, x)
				const [dx, dy] = [
						0 + (distance * Math.cos(angle)),
						0 + (distance * Math.sin(angle))
				]

				const [lx, ly] = [
						Math.floor(cx + (dx * n)),
						Math.floor(cy + (dy * n))
				]

				//for (let _x = -dotSize; _x <= dotSize; _x ++) {
				//		for (let _y = -dotSize; _y <= dotSize; _y++) {
				//				if (Math.hypot(_x, _y) < dotSize) {
				//						const col = Math.hypot(x, y) === Math.hypot(dx, dy)
				//						? blue : Math.abs(x)+Math.abs(y) === 15 ? red : black
				//						img.setAt(lx + _x, ly + _y, col)
				//				}
				//		}
				//}

				//tiles.set(coord(x, y), {
				//		distance: Math.abs(x),
				//		angle 
				//})

				let col

				if (x === 0 && y === 0) col = black
				else if (distance % 2 === 0) {
						if (x % 2 === 0) col = red
						else col = halfRed
				} else {
						if (x % 2 === 0) col = blue
						else col = halfBlue
				}

				const coords = coord(x, y)
				const tile = { x: lx, y: ly, col }
				tiles.set(coords, tile)
		}
}

for (let x = -mx; x <= mx; x ++) {
		for (let y = -mx; y <= mx; y++) {
				const tile = tiles.get(coord(x,y))
				if (!tile) continue
				console.log(coord(x,y))

				let maxDist = 0
				const neigh = [
						[-1, -1],
						[-1,  0],
						[-1, +1],

						[ 0, -1],
						[ 0, +1],
						
						[+1, -1],
						[+1,  0],
						[+1, +1],
				]
						.map(([X, Y]) => {
								const n = tiles.get(coord(x+X, y+Y))
								if (!n) return

								const dist = Math.hypot(
										tile.x - n.x,
										tile.y - n.y
								) / 2
								maxDist = Math.max(maxDist, Math.ceil(dist))
								return n
						})
						.filter(Boolean)
						.sort((a, b) => a.dist - b.dist)

				const [bx, by] = [tile.x + maxDist, tile.y + maxDist]
				for (let _x = -bx; _x <= bx; _x++) {
						for (let _y = -by; _y <= by; _y++) {
								const [lx, ly] = [tile.x+_x, tile.y+_y]
								const dist = Math.hypot(tile.x-lx, tile.y-ly) + 5
								if (
										dist > maxDist
										|| neigh.some(n => 
												dist
												> Math.hypot(n.x-lx, n.y-ly)
										)
								) continue
								img.setAt(lx, ly, tile.col)
						}
				}
		}
}

img.writeImage('image-4.png', function (err) {
		if (err) return console.log(err)

		console.log('done')
})

return

for (let x = 0; x < width; x++) {
		for (let y = 0; y < width; y++) {
				const distance = Math.sqrt(
						Math.pow(Math.abs(x - center[0]), 2)
						+ Math.pow(Math.abs(y - center[1]), 2)
				)

				const dd = Math.floor(distance / 15)
				
				const divOfRing = dd * 4
				const angleXXX = divOfRing ? 360 / divOfRing : 360
				
				const angle = Math.atan2(
						y - center[1],
						x - center[0]
				) * 180 / Math.PI
				const offset = angleXXX / 2
				const dAngle = Math.floor((angle - offset) / angleXXX)

				const xxx = dAngle % 2 === 0

				const colour = dd % 2 === 0
						? xxx ? red : blue
						: xxx ? white : black

				img.setAt(x, y, colour)
		}
}

img.writeImage('image.png', function (err) {
		if (err) return console.log(err)

		console.log('done')
})


function hexToRGBA(hex) {
    hex = hex.replace(hash, '')

    let div = 0
    let dbl = false

    switch (hex.length) {
        case 8:
        case 6:
            div = d2
            break
        case 4:
        case 3:
            div = d1
            dbl = true
            break
        default:
            throw new Error('invalid hex: ' + hex)
    }

    const [red, green, blue, alpha = 0] = Array.from(hex.match(div))
        .map(p => parseInt(dbl ? p + p : p, 16))

    return { red, green, blue, alpha: 255 }
}

function xxx(n) {
		return Math.round(n / 2)
}

