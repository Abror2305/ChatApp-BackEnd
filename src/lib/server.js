
const urlModule = require('url')
const path = require('path')
const fs = require('fs')

const controllerFunctions = {}
const globalValues = {}

const server = (req, res) => {
	const { pathname, query } = urlModule.parse(req.url.toLowerCase(), true)
	const method = req.method.toUpperCase()

	req.query = query

	if(method !== 'GET') {
		req.body = new Promise((resolve, reject) => {
			let str = ''
			req.on('data', (chunk) => str += chunk)
			req.on('end', () => {
				try {
					const value = JSON.parse(str)
					return resolve(value)
				} catch(error) {
					return reject(error)
				}
			})	
		})	
	}

	res.json = function (value) {
		res.setHeader('Content-Type', 'application/json')
		return res.end(JSON.stringify(value))
	}

	res.render = function (htmlFile) {
		res.setHeader('Content-Type', 'text/html')
		const file = fs.readFileSync(path.join(globalValues['views'] || 'views', htmlFile + '.html'))
		return res.end(file)
	}

	if(controllerFunctions[method][pathname]) {
		return controllerFunctions[method][pathname](req, res)
	} else {
		const extname = path.extname(pathname)
		const pathExists = fs.existsSync( path.join( globalValues['static'] || 'public', pathname) )

		if(!extname || !pathExists) {
			return res.end(`Cannot ${method} ${pathname}`)
		}

		const contentTypes = {
			'.html': 'text/html',
			'.txt': 'text/plain',
			'.css': 'text/css',
			'.js': 'application/js',
			'.json': 'application/json',
			'.zip': 'application/zip',
			'.pdf': 'application/pdf',
			'.xml': 'application/xml',
			'.mp3': 'audio/mp3',
			'.jpg': 'image/jpg',
			'.jpeg': 'image/jpeg',
			'.png': 'image/png',
			'.svg': 'image/svg+xml',
			'.mp4': 'video/mp4',
		}

		const contentType = contentTypes[extname] || 'application/octet-stream'

		res.writeHead(200, { 'Content-Type': contentType })
		res.end(
			fs.readFileSync( path.join(globalValues['static'], pathname) )
		)
	}
}

module.exports = {
	controllerFunctions,
	globalValues,
	server,
}