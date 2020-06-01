import React, { useContext } from "react"
import { CategoryManagerContext } from "./categoryManager"

const ClearFiltersButton = () => {
  const { resetActiveFilters, isResetFiltersActive } = useContext(
    CategoryManagerContext
  )
  return (
    <div>
      {isResetFiltersActive() ? (
        <button
          className={"btn btn-primary"}
          onClick={resetActiveFilters}
          style={{ marginBottom: `20px` }}
        >
          Clear Filters
        </button>
      ) : (
        "Not Active"
      )}
    </div>
  )
}

export default ClearFiltersButton
