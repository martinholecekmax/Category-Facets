import React, { Component } from "react"
import { products as initialProducts } from "../json/products"
import { filters as initialFilters } from "../json/filters"

import Filters from "../components/filters"
import Products from "../components/products"

import CategoryManager from "../components/categoryManager"
import PriceRange from "../components/priceRange"
import ClearFiltersButton from "../components/clearFiltersButton"
import SortSwitch from "../components/sortSwitch"
import ToggleOffersButton from "../components/toggleOffersButton"

class Index extends Component {
  render() {
    return (
      <CategoryManager products={initialProducts} filters={initialFilters}>
        <div
          style={{
            display: `flex`,
            margin: `50px auto`,
            justifyContent: `space-between`,
            width: `900px`,
            fontSize: `18px`,
          }}
        >
          <div style={{ minWidth: `150px` }}>
            <ClearFiltersButton />
            <ToggleOffersButton />
            <PriceRange />
            <Filters />
          </div>
          <div>
            <SortSwitch />
            <Products />
          </div>
        </div>
      </CategoryManager>
    )
  }
}

export default Index
