'use client';

import { AppStore, makeStore } from '@/lib/store';
import { setupListeners } from '@reduxjs/toolkit/query';
import React from 'react';
import { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';

export function ReduxProvider(props: PropsWithChildren) {
  const storeRef = React.useRef<AppStore | null>(null);

  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }

  React.useEffect(() => {
    if (storeRef.current != null) {
      // configure listeners using the provided defaults
      // optional, but required for `refetchOnFocus`/`refetchOnReconnect` behaviors
      const unsubscribe = setupListeners(storeRef.current.dispatch);
      return unsubscribe;
    }
  }, []);

  return <Provider store={storeRef.current}>{props.children}</Provider>;
}

export function Providers(props: PropsWithChildren) {
  return <ReduxProvider>{props.children}</ReduxProvider>;
}
