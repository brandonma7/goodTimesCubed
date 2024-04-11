import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './TimerApp';

test('renders learn react link', () => {
    render(<App />);
    const linkElement = screen.getByText(/Good Times/i);
    expect(linkElement).toBeInTheDocument();
});
