export function env (request, next) {
  if (exists(pwd('.env'))) {
    require('dotenv').load({
      path: pwd('.env')
    })
  }

  next()
}
