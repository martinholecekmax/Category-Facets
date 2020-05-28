import React, { Component } from "react"
import cloneDeep from "lodash/cloneDeep"
import { getFilters, getActiveProducts } from "../utils/filterHelpers"

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
    this.setFilters(filters, products)
  }

  toggleFilter = id => {
    let filters = cloneDeep(this.state.filters)
    let products = cloneDeep(this.state.initialProducts)
    let index = filters.findIndex(x => x.id === id)
    filters[index].active = !filters[index].active || false
    this.setFilters(filters, products)
  }

  initialState = {
    initialProducts: this.props.products,
    initialFilters: this.props.filters,
    products: [],
    filters: [],
    toggleFilter: this.toggleFilter,
    resetActiveFilters: this.resetActiveFilters,
  }

  state = this.initialState

  setFilters = (inputFilters, inputProducts) => {
    let products = getActiveProducts(inputFilters, inputProducts)
    let filters = getFilters(inputFilters, inputProducts)
    this.setState({ products, filters })
  }

  componentDidMount() {
    let products = cloneDeep(this.state.initialProducts)
    let filters = cloneDeep(this.state.initialFilters)
    this.setState({ products, filters }, () => {
      let { initialFilters, initialProducts } = this.state
      this.setFilters(initialFilters, initialProducts)
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
