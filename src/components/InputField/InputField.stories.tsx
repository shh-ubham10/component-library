import type { Meta, StoryObj } from "@storybook/react";
import React from 'react'
import { useArgs } from '@storybook/preview-api'
import { InputField } from './InputField'
import type { InputFieldProps } from './InputField'

const meta: Meta<typeof InputField> = {
  title: 'Components/InputField',
  component: InputField,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['filled', 'outlined', 'ghost'],
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helperText: { control: 'text' },
    errorMessage: { control: 'text' },
    onChange: { action: 'changed' },
  },
  parameters: {
    a11y: { disable: false },
    docs: { description: { component: 'Flexible text input with variants, sizes and validation states.' } },
  },
}
export default meta

type Story = StoryObj<typeof InputField>

/**
 * Controlled template so the input is editable inside Storybook Controls.
 * (We sync the `value` arg with the component.)
 */
const Controlled = (args: any) => {
  const [{ value }, updateArgs] = useArgs()
  return (
    <InputField
      {...args}
      value={value}
      onChange={(e) => {
        updateArgs({ value: e.target.value })
      }}
    />
  )
}

export const Default: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter username',
    helperText: '3–16 characters',
    variant: 'outlined',
    size: 'md',
    value: '',
  },
  render: Controlled,
}

export const Variants: Story = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    helperText: 'We’ll never share your email.',
    value: '',
  },
  render: (args) => (
    <div className="grid gap-4">
      <Controlled {...args} variant="filled" />
      <Controlled {...args} variant="outlined" />
      <Controlled {...args} variant="ghost" />
    </div>
  ),
}

export const Sizes: Story = {
  args: {
    label: 'Full name',
    placeholder: 'John Doe',
    value: '',
  },
  render: (args) => (
    <div className="grid gap-4">
      <Controlled {...args} size="sm" />
      <Controlled {...args} size="md" />
      <Controlled {...args} size="lg" />
    </div>
  ),
}

export const Disabled: Story = {
  args: {
    label: 'Disabled input',
    placeholder: 'Cannot type',
    disabled: true,
    value: '',
  },
  render: Controlled,
}

export const InvalidWithError: Story = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    invalid: true,
    errorMessage: 'Please enter a valid email address.',
    value: 'not-an-email',
  },
  render: Controlled,
}

export const Loading: Story = {
  args: {
    label: 'Searching',
    placeholder: 'Type to search…',
    helperText: 'Loading state demo',
    value: '',
    // assumes your component supports a `loading` prop
    // if your prop name differs, rename accordingly
    // @ts-ignore
    loading: true,
  },
  render: Controlled,
}
