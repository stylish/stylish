# Notes #

## For DEV setup ##

### Running npm install ###

1. installed npm 3.8.2 (should this be a pre-req)? I was running 3.3.2
2. did install skypager-cli globally, but...now there is a discrepancy
  1. when I'm in `./`, `which skypager`:
    `./node_modules/.bin/skypager`
    which links to `../skypager-cli/bin/cli.js` (npm module)
  2. when I'm in any subdir, `which skypager`:
    `/usr/local/bin/skypager `
    which links to ` /usr/local/lib/node_modules/skypager-cli/bin/cli.js`

