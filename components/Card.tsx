import React from 'react';

interface CardProps {
    title?: string;
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'interactive';
}

const Card: React.FC<CardProps> = ({ title, children, className = '', variant = 'default' }) => {
    const baseClasses = "bg-gray-800 border border-gray-700 rounded-xl overflow-hidden";
    const variantClasses = variant === 'interactive' 
        ? "transition-all duration-300 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 cursor-pointer" 
        : "shadow-md";

    return (
        <div className={`${baseClasses} ${variantClasses} ${className}`}>
            {title && (
                <div className="px-6 py-4 border-b border-gray-700/50">
                    <h3 className="text-lg font-semibold text-white">{title}</h3>
                </div>
            )}
            <div className="p-6 h-full flex flex-col">
                {children}
            </div>
        </div>
    );
};

export default Card;