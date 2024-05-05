import React from 'react';
import { render, screen } from '@testing-library/react';
import HeaderComponent from './HeaderComponent';

test('renders learn react link', () => {
    render(<HeaderComponent />);
    const titleElement = screen.getByText(/Good Times/i);
    const settingsButton = screen.getByLabelText(/Settings/i);
    const insightsButton = screen.getByLabelText(/Insights/i);
    expect(titleElement).toBeInTheDocument();
    expect(settingsButton).toBeInTheDocument();
    expect(insightsButton).toBeInTheDocument();
});
