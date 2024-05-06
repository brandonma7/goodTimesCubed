import React from 'react';
import { render, screen } from '@testing-library/react';
import HeaderComponent from './HeaderComponent';
import { BrowserRouter } from 'react-router-dom';

test('renders header component', () => {
    render(
        <BrowserRouter>
            <HeaderComponent />
        </BrowserRouter>,
    );
    const titleElement = screen.getByText(/Good Times/i);
    const settingsButton = screen.getByLabelText(/Settings/i);
    const insightsButton = screen.getByLabelText(/Insights/i);
    expect(titleElement).toBeInTheDocument();
    expect(settingsButton).toBeInTheDocument();
    expect(insightsButton).toBeInTheDocument();
});
