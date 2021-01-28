import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';

function recordStreakCelebration(org, courseId) {
  // Tell our analytics
  const { administrator } = getAuthenticatedUser();
  sendTrackEvent('edx.ui.lms.celebration.streak.opened', {
    org_key: org,
    courserun_key: courseId,
    course_id: courseId, // should only be courserun_key, but left as-is for historical reasons
    is_staff: administrator,
  });
}

export default recordStreakCelebration;
