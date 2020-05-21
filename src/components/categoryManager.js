import React, { Component } from "react"
import cloneDeep from "lodash/cloneDeep"
import each from "lodash/each"
import union from "lodash/union"
import intersection from "lodash/intersection"

export const CategoryManagerContext = React.createContext()

class CategoryManager extends Component {
  static Consumer = CategoryManagerContext.Consumer

  static defaultProps = {
    initialProducts: [],
    initialFilters: [],
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
  }

  state = this.initialState

  setFilters = (inputFilters, inputProducts) => {
    let filters = cloneDeep(inputFilters)

    // Set product count
    each(filters, filter => {
      let filteredProducts = inputProducts.filter(product => {
        let keys = Object.keys(product)
        if (keys.includes(filter.optionType)) {
          let isValue = false
          each(product[filter.optionType], option => {
            if (filter.optionValue === option.value) {
              isValue = true
            }
          })
          return isValue
        }
      })
      filter.count = filteredProducts.length
      filter.products = filteredProducts.reduce((acc, product) => {
        return acc.concat([product.sku])
      }, [])
    })
    console.log("filters", filters)

    // Get active Filters
    let activeFilters = filters.reduce((result, filter) => {
      if (filter.active) {
        let skus = filter.products
        result[filter.optionType] = result[filter.optionType] || {}
        result[filter.optionType].products = union(
          result[filter.optionType].products,
          skus
        )
      }
      return result
    }, Object.create(null))
    console.log("activeFilters", activeFilters)

    let combineArrays = Object.keys(activeFilters).reduce((result, key) => {
      let filter = activeFilters[key]
      console.log("comb", filter)

      return [...result, filter.products]
    }, [])

    console.log("combineArrays", combineArrays)
    let activeProducts = intersection(...combineArrays)
    console.log("activeProducts", activeProducts)

    // // Get active products
    // let activeProducts = filters.reduce((result, filter) => {
    //   if (filter.active) {
    //     let skus = filter.products.filter(product => !result.includes(product))
    //     console.log("skus", skus)
    //     return [...result, ...skus]
    //   }
    //   return result
    // }, [])

    let products = inputProducts.filter(product => {
      return activeProducts.includes(product.sku)
    })
    console.log("products", products)
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
