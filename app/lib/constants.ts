/**
 * Application-wide constants and configuration
 */

/**
 * Meet types supported by the system
 */
export const MEET_TYPES = {
    EXHIBITION: 'Exhib',
    DUAL: 'Dual',
    QUALIFIER: 'Qual',
    DIVISIONAL: 'Div',
    ALL_STAR: 'Star',
    MULTI_DUAL: 'Multidual'
} as const;

export type MeetType = typeof MEET_TYPES[keyof typeof MEET_TYPES];

/**
 * Meet type display labels
 */
export const MEET_TYPE_LABELS: Record<MeetType, string> = {
    [MEET_TYPES.EXHIBITION]: 'Exhibition',
    [MEET_TYPES.DUAL]: 'Dual Meet',
    [MEET_TYPES.QUALIFIER]: 'Qualifier',
    [MEET_TYPES.DIVISIONAL]: 'Divisional',
    [MEET_TYPES.ALL_STAR]: 'All-Star',
    [MEET_TYPES.MULTI_DUAL]: 'Multi-Dual'
};

/**
 * Standard meet schedule configuration
 */
export const MEET_SCHEDULE = {
    /** Default start hour for dual meets (4 PM) */
    DUAL_MEET_START_HOUR: 16,
    /** Default start hour for divisional meets (8 AM) */
    DIVISIONAL_MEET_START_HOUR: 8,
    /** Default start hour for all-star meets (3 PM) */
    ALL_STAR_MEET_START_HOUR: 15,
    /** Default start hour for rookie meet (9 AM) */
    ROOKIE_MEET_START_HOUR: 9,
    /** Number of regular season weeks */
    REGULAR_SEASON_WEEKS: 5
} as const;

/**
 * Standard dual meet rotation pattern
 * Used to generate the regular season schedule
 */
export const DUAL_MEET_PLAN = [
    { week: 1, host: 1, visitor: 4 },
    { week: 1, host: 2, visitor: 5 },
    { week: 1, host: 3, visitor: 6 },
    { week: 2, host: 5, visitor: 1 },
    { week: 2, host: 3, visitor: 2 },
    { week: 2, host: 6, visitor: 4 },
    { week: 3, host: 1, visitor: 3 },
    { week: 3, host: 2, visitor: 6 },
    { week: 3, host: 4, visitor: 5 },
    { week: 4, host: 1, visitor: 6 },
    { week: 4, host: 4, visitor: 2 },
    { week: 4, host: 5, visitor: 3 },
    { week: 5, host: 2, visitor: 1 },
    { week: 5, host: 3, visitor: 4 },
    { week: 5, host: 6, visitor: 5 },
] as const;

/**
 * Season date configuration
 */
export const SEASON_DATES = {
    /** Season typically starts in June (month index 5) */
    START_MONTH: 5,
    /** Season typically ends in August (month index 7) */
    END_MONTH: 7
} as const;

/**
 * UI Constants
 */
export const UI = {
    /** Default number of items per page for pagination */
    DEFAULT_PAGE_SIZE: 20,
    /** Debounce delay for search inputs (ms) */
    SEARCH_DEBOUNCE_MS: 300,
    /** Toast notification duration (ms) */
    TOAST_DURATION_MS: 5000
} as const;

/**
 * Cache revalidation times (in seconds)
 */
export const CACHE_REVALIDATE = {
    /** Short-lived cache for frequently changing data */
    SHORT: 30,
    /** Medium cache for moderately stable data */
    MEDIUM: 60,
    /** Long cache for rarely changing data */
    LONG: 300
} as const;

/**
 * Gender constants
 */
export const GENDER = {
    FEMALE: 'F',
    MALE: 'M'
} as const;

export type Gender = typeof GENDER[keyof typeof GENDER];

/**
 * Gender display labels
 */
export const GENDER_LABELS: Record<Gender, string> = {
    [GENDER.FEMALE]: 'Girls',
    [GENDER.MALE]: 'Boys'
};
