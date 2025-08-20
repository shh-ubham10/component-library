import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { DataTable } from './DataTable';
import type { Column } from './types';

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

const columns: Column<User>[] = [
  { key: 'name', title: 'Name', dataIndex: 'name', sortable: true },
  { key: 'email', title: 'Email', dataIndex: 'email' },
  { key: 'age', title: 'Age', dataIndex: 'age', sortable: true },
];

const sample: User[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com', age: 28 },
  { id: 2, name: 'Bob', email: 'bob@example.com', age: 35 },
  { id: 3, name: 'Charlie', email: 'charlie@example.com', age: 22 },
];

const meta: Meta<typeof DataTable<User>> = {
  title: 'Components/DataTable',
  component: DataTable,
  args: { data: sample, columns, selectable: true },
};
export default meta;

type Story = StoryObj<typeof DataTable<User>>;

export const Default: Story = {};

export const Loading: Story = {
  args: { data: [], loading: true },
};

export const Empty: Story = {
  args: { data: [], emptyText: 'No data' },
};

export const SingleSelect: Story = {
  render: (args) => {
    const [sel, setSel] = useState<User[]>([]);
    return (
      <div>
        <DataTable<User> {...args} selectionMode="single" onRowSelect={setSel} />
        <p className="mt-3 text-sm">Selected: {sel[0]?.name ?? 'None'}</p>
      </div>
    );
  },
};
