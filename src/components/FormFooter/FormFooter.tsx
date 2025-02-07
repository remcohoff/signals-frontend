// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { Column, Row, themeColor } from '@remcohoff/asc-ui'
import type { FunctionComponent, MouseEventHandler } from 'react'
import styled, { css } from 'styled-components'

import Button from 'components/Button'
import { useContext } from 'react'
import MapContext from 'containers/MapContext/context'

export const FORM_FOOTER_HEIGHT = 66

export const FooterWrapper = styled.footer<{ inline?: boolean }>`
  background: ${themeColor('tint', 'level1')};
  height: ${FORM_FOOTER_HEIGHT}px;
  padding: 10px 0;
  max-width: 1400px;

  ${({ inline }) =>
    !inline &&
    css`
      border-top: 2px solid ${themeColor('tint', 'level3')};
      position: fixed;
      bottom: 0;
      width: 100%;
      left: 50%;
      transform: translate(-50%);
    `}
`

export const ButtonContainer = styled(Column)`
  justify-content: flex-start;
`

export const SubmitButton = styled(Button).attrs({
  color: 'secondary',
})`
  margin-right: 15px;
`

export const ResetButton = styled(Button)`
  background-color: ${themeColor('tint', 'level1')};
  margin-right: auto;
`

export const CancelButton = styled(Button).attrs({
  color: 'bright',
})`
  background-color: ${themeColor('tint', 'level4')};
`

export interface FormFooterProps {
  cancelBtnLabel?: string
  className?: string
  /** When true, the component is positioned relative without borders or padding */
  inline?: boolean
  onCancel?: () => void
  onResetForm?: () => void
  onSubmitForm?: MouseEventHandler
  canSubmitForm?: boolean
  resetBtnLabel?: string
  submitBtnLabel?: string
}

const FormFooter: FunctionComponent<FormFooterProps> = ({
  cancelBtnLabel,
  className,
  inline,
  onCancel,
  onResetForm,
  onSubmitForm,
  resetBtnLabel,
  submitBtnLabel,
}) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const {
    state: { loading },
  } = useContext(MapContext)
  return (
    <FooterWrapper
      data-testid="formFooter"
      className={className}
      inline={inline}
    >
      <Row hasMargin={!inline} className="formFooterRow">
        <ButtonContainer span={12}>
          {resetBtnLabel && (
            <ResetButton
              data-testid="resetBtn"
              onClick={onResetForm}
              type="reset"
            >
              {resetBtnLabel}
            </ResetButton>
          )}

          {submitBtnLabel && (
            <SubmitButton
              data-testid="submitBtn"
              name="submit_button"
              disabled={loading}
              onClick={onSubmitForm}
              type="submit"
            >
              {submitBtnLabel}
            </SubmitButton>
          )}

          {cancelBtnLabel && (
            <CancelButton
              data-testid="cancelBtn"
              onClick={onCancel}
              type="button"
            >
              {cancelBtnLabel}
            </CancelButton>
          )}
        </ButtonContainer>
      </Row>
    </FooterWrapper>
  )
}

export default FormFooter
