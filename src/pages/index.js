import React, { Component } from "react"
import { products } from "../json/products"
import { filters } from "../json/filters"
import CategoryManager from "../core/categoryManager"
import { navigate } from "gatsby"

// const history = createHistoryInstance()

class IndexPage extends Component {
  constructor(props) {
    super(props)
    this.categoryManager = new CategoryManager(products, filters)
  }

  componentDidMount() {
    console.log("cdm")
    // this.categoryManager.setupListeners()
    // this.categoryManager.searchFromUrlQuery()
    navigate("/category")
  }

  render() {
    return (
      <div>
        {/* <button
          onClick={() =>
            this.categoryManager.performSearch({ test: "tea test" })
          }
        >
          Tea
        </button>
        <button
          onClick={() =>
            this.categoryManager.performSearch({ test: "water", test2: "corn" })
          }
        >
          Water
        </button> */}
      </div>
    )
  }
}

export default IndexPage

// const IndexPage = props => {
//   const [value, onSetValue] = useQueryString("filter")
//   // const historyMethod = false ? history.replace : history.push
//   // const url = history.location.pathname + "?" + encodeObjUrl(products)
//   // console.log("historyMethod", historyMethod)

//   // const decode = decodeObjString(history.location.search.replace(/^\?/, ""))
//   // console.log("decode", decode)
//   return (
//     <div className="App">
//       <h1>{value}</h1>
//       <button onClick={() => onSetValue("water")}>Water</button>
//       <button onClick={() => onSetValue("coffe")}>Coffe</button>
//       <button onClick={() => onSetValue("tea")}>Tea</button>
//       <button onClick={() => historyMethod.call(history, url)}>Hello</button>
//     </div>
//   )
// }
// export default IndexPage
