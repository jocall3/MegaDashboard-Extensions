import React, { useState } from 'react';
import Card from './Card';
import { Extension, ExtensionReview, InstalledExtension } from '../types';
import { RatingStars, formatDate } from './Common';
import { mockApiService } from '../services/api';
import { useUser } from '../contexts/UserContext';

interface DetailModalProps {
    extension: Extension;
    reviews: ExtensionReview[];
    onClose: () => void;
    onInstall: (ext: Extension) => void;
    installed?: InstalledExtension;
    onUninstall: (i: InstalledExtension) => void;
    onNewReview: (r: ExtensionReview) => void;
}

export const ExtensionDetailsModal: React.FC<DetailModalProps> = ({
    extension, reviews, onClose, onInstall, installed, onUninstall, onNewReview
}) => {
    const { currentUser } = useUser();
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(false);
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);

    const handleInstall = async () => {
        setLoading(true);
        try {
            await mockApiService.installExtension(extension.id, currentUser.id);
            onInstall(extension);
        } catch(e) { alert(e); }
        setLoading(false);
    }

    const handleUninstall = async () => {
        if (!installed) return;
        setLoading(true);
        try {
            await mockApiService.uninstallExtension(installed.id, currentUser.id);
            onUninstall(installed);
        } catch(e) { alert(e); }
        setLoading(false);
    }

    const submitReview = async () => {
        if (!reviewText || rating === 0) return;
        const r = await mockApiService.submitReview({ extensionId: extension.id, rating, comment: reviewText });
        onNewReview(r);
        setReviewText('');
        setRating(0);
    }

    const renderIcon = (icon: React.ReactNode) => {
        if (typeof icon === 'string') return <span className="text-3xl font-bold">{icon}</span>;
        return icon;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-4xl bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-8 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700 flex items-start gap-6 relative">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl">&times;</button>
                    <div className="w-24 h-24 bg-gray-700 rounded-2xl flex items-center justify-center text-cyan-400 shadow-lg">
                        {renderIcon(extension.icon)}
                    </div>
                    <div className="flex-grow">
                        <h2 className="text-3xl font-bold text-white mb-2">{extension.name}</h2>
                        <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                            <span>by {extension.publisher}</span>
                            <span>v{extension.version}</span>
                            <RatingStars rating={extension.rating} />
                        </div>
                        <div className="flex gap-3">
                            {!installed ? (
                                <button onClick={handleInstall} disabled={loading} className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg shadow-lg shadow-cyan-900/50 transition-all">
                                    {loading ? 'Processing...' : 'Install Extension'}
                                </button>
                            ) : (
                                <button onClick={handleUninstall} disabled={loading} className="px-6 py-2.5 bg-red-900/40 hover:bg-red-900/60 border border-red-900 text-red-100 font-bold rounded-lg transition-all">
                                    {loading ? 'Processing...' : 'Uninstall'}
                                </button>
                            )}
                            <a href={extension.documentationUrl} target="_blank" rel="noreferrer" className="px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-all">
                                Documentation
                            </a>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-700 bg-gray-800/50">
                    {['overview', 'reviews', 'changelog'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            className={`px-8 py-4 text-sm font-medium uppercase tracking-wider transition-colors ${activeTab === tab ? 'text-cyan-400 border-b-2 border-cyan-400 bg-gray-800' : 'text-gray-400 hover:text-white hover:bg-gray-700/50'}`}>
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto custom-scrollbar">
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            <p className="text-lg text-gray-300 leading-relaxed">{extension.description}</p>
                            
                            {extension.screenshots.length > 0 && (
                                <div className="grid grid-cols-2 gap-4">
                                    {extension.screenshots.map((s, i) => (
                                        <img key={i} src={s} alt="Screenshot" className="rounded-xl border border-gray-700 shadow-md hover:scale-[1.02] transition-transform duration-300" />
                                    ))}
                                </div>
                            )}

                            {extension.pricingPlans && (
                                <div className="mt-8">
                                    <h3 className="text-xl font-bold text-white mb-4">Pricing Plans</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {extension.pricingPlans.map(p => (
                                            <div key={p.id} className="bg-gray-800 p-5 rounded-xl border border-gray-700">
                                                <h4 className="text-lg font-bold text-white">{p.name}</h4>
                                                <p className="text-2xl font-bold text-cyan-400 my-2">${p.priceMonthly}<span className="text-sm text-gray-500">/mo</span></p>
                                                <ul className="text-sm text-gray-400 space-y-1">
                                                    {p.features.map(f => <li key={f}>• {f}</li>)}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {activeTab === 'reviews' && (
                        <div className="space-y-8">
                            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                                <h3 className="text-lg font-bold text-white mb-4">Write a Review</h3>
                                <div className="flex gap-2 mb-4">
                                    {[1,2,3,4,5].map(s => (
                                        <button key={s} onClick={() => setRating(s)} className={`text-2xl ${s <= rating ? 'text-yellow-400' : 'text-gray-600'}`}>★</button>
                                    ))}
                                </div>
                                <textarea className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white mb-3" rows={3} 
                                    placeholder="Share your thoughts..." value={reviewText} onChange={e => setReviewText(e.target.value)} />
                                <button onClick={submitReview} className="px-4 py-2 bg-cyan-700 hover:bg-cyan-600 text-white rounded-lg text-sm font-semibold">Post Review</button>
                            </div>
                            <div className="space-y-4">
                                {reviews.map(r => (
                                    <div key={r.id} className="border-b border-gray-700 pb-4 last:border-0">
                                        <div className="flex justify-between mb-1">
                                            <span className="font-bold text-white">{r.userName}</span>
                                            <span className="text-xs text-gray-500">{formatDate(r.timestamp)}</span>
                                        </div>
                                        <RatingStars rating={r.rating} />
                                        <p className="text-gray-300 mt-2 text-sm">{r.comment}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'changelog' && (
                        <div className="space-y-6">
                            {extension.changelog?.map((log, i) => (
                                <div key={i} className="relative pl-6 border-l-2 border-gray-700">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-cyan-900 border-2 border-cyan-500"></div>
                                    <h4 className="text-lg font-bold text-white mb-1">v{log.version}</h4>
                                    <p className="text-xs text-gray-500 mb-2">{formatDate(log.releaseDate)}</p>
                                    <ul className="list-disc pl-4 text-sm text-gray-300 space-y-1">
                                        {log.changes.map((c, idx) => <li key={idx}>{c}</li>)}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const ExtensionSettingsModal: React.FC<{ installedExtension: InstalledExtension; onClose: () => void; onSave: (i: InstalledExtension) => void }> = ({ installedExtension, onClose, onSave }) => {
    const { currentUser } = useUser();
    const [config, setConfig] = useState(installedExtension.configuration);
    const [enabled, setEnabled] = useState(installedExtension.enabled);

    const handleSave = async () => {
        const updated = await mockApiService.updateExtensionConfiguration(installedExtension.id, currentUser.id, { ...config, enabled });
        onSave(updated);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <Card className="w-full max-w-lg bg-gray-800 border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-6">Settings</h2>
                <div className="space-y-6 mb-8">
                    <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                        <span className="text-white font-medium">Enable Extension</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={enabled} onChange={e => setEnabled(e.target.checked)} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                        </label>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-2 uppercase tracking-wide">Configuration Keys</h3>
                        {Object.keys(config).length === 0 ? <p className="text-gray-500 italic">No specific configuration.</p> : 
                            Object.keys(config).map(k => (
                                <div key={k} className="mb-3">
                                    <label className="text-sm text-gray-300 block mb-1 capitalize">{k}</label>
                                    <input type="text" className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white"
                                        value={config[k]} onChange={e => setConfig({...config, [k]: e.target.value})} />
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-gray-300 hover:text-white">Cancel</button>
                    <button onClick={handleSave} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white font-medium">Save Changes</button>
                </div>
            </Card>
        </div>
    );
};