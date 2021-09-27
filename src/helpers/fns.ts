export const isServer = (): boolean => typeof window === 'undefined';

export const isBrowser = (): boolean => !isServer();
