export function pkg (request = {}, next) {
  let { exists, pwd, readFile } = this

  if (exists(pwd('package.json'))) {
    request.pkg = readFile(pwd('package.json'))
  } else {
    pkg = {}
  }

  next()
}


export default pkg
