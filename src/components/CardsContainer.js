import React, { PropTypes as types, createElement as create } from 'react'
import CardsContainerBase from 'skypager-ui/src/components/CardsContainer'

export class CardsContainer extends React.Component {
  static displayName = 'CardsContainer';

  static propTypes = {
    card: types.func.isRequired,
    items: types.array
  };

  render () {
    let {items, card} = this.props
    let cards = items.map((item,key) => create(card, {item, key}))

    let props = this.props

    return (
      <CardsContainerBase {...props}>
        {cards}
      </CardsContainerBase>
    )
  }
}

export default CardsContainer
