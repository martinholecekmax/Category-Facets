import React, { Component } from "react"
import { getFilteredProducts, getProductsByOffer } from "../utils/filterHelpers"
import cloneDeep from "lodash/cloneDeep"
import {
  filterProductsByPrice,
  getInitialPriceRange,
} from "../utils/priceHelpers"
import { SORT_TYPES, sortProducts } from "../utils/sortHelpers"
import { getPageCount, getPaginatedProducts } from "../utils/paginationHelpers"

export const CategoryManagerContext = React.createContext()

class CategoryManager extends Component {
  static Consumer = CategoryManagerContext.Consumer

  static defaultProps = {
    products: [],
    filters: [],
  }

  resetActiveFilters = () => {
    let priceRange = getInitialPriceRange(this.initialState.initialProducts)
    this.runRefinement({
      ...this.initialState,
      priceRange,
    })
  }

  toggleOffers = () => {
    let showOffers = !this.state.showOffers
    let initialFilters = cloneDeep(this.state.filters)
    this.runRefinement({
      ...this.state,
      initialFilters,
      showOffers,
    })
  }

  toggleFilter = id => {
    let initialFilters = cloneDeep(this.state.filters)
    let index = initialFilters.findIndex(x => x.id === id)
    initialFilters[index].active = !initialFilters[index].active || false
    this.runRefinement({
      ...this.state,
      initialFilters,
    })
  }

  setPriceRange = (min, max) => {
    let initialFilters = cloneDeep(this.state.filters)
    let priceRange = [min, max]
    this.runRefinement({
      ...this.state,
      priceRange,
      initialFilters,
    })
  }

  toggleSort = sortBy => {
    let initialFilters = cloneDeep(this.state.filters)
    this.runRefinement({
      ...this.state,
      initialFilters,
      sortBy,
    })
  }

  changePage = data => {
    let selectedPage = data.selected
    let initialFilters = cloneDeep(this.state.filters)
    this.runRefinement({
      ...this.state,
      initialFilters,
      selectedPage,
    })
  }

  changeProductsPerPage = productsPerPage => {
    let initialFilters = cloneDeep(this.state.filters)
    this.runRefinement({
      ...this.state,
      initialFilters,
      productsPerPage,
    })
  }

  runRefinement = ({
    priceRange,
    initialFilters,
    initialProducts,
    sortBy = SORT_TYPES.SORT_BY_RELEVANCE,
    showOffers,
    productsPerPage = 3,
    selectedPage = 0,
  }) => {
    initialProducts = cloneDeep(initialProducts)
    initialFilters = cloneDeep(initialFilters)

    const [min, max] = priceRange
    let productsByPrice = filterProductsByPrice(min, max, initialProducts)

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
    // let products = []
    // let pageCount = 1
    // if (sortedProducts.length > 0) {
    //   let pageOffset = selectedPage * productsPerPage
    //   pageCount = Math.ceil(sortedProducts.length / productsPerPage)
    //   products = sortedProducts.slice(pageOffset, pageOffset + productsPerPage)
    // } else {
    //   products = sortedProducts
    // }

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
    filters: [],
    priceRange: [0, 0],
    initialPriceRange: [0, 0],
    pageCount: 1,
    currentPage: 0,
    productsPerPage: 1,
    toggleFilter: this.toggleFilter,
    resetActiveFilters: this.resetActiveFilters,
    setPriceRange: this.setPriceRange,
    toggleOffers: this.toggleOffers,
    toggleSort: this.toggleSort,
    changePage: this.changePage,
    changeProductsPerPage: this.changeProductsPerPage,
  }

  state = this.initialState

  componentDidMount() {
    console.log("props", this.props)

    let priceRange = getInitialPriceRange(this.state.initialProducts)
    this.runRefinement({
      ...this.state,
      priceRange,
    })
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
