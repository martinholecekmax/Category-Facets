import React, { Component } from "react"
import { getFilteredProducts, getProductsByOffer } from "../utils/filterHelpers"
import cloneDeep from "lodash/cloneDeep"
import {
  filterProductsByPrice,
  getInitialPriceRange,
} from "../utils/priceHelpers"
import { SORT_TYPES, sortProducts } from "../utils/sortHelpers"
import { getPageCount, getPaginatedProducts } from "../utils/paginationHelpers"
import { storeQuery, decodeQuery } from "../utils/queryStore"

export const CategoryManagerContext = React.createContext()

class CategoryManager extends Component {
  static Consumer = CategoryManagerContext.Consumer

  static defaultProps = {
    products: [],
    filters: [],
  }

  resetActiveFilters = () => {
    let filters = cloneDeep(this.state.initialFilters)
    let priceRange = getInitialPriceRange(this.initialState.initialProducts)
    this.runRefinement({
      ...this.initialState,
      priceRange,
      filters,
    })
  }

  isResetFiltersActive = () => {
    let activeFilter = this.state.filters.find(filter => filter.active)
    if (activeFilter) {
      return true
    }
    if (this.initialState.showOffers !== this.state.showOffers) {
      return true
    }
    if (this.initialState.sortBy !== this.state.sortBy) {
      return true
    }
    if (this.initialState.currentPage !== this.state.currentPage) {
      return true
    }
    if (this.initialState.productsPerPage !== this.state.productsPerPage) {
      return true
    }
    if (
      this.initialState.initialPriceRange[0] !== this.state.priceRange[0] ||
      this.initialState.initialPriceRange[1] !== this.state.priceRange[1]
    ) {
      return true
    }
  }

  toggleOffers = () => {
    let showOffers = !this.state.showOffers
    this.runRefinement({
      ...this.state,
      showOffers,
    })
  }

  toggleFilter = id => {
    let filters = cloneDeep(this.state.filters)
    let index = filters.findIndex(x => x.id === id)
    filters[index].active = !filters[index].active || false
    this.runRefinement({
      ...this.state,
      filters,
    })
  }

  setPriceRange = (min, max) => {
    let priceRange = [min, max]
    this.runRefinement({
      ...this.state,
      priceRange,
    })
  }

  toggleSort = sortBy => {
    this.runRefinement({
      ...this.state,
      sortBy,
    })
  }

  changePage = data => {
    let selectedPage = data.selected
    this.runRefinement({
      ...this.state,
      selectedPage,
    })
  }

  changeProductsPerPage = productsPerPage => {
    this.runRefinement({
      ...this.state,
      productsPerPage,
    })
  }

  runRefinement = ({
    priceRange,
    filters: initialFilters,
    initialProducts,
    sortBy = SORT_TYPES.SORT_BY_RELEVANCE,
    showOffers,
    productsPerPage = 3,
    selectedPage = 0,
  }) => {
    initialProducts = cloneDeep(initialProducts)
    initialFilters = cloneDeep(initialFilters)

    let productsByPrice = filterProductsByPrice(priceRange, initialProducts)

    // Filter Offers
    let productsByOffer = getProductsByOffer(productsByPrice, showOffers)

    const { products: filteredProducts, filters } = getFilteredProducts(
      initialFilters,
      productsByOffer
    )

    // Sort order
    const sortedProducts = sortProducts(filteredProducts, sortBy)

    // Pagination
    let products = getPaginatedProducts(
      sortedProducts,
      selectedPage,
      productsPerPage
    )
    let pageCount = getPageCount(sortedProducts, productsPerPage)
    let currentPage = selectedPage
    let initialState = this.initialState
    storeQuery({
      filters,
      sortBy,
      priceRange,
      showOffers,
      currentPage,
      productsPerPage,
      initialState,
      location: this.props.location,
    })

    this.setState({
      filters,
      products,
      priceRange,
      sortBy,
      showOffers,
      pageCount,
      currentPage,
      productsPerPage,
    })
  }

  initialState = {
    initialProducts: this.props.products,
    initialFilters: this.props.filters,
    showOffers: false,
    sortBy: SORT_TYPES.SORT_BY_RELEVANCE,
    products: [],
    filters: this.props.filters,
    priceRange: getInitialPriceRange(this.props.products),
    initialPriceRange: getInitialPriceRange(this.props.products),
    // initialPriceRange: [0, 0],
    pageCount: 1,
    currentPage: 0,
    productsPerPage: 2,
    toggleFilter: this.toggleFilter,
    resetActiveFilters: this.resetActiveFilters,
    setPriceRange: this.setPriceRange,
    toggleOffers: this.toggleOffers,
    toggleSort: this.toggleSort,
    changePage: this.changePage,
    changeProductsPerPage: this.changeProductsPerPage,
    isResetFiltersActive: this.isResetFiltersActive,
  }

  state = this.initialState

  componentDidMount() {
    let state = decodeQuery(this.initialState, this.props.location)
    this.runRefinement({
      ...state,
    })
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
