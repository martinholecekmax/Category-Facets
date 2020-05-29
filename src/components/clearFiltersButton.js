import React, { useContext } from "react"
import { CategoryManagerContext } from "./categoryManager"

const ClearFiltersButton = () => {
  const { resetActiveFilters } = useContext(CategoryManagerContext)
  return (
    <div>
      <button onClick={resetActiveFilters} style={{ marginBottom: `20px` }}>
        Clear Filters
      </button>
    </div>
  )
}

export default ClearFiltersButton
