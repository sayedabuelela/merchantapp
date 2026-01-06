import { selectUser, useAuthStore } from '@/src/modules/auth/auth.store';
import useOnboardingDataViewModel from '../data/onboarding-data.viewmodel';
import { ApprovalStatus } from '../data/onboarding-data.model';

interface UseApprovalBasedSubmitReturn {
    // True if edits should be saved locally (user is live - full submit only)
    shouldSaveLocally: boolean;
    // True if partial submit is allowed (user is not live)
    canPartialSubmit: boolean;
    // True if full submit is allowed
    canFullSubmit: boolean;
    // True if editing is completely blocked (submitted status)
    isLocked: boolean;
    // Current approval status
    approvalStatus: ApprovalStatus | undefined;
}

/**
 * Hook to determine submission behavior based on user.isLive and isApprovedBusinessInfo.
 *
 * Scenarios:
 * - isLive=false, pending: New user onboarding - can partial submit
 * - isLive=false, submitted: First request under review - locked
 * - isLive=true, approved: Live user - can edit (save locally, full submit)
 * - isLive=true, pending: Live user with change request pending - locked
 * - isLive=true, submitted: Live user change request under review - locked
 * - rejected: Can edit (save locally, full submit)
 */
const useApprovalBasedSubmit = (): UseApprovalBasedSubmitReturn => {
    const user = useAuthStore(selectUser);
    const { onboardingData } = useOnboardingDataViewModel();

    // Use isLive from auth user to determine submission behavior
    const isUserLive = user?.isLive ?? false;

    // Use isApprovedBusinessInfo for lock status
    const isApprovedBusinessInfo = onboardingData?.isApprovedBusinessInfo;

    // Locked scenarios:
    // - isApprovedBusinessInfo='submitted' (under review)
    // - isLive=true AND isApprovedBusinessInfo='pending' (live user with change request pending)
    const isLocked =
        isApprovedBusinessInfo === 'submitted' ||
        (isUserLive && isApprovedBusinessInfo === 'pending');

    // If user is live, save locally and full submit only (don't use onborad endpoints)
    const shouldSaveLocally = isUserLive;

    // Can partial submit only for new user onboarding (isLive=false, not locked)
    const canPartialSubmit = !isUserLive && !isLocked;

    // Can full submit when not locked
    const canFullSubmit = !isLocked;

    return {
        shouldSaveLocally,
        canPartialSubmit,
        canFullSubmit,
        isLocked,
        approvalStatus: isApprovedBusinessInfo,
    };
};

export default useApprovalBasedSubmit;
