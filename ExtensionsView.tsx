import React, { useState, useCallback } from 'react';
import { useUser } from './contexts/UserContext';
import { Extension, InstalledExtension } from './types';
import { useExtensions, useInstalledExtensions } from './hooks/useExtensionHooks';
import { MOCK_REVIEWS } from './services/api';

// Components
import { ExtensionCard, InstalledExtensionCard, DeveloperExtensionCard } from './components/ExtensionCards';
import { ExtensionDetailsModal, ExtensionSettingsModal } from './components/ExtensionModals';
import { SearchFilterPanel, AnalyticsDashboard, PublishExtensionForm, AuditLogViewer } from './components/DashboardPanels';
import { LoadingSpinner, ErrorMessage, PaginationControls } from './components/Common';
import Card from './components/Card';

type CurrentView = 'marketplace' | 'installed' | 'developer' | 'publish' | 'edit' | 'analytics' | 'audit_logs';

const ExtensionsView: React.FC = () => {
    const { currentUser, setCurrentUser } = useUser();
    const [currentView, setCurrentView] = useState<CurrentView>('marketplace');
    const [selectedExtension, setSelectedExtension] = useState<Extension | null>(null);
    const [selectedInstalledExtension, setSelectedInstalledExtension] = useState<InstalledExtension | null>(null);
    const [extensionToAnalyzeId, setExtensionToAnalyzeId] = useState<string | null>(null);

    // Marketplace State
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [priceFilter, setPriceFilter] = useState<'free' | 'paid' | 'any'>('any');
    const [minRating, setMinRating] = useState(0);
    const [sortBy, setSortBy] = useState<keyof Extension>('installCount');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [currentPage, setCurrentPage] = useState(1);

    const { extensions, totalExtensions, loading: marketplaceLoading, error: marketplaceError } = useExtensions({
        query: searchQuery, category: selectedCategory, priceFilter, minRating, sortBy, sortOrder, page: currentPage, limit: 12
    });

    const { installedExtensions, refreshInstalled } = useInstalledExtensions(currentUser.id);

    // Handlers
    const handleInstallSuccess = useCallback(() => { refreshInstalled(); setSelectedExtension(null); }, [refreshInstalled]);
    const handleUninstallSuccess = useCallback(() => { refreshInstalled(); setSelectedExtension(null); setSelectedInstalledExtension(null); }, [refreshInstalled]);

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8 font-sans">
            {/* Top Bar */}
            <header className="flex flex-col md:flex-row justify-between items-center mb-10 border-b border-gray-800 pb-6 gap-4">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-cyan-900/50">MD</div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-white">MegaDashboard</h1>
                        <p className="text-xs text-gray-400 uppercase tracking-widest">Extensions Hub</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-6">
                    <nav className="bg-gray-800/50 p-1 rounded-lg border border-gray-700/50">
                        {[
                            { id: 'marketplace', label: 'Marketplace' },
                            { id: 'installed', label: 'Installed' },
                            ...(currentUser.role === 'developer' ? [{ id: 'developer', label: 'Developer' }] : []),
                            { id: 'audit_logs', label: 'Audit Logs' }
                        ].map(nav => (
                            <button key={nav.id} onClick={() => setCurrentView(nav.id as CurrentView)} 
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${currentView === nav.id ? 'bg-cyan-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}>
                                {nav.label}
                            </button>
                        ))}
                    </nav>

                    <div className="relative group cursor-pointer">
                        <div className="flex items-center gap-3 pl-4 border-l border-gray-800">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-bold text-white">{currentUser.name}</p>
                                <p className="text-xs text-cyan-400 capitalize">{currentUser.role.replace('_', ' ')}</p>
                            </div>
                            <div className="h-10 w-10 bg-gray-700 rounded-full flex items-center justify-center text-gray-300 font-bold border-2 border-gray-600 group-hover:border-cyan-500 transition-colors">
                                {currentUser.name.charAt(0)}
                            </div>
                        </div>
                        <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl py-2 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all z-20 transform origin-top-right">
                            <button onClick={() => setCurrentUser({...currentUser, role: 'standard_user'})} className="block w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">Switch to User</button>
                            <button onClick={() => setCurrentUser({...currentUser, role: 'developer'})} className="block w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">Switch to Developer</button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Content Area */}
            <main className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                {currentView === 'marketplace' && (
                    <>
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500 mb-4">
                                Discover Powerful Extensions
                            </h2>
                            <p className="text-gray-400 max-w-2xl mx-auto">Enhance your workflow with community-built tools, integrations, and utilities designed for MegaDashboard.</p>
                        </div>

                        <SearchFilterPanel 
                            searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                            selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
                            priceFilter={priceFilter} setPriceFilter={setPriceFilter}
                            minRating={minRating} setMinRating={setMinRating}
                            sortBy={sortBy} setSortBy={setSortBy}
                            sortOrder={sortOrder} setSortOrder={setSortOrder}
                        />

                        {marketplaceLoading ? <LoadingSpinner /> : marketplaceError ? <ErrorMessage message={marketplaceError} /> : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {extensions.map(ext => (
                                        <ExtensionCard 
                                            key={ext.id} 
                                            extension={ext} 
                                            installed={installedExtensions.find(i => i.extensionId === ext.id)}
                                            onViewDetails={setSelectedExtension}
                                            onInstall={handleInstallSuccess}
                                            onUninstall={handleUninstallSuccess}
                                        />
                                    ))}
                                </div>
                                <PaginationControls currentPage={currentPage} totalPages={Math.ceil(totalExtensions/12)} onPageChange={setCurrentPage} />
                            </>
                        )}
                    </>
                )}

                {currentView === 'installed' && (
                    <div className="space-y-6">
                         <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-800 pb-4">Installed Extensions</h2>
                         {installedExtensions.length === 0 ? <div className="p-12 text-center text-gray-500 bg-gray-800/30 rounded-2xl border border-gray-800 border-dashed">No extensions installed.</div> : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {installedExtensions.map(inst => (
                                    <InstalledExtensionCard 
                                        key={inst.id} 
                                        installedExtension={inst} 
                                        onUninstall={handleUninstallSuccess}
                                        onManageSettings={setSelectedInstalledExtension}
                                    />
                                ))}
                            </div>
                         )}
                    </div>
                )}

                {currentView === 'developer' && (
                    <div className="space-y-8">
                         <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">Developer Console</h2>
                            <button onClick={() => setCurrentView('publish')} className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold shadow-lg shadow-green-900/30 transition-all transform hover:scale-105">
                                + New Extension
                            </button>
                         </div>
                         <Card className="bg-gray-800/50 border-gray-700">
                             <div className="p-4 text-gray-400 italic">Mock Developer Dashboard (Extensions List goes here...)</div>
                         </Card>
                    </div>
                )}

                {currentView === 'publish' && (
                    <PublishExtensionForm developerId={currentUser.id} onSuccess={() => setCurrentView('developer')} onCancel={() => setCurrentView('developer')} />
                )}

                {currentView === 'analytics' && extensionToAnalyzeId && (
                    <AnalyticsDashboard extensionId={extensionToAnalyzeId} onClose={() => setCurrentView('developer')} />
                )}

                {currentView === 'audit_logs' && (
                    <AuditLogViewer onClose={() => setCurrentView('marketplace')} />
                )}
            </main>

            {/* Modals */}
            {selectedExtension && (
                <ExtensionDetailsModal
                    extension={selectedExtension}
                    reviews={MOCK_REVIEWS.filter(r => r.extensionId === selectedExtension.id)}
                    installed={installedExtensions.find(i => i.extensionId === selectedExtension.id)}
                    onClose={() => setSelectedExtension(null)}
                    onInstall={handleInstallSuccess}
                    onUninstall={handleUninstallSuccess}
                    onNewReview={() => {}}
                />
            )}

            {selectedInstalledExtension && (
                <ExtensionSettingsModal
                    installedExtension={selectedInstalledExtension}
                    onClose={() => setSelectedInstalledExtension(null)}
                    onSave={() => { refreshInstalled(); setSelectedInstalledExtension(null); }}
                />
            )}
        </div>
    );
};

export default ExtensionsView;