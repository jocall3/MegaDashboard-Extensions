import React, { useState, useEffect } from 'react';
import Card from './Card';
import { Extension, ExtensionAnalytics, AuditLogEntry, PricingPlan } from '../types';
import { mockApiService, delay, MOCK_CATEGORIES } from '../services/api';
import { LoadingSpinner, ErrorMessage, formatDate } from './Common';
import { useUser } from '../contexts/UserContext';

// --- Search Filter Panel ---
interface SearchFilterPanelProps {
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    selectedCategory: string;
    setSelectedCategory: (c: string) => void;
    priceFilter: 'free' | 'paid' | 'any';
    setPriceFilter: (f: 'free' | 'paid' | 'any') => void;
    minRating: number;
    setMinRating: (r: number) => void;
    sortBy: keyof Extension;
    setSortBy: (s: keyof Extension) => void;
    sortOrder: 'asc' | 'desc';
    setSortOrder: (o: 'asc' | 'desc') => void;
}

export const SearchFilterPanel: React.FC<SearchFilterPanelProps> = ({
    searchQuery, setSearchQuery, selectedCategory, setSelectedCategory,
    priceFilter, setPriceFilter, minRating, setMinRating,
    sortBy, setSortBy, sortOrder, setSortOrder
}) => {
    return (
        <Card className="p-6 mb-8 bg-gray-800/80 backdrop-blur">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="col-span-1 md:col-span-2 lg:col-span-3">
                    <label className="block text-sm font-medium text-gray-400 mb-2">Search Extensions</label>
                    <input
                        type="text"
                        placeholder="Search by name, publisher, tag..."
                        className="w-full p-3 bg-gray-900/50 rounded-xl text-white placeholder-gray-500 border border-gray-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                    <select
                        className="w-full p-2.5 bg-gray-900/50 rounded-lg text-gray-200 border border-gray-700 outline-none focus:border-cyan-500"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="all">All Categories</option>
                        {MOCK_CATEGORIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Price</label>
                    <select
                        className="w-full p-2.5 bg-gray-900/50 rounded-lg text-gray-200 border border-gray-700 outline-none focus:border-cyan-500"
                        value={priceFilter}
                        onChange={(e) => setPriceFilter(e.target.value as any)}
                    >
                        <option value="any">Any Price</option>
                        <option value="free">Free</option>
                        <option value="paid">Paid</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Rating</label>
                    <select
                        className="w-full p-2.5 bg-gray-900/50 rounded-lg text-gray-200 border border-gray-700 outline-none focus:border-cyan-500"
                        value={minRating}
                        onChange={(e) => setMinRating(parseFloat(e.target.value))}
                    >
                        <option value={0}>Any Rating</option>
                        <option value={4}>4 Stars & Up</option>
                        <option value={3}>3 Stars & Up</option>
                    </select>
                </div>
            </div>
        </Card>
    );
};

// --- Analytics Dashboard ---
export const AnalyticsDashboard: React.FC<{ extensionId: string; onClose: () => void }> = ({ extensionId, onClose }) => {
    const [analytics, setAnalytics] = useState<ExtensionAnalytics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            const data = await mockApiService.fetchExtensionAnalytics(extensionId);
            setAnalytics(data);
            setLoading(false);
        };
        fetch();
    }, [extensionId]);

    if (loading) return <LoadingSpinner />;
    if (!analytics) return <ErrorMessage message="No data available" />;

    const totalInstalls = analytics.data.reduce((sum, e) => sum + e.installs, 0);

    return (
        <Card className="p-6 relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl">&times;</button>
            <h2 className="text-2xl font-bold text-white mb-6">Analytics Dashboard</h2>
            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-700/30 p-4 rounded-xl border border-gray-700/50">
                    <p className="text-sm text-gray-400">Total Installs</p>
                    <p className="text-3xl font-bold text-cyan-400">{totalInstalls.toLocaleString()}</p>
                </div>
                <div className="bg-gray-700/30 p-4 rounded-xl border border-gray-700/50">
                    <p className="text-sm text-gray-400">Active Users</p>
                    <p className="text-3xl font-bold text-green-400">{analytics.data[0].activeUsers.toLocaleString()}</p>
                </div>
                <div className="bg-gray-700/30 p-4 rounded-xl border border-gray-700/50">
                    <p className="text-sm text-gray-400">Errors (30d)</p>
                    <p className="text-3xl font-bold text-red-400">{analytics.data.reduce((s,e)=>s+(e.errors||0), 0)}</p>
                </div>
            </div>
            <div className="overflow-x-auto rounded-xl border border-gray-700/50">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-gray-800 text-gray-200 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Installs</th>
                            <th className="px-6 py-3">Uninstalls</th>
                            <th className="px-6 py-3">Revenue</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700 bg-gray-800/50">
                        {analytics.data.map((row, i) => (
                            <tr key={i} className="hover:bg-gray-700/30">
                                <td className="px-6 py-3 font-medium text-white">{row.date}</td>
                                <td className="px-6 py-3 text-green-400">+{row.installs}</td>
                                <td className="px-6 py-3 text-red-400">-{row.uninstalls}</td>
                                <td className="px-6 py-3 text-white">${row.revenue?.toFixed(2) || '0.00'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

// --- Publish Form ---
export const PublishExtensionForm: React.FC<{ developerId: string; onSuccess: (ext: Extension) => void; onCancel: () => void }> = ({ developerId, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '', description: '', category: MOCK_CATEGORIES[0].name, initialVersion: '1.0.0', price: 0
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const ext = await mockApiService.publishNewExtension(formData);
            onSuccess(ext);
        } catch(e) { alert('Error publishing'); }
        setSubmitting(false);
    };

    return (
        <Card className="p-8 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Publish New Extension</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Extension Name</label>
                    <input required type="text" className="w-full p-3 bg-gray-700 rounded-lg text-white outline-none focus:ring-2 focus:ring-cyan-500"
                        value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                    <textarea required rows={4} className="w-full p-3 bg-gray-700 rounded-lg text-white outline-none focus:ring-2 focus:ring-cyan-500"
                        value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                        <select className="w-full p-3 bg-gray-700 rounded-lg text-white outline-none"
                            value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                            {MOCK_CATEGORIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Price ($)</label>
                        <input type="number" min="0" step="0.01" className="w-full p-3 bg-gray-700 rounded-lg text-white outline-none"
                            value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} />
                    </div>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                    <button type="button" onClick={onCancel} className="px-6 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-white font-medium">Cancel</button>
                    <button type="submit" disabled={submitting} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white font-medium disabled:opacity-50">
                        {submitting ? 'Publishing...' : 'Publish'}
                    </button>
                </div>
            </form>
        </Card>
    );
};

// --- Audit Log Viewer ---
export const AuditLogViewer: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { currentUser } = useUser();
    const [logs, setLogs] = useState<AuditLogEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        mockApiService.fetchAuditLogs({ userId: currentUser.id }).then(l => {
            setLogs(l);
            setLoading(false);
        });
    }, [currentUser.id]);

    if(loading) return <LoadingSpinner />;

    return (
        <Card className="p-6">
             <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">System Audit Logs</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
            </div>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {logs.map(log => (
                    <div key={log.id} className="p-3 bg-gray-900/50 rounded border border-gray-800 flex justify-between items-center">
                        <div>
                            <p className="text-sm font-medium text-cyan-300">{log.action}</p>
                            <p className="text-xs text-gray-500">{JSON.stringify(log.details)}</p>
                        </div>
                        <span className="text-xs text-gray-600 font-mono">{formatDate(log.timestamp)}</span>
                    </div>
                ))}
            </div>
        </Card>
    )
}