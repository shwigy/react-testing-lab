import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import AccountContainer from '../../components/AccountContainer'

const mockTransactions = [
  { id: "1", date: "2019-12-01", description: "Paycheck", category: "Income", amount: 1000 },
  { id: "2", date: "2019-12-02", description: "Groceries", category: "Food", amount: -50.25 },
]

describe('Display Transactions', () => {
  it('displays the transactions returned by the API on startup', async () => {
    global.setFetchResponse(mockTransactions)

    render(<AccountContainer />)

    expect(await screen.findByText('Paycheck')).toBeInTheDocument()
    expect(await screen.findByText('Groceries')).toBeInTheDocument()
  })

  it('displays a row for every transaction fetched', async () => {
    global.setFetchResponse(mockTransactions)

    render(<AccountContainer />)

    await screen.findByText('Groceries')

    const rows = screen.getAllByRole('row')
    // header row + one row per transaction
    expect(rows.length).toBe(mockTransactions.length + 1)
  })
})
