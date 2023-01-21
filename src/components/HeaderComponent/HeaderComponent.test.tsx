import React from 'react';
import { render, screen } from '@testing-library/react';
import HeaderComponent from './HeaderComponent';

test('renders learn react link', () => {
    render(<HeaderComponent />);
    const titleElement = screen.getByText(/GoodTimes/i);
    const settingsButton = screen.getByText(/Settings/i);
    const insightsButton = screen.getByText(/Insights/i);
    expect(titleElement).toBeInTheDocument();
    expect(settingsButton).toBeInTheDocument();
    expect(insightsButton).toBeInTheDocument();
});
