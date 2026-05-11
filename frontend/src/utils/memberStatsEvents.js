export const MEMBER_STATS_CHANGED_EVENT = "ttm-member-stats-changed";

export function notifyMemberStatsChanged() {
  window.dispatchEvent(new Event(MEMBER_STATS_CHANGED_EVENT));
}
