import { render, screen } from '@testing-library/react';
import SystemStatus from '../src/components/SystemStatus';
import { Provider } from 'react-redux';
import { store } from '../src/store';
import { updateSystemStatus } from '../src/store/slices/wsSlice';

describe('SystemStatus', () => {
  test('displays server status list', () => {
    store.dispatch(updateSystemStatus({ products: ['BTC-USD'], channels: ['level2_batch', 'matches'] }));
    render(
      <Provider store={store}>
        <SystemStatus />
      </Provider>
    );

    expect(screen.getByText('level2_batch: BTC-USD')).toBeInTheDocument();
    expect(screen.getByText('matches: BTC-USD')).toBeInTheDocument();
  });
});
