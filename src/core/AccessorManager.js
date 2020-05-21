import Accessor from "./Accessor"
import filter from "lodash/filter"
import each from "lodash/each"
import find from "lodash/find"

class AccessorManager {
  constructor() {
    this.accessors = []
  }

  createAccessorsFromFilters(filters) {
    each(filters, filter => {
      const { name, optionType, optionValue } = filter
      this.accessors.push(new Accessor({ name, optionType, optionValue }))
    })
    this.printAccessors()
  }

  add(accessor) {
    this.accessors.push(accessor)
  }

  getAccessors() {
    return this.accessors
  }

  getActiveAccessors() {
    return filter(this.accessors, { active: true })
  }

  setActiveAccessorsFromQuery(query) {
    each(this.accessors, accessor => {
      if (query) {
      }
    })
  }

  setActiveAccessor(id, active = true) {
    let accessor = find(this.accessors, accessor => {
      return accessor.uuid === id
    })
    if (accessor) {
      accessor.setAtive(active)
    }
  }

  printAccessors() {
    each(this.accessors, accessor => accessor.printJSON())
  }
}

export default AccessorManager
