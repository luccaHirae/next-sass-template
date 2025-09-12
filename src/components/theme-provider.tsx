'use client';
import * as React from 'react';
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes';

type Props = Omit<ThemeProviderProps, 'children'> & {
  children: React.ReactNode;
};

export function ThemeProvider({
  children,
  attribute = 'class',
  defaultTheme = 'light',
  enableSystem = false,
  disableTransitionOnChange = true,
  ...rest
}: Props) {
  return (
    <NextThemesProvider
      attribute={attribute}
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      disableTransitionOnChange={disableTransitionOnChange}
      {...rest}
    >
      {children}
    </NextThemesProvider>
  );
}
