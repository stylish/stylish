action('Create Document')

execute((params = {}) => {
  console.log('Create a document', this, arguments)
})

export const config = {
  params: {
    id: { type: 'string' },
    metadata: { type: 'object' },
    title: { type: 'string' }
  }
}
