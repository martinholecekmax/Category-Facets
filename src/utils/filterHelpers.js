import union from "lodash/union"

export const setProductsCount = (inputFilters, inputProducts) => {
  return updateFilters(inputFilters, inputProducts, "count", getProductsCount)
}

export const setProductsSKU = (inputFilters, inputProducts) => {
  return updateFilters(inputFilters, inputProducts, "products", getProductsSKU)
}

export const updateFilters = (inputFilters, inputProducts, property, cb) => {
  return inputFilters.reduce((filters, filter) => {
    let value = cb(inputProducts, filter)
    return filters.concat([
      {
        ...filter,
        [property]: value,
      },
    ])
  }, [])
}

export const getProductsCount = (inputProducts, filter) => {
  return inputProducts.reduce((total, product) => {
    return isFilterValueInProduct(product, filter) ? total + 1 : total
  }, 0)
}

export const getProductsSKU = (inputProducts, filter) => {
  return inputProducts.reduce((skus, product) => {
    if (isFilterValueInProduct(product, filter)) {
      return skus.concat([product.sku])
    }
    return skus
  }, [])
}

export const isFilterValueInProduct = (product, filter) => {
  const keys = Object.keys(product)
  if (keys.includes(filter.optionType)) {
    return product[filter.optionType].some(option => {
      return filter.optionValue === option.value
    })
  }
  return false
}

export const getActiveFilters = filters => {
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

export const transformActiveProducts = activeFilters => {
  return Object.keys(activeFilters).reduce((result, key) => {
    let filter = activeFilters[key]
    return [...result, filter.products]
  }, [])
}
