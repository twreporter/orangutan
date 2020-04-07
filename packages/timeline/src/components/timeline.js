import elementTypes from '../constants/element-types'
import defaultFontFamily from '../constants/font-family'
import mq from '@twreporter/core/lib/utils/media-query'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import Record from './record'
import sectionLevels from '../constants/section-levels'
import styled, { ThemeProvider } from 'styled-components'
// lodash
import forEach from 'lodash/forEach'
import get from 'lodash/get'
import isArray from 'lodash/isArray'
import map from 'lodash/map'
import merge from 'lodash/merge'

const _ = {
  forEach,
  get,
  isArray,
  map,
  merge,
}

const TimelineContainer = styled.article`
  &,
  * {
    box-sizing: border-box;
  }
  position: relative;
  padding-right: 13px;
  padding-bottom: 18px;
  margin-top: 20px;
  margin-bottom: 20px;
  ${mq.tabletAndBelow`
    text-align: initial;
  `}
  font-family: ${props => props.theme.fontFamily};
  color: #404040;
`

const Line = styled.div`
  border-right: 2px solid black;
  width: 13px;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
`

/**
 *
 *
 * @param {string} elementType
 * @returns {number} return the heading level of given element type.
 *                   if the element is not a heading element, it will return -1
 */
function getElementHeadingLevel(elementType) {
  return sectionLevels.findIndex(
    level => _.get(level, 'heading.type') === elementType
  )
}

/**
 *
 *
 * @param {Object} element
 * @param {number} maxHeadingTagLevel indicates the maximum number of <h?> tag used in timeline
 * @returns
 */
function renderElement(element, maxHeadingTagLevel) {
  // Render element by type
  const key = `${element.index}-element`
  const type = _.get(element, 'type')
  switch (type) {
    case 'record': {
      return (
        <Record
          key={key}
          {...element}
          as={`h${maxHeadingTagLevel + sectionLevels.length - 1}`}
        />
      )
    }
    default: {
      // if the element is a section heading element
      const headingLevel = getElementHeadingLevel(element.type)
      if (headingLevel > -1) {
        const Component = sectionLevels[headingLevel].heading.Component
        return (
          <Component
            key={key}
            as={`h${headingLevel + maxHeadingTagLevel}`}
            {...element}
          />
        )
      }
      // if no matched element type
      return null
    }
  }
}

/**
 *
 *
 * @param {[]} section a tuple as [headingElement, [...SubsectionsOrElements]]
 * @param {string} emphasizedLevel the level name emphasized
 * @param {number} maxHeadingTagLevel indicates the maximum number of <h?> tag used in timeline
 * @returns
 */
function renderSection(section, emphasizedLevel, maxHeadingTagLevel) {
  const [headingElement, subsectionsOrElements] = section
  const level = getElementHeadingLevel(headingElement.type)
  const SectionContainer = sectionLevels[level].Container
  const SubContentWrapper = sectionLevels[level].SubContentWrapper
  const emphasized = sectionLevels[level].name === emphasizedLevel
  return (
    <SectionContainer key={`${headingElement.type}-${headingElement.index}`}>
      {renderElement(headingElement, maxHeadingTagLevel)}
      <SubContentWrapper emphasized={emphasized}>
        {_.map(subsectionsOrElements, subsectionOrElement => {
          if (_.isArray(subsectionOrElement)) {
            const subsection = subsectionOrElement
            return renderSection(
              subsection,
              emphasizedLevel,
              maxHeadingTagLevel
            )
          }
          const element = subsectionOrElement
          return renderElement(element, maxHeadingTagLevel)
        })}
      </SubContentWrapper>
    </SectionContainer>
  )
}

const defaultTheme = {
  fontFamily: defaultFontFamily,
  [elementTypes.record]: {
    color: '#404040',
    strongColor: '#262626',
    linkColor: '#a67a44',
    linkUnderlineColor: '#d8d8d8',
  },
  [elementTypes.unitFlag]: {
    color: '#fff',
    background: '#000',
  },
  [elementTypes.groupFlag]: {
    color: '#fff',
    background: '#a67a44',
  },
}

export default class Timeline extends PureComponent {
  static propTypes = {
    maxHeadingTagLevel: PropTypes.number,
    emphasizedLevel: PropTypes.oneOf(_.map(sectionLevels, level => level.name)),
    data: PropTypes.array,
    theme: PropTypes.shape({
      fontFamily: PropTypes.string,
      [elementTypes.record]: PropTypes.shape({
        color: PropTypes.string,
        strongColor: PropTypes.string,
        linkColor: PropTypes.string,
        linkUnderlineColor: PropTypes.string,
      }),
      [elementTypes.unitFlag]: PropTypes.shape({
        color: PropTypes.string,
        background: PropTypes.string,
      }),
      [elementTypes.groupFlag]: PropTypes.shape({
        color: PropTypes.string,
        background: PropTypes.string,
      }),
    }),
  }
  static defaultProps = {
    maxHeadingTagLevel: 3,
    data: [],
    emphasizedLevel: sectionLevels[1].name,
    theme: {},
  }
  render() {
    const { data, emphasizedLevel, maxHeadingTagLevel, theme } = this.props
    return (
      <ThemeProvider theme={_.merge({}, defaultTheme, theme)}>
        <TimelineContainer>
          <Line />
          {_.map(data, section =>
            renderSection(section, emphasizedLevel, maxHeadingTagLevel)
          )}
        </TimelineContainer>
      </ThemeProvider>
    )
  }
}
