import { useState, useEffect, useCallback } from 'react';
import { Extension, ExtensionReview, InstalledExtension, DeveloperExtension } from '../types';
import { mockApiService } from '../services/api';

export const useExtensions = (params: Parameters<typeof mockApiService.fetchExtensions>[0]) => {
    const [extensions, setExtensions] = useState<Extension[]>([]);
    const [totalExtensions, setTotalExtensions] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            setError(null);
            try {
                const { extensions: fetchedExtensions, total } = await mockApiService.fetchExtensions(params);
                setExtensions(fetchedExtensions);
                setTotalExtensions(total);
            } catch (err) {
                setError('Failed to fetch extensions.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [params.query, params.category, params.priceFilter, params.minRating, params.sortBy, params.sortOrder, params.page]);

    return { extensions, totalExtensions, loading, error };
};

export const useInstalledExtensions = (userId: string) => {
    const [installedExtensions, setInstalledExtensions] = useState<InstalledExtension[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshInstalled = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const fetched = await mockApiService.fetchInstalledExtensions(userId);
            setInstalledExtensions(fetched);
        } catch (err) {
            setError('Failed to fetch installed extensions.');
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        refreshInstalled();
    }, [refreshInstalled]);

    return { installedExtensions, loading, error, refreshInstalled, setInstalledExtensions };
};

export const useDeveloperExtensions = (developerId: string) => {
    const [developerExtensions, setDeveloperExtensions] = useState<DeveloperExtension[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshDeveloperExtensions = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const fetched = await mockApiService.fetchDeveloperExtensions(developerId);
            setDeveloperExtensions(fetched);
        } catch (err) {
            setError('Failed to fetch developer extensions.');
        } finally {
            setLoading(false);
        }
    }, [developerId]);

    useEffect(() => {
        refreshDeveloperExtensions();
    }, [refreshDeveloperExtensions]);

    return { developerExtensions, loading, error, refreshDeveloperExtensions };
};