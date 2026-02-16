'use server'

import { notFound, redirect } from "next/navigation"
import { getAccessToken } from "@/app/lib/accessTokens"
import { GenericServerActionState } from "../types/baseTypes"

/**
 * Base API configuration
 */
const API_BASE_URL = process.env.DATA_URL;

/**
 * Default cache configuration for GET requests
 */
const DEFAULT_CACHE_LIFETIME = 30;

/**
 * Custom fetch wrapper that handles errors consistently
 */
export async function apiFetch<T>(
    endpoint: string,
    options?: RequestInit & { tags?: string[], cache?: RequestCache, cacheLifeTime?: number, includeAuth?: boolean, blob?: boolean }
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const { tags, includeAuth = false, cache, cacheLifeTime, ...fetchOptions } = options || {};
    const token = includeAuth ? await getAccessToken() : null;

    const opt = {
        ...(cache ? {cache: cache} : {}),
        ...fetchOptions,
        next: {
            ...( (!cache || !(['no-cache', 'no-store'].includes(cache))) && {revalidate: cacheLifeTime !== undefined ? cacheLifeTime : DEFAULT_CACHE_LIFETIME}),
            ...(tags && { tags })
        },
        headers: {
            ...(token && {
                "Authorization": `Bearer ${token}`
            }),
            ...fetchOptions.headers
        }
    };

    const response = await fetch(url, opt);

    if (!response.ok) {
        if (response.status === 404) {
            notFound();
        } else if (response.status === 401) {
            // For 401 errors, we want to redirect to the logging out page, which will handle clearing the session and redirecting to the home page afterwards. This is necessary because the 401 could be due to an expired token, and we want to ensure the user is properly logged out and prompted to log in again. 
            redirect('/logging-out');
        }
        const text = await response.text();
        throw new Error(`Error fetching ${url}: ${response.status} ${response.statusText}${text ? ` - ${text}` : ''}`);
    }
    return options?.blob ? response.blob() as Promise<T> : response.json();
}


/**
 * Authenticated fetch wrapper for mutations (POST, PATCH, DELETE)
 */
export async function apiMutate<T>(
    endpoint: string,
    method: 'POST' | 'PATCH' | 'DELETE',
    body?: unknown
): Promise<Response> {
    const token = await getAccessToken();
    const url = `${API_BASE_URL}${endpoint}`;

    return fetch(url, {
        method,
        body: body ? JSON.stringify(body) : undefined,

        headers: {
            "Content-Type": "application/json",
            ...(token && {
                "Authorization": `Bearer ${token}`
            })
        }
    });
}

/**
 * Helper to create a standardized server action result
 */
export async function createSuccessResult<T>(data: T | null = null): Promise<GenericServerActionState<T>> {
    return { error: null, data };
}

/**
 * Helper to create a standardized error result
 */
export async function createErrorResult<T>(msg: string): Promise<GenericServerActionState<T>> {
    return {
        error: { msg, seq: Date.now() },
        data: null
    };
}

/**
 * Helper to handle mutation responses and return standardized results
 */
export async function handleMutationResponse<T>(
    response: Response
): Promise<GenericServerActionState<T>> {
    if (response.ok) {
        return createSuccessResult<T>(null);
    }
    const text = await response.text();
    return createErrorResult<T>(`${text ? `${text}` : `${response.statusText}`}`);
}
