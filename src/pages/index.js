import React, { Component, useContext } from "react"
import initialProducts from "../json/products"
import initialFilters from "../json/filters"

import Filters from "./filters"
import Products from "./products"

import CategoryManager from "../components/categoryManager"

class Index extends Component {
  render() {
    return (
      <CategoryManager products={initialProducts} filters={initialFilters}>
        <div
          style={{
            display: `flex`,
            margin: `50px auto`,
            justifyContent: `space-between`,
            width: `500px`,
          }}
        >
          <Filters />
          <Products />
        </div>
      </CategoryManager>
    )
  }
}

export default Index
