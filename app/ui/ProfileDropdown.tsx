'use client';

import { signIn, signOut } from "@/lib/auth-client"
import { useRouter } from 'next/navigation';
import type { Session } from "@/lib/auth";
import Link from 'next/link';

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ShieldAlertIcon, UsersIcon } from 'lucide-react'
import { SettingsIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { toast } from "sonner";

import {
    UserIcon,
    CreditCardIcon,
    SquarePenIcon,
    CirclePlusIcon,
    LogOutIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

import { userInitials } from '@/app/lib/userInitials';

type Props = {
    trigger: ReactNode
    defaultOpen?: boolean
    align?: 'start' | 'center' | 'end',
    session: Session
}

export const ProfileDropdown = ({ trigger, defaultOpen, align = 'end', session }: Props) => {
    const router = useRouter();
    const handleSignOut = async () => {
        await signOut();
        router.push(process.env.NEXT_PUBLIC_LOGOUT_URL || '/');
    }

    return (
        <DropdownMenu defaultOpen={defaultOpen}>
            <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
            <DropdownMenuContent className='w-80' align={align || 'end'}>
                <DropdownMenuLabel className='flex items-center gap-4 px-4 py-2.5 font-normal'>
                    <div className='relative'>
                        <Avatar className='size-10'>
                            <AvatarFallback>{userInitials(session.user?.name ?? '')}</AvatarFallback>
                        </Avatar>

                    </div>
                    <div className='flex flex-1 flex-col items-start'>
                        {session && session.user &&
                            <>
                                <span className='text-foreground text-lg font-semibold'>{session.user.name}</span>
                                <span className='text-muted-foreground text-base'>{session.user.email}</span>
                            </>
                        }
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <DropdownMenuItem className='px-4 py-2.5 text-base'>
                        <UserIcon className='text-foreground size-5' />
                        <span>My account</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className='px-4 py-2.5 text-base'>
                        <SettingsIcon className='text-foreground size-5' />
                        <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className='px-4 py-2.5 text-base' onClick={() => router.push('/user-advanced')}>
                       <ShieldAlertIcon className='text-foreground size-5' />
                            <span>
                                 Advanced
                            </span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <DropdownMenuItem className='px-4 py-2.5 text-base'>
                        <UsersIcon className='text-foreground size-5' />
                        <span>Manage team</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className='px-4 py-2.5 text-base'>
                        <SquarePenIcon className='text-foreground size-5' />
                        <span>Customization</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className='px-4 py-2.5 text-base'>
                        <CirclePlusIcon className='text-foreground size-5' />
                        <span>Add team account</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem variant='destructive' className='px-4 py-2.5 text-base' onClick={handleSignOut}>
                    <LogOutIcon className='size-5' />
                    <span>Logout</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}


export const LoginButton = () => {
    return (
        <Button variant='outline' onClick={() => signIn.social({ provider: 'cognito', callbackURL: '/dashboard' })}>
            Log In
        </Button>
    )
}


