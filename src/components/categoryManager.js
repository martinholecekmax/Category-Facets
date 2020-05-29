import React, { Component } from "react"
import { getFilteredProducts, getProductsByOffer } from "../utils/filterHelpers"
import cloneDeep from "lodash/cloneDeep"
import {
  filterProductsByPrice,
  getInitialPriceRange,
} from "../utils/priceHelpers"
import { SORT_TYPES, sortProducts } from "../utils/sortHelpers"

export const CategoryManagerContext = React.createContext()

class CategoryManager extends Component {
  static Consumer = CategoryManagerContext.Consumer

  static defaultProps = {
    initialProducts: [],
    initialFilters: [],
  }

  resetActiveFilters = () => {
    let filters = cloneDeep(this.state.initialFilters)
    let products = cloneDeep(this.state.initialProducts)
    let priceRange = getInitialPriceRange(products)
    let sortBy = SORT_TYPES.SORT_BY_RELEVANCE
    let showOffers = false
    this.runRefinement(priceRange, filters, products, sortBy, showOffers)
  }

  toggleOffers = () => {
    let showOffers = !this.state.showOffers
    let priceRange = this.state.priceRange
    let filters = cloneDeep(this.state.filters)
    let products = cloneDeep(this.state.initialProducts)
    let sortBy = this.state.sortBy
    this.runRefinement(priceRange, filters, products, sortBy, showOffers)
  }

  toggleFilter = id => {
    let filters = cloneDeep(this.state.filters)
    let products = cloneDeep(this.state.initialProducts)
    let priceRange = this.state.priceRange
    let index = filters.findIndex(x => x.id === id)
    filters[index].active = !filters[index].active || false
    let sortBy = this.state.sortBy
    let showOffers = this.state.showOffers
    this.runRefinement(priceRange, filters, products, sortBy, showOffers)
  }

  setPriceRange = (min, max) => {
    let filters = cloneDeep(this.state.filters)
    let products = cloneDeep(this.state.initialProducts)
    let priceRange = [min, max]
    let sortBy = this.state.sortBy
    let showOffers = this.state.showOffers
    this.runRefinement(priceRange, filters, products, sortBy, showOffers)
  }

  toggleSort = sortBy => {
    if (SORT_TYPES[sortBy]) {
      let filters = cloneDeep(this.state.filters)
      let products = cloneDeep(this.state.initialProducts)
      let priceRange = this.state.priceRange
      let showOffers = this.state.showOffers
      this.runRefinement(priceRange, filters, products, sortBy, showOffers)
    }
  }

  runRefinement = (
    priceRange,
    initialFilters,
    initialProducts,
    sortBy = SORT_TYPES.SORT_BY_RELEVANCE,
    showOffers
  ) => {
    const [min, max] = priceRange
    let productsByPrice = filterProductsByPrice(min, max, initialProducts)

    // Filter Offers
    let productsByOffer = getProductsByOffer(productsByPrice, showOffers)

    const { products: filteredProducts, filters } = getFilteredProducts(
      initialFilters,
      productsByOffer
    )

    // Sort order
    const products = sortProducts(filteredProducts, sortBy)

    // Pagination
    /// Products per page (View [combo: 20, 28, 36, 48] per page)

    this.setState({ filters, products, priceRange, sortBy, showOffers })
  }

  initialState = {
    initialProducts: this.props.products,
    initialFilters: this.props.filters,
    showOffers: false,
    sortBy: SORT_TYPES.SORT_BY_RELEVANCE,
    products: [],
    filters: [],
    priceRange: [0, 0],
    initialPriceRange: [0, 0],
    toggleFilter: this.toggleFilter,
    resetActiveFilters: this.resetActiveFilters,
    setPriceRange: this.setPriceRange,
    toggleOffers: this.toggleOffers,
    toggleSort: this.toggleSort,
  }

  state = this.initialState

  componentDidMount() {
    let products = cloneDeep(this.state.initialProducts)
    let filters = cloneDeep(this.state.initialFilters)
    let priceRange = getInitialPriceRange(products)
    let showOffers = false
    this.runRefinement(priceRange, filters, products, showOffers)
    this.setState({ initialPriceRange: priceRange })
  }

  render() {
    const ui =
      this.props.children === "function"
        ? this.props.children(this.state)
        : this.props.children
    return (
      <CategoryManagerContext.Provider value={this.state}>
        {ui}
      </CategoryManagerContext.Provider>
    )
  }
}

export default CategoryManager
