import { useState } from 'react'
import { InputField } from './components/InputField/InputField'
import { DataTable } from './components/DataTable/DataTable'
import './index.css'

export default function App() {
  const [email, setEmail] = useState('')

  // ✅ Sample data for DataTable
  const data = [
    { id: 1, name: 'Alice', age: 25, role: 'Developer' },
    { id: 2, name: 'Bob', age: 30, role: 'Designer' },
    { id: 3, name: 'Charlie', age: 28, role: 'Manager' },
  ]

  const columns = [
    { key: 'name', title: 'Name', dataIndex: 'name', sortable: true },
    { key: 'age', title: 'Age', dataIndex: 'age', sortable: true },
    { key: 'role', title: 'Role', dataIndex: 'role' },
  ]

  const handleRowSelect = (selectedRows: typeof data) => {
    console.log('Selected rows:', selectedRows)
  }

  return (
    <div className="min-h-screen flex flex-col items-center w-full bg-gray-50 p-6 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <div className="mx-auto w-full max-w-4xl space-y-10">

        {/* ---------------- InputField Demo ---------------- */}
        <section>
          <h1 className="text-2xl font-semibold mb-4">
            Assignment Demo — InputField
          </h1>

          <InputField
            label="Email"
            placeholder="you@example.com"
            helperText="We’ll never share your email."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            size="md"
            clearable
            required
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mt-6">
            <InputField label="Filled" variant="filled" placeholder="Filled…" />
            <InputField label="Outlined" variant="outlined" placeholder="Outlined…" />
            <InputField label="Ghost" variant="ghost" placeholder="Ghost…" />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mt-6">
            <InputField label="Small" size="sm" placeholder="Small…" />
            <InputField label="Medium" size="md" placeholder="Medium…" />
            <InputField label="Large" size="lg" placeholder="Large…" />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mt-6">
            <InputField label="Disabled" disabled placeholder="Disabled…" />
            <InputField label="Invalid" invalid errorMessage="This is invalid." placeholder="Invalid…" />
            <InputField label="Loading" loading placeholder="Checking…" />
          </div>
        </section>

        {/* ---------------- DataTable Demo ---------------- */}
        <section>
          <h1 className="text-2xl font-semibold mb-4">
            Assignment Demo — DataTable
          </h1>

          <DataTable
            data={data}
            columns={columns}
            loading={false}
            selectable={true}
            onRowSelect={handleRowSelect}
          />
        </section>

      </div>
    </div>
  )
}
