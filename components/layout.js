import React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"

import Header from "./Header"
import Footer from "./Footer"
import "./layout.css"

const Layout = ({ children }) => {
  

  return (
    <>
      <Header siteTitle="Wisconsin Alumni Association" />
      <div>
        <Link to="/">home menu</Link>
        <main>{children}</main>
        <Footer />
      </div>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
