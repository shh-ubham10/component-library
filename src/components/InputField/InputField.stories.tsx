import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { InputField, type InputProps } from './InputField'

const meta: Meta<typeof InputField> = {
  title: 'Components/InputField',
  component: InputField,
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    helperText: 'We’ll never share your email.',
    variant: 'outlined',
    size: 'md',
    disabled: false,
    invalid: false,
    clearable: true,
    loading: false,
    type: 'text'
  },
  parameters: {
    layout: 'centered'
  }
}
export default meta

type Story = StoryObj<typeof InputField>

export const Playground: Story = {
  render: (args: InputProps) => {
    const [val, setVal] = useState('')
    return (
      <div className="w-[360px]">
        <InputField
          {...args}
          value={val}
          onChange={(e) => setVal(e.target.value)}
        />
      </div>
    )
  }
}

export const Variants: Story = {
  render: () => {
    const [v1, setV1] = useState('')
    const [v2, setV2] = useState('')
    const [v3, setV3] = useState('')
    return (
      <div className="flex w-[720px] flex-col gap-5">
        <InputField label="Filled" variant="filled" value={v1} onChange={(e)=>setV1(e.target.value)} placeholder="Filled…" helperText="Filled variant" />
        <InputField label="Outlined" variant="outlined" value={v2} onChange={(e)=>setV2(e.target.value)} placeholder="Outlined…" helperText="Outlined variant" />
        <InputField label="Ghost" variant="ghost" value={v3} onChange={(e)=>setV3(e.target.value)} placeholder="Ghost…" helperText="Ghost variant" />
      </div>
    )
  }
}

export const Sizes: Story = {
  render: () => {
    const [s1, setS1] = useState('')
    const [s2, setS2] = useState('')
    const [s3, setS3] = useState('')
    return (
      <div className="flex w-[720px] flex-col gap-5">
        <InputField label="Small" size="sm" value={s1} onChange={(e)=>setS1(e.target.value)} placeholder="Small…" />
        <InputField label="Medium" size="md" value={s2} onChange={(e)=>setS2(e.target.value)} placeholder="Medium…" />
        <InputField label="Large" size="lg" value={s3} onChange={(e)=>setS3(e.target.value)} placeholder="Large…" />
      </div>
    )
  }
}

export const States: Story = {
  render: () => (
    <div className="flex w-[720px] flex-col gap-5">
      <InputField label="Disabled" disabled placeholder="Disabled…" helperText="Cannot type here" />
      <InputField label="Invalid" invalid errorMessage="This value is not allowed" placeholder="Has error…" />
      <InputField label="Loading" loading placeholder="Loading…" helperText="Simulates async validation" />
    </div>
  )
}
