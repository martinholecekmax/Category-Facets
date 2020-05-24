import React from "react"
import { CategoryManagerContext } from "../components/categoryManager"

const Products = () => {
  const { products } = useContext(CategoryManagerContext)
  const productList =
    products.map((product, index) => {
      return (
        <div key={index} style={{ marginBottom: `20px` }}>
          <div>
            {product.title} - {product.sku}
          </div>
          <div>Color: {JSON.stringify(product.color, null, 2)}</div>
          <div>Width: {JSON.stringify(product.width, null, 2)}</div>
        </div>
      )
    }) || null
  return <div>{productList}</div>
}

export default Products
