const http = require('node:http')
const fs = require('node:fs')

const mime = {
  'html': 'text/html',
  'css': 'text/css',
  'jpg': 'image/jpg',
  'ico': 'image/x-icon',
  'mp3': 'audio/mpeg3',
  'mp4': 'video/mp4'
}

const servidor = http.createServer((pedido, respuesta) => {
  const url = new URL('http://localhost:8888' + pedido.url)
  let camino = 'public' + url.pathname
  if (camino == 'public/')
    camino = 'public/index.html'
  encaminar(pedido, respuesta, camino)
});

servidor.listen(8888)


function encaminar(pedido, respuesta, camino) {
  switch (camino) {
    case 'public/ListaNumeros': {
      listar(pedido, respuesta)
      break
    }
    case 'public/listadotabla': {
      listarTablaMultiplicar(pedido, respuesta)
      break
    }
    case 'public/sumatabla': {
        listarTablaSumar(pedido, respuesta)
        break
      }
      case 'public/restatabla': {
        listarTablaRestar(pedido, respuesta)
        break
      }
    default: {
      fs.stat(camino, error => {
        if (!error) {
          fs.readFile(camino, (error, contenido) => {
            if (error) {
              respuesta.writeHead(500, { 'Content-Type': 'text/plain' })
              respuesta.write('Error interno')
              respuesta.end()
            } else {
              const vec = camino.split('.')
              const extension = vec[vec.length - 1]
              const mimearchivo = mime[extension]
              respuesta.writeHead(200, { 'Content-Type': mimearchivo })
              respuesta.write(contenido)
              respuesta.end()
            }
          })
        } else {
          respuesta.writeHead(404, { 'Content-Type': 'text/html' })
          respuesta.write('<!doctype html><html><head></head><body>Recurso inexistente</body></html>')
          respuesta.end()
        }
      })
    }
  }
}


function listar(pedido, respuesta) {
  const info = ''
  respuesta.writeHead(200, { 'Content-Type': 'text/html' })
  let pagina = '<!doctype html><html><head></head><body>'
  for (let i = 1; i <= 20; i++) {
    pagina += `<a href="listadotabla?num=${i}"> Multiplicar ${i}</a> <a href="sumatabla?num=${i}"> Sumar ${i}</a> <a href="restatabla?num=${i}">Restar ${i}</a><br>`
  }
  pagina += '</body></html>'
  respuesta.end(pagina)
}

function listarTablaMultiplicar(pedido, respuesta) {
  const url = new URL('http://localhost:8088' + pedido.url)
  respuesta.writeHead(200, { 'Content-Type': 'text/html' })
  let pagina = '<!doctype html><html><head></head><body>'
  for (let i = 1; i <= 10; i++) {
    pagina += `${url.searchParams.get('num')}*${i}=${url.searchParams.get('num') * i}<br>`
  }
  pagina += '</body></html>'
  respuesta.end(pagina)
}

function listarTablaSumar(pedido, respuesta) {
    const url = new URL('http://localhost:8088' + pedido.url)
    respuesta.writeHead(200, { 'Content-Type': 'text/html' })
    let pagina = '<!doctype html><html><head></head><body>'
    for (let i = 1; i <= 10; i++) {
      pagina += `${url.searchParams.get('num')}+${i}=${parseInt(url.searchParams.get('num')) + i}<br>`
    }
    pagina += '</body></html>'
    respuesta.end(pagina)
  }

  function listarTablaRestar(pedido, respuesta) {
    const url = new URL('http://localhost:8088' + pedido.url)
    respuesta.writeHead(200, { 'Content-Type': 'text/html' })
    let pagina = '<!doctype html><html><head></head><body>'
    for (let i = 1; i <= 10; i++) {
      pagina += `${url.searchParams.get('num')}+${i}=${url.searchParams.get('num') - i}<br>`
    }
    pagina += '</body></html>'
    respuesta.end(pagina)
  }

console.log('No se inicio el servidor') 