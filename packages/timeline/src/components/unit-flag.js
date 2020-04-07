import { sourceHanSansTC as fontWeight } from '@twreporter/core/lib/constants/font-weight'
import elementTypes from '../constants/element-types'
import predefinedPropTypes from '../constants/prop-types'
import React, { PureComponent } from 'react'
import styled from 'styled-components'

const UnitFlagContainer = styled.div`
  margin-top: 6px;
  margin-bottom: 6px;
  position: relative;
  max-width: 55%;
`

const Flag = styled.h3`
  /* h3 reset start */
  margin: 0;
  border: 0;
  outline: 0;
  font-size: 100%;
  vertical-align: baseline;
  /* h3 reset end */
  background: ${props => props.theme[elementTypes.unitFlag].background};
  color: ${props => props.theme[elementTypes.unitFlag].color};
  max-width: 95%;
  margin-left: 13px;
  display: inline-block;
  padding: 2px 12px 1px 5px;
  line-height: 1.28;
  display: inline-flex;
`

const Label = styled.div`
  font-size: 16px;
  font-weight: ${fontWeight.normal};
  letter-spacing: 0.9px;
  flex: 0 0 auto;
`

const Title = styled.div`
  font-size: 16px;
  font-weight: ${fontWeight.regular};
  margin-left: 0.4em;
  flex: 0 1 auto;
`

export default class UnitFlag extends PureComponent {
  static propTypes = predefinedPropTypes.unitFlag

  render() {
    const { label, title, as } = this.props
    return (
      <UnitFlagContainer>
        <Flag as={as}>
          {label ? <Label>{label}</Label> : null}
          {title ? <Title>{title}</Title> : null}
        </Flag>
      </UnitFlagContainer>
    )
  }
}
