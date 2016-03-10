import svgToReact from 'svg-to-react'

export function svg(path) {
  return new Promise((resolve, reject) => {
    svgToReact.convertFile(path, (err, fn) => {
      if(err) {
        reject(err);
        return
      }

      return resolve(fn)
    })
  })
}
