import union from "lodash/union"
import intersection from "lodash/intersection"

/**
 * Combine individual filters by the optionType as a key
 * Used for render
 *
 * @param {Array} filters Array of filter objects
 */
export const combineFiltersByOptionType = filters => {
  return filters.reduce((combined, filterItem) => {
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
}

const getActiveFilters = filters => {
  let activeFilters = {}
  for (let index = 0; index < filters.length; index++) {
    const filter = filters[index]
    if (filter.active) {
      activeFilters[filter.optionType] = activeFilters[filter.optionType] || {}
      activeFilters[filter.optionType].products = union(
        activeFilters[filter.optionType].products,
        filter.products
      )
    }
  }
  return activeFilters
}

export const getFiltersAndProducts = (inputFilters, inputProducts) => {
  setProductsSKU(inputFilters, inputProducts)
  let activeFilters = getActiveFilters(inputFilters)
  let activeTransformedProducts = transformActiveProducts(activeFilters)
  let activeProducts = intersection(...activeTransformedProducts)
  let isAnyActive = false

  for (let index = 0; index < inputFilters.length; index++) {
    let filter = inputFilters[index]
    if (filter.active) {
      isAnyActive = true
      let actFilters = getActiveFilters(inputFilters)
      let actTransformedProducts = transformActiveProducts(actFilters)
      let intersect = intersection(...actTransformedProducts, filter.products)
      filter.count = intersect.length
    } else {
      filter.active = true
      let actFilters = getActiveFilters(inputFilters)
      let actTransformedProducts = transformActiveProducts(actFilters)
      let intersect = intersection(...actTransformedProducts, filter.products)
      filter.active = false
      filter.count = intersect.length
    }
  }

  let products = inputProducts.filter(product => {
    return activeProducts.includes(product.sku)
  })

  if (!isAnyActive && products.length === 0) {
    products = inputProducts
  }

  return { products, filters: inputFilters }
}

const setProductsSKU = (inputFilters, inputProducts) => {
  for (let index = 0; index < inputFilters.length; index++) {
    let filter = inputFilters[index]
    filter.products = getProductsSKU(inputProducts, filter)
  }
}

const getProductsSKU = (inputProducts, filter) => {
  let skus = []
  for (let index = 0; index < inputProducts.length; index++) {
    const product = inputProducts[index]
    if (isFilterValueInProduct(product, filter)) {
      if (product.sku) {
        skus.push(product.sku)
      }
    }
  }
  return skus
}

const isFilterValueInProduct = (product, filter) => {
  const keys = Object.keys(product)
  if (keys.includes(filter.optionType) && product[filter.optionType]) {
    return product[filter.optionType].some(option => {
      return filter.optionValue === option.value
    })
  }
  return false
}

/**
 * Flatten products from activeFilters object
 * @param {Object} activeFilters Active filters object
 */
const transformActiveProducts = activeFilters => {
  return Object.keys(activeFilters).reduce((result, key) => {
    let filter = activeFilters[key]
    return [...result, filter.products]
  }, [])
}
