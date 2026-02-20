'use server'

import { apiFetch, apiMutate, handleMutationResponse } from "./client"
import { User } from "@/app/lib/types/user";

export async function fetchUsers(): Promise<User[]> {
    return apiFetch<User[]>(`/users`, { cache: 'no-store', includeAuth: true });
}

export async function fetchUser(userId: string): Promise<User> {
    return apiFetch<User>(`/users/${userId}`, { cache: 'no-store', includeAuth: true });
}