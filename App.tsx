import React from 'react';
import { UserProvider } from './contexts/UserContext';
import ExtensionsView from './ExtensionsView';

const App: React.FC = () => {
    return (
        <UserProvider>
            <ExtensionsView />
        </UserProvider>
    );
};

export default App;