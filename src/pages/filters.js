import React from "react"
import { CategoryManagerContext } from "../components/categoryManager"

const Filters = () => {
  const { filters, toggleFilter, resetActiveFilters } = useContext(
    CategoryManagerContext
  )
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

  const filtersList =
    Object.keys(combineFilters).map((optionKey, index) => {
      let filter = combineFilters[optionKey]
      let options = filter.options.map((option, index) => {
        return (
          <div
            key={index}
            onClick={() => toggleFilter(option.id)}
            role="presentation"
            onKeyDown={() => {}}
          >
            <span style={{ cursor: `pointer` }}>
              {option.active ? "[x] " : "[ ] "}
            </span>
            <span>{option.optionValue}</span>
            <span>[{option.count}]</span>
          </div>
        )
      })
      return (
        <div key={index} style={{ marginBottom: `20px` }}>
          <div style={{ marginBottom: `5px` }}>{optionKey.toUpperCase()}</div>
          {options}
        </div>
      )
    }) || null
  return (
    <div>
      <div>
        <button onClick={resetActiveFilters} style={{ marginBottom: `20px` }}>
          Clear Filters
        </button>
      </div>
      <div>{filtersList}</div>
    </div>
  )
}

export default Filters
