import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import AccountContainer from '../../components/AccountContainer'

const mockTransactions = [
  { id: "1", date: "2019-12-01", description: "Paycheck from Bob's Burgers", category: "Income", amount: 1000 },
  { id: "2", date: "2019-12-02", description: "Groceries at Whole Foods", category: "Food", amount: -50.25 },
  { id: "3", date: "2019-12-03", description: "Sunglasses, Urban Outfitters", category: "Fashion", amount: -24.99 },
]

describe('Search and Sort', () => {
  it('updates the page when a change event is triggered on the search input', async () => {
    global.setFetchResponse(mockTransactions)
    const user = userEvent.setup()

    render(<AccountContainer />)

    await screen.findByText("Paycheck from Bob's Burgers")

    const searchInput = screen.getByPlaceholderText('Search your Recent Transactions')
    await user.type(searchInput, 'Groceries')

    expect(screen.getByText('Groceries at Whole Foods')).toBeInTheDocument()
    expect(screen.queryByText("Paycheck from Bob's Burgers")).not.toBeInTheDocument()
    expect(screen.queryByText('Sunglasses, Urban Outfitters')).not.toBeInTheDocument()
  })

  it('filters transactions by search term, case-insensitively', async () => {
    global.setFetchResponse(mockTransactions)
    const user = userEvent.setup()

    render(<AccountContainer />)

    await screen.findByText("Paycheck from Bob's Burgers")

    const searchInput = screen.getByPlaceholderText('Search your Recent Transactions')
    await user.type(searchInput, 'sunglasses')

    expect(screen.getByText('Sunglasses, Urban Outfitters')).toBeInTheDocument()
    expect(screen.queryByText('Groceries at Whole Foods')).not.toBeInTheDocument()
  })

  it('sorts transactions by category when a sort option is selected', async () => {
    global.setFetchResponse(mockTransactions)
    const user = userEvent.setup()

    render(<AccountContainer />)

    await screen.findByText("Paycheck from Bob's Burgers")

    const sortSelect = screen.getByRole('combobox')
    await user.selectOptions(sortSelect, 'category')

    const rows = screen.getAllByRole('row').slice(1) // drop header row
    const categoriesInOrder = rows.map((row) => row.children[2].textContent)

    expect(categoriesInOrder).toEqual(['Fashion', 'Food', 'Income'])
  })
})
