import React, { useContext } from "react"
import { CategoryManagerContext } from "./categoryManager"
import { combineFiltersByOptionType } from "../utils/filterHelpers"

const Filters = () => {
  const { filters, toggleFilter, resetActiveFilters } = useContext(
    CategoryManagerContext
  )
  const combineFilters = combineFiltersByOptionType(filters)

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
            <span>{`${option.optionValue}   (${option.count})`}</span>
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
