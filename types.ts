import React from 'react';

export interface Extension {
    id: string;
    name: string;
    publisher: string;
    description: string;
    icon: React.ReactNode;
    recommended?: boolean;
    category: string;
    tags: string[];
    rating: number;
    installCount: number;
    price: number;
    lastUpdated: string;
    version: string;
    screenshots: string[];
    documentationUrl: string;
    privacyPolicyUrl: string;
    developerInfo: {
        id: string;
        name: string;
        contactEmail: string;
        website?: string;
    };
    pricingPlans?: PricingPlan[];
    changelog?: ExtensionVersionLog[];
}

export interface PricingPlan {
    id: string;
    name: string;
    description: string;
    priceMonthly: number;
    priceAnnually: number;
    features: string[];
}

export interface ExtensionVersionLog {
    version: string;
    releaseDate: string;
    changes: string[];
}

export interface ExtensionCategory {
    id: string;
    name: string;
    icon: React.ReactNode;
    description: string;
}

export interface ExtensionReview {
    id: string;
    extensionId: string;
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    timestamp: string;
}

export interface InstalledExtension {
    id: string;
    extensionId: string;
    userId: string;
    installationDate: string;
    enabled: boolean;
    configuration: Record<string, any>;
    subscription?: SubscriptionDetails;
}

export interface SubscriptionDetails {
    planId: string;
    startDate: string;
    endDate: string;
    status: 'active' | 'cancelled' | 'trial';
    autoRenew: boolean;
}

export interface DeveloperExtension {
    id: string;
    name: string;
    status: 'published' | 'draft' | 'pending_review' | 'rejected' | 'archived';
    version: string;
    lastPublished: string;
    totalInstalls: number;
    reviewsCount: number;
    averageRating: number;
    monetizationStatus: 'free' | 'paid' | 'subscription';
    pendingUpdates: boolean;
}

export interface AuditLogEntry {
    id: string;
    timestamp: string;
    action: string;
    userId: string;
    extensionId?: string;
    details: Record<string, any>;
}

export interface ExtensionAnalytics {
    extensionId: string;
    period: 'daily' | 'weekly' | 'monthly';
    data: {
        date: string;
        installs: number;
        uninstalls: number;
        activeUsers: number;
        revenue?: number;
        errors?: number;
    }[];
}

export type UserRole = 'standard_user' | 'developer' | 'admin';

export interface UserContextType {
    currentUser: { id: string; name: string; role: UserRole };
    setCurrentUser: (user: { id: string; name: string; role: UserRole }) => void;
}