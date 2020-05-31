import React, { useContext } from "react"
import { Slider } from "@material-ui/core"
import { CategoryManagerContext } from "./categoryManager"

import styles from "./priceRange.module.css"

const PriceRange = () => {
  const { setPriceRange, priceRange, initialPriceRange } = useContext(
    CategoryManagerContext
  )

  const handleChangeCommitted = () => {}

  const handleChange = (event, priceRange) => {
    let min = priceRange[0] || 0
    let max = priceRange[1] || 0
    setPriceRange(min, max)
  }

  return (
    <div>
      Price Range
      <div>
        <div>From: {priceRange[0]}</div>
        <div>To: {priceRange[1]}</div>
      </div>
      <Slider
        onChangeCommitted={handleChangeCommitted}
        value={priceRange}
        min={initialPriceRange[0]}
        max={initialPriceRange[1]}
        onChange={handleChange}
        valueLabelDisplay="off"
        aria-labelledby="range-slider"
        // getAriaValueText={this.valuetext}
        // valueLabelFormat={this.valuetext}
        classes={{
          root: styles.root,
          track: styles.track,
          thumb: styles.thumb,
          valueLabel: styles.valueLabel,
        }}
      />
    </div>
  )
}

export default PriceRange
