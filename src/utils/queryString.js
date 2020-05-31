import qs from "query-string"
import { navigate } from "gatsby"

export const setQueryStringWithoutPageReload = (qsValue, location) => {
  const { pathname } = location
  let newurl = pathname
  if (qsValue !== "") {
    newurl = newurl + "?" + qsValue
  }
  navigate(newurl)
}

export const getQueryStringValue = (
  key,
  queryString = window.location.search
) => {
  const values = qs.parse(queryString)
  return values[key]
}

export const setQueryStringValue = (
  key,
  value,
  queryString = window.location.search
) => {
  const values = qs.parse(queryString)
  const newQsValue = qs.stringify({
    ...values,
    [key]: value,
  })
  setQueryStringWithoutPageReload(`?${newQsValue}`)
}
