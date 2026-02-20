'use server'

import { updateTag } from "next/cache"
import { apiFetch, apiMutate, handleMutationResponse } from "./client"
import { User, UserCreateInput, UserUpdateInput } from "@/app/lib/types/user";
import type { GenericServerActionState } from "@/app/lib/types/baseTypes";

export async function fetchUsers(): Promise<User[]> {
    return apiFetch<User[]>(`/users`, { cache: 'no-store', includeAuth: true });
}

export async function fetchUser(userId: string): Promise<User> {
    return apiFetch<User>(`/users/${userId}`, { cache: 'no-store', includeAuth: true });
}

export async function createUser(user: UserCreateInput): Promise<GenericServerActionState<User>> {
    const response = await apiMutate(
        `/users`,
        'POST',
        user
    );

    if (response.ok) {
        updateTag('users');
    }

    return handleMutationResponse<User>(response);
}

export async function updateUser(userId: string, user: UserUpdateInput): Promise<GenericServerActionState<User>> {
    const response = await apiMutate(
        `/users/${userId}`,
        'POST',
        user
    );

    if (response.ok) {
        updateTag('users');
    }

    return handleMutationResponse<User>(response);
}
