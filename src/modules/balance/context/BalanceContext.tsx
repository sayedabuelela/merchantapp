import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BalanceContextType {
    activeAccount: {
        accountId: string;
        accountName: string;
    };

    setActiveAccount: (account: { accountId: string; accountName: string }) => void;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export const BalanceProvider = ({ children }: { children: ReactNode }) => {
    const [activeAccount, setActiveAccount] = useState<{ accountId: string; accountName: string }>({ accountId: 'all', accountName: 'all' });

    return (
        <BalanceContext.Provider value={{ activeAccount, setActiveAccount }}>
            {children}
        </BalanceContext.Provider>
    );
};

export const useBalanceContext = () => {
    const context = useContext(BalanceContext);
    if (context === undefined) {
        throw new Error('useBalanceContext must be used within a BalanceProvider');
    }
    return context;
};
