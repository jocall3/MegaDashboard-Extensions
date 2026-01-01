import React from 'react';
import { 
    Extension, ExtensionCategory, ExtensionReview, InstalledExtension, 
    DeveloperExtension, AuditLogEntry, ExtensionAnalytics, PricingPlan, ExtensionVersionLog 
} from '../types';

// Utility
const generateRandomId = () => Math.random().toString(36).substring(2, 15);
export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// Constants
export const MOCK_CATEGORIES: ExtensionCategory[] = [
    { id: 'cat-dev-tools', name: 'Developer Tools', icon: '🛠️', description: 'Tools for coding, debugging, and deployment.' },
    { id: 'cat-fin-ops', name: 'Financial Operations', icon: '💰', description: 'Automate financial workflows and reporting.' },
    { id: 'cat-collaboration', name: 'Collaboration', icon: '🤝', description: 'Enhance team communication and project management.' },
    { id: 'cat-design', name: 'Design & UI', icon: '🎨', description: 'Integrate design tools and assets.' },
    { id: 'cat-reporting', name: 'Reporting & Analytics', icon: '📊', description: 'Visualize data and generate reports.' },
    { id: 'cat-security', name: 'Security & Compliance', icon: '🔒', description: 'Ensure data security and regulatory compliance.' },
    { id: 'cat-crm', name: 'CRM & Sales', icon: '📈', description: 'Manage customer relations and sales pipelines.' },
    { id: 'cat-marketing', name: 'Marketing', icon: '📣', description: 'Automate marketing campaigns and customer engagement.' },
    { id: 'cat-ai-ml', name: 'AI & Machine Learning', icon: '🧠', description: 'Integrate AI models and machine learning workflows.' },
    { id: 'cat-iot', name: 'IoT & Edge Computing', icon: '📡', description: 'Connect and manage IoT devices and data streams.' },
];

const EXTENSION_DESCRIPTIONS = [
    'Seamlessly integrate your workflow with our advanced API services.',
    'Boost your productivity with automated tasks and smart notifications.',
    'Gain deeper insights into your financial data with comprehensive reporting.',
    'Streamline your customer support operations by linking customer queries.',
    'Enhance your team’s collaboration with shared dashboards.',
    'Secure your transactions with enterprise-grade encryption.',
    'Personalize your customer engagement strategies using powerful CRM integrations.',
    'Automate your marketing campaigns with data-driven insights.',
    'Leverage AI and machine learning to predict market trends.',
    'Connect your IoT devices to our platform for real-time data streaming.',
];

const publishers = ['Demo Bank', 'Atlassian', 'Slack', 'Figma', 'Google', 'Microsoft', 'AWS', 'Stripe', 'Twilio', 'Zapier'];

// Data Generators
const generatePricingPlans = (id: string): PricingPlan[] => {
    const plans: PricingPlan[] = [];
    if (Math.random() > 0.4) {
        plans.push({
            id: `${id}-basic`,
            name: 'Basic',
            description: 'Essential features for small teams.',
            priceMonthly: 9.99,
            priceAnnually: 99.99,
            features: ['Core Integration', '500 API calls/month', 'Standard Support'],
        });
        plans.push({
            id: `${id}-pro`,
            name: 'Pro',
            description: 'Advanced features for growing businesses.',
            priceMonthly: 29.99,
            priceAnnually: 299.99,
            features: ['All Basic Features', 'Unlimited API calls', 'Premium Support', 'Custom Reports', 'Multi-user Access'],
        });
    }
    return plans;
};

const generateChangelog = (version: string): ExtensionVersionLog[] => {
    const logs: ExtensionVersionLog[] = [];
    let currentVersion = version.split('.').map(Number);
    for (let i = 0; i < Math.floor(Math.random() * 5) + 1; i++) {
        const major = currentVersion[0];
        const minor = currentVersion[1];
        const patch = currentVersion[2];
        const newPatch = Math.max(0, patch - (i === 0 ? 0 : Math.floor(Math.random() * 5)));
        const newMinor = minor - (Math.random() > 0.8 && i !== 0 ? 1 : 0);
        const newMajor = major - (Math.random() > 0.95 && i !== 0 ? 1 : 0);

        currentVersion = [Math.max(0, newMajor), Math.max(0, newMinor), Math.max(0, newPatch)];

        logs.push({
            version: currentVersion.join('.'),
            releaseDate: new Date(Date.now() - (i * 30 + Math.random() * 15) * 24 * 60 * 60 * 1000).toISOString(),
            changes: [
                `Improved performance for ${Math.random() > 0.5 ? 'large datasets' : 'real-time updates'}.`,
                `Fixed a bug where ${Math.random() > 0.5 ? 'notifications were not sent' : 'data sync failed intermittently'}.`,
            ].filter(Boolean),
        });
    }
    return logs.reverse();
};

const generateMockExtensions = (count: number): Extension[] => {
    const extensions: Extension[] = [];
    for (let i = 0; i < count; i++) {
        const id = `ext-${generateRandomId()}`;
        const publisher = publishers[Math.floor(Math.random() * publishers.length)];
        const category = MOCK_CATEGORIES[Math.floor(Math.random() * MOCK_CATEGORIES.length)];
        const tags = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => `tag-${generateRandomId().substring(0, 5)}`);
        const rating = parseFloat((Math.random() * 2 + 3).toFixed(1));
        const installCount = Math.floor(Math.random() * 50000) + 100;
        const recommended = Math.random() > 0.7;
        const description = EXTENSION_DESCRIPTIONS[Math.floor(Math.random() * EXTENSION_DESCRIPTIONS.length)];
        const version = `${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 20)}`;
        const lastUpdated = new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString();
        const price = Math.random() > 0.6 ? parseFloat((Math.random() * 100).toFixed(2)) : 0;
        const pricingPlans = price > 0 ? generatePricingPlans(id) : undefined;
        const screenshots = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, idx) => `https://picsum.photos/600/400?random=${idx + i}`);
        const changelog = generateChangelog(version);

        extensions.push({
            id,
            name: `${publisher} ${category.name} ${i + 1}`,
            publisher,
            description,
            icon: category.icon,
            recommended,
            category: category.name,
            tags,
            rating,
            installCount,
            price,
            lastUpdated,
            version,
            screenshots,
            documentationUrl: `https://example.com/docs/${id}`,
            privacyPolicyUrl: `https://example.com/privacy/${id}`,
            developerInfo: {
                id: `dev-${generateRandomId()}`,
                name: `${publisher} Team`,
                contactEmail: `contact@${publisher.toLowerCase().replace(/\s/g, '')}.com`,
                website: `https://${publisher.toLowerCase().replace(/\s/g, '')}.com`,
            },
            pricingPlans,
            changelog,
        });
    }
    return extensions;
};

// State Variables (Simulating DB)
export const MOCK_EXTENSIONS: Extension[] = [
    { id: 'ext-vscode', name: 'Demo Bank for VS Code', publisher: 'Demo Bank', description: 'Manage your API resources and test webhooks directly from your editor.', icon: 'VS', recommended: true, category: 'Developer Tools', tags: ['IDE', 'APIs', 'Webhooks'], rating: 4.8, installCount: 120000, price: 0, lastUpdated: '2023-10-26T10:00:00Z', version: '1.5.2', screenshots: ['https://picsum.photos/600/400?random=101', 'https://picsum.photos/600/400?random=102'], documentationUrl: 'https://docs.demobank.com/vscode', privacyPolicyUrl: 'https://demobank.com/privacy', developerInfo: { id: 'dev-demobank', name: 'Demo Bank Team', contactEmail: 'dev@demobank.com', website: 'https://demobank.com' }, changelog: [{ version: '1.5.2', releaseDate: '2023-10-26', changes: ['Bug fixes', 'Performance improvements'] }] },
    { id: 'ext-jira', name: 'Jira Integration', publisher: 'Atlassian', description: 'Create and link Demo Bank transactions to Jira issues automatically.', icon: 'JI', recommended: false, category: 'Collaboration', tags: ['Project Management', 'Ticketing'], rating: 4.5, installCount: 85000, price: 0, lastUpdated: '2023-09-15T10:00:00Z', version: '2.1.0', screenshots: ['https://picsum.photos/600/400?random=103', 'https://picsum.photos/600/400?random=104'], documentationUrl: 'https://docs.atlassian.com/jira-demobank', privacyPolicyUrl: 'https://atlassian.com/privacy', developerInfo: { id: 'dev-atlassian', name: 'Atlassian', contactEmail: 'support@atlassian.com' }, pricingPlans: [{ id: 'jira-pro', name: 'Pro Plan', description: 'Advanced linking and automation', priceMonthly: 15.00, priceAnnually: 150.00, features: ['Unlimited automations', 'Custom fields mapping'] }] },
    ...generateMockExtensions(100),
];

export const MOCK_REVIEWS: ExtensionReview[] = [];
MOCK_EXTENSIONS.forEach(ext => {
    for (let i = 0; i < Math.floor(Math.random() * 5) + 1; i++) {
        MOCK_REVIEWS.push({
            id: generateRandomId(),
            extensionId: ext.id,
            userId: `user-${generateRandomId()}`,
            userName: `User ${generateRandomId().substring(0, 4)}`,
            rating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
            comment: EXTENSION_DESCRIPTIONS[Math.floor(Math.random() * EXTENSION_DESCRIPTIONS.length)],
            timestamp: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString(),
        });
    }
});

export const MOCK_INSTALLED_EXTENSIONS: InstalledExtension[] = [
    { id: 'inst-vscode', extensionId: 'ext-vscode', userId: 'user-current', installationDate: '2023-01-15T10:00:00Z', enabled: true, configuration: { theme: 'dark', autoUpdate: true } },
];

export const MOCK_DEVELOPER_EXTENSIONS: DeveloperExtension[] = MOCK_EXTENSIONS
    .filter(ext => ext.developerInfo.id === 'dev-demobank' || Math.random() > 0.95)
    .map(ext => ({
        id: ext.id,
        name: ext.name,
        status: (['published', 'draft', 'pending_review'] as const)[Math.floor(Math.random() * 3)],
        version: ext.version,
        lastPublished: ext.lastUpdated,
        totalInstalls: ext.installCount,
        reviewsCount: MOCK_REVIEWS.filter(r => r.extensionId === ext.id).length,
        averageRating: ext.rating,
        monetizationStatus: ext.price > 0 ? (ext.pricingPlans ? 'subscription' : 'paid') : 'free',
        pendingUpdates: Math.random() > 0.7,
    }));

export const MOCK_AUDIT_LOGS: AuditLogEntry[] = Array.from({ length: 50 }, () => {
    const action = (['INSTALL_EXTENSION', 'UNINSTALL_EXTENSION', 'UPDATE_CONFIG', 'SUBMIT_REVIEW', 'PUBLISH_EXTENSION'] as const)[Math.floor(Math.random() * 5)];
    const randomExt = MOCK_EXTENSIONS[Math.floor(Math.random() * MOCK_EXTENSIONS.length)];
    return {
        id: generateRandomId(),
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
        action,
        userId: Math.random() > 0.5 ? 'user-current' : `user-${generateRandomId()}`,
        extensionId: randomExt.id,
        details: { extensionName: randomExt.name },
    };
}).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

export const MOCK_ANALYTICS_DATA: ExtensionAnalytics[] = MOCK_DEVELOPER_EXTENSIONS.map(devExt => {
    const data = [];
    for (let i = 0; i < 30; i++) {
        data.push({
            date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            installs: Math.floor(Math.random() * 100),
            uninstalls: Math.floor(Math.random() * 10),
            activeUsers: Math.floor(Math.random() * devExt.totalInstalls * 0.5),
            revenue: devExt.monetizationStatus !== 'free' ? parseFloat((Math.random() * 500).toFixed(2)) : undefined,
            errors: Math.floor(Math.random() * 5),
        });
    }
    return {
        extensionId: devExt.id,
        period: 'daily',
        data: data.reverse(),
    };
});

// API Service Implementation
export const mockApiService = {
    fetchExtensions: async (params: {
        query?: string;
        category?: string;
        publisher?: string;
        minRating?: number;
        priceFilter?: 'free' | 'paid' | 'any';
        page?: number;
        limit?: number;
        sortBy?: keyof Extension;
        sortOrder?: 'asc' | 'desc';
    }): Promise<{ extensions: Extension[]; total: number }> => {
        await delay(300);
        let filtered = [...MOCK_EXTENSIONS];

        if (params.query) {
            const lowerQuery = params.query.toLowerCase();
            filtered = filtered.filter(ext =>
                ext.name.toLowerCase().includes(lowerQuery) ||
                ext.description.toLowerCase().includes(lowerQuery) ||
                ext.publisher.toLowerCase().includes(lowerQuery) ||
                ext.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
            );
        }

        if (params.category && params.category !== 'all') {
            filtered = filtered.filter(ext => ext.category.toLowerCase() === params.category!.toLowerCase());
        }

        if (params.minRating) {
            filtered = filtered.filter(ext => ext.rating >= params.minRating!);
        }

        if (params.priceFilter && params.priceFilter !== 'any') {
            filtered = filtered.filter(ext => params.priceFilter === 'free' ? ext.price === 0 : ext.price > 0);
        }

        if (params.sortBy) {
            filtered.sort((a, b) => {
                const valA = a[params.sortBy!] as any;
                const valB = b[params.sortBy!] as any;
                if (typeof valA === 'string') {
                    return params.sortOrder === 'desc' ? valB.localeCompare(valA) : valA.localeCompare(valB);
                }
                return params.sortOrder === 'desc' ? valB - valA : valA - valB;
            });
        }

        const page = params.page || 1;
        const limit = params.limit || 12;
        const startIndex = (page - 1) * limit;
        return { 
            extensions: filtered.slice(startIndex, startIndex + limit), 
            total: filtered.length 
        };
    },

    fetchExtensionDetails: async (id: string): Promise<Extension | null> => {
        await delay(200);
        return MOCK_EXTENSIONS.find(ext => ext.id === id) || null;
    },

    fetchExtensionReviews: async (extensionId: string): Promise<ExtensionReview[]> => {
        await delay(200);
        return MOCK_REVIEWS.filter(review => review.extensionId === extensionId);
    },

    submitReview: async (review: Omit<ExtensionReview, 'id' | 'timestamp' | 'userId' | 'userName'>): Promise<ExtensionReview> => {
        await delay(400);
        const newReview: ExtensionReview = {
            ...review,
            id: generateRandomId(),
            userId: 'user-current',
            userName: 'Current User',
            timestamp: new Date().toISOString(),
        };
        MOCK_REVIEWS.push(newReview);
        const ext = MOCK_EXTENSIONS.find(e => e.id === review.extensionId);
        if (ext) {
            const reviewsForExt = MOCK_REVIEWS.filter(r => r.extensionId === ext.id);
            ext.rating = reviewsForExt.reduce((sum, r) => sum + r.rating, 0) / reviewsForExt.length;
        }
        return newReview;
    },

    fetchInstalledExtensions: async (userId: string): Promise<InstalledExtension[]> => {
        await delay(300);
        return MOCK_INSTALLED_EXTENSIONS.filter(installed => installed.userId === userId);
    },

    installExtension: async (extensionId: string, userId: string): Promise<InstalledExtension> => {
        await delay(500);
        const existing = MOCK_INSTALLED_EXTENSIONS.find(inst => inst.extensionId === extensionId && inst.userId === userId);
        if (existing) throw new Error('Extension already installed');
        
        const ext = MOCK_EXTENSIONS.find(e => e.id === extensionId);
        if (!ext) throw new Error('Extension not found');

        const newInstall: InstalledExtension = {
            id: `inst-${generateRandomId()}`,
            extensionId,
            userId,
            installationDate: new Date().toISOString(),
            enabled: true,
            configuration: {},
            subscription: ext.pricingPlans?.length ? {
                planId: ext.pricingPlans[0].id,
                startDate: new Date().toISOString(),
                endDate: new Date(Date.now() + 30 * 86400000).toISOString(),
                status: 'trial',
                autoRenew: false,
            } : undefined,
        };
        MOCK_INSTALLED_EXTENSIONS.push(newInstall);
        ext.installCount++;
        MOCK_AUDIT_LOGS.unshift({
            id: generateRandomId(), timestamp: new Date().toISOString(), action: 'INSTALL_EXTENSION', userId, extensionId, details: { extensionName: ext.name }
        });
        return newInstall;
    },

    uninstallExtension: async (installedExtensionId: string, userId: string): Promise<void> => {
        await delay(500);
        const index = MOCK_INSTALLED_EXTENSIONS.findIndex(inst => inst.id === installedExtensionId && inst.userId === userId);
        if (index === -1) throw new Error('Installed extension not found');
        
        const removed = MOCK_INSTALLED_EXTENSIONS.splice(index, 1)[0];
        const ext = MOCK_EXTENSIONS.find(e => e.id === removed.extensionId);
        if (ext) {
            ext.installCount = Math.max(0, ext.installCount - 1);
            MOCK_AUDIT_LOGS.unshift({
                id: generateRandomId(), timestamp: new Date().toISOString(), action: 'UNINSTALL_EXTENSION', userId, extensionId: ext.id, details: { extensionName: ext.name }
            });
        }
    },

    updateExtensionConfiguration: async (installedExtensionId: string, userId: string, config: Record<string, any>): Promise<InstalledExtension> => {
        await delay(400);
        const installed = MOCK_INSTALLED_EXTENSIONS.find(inst => inst.id === installedExtensionId && inst.userId === userId);
        if (!installed) throw new Error('Installed extension not found');
        
        const oldConfig = { ...installed.configuration };
        installed.configuration = { ...installed.configuration, ...config };
        MOCK_AUDIT_LOGS.unshift({
            id: generateRandomId(), timestamp: new Date().toISOString(), action: 'UPDATE_CONFIG', userId, extensionId: installed.extensionId, details: { extensionName: MOCK_EXTENSIONS.find(e => e.id === installed.extensionId)?.name, oldConfig, newConfig: config }
        });
        return { ...installed };
    },

    fetchDeveloperExtensions: async (developerId: string): Promise<DeveloperExtension[]> => {
        await delay(300);
        return MOCK_DEVELOPER_EXTENSIONS.filter(devExt => 
            MOCK_EXTENSIONS.find(ext => ext.id === devExt.id)?.developerInfo.id === developerId
        );
    },

    publishNewExtension: async (newExt: any): Promise<Extension> => {
        await delay(700);
        const id = `ext-${generateRandomId()}`;
        const extension: Extension = {
            ...newExt,
            id,
            lastUpdated: new Date().toISOString(),
            installCount: 0,
            rating: 0,
            version: newExt.initialVersion,
            changelog: [{ version: newExt.initialVersion, releaseDate: new Date().toISOString(), changes: ['Initial release'] }],
        };
        MOCK_EXTENSIONS.unshift(extension);
        MOCK_DEVELOPER_EXTENSIONS.unshift({
            id,
            name: extension.name,
            status: 'pending_review',
            version: extension.version,
            lastPublished: extension.lastUpdated,
            totalInstalls: 0,
            reviewsCount: 0,
            averageRating: 0,
            monetizationStatus: extension.price > 0 ? 'paid' : 'free',
            pendingUpdates: false,
        });
        return extension;
    },

    deletePublishedExtension: async (extensionId: string, developerId: string): Promise<void> => {
        await delay(500);
        const index = MOCK_EXTENSIONS.findIndex(ext => ext.id === extensionId && ext.developerInfo.id === developerId);
        if (index !== -1) MOCK_EXTENSIONS.splice(index, 1);
        
        const devIndex = MOCK_DEVELOPER_EXTENSIONS.findIndex(de => de.id === extensionId);
        if (devIndex !== -1) MOCK_DEVELOPER_EXTENSIONS.splice(devIndex, 1);
    },

    fetchExtensionAnalytics: async (extensionId: string): Promise<ExtensionAnalytics | null> => {
        await delay(300);
        return MOCK_ANALYTICS_DATA.find(data => data.extensionId === extensionId) || null;
    },

    fetchAuditLogs: async (params: { userId?: string; extensionId?: string; limit?: number }): Promise<AuditLogEntry[]> => {
        await delay(200);
        let logs = [...MOCK_AUDIT_LOGS];
        if (params.userId) logs = logs.filter(log => log.userId === params.userId);
        return logs.slice(0, params.limit || 50);
    },
};