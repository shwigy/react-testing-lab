import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import AccountContainer from '../../components/AccountContainer'

function mockFetchForAdd() {
  global.fetch = vi.fn((url, options) => {
    if (options && options.method === "POST") {
      const newTransaction = JSON.parse(options.body)
      return Promise.resolve({
        json: () => Promise.resolve({ ...newTransaction, id: "99" }),
        ok: true,
        status: 201
      })
    }
    // initial GET on mount
    return Promise.resolve({
      json: () => Promise.resolve([]),
      ok: true,
      status: 200
    })
  })
}

describe('Add Transactions', () => {
  it('adds a new transaction to the frontend after submitting the form', async () => {
    mockFetchForAdd()
    const user = userEvent.setup()

    const { container } = render(<AccountContainer />)

    await screen.findAllByRole('columnheader')

    const dateInput = container.querySelector('input[name="date"]')
    await user.type(dateInput, '2024-01-01')
    await user.type(screen.getByPlaceholderText('Description'), 'Coffee')
    await user.type(screen.getByPlaceholderText('Category'), 'Food')
    await user.type(screen.getByPlaceholderText('Amount'), '4.50')

    await user.click(screen.getByRole('button', { name: /add transaction/i }))

    expect(await screen.findByText('Coffee')).toBeInTheDocument()
  })

  it('calls fetch with a POST request when the form is submitted', async () => {
    mockFetchForAdd()
    const user = userEvent.setup()

    const { container } = render(<AccountContainer />)

    await screen.findAllByRole('columnheader')

    const dateInput = container.querySelector('input[name="date"]')
    await user.type(dateInput, '2024-01-01')
    await user.type(screen.getByPlaceholderText('Description'), 'Coffee')
    await user.type(screen.getByPlaceholderText('Category'), 'Food')
    await user.type(screen.getByPlaceholderText('Amount'), '4.50')

    await user.click(screen.getByRole('button', { name: /add transaction/i }))

    await screen.findByText('Coffee')

    const postCall = global.fetch.mock.calls.find(
      (call) => call[1] && call[1].method === "POST"
    )
    expect(postCall).toBeTruthy()
    expect(postCall[0]).toBe('http://localhost:6001/transactions')
    const sentBody = JSON.parse(postCall[1].body)
    expect(sentBody.description).toBe('Coffee')
  })
})
