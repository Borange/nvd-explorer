import { routes } from '@/router/routes';
import { render, screen } from '@testing-library/react';
import { createBrowserRouter, RouterProvider } from 'react-router';
import '@testing-library/jest-dom';

describe('404 page', () => {
  const setup = () => {
    window.history.pushState({}, 'test', '/randomPage');
    return render(<RouterProvider router={createBrowserRouter(routes)} />);
  };
  test('404 page should render', () => {
    setup();

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page not found')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'start page' }),
    ).toBeInTheDocument();
  });
});
