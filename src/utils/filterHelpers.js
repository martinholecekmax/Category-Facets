import union from "lodash/union"
import intersection from "lodash/intersection"
import cloneDeep from "lodash/cloneDeep"

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

export const getFilteredProducts = (inputFilters, inputProducts) => {
  let products = []
  let filters = []
  if (isAnyActive(inputFilters)) {
    products = getActiveProducts(inputFilters, inputProducts)
  } else {
    products = cloneDeep(inputProducts)
  }
  filters = getFilters(inputFilters, inputProducts)
  return { products, filters }
}

export const getProductsByOffer = (inputProducts, showOffers) => {
  if (!showOffers) return inputProducts
  let productsByOffer = inputProducts.filter(product => {
    return product.offer
  })
  return productsByOffer.length > 0 ? productsByOffer : inputProducts
}

const setProductsSKU = (inputFilters, inputProducts) => {
  return inputFilters.reduce((filters, filter) => {
    let skus = getProductsSKU(inputProducts, filter)
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
      if (product.sku) {
        return skus.concat([product.sku])
      }
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

const getActiveProductsCount = (inputFilters, inputProducts, filter) => {
  let filters = setProductsSKU(inputFilters, inputProducts)
  let activeFilters = getActiveFilters(filters)
  let transformedProducts = transformActiveProducts(activeFilters)
  let activeProducts = intersection(...transformedProducts)
  let counter = 0
  let found = filters.find(fil => {
    return fil.optionValue === filter.optionValue
  })
  if (found) {
    let intersect = intersection(activeProducts, found.products)
    counter = intersect.length
  }
  return counter
}

const getActiveProducts = (inputFilters, inputProducts) => {
  let filters = setProductsSKU(inputFilters, inputProducts)
  let activeFilters = getActiveFilters(filters)
  let transformedProducts = transformActiveProducts(activeFilters)
  let activeProducts = intersection(...transformedProducts)
  let products = inputProducts.filter(product => {
    return activeProducts.includes(product.sku)
  })
  return products
}

const getFilters = (inputFilters, inputProducts) => {
  return inputFilters.reduce((filters, filter) => {
    let active = filter.active
    if (active) {
      filter.count = getActiveProductsCount(inputFilters, inputProducts, filter)
      return [...filters, filter]
    }
    filter.active = true
    filter.count = getActiveProductsCount(inputFilters, inputProducts, filter)
    filter.active = false
    return [...filters, filter]
  }, [])
}

const isAnyActive = filters => {
  return filters.some(filter => filter.active)
}
