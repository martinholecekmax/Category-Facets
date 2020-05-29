import React, { useContext } from "react"
import { CategoryManagerContext } from "./categoryManager"
import { SORT_TYPES } from "../utils/sortHelpers"

const SortSwitch = () => {
  const { toggleSort, sortBy } = useContext(CategoryManagerContext)
  return (
    <div style={{ marginBottom: `10px` }}>
      <div>SortedBy: {sortBy}</div>
      <button
        onClick={() => toggleSort(SORT_TYPES.SORT_BY_RELEVANCE)}
        //style={{ marginBottom: `20px` }}
      >
        Relevance
      </button>

      <button
        onClick={() => toggleSort(SORT_TYPES.SORT_BY_NEWEST)}
        //style={{ marginBottom: `20px` }}
      >
        Newest
      </button>

      <button
        onClick={() => toggleSort(SORT_TYPES.SORT_BY_OLDEST)}
        //style={{ marginBottom: `20px` }}
      >
        Oldest
      </button>

      <button
        onClick={() => toggleSort(SORT_TYPES.SORT_BY_PRICE_ASC)}
        //style={{ marginBottom: `20px` }}
      >
        Sort By Price (ASC)
      </button>

      <button
        onClick={() => toggleSort(SORT_TYPES.SORT_BY_PRICE_DESC)}
        //style={{ marginBottom: `20px` }}
      >
        Sort By Price (DESC)
      </button>

      <button
        onClick={() => toggleSort(SORT_TYPES.SORT_BY_TITLE_ASC)}
        //style={{ marginBottom: `20px` }}
      >
        Title (ASC)
      </button>

      <button
        onClick={() => toggleSort(SORT_TYPES.SORT_BY_TITLE_DESC)}
        //style={{ marginBottom: `20px` }}
      >
        Title (DESC)
      </button>
    </div>
  )
}

export default SortSwitch
