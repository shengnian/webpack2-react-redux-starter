import React from 'react'
import Header from '../../components/Header'
// import './CoreLayout.scss'
// import '../../styles/core.scss'

export const CoreLayout = ({ children }) => (
  <div className='out-wrapper'>
    <Header />
    <div className='row-fluid'>
      {children}
    </div>
  </div>
)

CoreLayout.propTypes = {
  children : React.PropTypes.element.isRequired
}

export default CoreLayout
