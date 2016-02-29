action('expand outline')

execute(function(params = {id}, { project }) {
  let doc = project.docs.findBy({
    type: 'outline',
    id
  })

  console.log(doc.toEntity())
})
