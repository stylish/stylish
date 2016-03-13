import React, { Children } from 'react'

import Col from 'react-bootstrap/lib/Col'
import Grid from 'react-bootstrap/lib/Grid'
import Row from 'react-bootstrap/lib/Row'

import range from 'lodash/range'

/**
 * The CardsContainer aligns a list of items in a grid pattern.
*/
export function CardsContainer (props = {}) {
  let num = props.perRow || 4
  let items = each_cons(Children.toArray(props.children), num)
  let wrapper = props.wrapper ? props.wrapper : undefined

  let colSize = 12 / num;

  let rows = items.map((row,i) => {
    let columns = row.map((_item,j) => {
      const item = wrapper
        ? (<wrapper>{_item}</wrapper>)
        : _item

        return (
          <Col key={j} xs={colSize}>{item}</Col>
        )
    })

    return (
      <Row key={i}>{columns}</Row>
    )
  })

  return <Grid>{rows}</Grid>
}

export default CardsContainer

// investigate whether it is better to use lodash.chunk which i discovered after this solution
function each_cons (list, size) {
  let groupsCount = list.length <= size ? 1 : list.length / size

  return range(0, groupsCount).reduce((m,s,k) => {
    let beginAt = s * size
    let endAt = size * (s + 1)

    m.push(list.slice(beginAt, endAt))

    return m
  }, [])
}
