import React from 'react'
import ReactDOM from 'react-dom'
import ScrollHorizontal from './scroll-horizontal'
import get from 'lodash/get'
import { packageName } from '../constants'

const _ = {
  get,
}

const namespace = '__twreporterEmbeddedData'

let id

const scripts = document.getElementsByTagName('script')

for (let s of scripts) {
  if (s.getAttribute('data-name') === packageName) {
    const dataID = s.getAttribute('data-id')
    const node = document.getElementById(dataID)
    if (node && node.getAttribute('data-status') === 'tbRendered') {
      id = dataID
    }
  }
}

const config = _.get(window, [`${namespace}`, `${packageName}`, `${id}`])
const data = _.get(config, 'data')
const lazyload = _.get(config, 'lazyload', false)
const container = document.getElementById(id)

ReactDOM.render(
  <ScrollHorizontal imgSrc={data} lazyload={lazyload} />,
  container
)

container.removeAttribute('data-status')
