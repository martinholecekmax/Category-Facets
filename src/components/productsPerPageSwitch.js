import React, { useContext } from "react"
import { CategoryManagerContext } from "./categoryManager/categoryManager"

const ProductsPerPageSwitch = () => {
  const { changeProductsPerPage, productsPerPage } = useContext(
    CategoryManagerContext
  )
  return (
    <div style={{ marginBottom: `10px` }}>
      <div>Products Per Page {productsPerPage}</div>
      <button onClick={() => changeProductsPerPage(2)}>2</button>
      <button onClick={() => changeProductsPerPage(4)}>4</button>
      <button onClick={() => changeProductsPerPage(6)}>6</button>
    </div>
  )
}

export default ProductsPerPageSwitch
