import React from 'react'
import { IndexLink, Link } from 'react-router'
import './Navbar.scss'

export const Navbar = () => (
  <div className='navbar navbar-shengnian expanded'>
    <div className='dropdown'>
      <IndexLink to='/' className='logo' activeClassName='active'>
        <b>盛</b><i className='fa fa-home' /><span className='title'>首页</span>
      </IndexLink>

      <Link to='/counter' activeClassName='active'>
        <i className='fa fa-th' /><span className='title'>指南</span>
      </Link>

      <Link to='/counter' activeClassName='active'>
        <i className='fa fa-th' /><span className='title'>发现</span>
      </Link>

      <Link to='/counter' activeClassName='active'>
        <i className='fa fa-th' /><span className='title'>实验室</span>
      </Link>

      <Link className='ad-selector' to='/counter'>
        <i className='fa fa-mobile' /><span className='title'>下载手机应用</span>
      </Link>
    </div>

    <div className='nav-user'>
      <Link className='signin' to='/sign_in'>
        <i className='fa fa-sign-in' /><span className='title'>登录</span>
      </Link>
    </div>
  </div>
)

export default Navbar
