import React, { Component, PropTypes as type } from 'react'

import classnames from 'classnames'

export class Block extends Component {
  static displayName = 'Block';

  static propTypes = {
    inverse: type.bool,
    text: type.string,
    title: type.string,
    muteText: type.bool,
    centerText: type.bool,
    background: type.element,
    children: type.node,
    angled: type.bool,
    bordered: type.bool,
    fillHeight: type.bool
  };

  static defaultProps = {
    inverse: false,
    muteText: true,
    centerText: true,
    bordered: false,
    angled: false,
    fillHeight: false
  };

  render() {
    const { bordered, angled, background, fillHeight, title, text, children, inverse, centerText, muteText } = this.props

    const classes = classnames({
      'block': true,
      'block-inverse': inverse,
      'text-center': centerText,
      'block-bordered': bordered,
      'block-angled': angled,
      'block-fill-height': fillHeight
    })

    // TODO: Look into sensible defaults
    const textMargin = 'm-b-md'

    const textClasses = classnames({
      'muted-text': muteText,
      [ textMargin ]: true
    })

    const titleEl = title ? (<h1 className="block-title">{title}</h1>) : null
    const textEl = text ? (<h4 className={ textClasses }>{text}</h4>) : null

    return (
      <div className={classes}>
        <div className="block-foreground">
          {titleEl}
          {textEl}
          {children}
        </div>
        <div className="block-background">
          {background}
        </div>
      </div>
    )
  }
}

export default Block

