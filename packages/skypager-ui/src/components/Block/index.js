import React, { Component, PropTypes as type } from 'react'

import classnames from 'classnames'

/**
 * The Block Component is part of the Bootstrap Professional Marketing theme.
 */
export class Block extends Component {
  static displayName = 'Block';

  static propTypes = {
    /** use the inverse color style for this block */
    inverse: type.bool,

    /** body text underneath the block title */
    text: type.string,

    /** main title text in the block */
    title: type.string,

    /** use a muted text style for the body text in the block */
    muteText: type.bool,

    /** center text within the block */
    centerText: type.bool,

    /** a react component to use as an interactive background for this block */
    background: type.element,

    /** additional content will be displayed under the block title in the block foreground */
    children: type.node,

    /** use the angled style variation of this block */
    angled: type.bool,

    /** use the bordered style variation of this block */
    bordered: type.bool,

    /** when enabled this block will occupy the full height of the parent container */
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
    const textMargin = 'm-t-md m-x-md'

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
