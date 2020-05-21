import React, { Component, useContext } from "react"
import { products } from "../json/products"
import { filters } from "../json/filters"
import CategoryManager, {
  CategoryManagerContext,
} from "../components/categoryManager"

const Products = () => {
  const { products } = useContext(CategoryManagerContext)
  return (
    products.map((product, index) => {
      return <div key={index}>{product.title}</div>
    }) || null
  )
}

const Filters = () => {
  const { filters, toggleFilter } = useContext(CategoryManagerContext)
  const combineFilters = filters.reduce((combined, filterItem) => {
    let obj = {
      id: filterItem.id,
      active: filterItem.active,
      count: filterItem.count,
      optionValue: filterItem.optionValue,
    }
    combined[filterItem.optionType] = combined[filterItem.optionType] || {}
    combined[filterItem.optionType].options =
      combined[filterItem.optionType].options || []
    combined[filterItem.optionType].options.push(obj)
    combined[filterItem.optionType].name = filterItem.name
    return combined
  }, Object.create(null))

  return (
    Object.keys(combineFilters).map((optionKey, index) => {
      let filter = combineFilters[optionKey]
      let options = filter.options.map((option, index) => {
        return (
          <div key={index} onClick={() => toggleFilter(option.id)}>
            <span>{option.active ? "[x] " : "[ ] "}</span>
            <span>{option.optionValue}</span>
            <span>[{option.count}]</span>
          </div>
        )
      })
      return (
        <div key={index}>
          <div>{optionKey}</div>
          {options}
        </div>
      )
    }) || null
  )
}

class Category extends Component {
  render() {
    return (
      <CategoryManager products={products} filters={filters}>
        <div>
          <Products />
          <Filters />
        </div>
      </CategoryManager>
    )
  }
}

export default Category
