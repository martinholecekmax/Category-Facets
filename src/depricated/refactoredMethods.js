const updateFilterCountAndProducts = (inputFilters, inputProducts) => {
  let filters = cloneDeep(inputFilters)
  each(filters, filter => {
    let filteredProducts = inputProducts.filter(product => {
      let keys = Object.keys(product)
      if (keys.includes(filter.optionType)) {
        let isValue = false
        each(product[filter.optionType], option => {
          if (filter.optionValue === option.value) {
            isValue = true
          }
        })
        return isValue
      }
    })
    filter.count = filteredProducts.length
    filter.products = filteredProducts.reduce((acc, product) => {
      return acc.concat([product.sku])
    }, [])
  })
  return filters
}
