import { render, screen } from '@testing-library/react'
import type { FC } from 'react'

import { withAppContext } from 'test/utils'

import WithHeading from './'

const TextInput: FC<any> = (props) => (
  <span data-testid="textInput" {...props} />
)

const name = 'Foo bar'
const wrappedComponent = TextInput
const heading = 'Hic sunt dracones'

describe('WithHeading', () => {
  it('renders a wrapped component', () => {
    const meta = {
      name,
      heading,
      wrappedComponent,
    }

    render(withAppContext(<WithHeading meta={meta} />))

    expect(screen.getByText(heading)).toBeInTheDocument()
    expect(screen.getByTestId('textInput')).toBeInTheDocument()
  })

  it('will not render a component when not all the meta data is provided', () => {
    const { rerender } = render(
      withAppContext(
        <WithHeading
          meta={{
            name,
            wrappedComponent,
          }}
        />
      )
    )

    expect(screen.queryByTestId('textInput')).not.toBeInTheDocument()

    rerender(
      withAppContext(
        <WithHeading
          meta={{
            name,
            heading,
          }}
        />
      )
    )

    expect(screen.queryByText(heading)).not.toBeInTheDocument()
    expect(screen.queryByTestId('textInput')).not.toBeInTheDocument()
  })
})
