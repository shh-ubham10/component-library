import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import React, { useState } from 'react'
import { InputField } from './InputField'

function ControlledWrapper() {
  const [val, setVal] = useState('hello')
  return (
    <InputField
      label="Name"
      value={val}
      onChange={(e) => setVal(e.target.value)}
      clearable
    />
  )
}

describe('InputField', () => {
  it('associates label and input correctly', () => {
    render(<InputField label="Email" placeholder="you@example.com" />)
    const input = screen.getByLabelText('Email') as HTMLInputElement
    expect(input).toBeInTheDocument()
    expect(input.placeholder).toBe('you@example.com')
  })

  it('shows helper text and error message with aria-describedby', () => {
    const { rerender } = render(
      <InputField label="Field" helperText="Helpful things" />
    )
    const help = screen.getByText('Helpful things')
    expect(help).toBeInTheDocument()

    rerender(
      <InputField
        label="Field"
        invalid
        errorMessage="Nope!"
        helperText="This should be hidden by error"
      />
    )
    const err = screen.getByText('Nope!')
    expect(err).toBeInTheDocument()
    const input = screen.getByLabelText('Field')
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })

  it('respects disabled and loading states', () => {
    const { rerender } = render(<InputField label="X" disabled />)
    const input = screen.getByLabelText('X')
    expect(input).toBeDisabled()

    rerender(<InputField label="Y" loading />)
    const input2 = screen.getByLabelText('Y')
    expect(input2).toBeDisabled()
    expect(input2).toHaveAttribute('aria-busy', 'true')
  })

  it('clear button clears value (controlled)', async () => {
    render(<ControlledWrapper />)
    const input = screen.getByLabelText('Name') as HTMLInputElement
    expect(input.value).toBe('hello')
    const clearBtn = screen.getByRole('button', { name: /clear input/i })
    await userEvent.click(clearBtn)
    expect(input.value).toBe('')
  })

  it('fires onChange', async () => {
    const onChange = vi.fn()
    render(<InputField label="Z" onChange={onChange} />)
    const input = screen.getByLabelText('Z')
    await userEvent.type(input, 'abc')
    expect(onChange).toHaveBeenCalled()
  })
})
