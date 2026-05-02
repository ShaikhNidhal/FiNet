import { useState, useEffect } from 'react';
import { SubscriptionStatus } from '../types';

const TRIAL_DURATION_DAYS = 30;

export const useSubscription = () => {
    const [status, setStatus] = useState<SubscriptionStatus>({
        isTrial: true,
        trialDaysRemaining: TRIAL_DURATION_DAYS,
        isExpired: false,
        isPro: false,
    });

    useEffect(() => {
        const storedStartDate = localStorage.getItem('finet_trial_start');
        const isProUser = localStorage.getItem('finet_is_pro') === 'true';
        
        let startDate: number;
        
        if (!storedStartDate) {
            startDate = Date.now();
            localStorage.setItem('finet_trial_start', startDate.toString());
        } else {
            startDate = parseInt(storedStartDate, 10);
        }

        const msInDay = 24 * 60 * 60 * 1000;
        const elapsedDays = Math.floor((Date.now() - startDate) / msInDay);
        const remainingDays = Math.max(0, TRIAL_DURATION_DAYS - elapsedDays);
        
        setStatus({
            isTrial: !isProUser,
            trialDaysRemaining: remainingDays,
            isExpired: !isProUser && remainingDays <= 0,
            isPro: isProUser,
        });
    }, []);

    const upgradeToPro = () => {
        localStorage.setItem('finet_is_pro', 'true');
        setStatus(prev => ({ ...prev, isTrial: false, isPro: true, isExpired: false }));
    };

    return { ...status, upgradeToPro };
};
