import { v4 as uuidv4 } from "uuid"

class Accessor {
  constructor({ optionType, optionValue, name }) {
    this.uuid = uuidv4()
    this.active = false
    this.name = name
    this.optionType = optionType
    this.optionValue = optionValue
    this.productCount = 0
  }

  setActive(active) {
    this.active = active
  }

  incrementProductCount() {
    this.productCount += 1
  }

  decrementProductCount() {
    this.productCount -= 1
  }

  resetProductCount() {
    this.productCount = 0
  }

  printJSON() {
    const accessor = {
      uuid: this.uuid,
      active: this.active,
      name: this.name,
      optionType: this.optionType,
      optionValue: this.optionValue,
      productCount: this.productCount,
    }
    console.log(JSON.stringify(accessor, null, 2))
  }
}

export default Accessor
