import union from "lodash/union"
import intersection from "lodash/intersection"

const setProductsSKU = (inputFilters, inputProducts) => {
  return inputFilters.reduce((filters, filter) => {
    let skus = getProductsSKU(inputProducts, filter)
    console.log("s sku filter", filter)
    return filters.concat([
      {
        ...filter,
        products: skus,
      },
    ])
  }, [])
}

const getProductsSKU = (inputProducts, filter) => {
  return inputProducts.reduce((skus, product) => {
    if (isFilterValueInProduct(product, filter)) {
      return skus.concat([product.sku])
    }
    return skus
  }, [])
}

const isFilterValueInProduct = (product, filter) => {
  const keys = Object.keys(product)
  if (keys.includes(filter.optionType)) {
    return product[filter.optionType].some(option => {
      return filter.optionValue === option.value
    })
  }
  return false
}

const getActiveFilters = filters => {
  return filters.reduce((result, filter) => {
    if (filter.active) {
      let skus = filter.products
      result[filter.optionType] = result[filter.optionType] || {}
      result[filter.optionType].products = union(
        result[filter.optionType].products,
        skus
      )
      // Added
      result[filter.optionType].optionValue =
        result[filter.optionType].optionValue || []

      result[filter.optionType].optionValue.push(filter.optionValue)
    }
    return result
  }, Object.create(null))
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

const getActiveProductsCount = (inputFilters, inputProducts) => {
  let filters = setProductsSKU(inputFilters, inputProducts)
  console.log("filters after set Skus", filters)
  let activeFilters = getActiveFilters(filters)
  console.log("activeFilters", activeFilters)
  let transformedProducts = transformActiveProducts(activeFilters)
  console.log("transformedProducts", transformedProducts)
  let activeProducts = intersection(...transformedProducts)
  console.log("activeProducts", activeProducts)
  return activeProducts.length
}

export const getActiveProducts = (inputFilters, inputProducts) => {
  let filters = setProductsSKU(inputFilters, inputProducts)
  let activeFilters = getActiveFilters(filters)
  let transformedProducts = transformActiveProducts(activeFilters)
  let activeProducts = intersection(...transformedProducts)
  let products = inputProducts.filter(product => {
    return activeProducts.includes(product.sku)
  })
  return products
}

export const getFilters = (inputFilters, inputProducts) => {
  return inputFilters.reduce((filters, filter) => {
    let active = filter.active
    if (active) {
      console.log("active", active)
      console.log("filter", filter)
      filter.count = getActiveProductsCount(inputFilters, inputProducts)
      return [...filters, filter]
    }
    filter.active = true
    filter.count = getActiveProductsCount(inputFilters, inputProducts)
    filter.active = false
    return [...filters, filter]
  }, [])
}

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
