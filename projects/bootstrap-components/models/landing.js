describe("Landing", (landing) => { })

export const example = ``

export function create (document) {
  let entity = Object.assign({}, document.data)

  entity.title = document.headings.titles.first.value

  return entity
}
