// src/components/DataTable/DataTable.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { DataTable } from './DataTable'
import type { Column } from './types' // adjust if your types file is elsewhere

type User = { id: number; name: string; age: number }

const columns: Column<User>[] = [
  { key: 'name', title: 'Name', dataIndex: 'name', sortable: true },
  { key: 'age', title: 'Age', dataIndex: 'age', sortable: true },
]

const data: User[] = [
  { id: 1, name: 'Amy', age: 20 },
  { id: 2, name: 'Zed', age: 40 },
  { id: 3, name: 'Bob', age: 28 },
]

const meta: Meta<typeof DataTable<User>> = {
  title: 'Components/DataTable',
  component: DataTable<User>,
  tags: ['autodocs'],
  argTypes: {
    selectable: { control: 'boolean' },
    loading: { control: 'boolean' },
    onRowSelect: { action: 'rowSelected' },
  },
  parameters: {
    docs: { description: { component: 'Generic data table with sorting, selection, loading and empty states.' } },
  },
}
export default meta

type Story = StoryObj<typeof DataTable<User>>

export const Basic: Story = {
  args: {
    columns,
    data,
  },
}

export const SortableColumns: Story = {
  args: {
    columns,
    data,
  },
}

export const SelectableRows: Story = {
  args: {
    columns,
    data,
    selectable: true,
  },
}

export const Loading: Story = {
  args: {
    columns,
    data: [],
    loading: true,
  },
}

export const EmptyState: Story = {
  args: {
    columns,
    data: [],
  },
}
