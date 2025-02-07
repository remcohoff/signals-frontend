// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2022 Gemeente Amsterdam
import { render, fireEvent, act, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import configureStore from 'configureStore'
import { mocked } from 'jest-mock'
import { Provider } from 'react-redux'
import * as reactRedux from 'react-redux'
import * as reactRouterDom from 'react-router-dom'
import configuration from 'shared/services/configuration/configuration'
import { filesUpload } from 'shared/services/files-upload/files-upload'
import * as incidentContainerActions from 'signals/incident/containers/IncidentContainer/actions'
import { history, withAppContext } from 'test/utils'

import KtoForm from '.'

const onSubmit = jest.fn()

const options = [
  { key: 'a', value: 'Foo' },
  { key: 'b', value: 'Bar' },
  { key: 'c', value: 'Baz' },
  { key: 'anders', value: 'Here be dragons' },
]

const value = 'Bar baz foo'
let fileInput, file

const mockedUseParams = mocked(reactRouterDom.useParams)
jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
}))

jest.mock('shared/services/configuration/configuration')
jest.mock('shared/services/files-upload/files-upload')

jest.spyOn(incidentContainerActions, 'updateIncident')

describe('signals/incident/containers/KtoContainer/components/KtoForm', () => {
  beforeEach(() => {
    onSubmit.mockReset()
    jest.useFakeTimers()

    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({
      satisfactionIndication: 'ja',
    }))

    configuration.featureFlags.enableMultipleKtoQuestions = true
  })

  afterEach(() => {
    configuration.__reset()
  })

  it('renders correctly', () => {
    configuration.featureFlags.reporterMailHandledNegativeContactEnabled = true
    mockedUseParams.mockImplementation(() => ({
      satisfactionIndication: 'nee',
    }))

    const { container, getByTestId, rerender } = render(
      withAppContext(
        <KtoForm
          dataFeedbackForms={{ signal_id: 123 }}
          isSatisfied
          onSubmit={onSubmit}
          options={options}
        />
      )
    )

    expect(container.querySelectorAll('input[type="checkbox"]')).toHaveLength(
      options.length + 1
    )

    expect(getByTestId('ktoTextExtra')).toBeInTheDocument()
    expect(getByTestId('fileInput')).toBeInTheDocument()
    expect(getByTestId('ktoAllowsContact')).toBeInTheDocument()
    expect(getByTestId('ktoSubmit')).toBeInTheDocument()

    expect(screen.queryByTestId('allowsContact')).toHaveTextContent(
      'Nee, bel of e-mail mij niet meer over deze melding of over mijn reactie.'
    )

    mockedUseParams.mockImplementation(() => ({
      satisfactionIndication: 'ja',
    }))

    rerender(
      withAppContext(
        <KtoForm
          dataFeedbackForms={{ signal_id: 123 }}
          isSatisfied
          onSubmit={onSubmit}
          options={options}
        />
      )
    )

    expect(screen.queryByTestId('allowsContact')).toBeFalsy()

    configuration.featureFlags.reporterMailHandledNegativeContactEnabled = false

    rerender(
      withAppContext(
        <KtoForm
          dataFeedbackForms={{ signal_id: 123 }}
          isSatisfied
          onSubmit={onSubmit}
          options={options}
        />
      )
    )

    expect(screen.queryByTestId('allowsContact')).not.toBeInTheDocument()

    mockedUseParams.mockImplementation(() => ({ satisfactionIndication: 'ja' }))

    rerender(
      withAppContext(
        <KtoForm
          dataFeedbackForms={{ signal_id: 123 }}
          isSatisfied
          onSubmit={onSubmit}
          options={options}
        />
      )
    )

    expect(screen.queryByTestId('allowsContact')).not.toBeInTheDocument()
  })

  it('renders the correct title', () => {
    mockedUseParams.mockImplementation(() => ({ satisfactionIndication: 'ja' }))

    const { getByText, unmount, rerender } = render(
      withAppContext(
        <KtoForm
          dataFeedbackForms={{ signal_id: 123 }}
          isSatisfied
          onSubmit={onSubmit}
          options={options}
        />
      )
    )

    expect(getByText('Waarom bent u tevreden?')).toBeInTheDocument()

    unmount()

    mockedUseParams.mockImplementation(() => ({
      satisfactionIndication: 'nee',
    }))

    rerender(
      withAppContext(
        <KtoForm
          dataFeedbackForms={{ signal_id: 123 }}
          isSatisfied={false}
          onSubmit={onSubmit}
          options={options}
        />
      )
    )

    expect(screen.queryByText('Waarom bent u ontevreden?')).toBeInTheDocument()
  })

  it('requires one of the options to be selected', async () => {
    const { queryByText, getByTestId } = render(
      withAppContext(
        <KtoForm
          dataFeedbackForms={{ signal_id: 123 }}
          isSatisfied
          onSubmit={onSubmit}
          options={options}
        />
      )
    )

    expect(queryByText('Dit veld is verplicht')).not.toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()

    act(() => {
      fireEvent.click(getByTestId('ktoSubmit'))
    })

    expect(await screen.findByText('Dit veld is verplicht')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('requires text area to contain content when last option is selected', async () => {
    const { queryByTestId, getByTestId } = render(
      withAppContext(
        <KtoForm
          dataFeedbackForms={{ signal_id: 123 }}
          isSatisfied
          onSubmit={onSubmit}
          options={options}
        />
      )
    )

    const lastOption = getByTestId(
      `checkbox-input_${[...options].reverse()[0].key}`
    )
    expect(queryByTestId('ktoText')).not.toBeInTheDocument()

    act(() => {
      fireEvent.click(lastOption)
    })

    expect(await screen.findByTestId('ktoText')).toBeInTheDocument()
    expect(screen.queryByText('Dit veld is verplicht')).not.toBeInTheDocument()

    act(() => {
      fireEvent.click(getByTestId('ktoSubmit'))
    })

    expect(await screen.findByText('Dit veld is verplicht')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('should clear error message', async () => {
    const { queryByTestId, getByTestId } = render(
      withAppContext(
        <KtoForm
          dataFeedbackForms={{ signal_id: 123 }}
          isSatisfied
          onSubmit={onSubmit}
          options={options}
        />
      )
    )

    const lastOption = getByTestId(
      `checkbox-input_${[...options].reverse()[0].key}`
    )
    expect(queryByTestId('ktoText')).not.toBeInTheDocument()

    act(() => {
      fireEvent.click(lastOption)
    })

    expect(await screen.findByTestId('ktoText')).toBeInTheDocument()
    expect(screen.queryByText('Dit veld is verplicht')).not.toBeInTheDocument()

    act(() => {
      fireEvent.click(getByTestId('ktoSubmit'))
    })

    expect(await screen.findByText('Dit veld is verplicht')).toBeInTheDocument()

    const value = 'Qux Baz'

    const ktoText = await screen.findByTestId('ktoText')

    act(() => {
      fireEvent.change(ktoText, { target: { value } })
    })

    expect(
      await screen.findByText('Dit veld is verplicht')
    ).not.toBeInTheDocument()
  })
  it('should handle submit for all but last option', async () => {
    mockedUseParams.mockImplementation(() => ({
      satisfactionIndication: 'nee',
    }))

    const { getByTestId } = render(
      withAppContext(
        <KtoForm
          dataFeedbackForms={{ signal_id: 123 }}
          onSubmit={onSubmit}
          options={options}
          contactAllowed={true}
        />
      )
    )

    const firstOption = getByTestId(`checkbox-input_${[...options][0].key}`)

    act(() => {
      userEvent.click(firstOption)
    })

    expect(firstOption).toBeChecked()
    expect(screen.queryByTestId('ktoText')).not.toBeInTheDocument()
    expect(screen.queryByText('Dit veld is verplicht')).not.toBeInTheDocument()

    expect(onSubmit).not.toHaveBeenCalled()

    act(() => {
      userEvent.click(getByTestId('ktoSubmit'))
    })

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          is_satisfied: false,
          text_list: [options[0].value],
        })
      )
    })
  })

  it('should handle submit for last option', async () => {
    const { getByTestId } = render(
      withAppContext(
        <KtoForm
          dataFeedbackForms={{ signal_id: 123 }}
          isSatisfied
          onSubmit={onSubmit}
          options={options}
          contactAllowed={true}
        />
      )
    )

    const lastOption = getByTestId(
      `checkbox-input_${[...options].reverse()[0].key}`
    )

    act(() => {
      fireEvent.click(lastOption)
    })

    const value = 'Qux Baz'
    const ktoText = await screen.findByTestId('ktoText')
    act(() => {
      fireEvent.change(ktoText, { target: { value } })
    })

    act(() => {
      fireEvent.click(getByTestId('ktoSubmit'))
    })

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          text_list: [options.slice(-1)[0].value, value],
        })
      )
    })
  })

  it('should contain the correct values in the submit payload', async () => {
    configuration.featureFlags.reporterMailHandledNegativeContactEnabled = true
    mockedUseParams.mockImplementation(() => ({
      satisfactionIndication: 'nee',
    }))

    const setContactAllowed = jest.fn()

    const { getByTestId } = render(
      withAppContext(
        <KtoForm
          dataFeedbackForms={{ signal_id: 123 }}
          onSubmit={onSubmit}
          options={options}
          setContactAllowed={setContactAllowed}
        />
      )
    )

    fillForm()

    act(() => {
      fireEvent.click(getByTestId('ktoAllowsContact'))
    })

    expect(setContactAllowed).toHaveBeenCalled()

    act(() => {
      fireEvent.click(getByTestId('ktoSubmit'))
    })

    // Be default allowscontact equals true but after clicking
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        allows_contact: false,
        is_satisfied: false,
        text_extra: value,
        text_list: [options[1].value],
      })
    })
  })
  it('should have the correct values in the submit payload of the old flow', async () => {
    configuration.featureFlags.reporterMailHandledNegativeContactEnabled = false
    mockedUseParams.mockImplementation(() => ({
      satisfactionIndication: 'nee',
    }))
    const setContactAllowed = jest.fn()

    const { getByTestId, rerender } = render(
      withAppContext(
        <KtoForm
          dataFeedbackForms={{ signal_id: 123 }}
          onSubmit={onSubmit}
          options={options}
          setContactAllowed={setContactAllowed}
          contactAllowed={true}
        />
      )
    )

    fillForm()

    act(() => {
      fireEvent.click(getByTestId('ktoSubmit'))
    })

    // By default allow_contact equals false is in the old flow
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        allows_contact: true,
        is_satisfied: false,
        text_extra: value,
        text_list: [options[1].value],
      })
    })

    configuration.featureFlags.reporterMailHandledNegativeContactEnabled = true

    mockedUseParams.mockImplementation(() => ({
      satisfactionIndication: 'nee',
    }))

    rerender(
      withAppContext(
        <KtoForm
          dataFeedbackForms={{ signal_id: 123 }}
          onSubmit={onSubmit}
          options={options}
          setContactAllowed={setContactAllowed}
        />
      )
    )

    fillForm()

    act(() => {
      fireEvent.click(getByTestId('ktoAllowsContact'))
      fireEvent.click(getByTestId('ktoSubmit'))
    })

    expect(setContactAllowed).toHaveBeenCalled()
    // By default allow_contact equals false is in the old flow
    expect(onSubmit).toHaveBeenCalledWith({
      allows_contact: true,
      is_satisfied: false,
      text_extra: value,
      text_list: [options[1].value],
    })
  })

  it('should upload a picture', async () => {
    mockedUseParams.mockImplementation(() => ({
      satisfactionIndication: 'nee',
    }))

    render(
      withAppContext(
        <Provider store={configureStore({}, history)}>
          <KtoForm
            onSubmit={onSubmit}
            options={options}
            dataFeedbackForms={{ signal_id: 123 }}
          />
        </Provider>
      )
    )

    uploadFile()
    fillForm()

    expect(incidentContainerActions.updateIncident).toBeCalledWith({
      images: [file],
      images_previews: ['https://url-from-data/image.jpg'],
    })
  })

  it('should call filesUpload when submitting', async () => {
    jest.spyOn(reactRedux, 'useSelector').mockReturnValue({
      incident: {
        images: [file],
        images_previews: ['https://url-from-data/image.jpg'],
      },
    })

    render(
      withAppContext(
        <Provider store={configureStore({}, history)}>
          <KtoForm
            onSubmit={onSubmit}
            options={options}
            dataFeedbackForms={{ signal_id: 123 }}
            contactAllowed={true}
          />
        </Provider>
      )
    )
    fillForm()

    act(() => {
      fireEvent.click(screen.getByTestId('ktoSubmit'))
    })

    await waitFor(() => {
      expect(filesUpload).toBeCalledWith({
        files: [file],
        url: 'http://localhost:8000/signals/v1/public/signals/123/attachments/',
      })
    })
  })
})

function uploadFile() {
  fileInput = screen.getByTestId('fileInputUpload')
  file = new File(['hello'], 'hello.png', { type: 'image/png' })
  Object.defineProperty(file, 'size', { value: 1024 * 1024 + 1 }) // 1 MB
  userEvent.upload(fileInput, file)
}

function fillForm() {
  const secondOption = screen.getByTestId(`checkbox-input_${options[1].key}`)

  act(() => {
    fireEvent.click(secondOption)
    fireEvent.change(screen.getByTestId('ktoTextExtra'), { target: { value } })
  })
}
