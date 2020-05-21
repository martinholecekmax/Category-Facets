// import { createHistoryInstance, decodeObjString, encodeObjUrl } from "./history"
import AccessorManager from "./AccessorManager"

// const get = require("lodash/get")

class CategoryManager {
  constructor(products, filters) {
    // this.options = {
    //   useHistory: true,
    //   createHistory: createHistoryInstance,
    //   getLocation: () => typeof window !== "undefined" && window.location,
    // }
    this.result = []
    this.accessors = new AccessorManager()
    this.accessors.createAccessorsFromFilters(filters)
  }

  getAccessors() {
    return this.accessors.getAccessors()
  }

  // setupListeners() {
  //   this.initialLoading = !this.results
  //   if (this.options.useHistory) {
  //     this.unlistenHistory()
  //     this.history = this.options.createHistory()
  //     this.listenToHistory()
  //   }
  //   this.runInitialSearch()
  // }

  // runInitialSearch() {
  //   console.log("init search")
  //   var q = this.searchFromUrlQuery(this.options.getLocation().search)
  //   console.log("q", q)
  // }

  // unlistenHistory() {
  //   if (this.options.useHistory && this._unlistenHistory) {
  //     this._unlistenHistory()
  //   }
  // }

  // listenToHistory() {
  //   this._unlistenHistory = this.history.listen((location, action) => {
  //     if (action === "POP") {
  //       // this._searchWhenCompleted(location)
  //       this.searchFromUrlQuery(location.search)
  //       console.log("location", location)
  //     }
  //   })
  // }

  // performSearch(obj, replaceState = false) {
  //   // TODO: Update filters, displayed data

  //   if (this.options.useHistory) {
  //     const historyMethod = replaceState
  //       ? this.history.replace
  //       : this.history.push

  //     const url = this.options.getLocation().pathname + "?" + encodeObjUrl(obj)
  //     historyMethod.call(this.history, url)
  //   }
  // }

  // searchFromUrlQuery(query) {
  //   query = decodeObjString(query.replace(/^\?/, ""))
  //   console.log("query", query)
  //   return query
  //   // this.accessors.setState(query)
  //   // return this._search()
  // }

  // getHits() {
  //   return get(this.results, ["hits", "hits"], [])
  // }

  // getHitsCount() {
  //   const hitsCount = get(this.results, ["hits", "total"], 0)
  //   if (typeof hitsCount === "object") {
  //     return hitsCount.value
  //   }
  //   return hitsCount
  // }

  // buildSearchUrl(params = {}) {
  //   // const params = defaults(extraParams, this.state || this.accessors.getState())
  //   return this.options.getLocation().pathname + "?" + encodeObjUrl(params)
  // }
}

export default CategoryManager
