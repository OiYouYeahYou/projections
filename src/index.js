const PNG = require('pngjs-image')

const hash = /^#/
const d1 = /.{1}/g
const d2 = /.{1,2}/g

const dim = 1001
const [width, height] = [dim, dim]
const img = PNG.createImage(width, height)
const center = [xxx(width), xxx(height)]

const red = hexToRGBA('f00')
const blue = hexToRGBA('00f')
const white = hexToRGBA('fff')
const black = hexToRGBA('000')

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

