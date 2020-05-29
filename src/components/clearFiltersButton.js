import React, { useContext } from "react"
import { CategoryManagerContext } from "./categoryManager"

const ClearFiltersButton = () => {
  const { resetActiveFilters } = useContext(CategoryManagerContext)
  return (
    <div>
      <button
        className={"btn btn-primary"}
        onClick={resetActiveFilters}
        style={{ marginBottom: `20px` }}
      >
        Clear Filters
      </button>
    </div>
  )
}

export default ClearFiltersButton
