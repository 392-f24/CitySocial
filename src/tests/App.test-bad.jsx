// App.test.jsx
import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

describe('App Component', () => {
  test('renders Questionnaire component on default route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Find Your Tribe')).toBeDefined();
  });

  test('renders Persons component on /persons route', () => {
    render(
      <MemoryRouter initialEntries={['/persons']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Your Perfect Match Found!')).toBeDefined();
  });

  test('renders GroupChat component on /chat route', () => {
    render(
      <MemoryRouter initialEntries={['/chat']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Your New Tribe')).toBeDefined();
  });
});