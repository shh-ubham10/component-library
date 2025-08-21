import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DataTable } from './DataTable'
import type { Column } from './types'

interface User {
  id: number
  name: string
  age: number
}

const columns: Column<User>[] = [
  { key: 'name', title: 'Name', dataIndex: 'name', sortable: true },
  { key: 'age', title: 'Age', dataIndex: 'age', sortable: true }
]

const users: User[] = [
  { id: 1, name: 'Zed', age: 40 },
  { id: 2, name: 'Amy', age: 20 }
]

describe('DataTable', () => {
  it('renders headers and rows', () => {
    render(<DataTable<User> data={users} columns={columns} />)
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Amy')).toBeInTheDocument()
  })

  it('sorts when clicking sortable header', async () => {
    render(<DataTable<User> data={users} columns={columns} />)

    const nameHeader = screen.getByRole('columnheader', { name: /name/i })
    let rows = screen.getAllByRole('row')

    // initial order
    expect(rows[1]).toHaveTextContent('Zed')
    expect(rows[2]).toHaveTextContent('Amy')

    // click to sort
    await userEvent.click(nameHeader)

    rows = screen.getAllByRole('row')
    expect(rows[1]).toHaveTextContent('Amy') // sorted ascending
    expect(rows[2]).toHaveTextContent('Zed')
  })

  it('shows loading state', () => {
    render(<DataTable<User> data={[]} columns={columns} loading />)
    expect(screen.getByText(/Loading/i)).toBeInTheDocument()
  })

  it('shows empty state', () => {
    render(<DataTable<User> data={[]} columns={columns} />)
    expect(screen.getByText(/No data/i)).toBeInTheDocument()
  })

  it('handles row selection', async () => {
    const handler = vi.fn()
    render(<DataTable<User> data={users} columns={columns} selectable onRowSelect={handler} />)
    const checkbox = screen.getAllByRole('checkbox')[1] // first row
    await userEvent.click(checkbox)
    expect(handler).toHaveBeenCalled()
  })
})
