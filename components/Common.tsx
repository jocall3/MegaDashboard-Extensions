import React from 'react';

export const truncateText = (text: string, length: number) => {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
};

export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

export const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-400"></div>
        <p className="ml-4 text-cyan-300 font-medium animate-pulse">Loading...</p>
    </div>
);

export const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
    <div className="bg-red-900/20 border border-red-800 text-red-200 p-4 rounded-lg flex items-center gap-3 my-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="font-medium">Error: {message}</span>
    </div>
);

export const RatingStars: React.FC<{ rating: number; maxStars?: number }> = ({ rating, maxStars = 5 }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = maxStars - fullStars - halfStar;

    return (
        <div className="flex items-center text-yellow-400 text-sm">
            {Array(fullStars).fill(0).map((_, i) => <span key={`full-${i}`}>★</span>)}
            {halfStar === 1 && <span key="half">½</span>}
            {Array(emptyStars).fill(0).map((_, i) => <span key={`empty-${i}`} className="text-gray-600">☆</span>)}
            <span className="ml-2 text-xs text-gray-400 font-mono">({rating.toFixed(1)})</span>
        </div>
    );
};

export const PaginationControls: React.FC<{ currentPage: number; totalPages: number; onPageChange: (page: number) => void }> = ({ currentPage, totalPages, onPageChange }) => {
    const pagesToShow = 5;
    const startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + pagesToShow - 1);
    const pages = Array.from({ length: (endPage - startPage + 1) }, (_, i) => startPage + i);

    return (
        <div className="flex justify-center items-center space-x-2 py-8 mt-4 border-t border-gray-800">
            <button
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                First
            </button>
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                Previous
            </button>
            {pages.map(page => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${currentPage === page ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/50' : 'bg-gray-800 hover:bg-gray-700 text-gray-300'}`}
                >
                    {page}
                </button>
            ))}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                Next
            </button>
            <button
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                Last
            </button>
        </div>
    );
};