import React, { Children } from 'react'
import { Grid, Col, Row, Panel } from 'react-bootstrap'

import { range } from 'lodash'

export function CardsContainer (props = {}) {
  let num = props.perRow || 4
  let items = each_cons(Children.toArray(props.children), num)

  let colSize = 12 / num;

  let rows = items.map((row,i) => {
    let columns = row.map((item,j) => {
      return <Col key={j} xs={colSize}>{item}</Col>
    })

    return <Row key={i}>{columns}</Row>
  })

  return <Grid>{rows}</Grid>
}

export default CardsContainer

function each_cons (list, size) {
  let groupsCount = list.length <= size ? 1 : list.length / size

  return range(0, groupsCount).reduce((m,s,k) => {
    let beginAt = s * size
    let endAt = size * (s + 1)

    m.push(list.slice(beginAt, endAt))

    return m
  }, [])
}
