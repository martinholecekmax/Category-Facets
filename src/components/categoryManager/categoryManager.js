import React, { Component } from "react"
import cloneDeep from "lodash/cloneDeep"
import { getFilteredProducts } from "./core/refinementFilters"
import { filterProductsByPrice, getInitialPriceRange } from "./core/priceFilter"
import { SORT_TYPES, sortProducts } from "./core/sortReducer"
import { getPageCount, getPaginatedProducts } from "./core/pagination"
import { storeQuery, decodeQuery } from "./core/queryStore"
import { getProductsByOffer } from "./core/offersFilter"
import { isAnyFilterActive } from "./core/validation"

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
    return isAnyFilterActive(this.initialState, this.state)
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
