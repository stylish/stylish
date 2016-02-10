import React from 'react'

export class SidebarLayout extends React.Component {
  render () {
    let [sidebar, ...content] = this.props.children

    return (
      <div className='container'>
        <div className='row'>
          <div className='col-sm-3 sidebar'>
            {sidebar}
          </div>
          <div className='col-sm-9 content'>
            {content}
          </div>
        </div>
      </div>
    )
  }
}

SidebarLayout.propTypes = {
  children: React.PropTypes.node
}

export default SidebarLayout
