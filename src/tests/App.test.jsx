// App.test.jsx
import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Questionnaire from './components/Questionnaire';
import Persons from './components/Persons';
import GroupChat from './components/GroupChat';

describe('App Routing', () => {
  test('renders Questionnaire component on default route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Questionnaire />
      </MemoryRouter>
    );
    expect(screen.getByText('Find Your Tribe')).toBeDefined();
  });

  test('renders Persons component on /persons route', () => {
    render(
      <MemoryRouter initialEntries={['/persons']}>
        <Persons />
      </MemoryRouter>
    );
    expect(screen.getByText('Your Perfect Match Found!')).toBeDefined();
  });

  test('renders GroupChat component on /chat route', () => {
    render(
      <MemoryRouter>
        <GroupChat />
      </MemoryRouter>
    );
    expect(screen.getByText('Your New Tribe')).toBeDefined();
  });
});
