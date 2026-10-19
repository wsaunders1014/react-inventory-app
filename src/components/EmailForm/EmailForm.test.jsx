import React from 'react';
import { it, expect } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import EmailForm from './EmailForm.jsx';
it('keeps typed email text when toggling the checkbox', () => {
  render(<EmailForm />);
  const input = screen.getByPlaceholderText('ENTER EMAIL');
  fireEvent.change(input, {target:{value:'test@example.com'}});
  fireEvent.click(screen.getByRole('checkbox'));
  expect(input).toHaveValue('test@example.com');
});
