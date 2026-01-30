'use server'

import { auth } from "@/auth"
import { notFound } from "next/navigation"
import { getAccessToken } from "@/app/lib/accessTokens"
import { GenericServerActionState } from "../types/baseTypes"

/**
 * Base API configuration
 */
const API_BASE_URL = process.env.DATA_URL;

/**
 * Default cache configuration for GET requests
 */
const DEFAULT_CACHE_CONFIG = {
    revalidate: 30
} as const;

/**
 * Custom fetch wrapper that handles errors consistently
 */
export async function apiFetch<T>(
    endpoint: string,
    options?: RequestInit & { tags?: string[] }
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const { tags, ...fetchOptions } = options || {};

    const response = await fetch(url, {
        ...fetchOptions,
        next: {
            ...DEFAULT_CACHE_CONFIG,
            ...(tags && { tags })
        }
    });

    if (!response.ok) {
        if (response.status === 404) {
            notFound();
        }
        const text = await response.text();
        throw new Error(`Error fetching ${url}: ${response.status} ${response.statusText}${text ? ` - ${text}` : ''}`);
    }

    return response.json();
}

/**
 * Get the current user's access token for authenticated requests
 */
export async function getAuthToken(): Promise<string> {
    const session = await auth();
    if (!session || !session.user) {
        throw new Error('Authentication required');
    }
    const token = await getAccessToken(session.user.id as string);
    if (!token) {
        throw new Error('Unable to retrieve access token');
    }
    return token;
}

/**
 * Authenticated fetch wrapper for mutations (POST, PATCH, DELETE)
 */
export async function apiMutate<T>(
    endpoint: string,
    method: 'POST' | 'PATCH' | 'DELETE',
    body?: unknown
): Promise<Response> {
    const token = await getAuthToken();
    const url = `${API_BASE_URL}${endpoint}`;

    return fetch(url, {
        method,
        body: body ? JSON.stringify(body) : undefined,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
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
    return createErrorResult<T>(`${response.statusText}${text ? `: ${text}` : ''}`);
}
