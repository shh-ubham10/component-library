# 🧩 UI Component Library – Assignment  

This repository contains a small **React component library** built as part of the UI Assignment.  
It demonstrates how to design **reusable, modular, and interactive components** with **Storybook**.  

---

## 📂 Folder Structure  

ui-assignment/

│── .storybook/  # Storybook config files

│── src/

│ ├── components/

│ │ ├── InputField/ # Component 1: InputField

│ │ │ ├── InputField.jsx

│ │ │ ├── InputField.css

│ │ │ └── InputField.stories.jsx

│ │ ├── DataTable/ # Component 2: DataTable

│ │ │ ├── DataTable.jsx

│ │ │ ├── DataTable.css

│ │ │ └── DataTable.stories.jsx

│ ├── App.js # Demo app (optional)

│ └── index.js # Entry point
│── package.json
│── README.md


---

## ⚙️ Setup Instructions  

Clone the repository and install dependencies:  

```bash
git clone https://github.com/your-username/component-library.git
cd component-library
npm install

Run the local dev server:
npm start

Run Storybook:
npm run storybook

Build Storybook for deployment:
npm run build-storybook
````

💡 **Approach**
🔹 Component 1: InputField

○ Built a reusable Input component with support for:

○ Variants: outlined, filled

○ Sizes: sm, md, lg

○ Error handling (error, helperText)

○ Controlled inputs (via props)

This ensures flexibility across forms, login pages, or custom UIs.

🔹 Component 2: DataTable

○ Built a DataTable component with features like:

○ Dynamic column rendering

○ Row selection (onRowSelect)

○ Loading state

○ Clean styling for readability

This demonstrates how reusable table components can be structured.


📦 Example Usage
InputField
```bash
import InputField from "./components/InputField/InputField";

export default function Demo() {
  return (
    <div>
      <InputField
        label="Username"
        placeholder="Enter your username"
        variant="outlined"
        size="md"
      />

      <InputField
        label="Password"
        placeholder="Enter your password"
        type="password"
        variant="filled"
        size="lg"
        error
        helperText="Password must be at least 6 characters"
      />
    </div>
  );
}
````

DataTable
```bash
import DataTable from "./components/DataTable/DataTable";

const columns = [
  { header: "ID", accessor: "id" },
  { header: "Name", accessor: "name" },
  { header: "Email", accessor: "email" },
];

const rows = [
  { id: 1, name: "Alice", email: "alice@email.com" },
  { id: 2, name: "Bob", email: "bob@email.com" },
  { id: 3, name: "Charlie", email: "charlie@email.com" },
];

export default function Demo() {
  return (
    <div>
      <DataTable
        columns={columns}
        data={rows}
        loading={false}
        onRowSelect={(row) => console.log("Selected:", row)}
      />
    </div>
  );
}
````
🌐 Storybook Preview

Deployed using Chromatic or Vercel.
vercel👉 https://component-library-vrev.vercel.app
chromatic👉  

## Notes on Testing Setup

This project includes **React + Vite + Storybook**.  
Originally, we planned to integrate **Vitest inside Storybook** using `@storybook/addon-vitest`.  
However, at the time of setup, there was a **version mismatch** between:

- `storybook@9.x`  
- `@storybook/addon-vitest` (currently aligned with Storybook `8.x`)  

Because of this, running Vitest **directly inside Storybook** caused dependency resolution errors.


Reason for Skipping Chromatic

Due to the version conflict between Storybook packages, npm run build-storybook cannot generate the static build required for Chromatic deployment. Instead of spending more time on downgrading/upgrading and breaking other dependencies, I kept the project stable and ensured local Storybook works flawlessly for reviewing all component stories.
