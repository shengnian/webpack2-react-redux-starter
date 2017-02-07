import React from 'react'

export const SignIn = (props) => (
  <div style={{ margin: '0 auto' }} >
    <h2>SignIn: {props.sign_in}</h2>
    <button className='btn btn-default' onClick={props.increment}>
      Increment
    </button>
    {' '}
    <button className='btn btn-default' onClick={props.doubleAsync}>
      Double (Async)
    </button>
  </div>
)

SignIn.propTypes = {
  sign_in     : React.PropTypes.number.isRequired,
  doubleAsync : React.PropTypes.func.isRequired,
  increment   : React.PropTypes.func.isRequired
}

export default SignIn
