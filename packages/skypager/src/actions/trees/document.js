action('Document Tree')

/* Takes a tree of assets - say source code files - and
 * generates a document from them. */
execute((params) => {
  let project = this
  let paths = {}

  console.log("Params", params)
})

exports.config = {
  params: {
    base: {
      desc: 'The tree you want to clone into the documents folder',
      type: 'relative'
    }
  }
}
