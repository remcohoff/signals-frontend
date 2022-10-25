// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Rotterdam
import styled from 'styled-components'

type Props = {
  streetName: string
  streetNumber: string | number
  suffix?: string | null | undefined
  etage?: string | number | undefined
}

const NoWrap = styled.span`
  white-space: nowrap;
`

const AddressDisplay: React.FC<Props> = ({
  streetName,
  streetNumber,
  suffix,
  etage,
}) => (
  <>
    {streetName}{' '}
    <NoWrap>
      {`${streetNumber}${suffix ? suffix : ''}${
        etage ? `-${etage}` : ''
      }`.trim()}
    </NoWrap>
  </>
)

export default AddressDisplay
