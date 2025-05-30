
import { render, screen, fireEvent } from '@testing-library/react';
import SubscribeControl from '../src/components/SubscribeControl';
import { Provider } from 'react-redux';

import { addSubscription } from '../src/store/slices/wsSlice';

import { configureStore } from '@reduxjs/toolkit';
import wsReducer from '../src/store/slices/wsSlice';


const createTestStore = () => configureStore({
  reducer: {
    ws: wsReducer
  }
});

const store = createTestStore();

describe('SubscribeControl', () => {
  test('renders product buttons', () => {
    render(
      <Provider store={store}>
        <SubscribeControl />
      </Provider>
    );

    expect(screen.getByText('BTC-USD')).toBeInTheDocument();
    expect(screen.getByText('ETH-USD')).toBeInTheDocument();
  });

  test('subscribe button changes class after subscription', () => {
    store.dispatch(addSubscription('BTC-USD'));
    render(
      <Provider store={store}>
        <SubscribeControl />
      </Provider>
    );

    const button = screen.getByText('BTC-USD');
    expect(button).toHaveClass('active');  
  });

});
