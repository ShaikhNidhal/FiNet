import React from 'react';
import { useSubscription } from '../hooks/useSubscription';

const SubscriptionBanner: React.FC = () => {
    const { isTrial, trialDaysRemaining, isExpired, isPro } = useSubscription();

    if (isPro) return null;

    return (
        <div className={`w-full py-2 px-4 text-center text-sm font-medium transition-all duration-500 ${
            isExpired ? 'bg-rose-600 text-white' : 'bg-sky-600/10 text-sky-600 dark:text-sky-400 border-b border-sky-500/20'
        }`}>
            {isExpired ? (
                <div className="flex items-center justify-center gap-2">
                    <span>Your trial has expired. Upgrade to Pro to continue using advanced AI features.</span>
                    <button className="bg-white text-rose-600 px-3 py-1 rounded-full text-xs font-bold hover:bg-rose-50 transition-colors">
                        Upgrade Now
                    </button>
                </div>
            ) : (
                <div className="flex items-center justify-center gap-4">
                    <span>🚀 <strong>Free Trial Active:</strong> {trialDaysRemaining} days remaining.</span>
                    <button className="underline hover:text-sky-500 transition-colors">
                        View Pro Plans
                    </button>
                </div>
            )}
        </div>
    );
};

export default SubscriptionBanner;
