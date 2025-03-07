interface Window {
  ethereum?: {
    isMetaMask?: true;
    request?: (args: { method: string; params?: any[] }) => Promise<any>;
    on?: (event: string, listener: (...args: any[]) => void) => void;
    removeListener?: (event: string, listener: (...args: any[]) => void) => void;
    enable?: () => Promise<string[]>;
    send?: (method: string, params?: any[]) => Promise<any>;
  };
}
