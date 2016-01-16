import dotenv from 'dotenv'

module.exports = function environment (pwd) {
  pwd = pwd || process.env.PWD

  if (require('fs').existsSync(pwd + '/.env')) {
    dotenv.load(pwd + '/.env')
  }
}

