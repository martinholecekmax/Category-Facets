import { v4 as uuidv4 } from "uuid"

export default filters = [
  {
    id: uuidv4(),
    name: "Width",
    optionType: "width",
    optionValue: "140mm",
    active: false,
    count: 0,
    products: [],
  },
  {
    id: uuidv4(),
    name: "Width",
    optionType: "width",
    optionValue: "150mm",
    active: false,
    count: 0,
    products: [],
  },
  {
    id: uuidv4(),
    name: "Width",
    optionType: "width",
    optionValue: "125mm",
    active: false,
    count: 0,
    products: [],
  },
  {
    id: uuidv4(),
    name: "Color",
    optionType: "color",
    optionValue: "Red",
    active: false,
    count: 0,
    products: [],
  },
  {
    id: uuidv4(),
    name: "Color",
    optionType: "color",
    optionValue: "Green",
    active: false,
    count: 0,
    products: [],
  },
  {
    id: uuidv4(),
    name: "Color",
    optionType: "color",
    optionValue: "Blue",
    active: false,
    count: 0,
    products: [],
  },
]
// export const filters = [
//   { name: "Width", optionType: "width", options: ["140mm", "150mm", "125mm"] },
//   {
//     name: "Height",
//     optionType: "height",
//     options: ["1400mm", "1500mm", "1250mm"],
//   },
//   { name: "Color", optionType: "color", options: ["Red", "Green", "Blue"] },
// ]

/**
 * Output
 {
  width: {
    name: "Width",
    options: [
      {
        option: "140m",
        active: true,
        count: 3
      },
      {
        option: "150m",
        active: true,
        count: 3
      }
    }
  }
}
 */
export const combineFilters = filters.reduce((combined, filterItem) => {
  let obj = { active: false, count: 0, option: filterItem.optionValue }
  combined[filterItem.optionType] = combined[filterItem.optionType] || {}
  combined[filterItem.optionType].options =
    combined[filterItem.optionType].options || []
  combined[filterItem.optionType].options.push(obj)
  combined[filterItem.optionType].name = filterItem.name
  return combined
}, Object.create(null))

/*
{
  name: "Width",
  optionType: "width",
  optionValues: [
    {
      optionValue: "140m",
      active: true,
      count: 3
    },
    {
      optionValue: "150m",
      active: true,
      count: 3
    }
  }
}

 */
