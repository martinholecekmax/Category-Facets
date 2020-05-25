import React, { Component } from "react"
import { products as initialProducts } from "../json/products"
import { filters as initialFilters } from "../json/filters"

import Filters from "../components/filters"
import Products from "../components/products"

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
            width: `600px`,
            fontSize: `18px`,
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
