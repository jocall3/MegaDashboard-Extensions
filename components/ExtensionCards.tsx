import React, { useState } from 'react';
import Card from './Card';
import { RatingStars, truncateText, formatDate } from './Common';
import { Extension, InstalledExtension, DeveloperExtension } from '../types';
import { useUser } from '../contexts/UserContext';
import { mockApiService, MOCK_EXTENSIONS } from '../services/api';

interface ExtensionCardProps {
    extension: Extension;
    onInstall?: (ext: Extension) => void;
    onUninstall?: (installedExt: InstalledExtension) => void;
    installed?: InstalledExtension;
    onViewDetails: (ext: Extension) => void;
}

export const ExtensionCard: React.FC<ExtensionCardProps> = ({ extension, onInstall, onUninstall, installed, onViewDetails }) => {
    const { currentUser } = useUser();
    const isInstalled = !!installed;
    const [installing, setInstalling] = useState(false);
    const [uninstalling, setUninstalling] = useState(false);

    const handleInstall = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!onInstall || installing) return;
        setInstalling(true);
        try {
            await mockApiService.installExtension(extension.id, currentUser.id);
            onInstall(extension);
        } catch (error: any) {
            alert(`Failed to install: ${error.message}`);
        } finally {
            setInstalling(false);
        }
    };

    const handleUninstall = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!onUninstall || uninstalling || !installed) return;
        setUninstalling(true);
        try {
            await mockApiService.uninstallExtension(installed.id, currentUser.id);
            onUninstall(installed);
        } catch (error: any) {
            alert(`Failed to uninstall: ${error.message}`);
        } finally {
            setUninstalling(false);
        }
    };

    const renderIcon = (icon: React.ReactNode) => {
        if (typeof icon === 'string') {
             // If icon is a simple string (like 'VS'), render it as text
             return <span className="text-xl font-bold">{icon}</span>;
        }
        return icon;
    }


    return (
        <Card variant="interactive" className="flex flex-col h-full hover:-translate-y-1">
            <div className="flex-grow flex flex-col" onClick={() => onViewDetails(extension)}>
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-gray-700/50 rounded-xl flex items-center justify-center text-cyan-400 shadow-inner">
                        {renderIcon(extension.icon)}
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-lg leading-tight">{extension.name}</h3>
                        <p className="text-xs text-cyan-200/70 mt-1">by {extension.publisher}</p>
                    </div>
                </div>
                <div className="mb-3 flex items-center justify-between">
                    <RatingStars rating={extension.rating} />
                    <span className="text-xs text-gray-500 bg-gray-800/80 px-2 py-0.5 rounded-full border border-gray-700">
                        {extension.installCount.toLocaleString()} installs
                    </span>
                </div>
                <p className="text-sm text-gray-400 flex-grow mb-4 leading-relaxed line-clamp-3">
                    {truncateText(extension.description, 100)}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-cyan-900/30 text-cyan-300 border border-cyan-900/50 text-xs px-2.5 py-0.5 rounded-md font-medium">{extension.category}</span>
                    {extension.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="bg-gray-700/30 text-gray-400 border border-gray-700/50 text-xs px-2.5 py-0.5 rounded-md">#{tag}</span>
                    ))}
                </div>
                {extension.price > 0 && (
                    <p className="text-sm text-green-400 font-semibold mt-auto flex items-center gap-1">
                         <span>$</span>{extension.price.toFixed(2)}
                    </p>
                )}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-700/50 flex gap-3">
                {isInstalled ? (
                    <>
                        <button
                            onClick={() => onViewDetails(extension)}
                            className="flex-grow py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors duration-200 font-medium"
                        >
                            Manage
                        </button>
                        <button
                            onClick={handleUninstall}
                            className="px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-300 border border-red-900/50 rounded-lg text-sm transition-colors duration-200"
                            disabled={uninstalling}
                        >
                            {uninstalling ? '...' : 'Uninstall'}
                        </button>
                    </>
                ) : (
                    <button
                        onClick={handleInstall}
                        className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/40 rounded-lg text-sm font-semibold transition-colors duration-200"
                        disabled={installing}
                    >
                        {installing ? 'Installing...' : 'Install'}
                    </button>
                )}
            </div>
        </Card>
    );
};

export const InstalledExtensionCard: React.FC<{ installedExtension: InstalledExtension; onUninstall: (installedExt: InstalledExtension) => void; onManageSettings: (installedExt: InstalledExtension) => void }> = ({ installedExtension, onUninstall, onManageSettings }) => {
    const { currentUser } = useUser();
    const extension = MOCK_EXTENSIONS.find(ext => ext.id === installedExtension.extensionId);
    const [uninstalling, setUninstalling] = useState(false);

    if (!extension) return null;

    const handleUninstall = async () => {
        if (uninstalling) return;
        setUninstalling(true);
        try {
            await mockApiService.uninstallExtension(installedExtension.id, currentUser.id);
            onUninstall(installedExtension);
        } catch (error: any) {
            alert(`Failed to uninstall: ${error.message}`);
        } finally {
            setUninstalling(false);
        }
    };

    const renderIcon = (icon: React.ReactNode) => {
        if (typeof icon === 'string') return <span className="text-xl font-bold">{icon}</span>;
        return icon;
    }

    return (
        <Card className="flex flex-col h-full bg-gray-800/80 backdrop-blur-sm">
            <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-gray-700/50 rounded-lg flex items-center justify-center text-cyan-400">
                    {renderIcon(extension.icon)}
                </div>
                <div>
                    <h3 className="font-semibold text-white text-lg">{extension.name}</h3>
                    <p className="text-xs text-gray-400">{extension.publisher}</p>
                </div>
            </div>
            <div className="text-xs text-gray-400 mb-4 bg-gray-900/50 p-3 rounded-lg border border-gray-700/50 space-y-1">
                <div className="flex justify-between">
                    <span>Installed:</span>
                    <span className="text-gray-300">{formatDate(installedExtension.installationDate)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Status:</span>
                    <span className={`font-medium ${installedExtension.enabled ? 'text-green-400' : 'text-red-400'}`}>{installedExtension.enabled ? 'Active' : 'Disabled'}</span>
                </div>
            </div>
            <div className="mt-auto flex gap-2">
                <button
                    onClick={() => onManageSettings(installedExtension)}
                    className="flex-grow py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
                >
                    Config
                </button>
                <button
                    onClick={handleUninstall}
                    className="w-1/3 py-2 bg-red-900/20 hover:bg-red-900/40 text-red-300 rounded-lg text-sm transition-colors"
                    disabled={uninstalling}
                >
                    {uninstalling ? '...' : 'Delete'}
                </button>
            </div>
        </Card>
    );
};

export const DeveloperExtensionCard: React.FC<{ devExtension: DeveloperExtension; onViewDetails: (extId: string) => void; onEditExtension: (extId: string) => void; onDeleteExtension: (extId: string) => void; }> = ({ devExtension, onViewDetails, onEditExtension, onDeleteExtension }) => {
    const extension = MOCK_EXTENSIONS.find(e => e.id === devExtension.id);
    if (!extension) return null;

    const statusColors: Record<string, string> = {
        'published': 'text-green-400 bg-green-900/20 border-green-900/50',
        'draft': 'text-yellow-400 bg-yellow-900/20 border-yellow-900/50',
        'pending_review': 'text-blue-400 bg-blue-900/20 border-blue-900/50',
        'rejected': 'text-red-400 bg-red-900/20 border-red-900/50',
        'archived': 'text-gray-500 bg-gray-800 border-gray-700',
    };

    const renderIcon = (icon: React.ReactNode) => {
        if (typeof icon === 'string') return <span className="text-xl font-bold">{icon}</span>;
        return icon;
    }

    return (
        <Card className="flex flex-col h-full bg-gray-800">
            <div className="flex-grow">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center text-cyan-400">
                             {renderIcon(extension.icon)}
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">{devExtension.name}</h3>
                            <p className="text-xs text-gray-500">v{devExtension.version}</p>
                        </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded border ${statusColors[devExtension.status]}`}>
                        {devExtension.status.replace('_', ' ')}
                    </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-gray-900/50 p-2 rounded border border-gray-700/50">
                        <p className="text-xs text-gray-500">Installs</p>
                        <p className="text-lg font-bold text-white">{devExtension.totalInstalls.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-900/50 p-2 rounded border border-gray-700/50">
                        <p className="text-xs text-gray-500">Rating</p>
                        <div className="flex items-center gap-1">
                            <span className="text-lg font-bold text-white">{devExtension.averageRating.toFixed(1)}</span>
                            <span className="text-yellow-400 text-xs">★</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex gap-2 pt-4 border-t border-gray-700">
                <button onClick={() => onViewDetails(devExtension.id)} className="flex-1 py-1.5 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors">Details</button>
                <button onClick={() => onEditExtension(devExtension.id)} className="flex-1 py-1.5 text-xs bg-cyan-700 hover:bg-cyan-600 text-white rounded transition-colors">Edit</button>
                <button onClick={() => onDeleteExtension(devExtension.id)} className="flex-1 py-1.5 text-xs bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded transition-colors">Delete</button>
            </div>
        </Card>
    );
};