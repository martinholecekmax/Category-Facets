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
    let initialFilters = cloneDeep(this.state.initialFilters)
    let initialProducts = cloneDeep(this.state.initialProducts)
    let priceRange = getInitialPriceRange(initialProducts)
    let sortBy = SORT_TYPES.SORT_BY_RELEVANCE
    let showOffers = false
    this.runRefinement({
      priceRange,
      initialFilters,
      initialProducts,
      sortBy,
      showOffers,
    })
  }

  toggleOffers = () => {
    let showOffers = !this.state.showOffers
    let priceRange = this.state.priceRange
    let initialFilters = cloneDeep(this.state.filters)
    let initialProducts = cloneDeep(this.state.initialProducts)
    let sortBy = this.state.sortBy
    this.runRefinement({
      priceRange,
      initialFilters,
      initialProducts,
      sortBy,
      showOffers,
    })
  }

  toggleFilter = id => {
    let initialFilters = cloneDeep(this.state.filters)
    let initialProducts = cloneDeep(this.state.initialProducts)
    let priceRange = this.state.priceRange
    let index = initialFilters.findIndex(x => x.id === id)
    initialFilters[index].active = !initialFilters[index].active || false
    let sortBy = this.state.sortBy
    let showOffers = this.state.showOffers
    this.runRefinement({
      priceRange,
      initialFilters,
      initialProducts,
      sortBy,
      showOffers,
    })
  }

  setPriceRange = (min, max) => {
    let initialFilters = cloneDeep(this.state.filters)
    let initialProducts = cloneDeep(this.state.initialProducts)
    let priceRange = [min, max]
    let sortBy = this.state.sortBy
    let showOffers = this.state.showOffers
    this.runRefinement({
      priceRange,
      initialFilters,
      initialProducts,
      sortBy,
      showOffers,
    })
  }

  toggleSort = sortBy => {
    if (SORT_TYPES[sortBy]) {
      let initialFilters = cloneDeep(this.state.filters)
      let initialProducts = cloneDeep(this.state.initialProducts)
      let priceRange = this.state.priceRange
      let showOffers = this.state.showOffers
      this.runRefinement({
        priceRange,
        initialFilters,
        initialProducts,
        sortBy,
        showOffers,
      })
    }
  }

  changePage = data => {
    console.log("data", data)
    let currentPage = data.selected
    let pageOffset = currentPage * this.state.productsPerPage

    let initialFilters = cloneDeep(this.state.filters)
    let initialProducts = cloneDeep(this.state.initialProducts)
    let { priceRange, showOffers, sortBy, productsPerPage } = this.state
    this.runRefinement({
      priceRange,
      initialFilters,
      initialProducts,
      sortBy,
      showOffers,
      productsPerPage,
      pageOffset,
      currentPage,
    })
  }

  changeProductsPerPage = productsPerPage => {
    this.setState({ productsPerPage })
  }

  runRefinement = ({
    priceRange,
    initialFilters,
    initialProducts,
    sortBy = SORT_TYPES.SORT_BY_RELEVANCE,
    showOffers,
    productsPerPage = this.state.productsPerPage,
    pageOffset = 0,
    currentPage = 0,
  }) => {
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
    /// Products per page (View [combo: 20, 28, 36, 48] per page)
    let products = []
    let pageCount = 1
    if (sortedProducts.length > 0) {
      pageCount = Math.ceil(sortedProducts.length / this.state.productsPerPage)
      products = sortedProducts.slice(pageOffset, pageOffset + productsPerPage)
    } else {
      products = sortedProducts
    }

    this.setState({
      filters,
      products,
      priceRange,
      sortBy,
      showOffers,
      pageCount,
      currentPage,
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

    toggleFilter: this.toggleFilter,
    resetActiveFilters: this.resetActiveFilters,
    setPriceRange: this.setPriceRange,
    toggleOffers: this.toggleOffers,
    toggleSort: this.toggleSort,

    pageCount: 1,
    currentPage: 0,
    productsPerPage: 3,

    changePage: this.changePage,
  }

  state = this.initialState

  componentDidMount() {
    let initialProducts = cloneDeep(this.state.initialProducts)
    let initialFilters = cloneDeep(this.state.initialFilters)
    let priceRange = getInitialPriceRange(initialProducts)
    let showOffers = false
    let sortBy = this.state.sortBy
    this.runRefinement({
      priceRange,
      initialFilters,
      initialProducts,
      showOffers,
      sortBy,
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
