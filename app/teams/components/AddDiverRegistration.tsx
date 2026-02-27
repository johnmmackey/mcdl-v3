"use client";
import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { DiverWithSeason, DiverBase } from '@/app/lib/types/diver';
import { createDiverSeasonRegistration, createDiver } from '@/app/lib/api';
import { DiverForm } from './DiverForm';
import { Processing } from "@/app/ui/Processing";

export const AddDiverRegistration = ({
    teamId,
    seasonId,
    allTeamDivers,
    children,
}: Readonly<{
    teamId: string,
    seasonId: number,
    allTeamDivers: DiverWithSeason[],
    children?: React.ReactNode,
}>) => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [selectedDiverId, setSelectedDiverId] = useState<number | null>(null);

    // Filter out divers already registered for this season
    const unregisteredDivers = allTeamDivers.filter(d => 
        !d.seasons.some(s => s.seasonId === seasonId)
    );

    const handleRegisterExisting = () => {
        if (!selectedDiverId) {
            toast.error('Please select a diver');
            return;
        }

        startTransition(async () => {
            const result = await createDiverSeasonRegistration({
                diverId: selectedDiverId,
                seasonId: seasonId,
                ageGroupId: 0, // Will be calculated by backend
                firstYear: false,
                inactive: false,
                registrationDate: new Date().toISOString().split('T')[0],
            });

            if (result.error) {
                toast.error('Registration failed', { description: result.error.msg });
            } else {
                toast.success('Diver registered for season');
                setOpen(false);
                setSelectedDiverId(null);
                router.refresh();
            }
        });
    };

    const handleNewDiverSuccess = () => {
        setOpen(false);
        router.refresh();
    };

    const handleCreateNewDiverWithRegistration = async (diverData: Omit<DiverBase, 'id' | 'createDate'>) => {
        startTransition(async () => {
            // First create the diver
            const diverResult = await createDiver(diverData);
            
            if (diverResult.error) {
                toast.error('Failed to create diver', { description: diverResult.error.msg });
                return;
            }

            // Then register them for the season
            if (diverResult.data?.id) {
                const registrationResult = await createDiverSeasonRegistration({
                    diverId: diverResult.data.id,
                    seasonId: seasonId,
                    ageGroupId: 0, // Will be calculated by backend
                    firstYear: true, // New divers are typically first year
                    inactive: false,
                    registrationDate: new Date().toISOString().split('T')[0],
                });

                if (registrationResult.error) {
                    toast.error('Diver created but registration failed', { 
                        description: registrationResult.error.msg 
                    });
                } else {
                    toast.success('Diver created and registered for season');
                    setOpen(false);
                    router.refresh();
                }
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children || <Button>Add Diver Registration</Button>}
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add Diver to Season {seasonId}</DialogTitle>
                    <DialogDescription>
                        Register an existing diver or create a new one for the team.
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="existing" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="existing">Existing Diver</TabsTrigger>
                        <TabsTrigger value="new">New Diver</TabsTrigger>
                    </TabsList>

                    <TabsContent value="existing" className="space-y-4">
                        {unregisteredDivers.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                All team divers are already registered for this season.
                                Create a new diver instead.
                            </div>
                        ) : (
                            <>
                                <div className="text-sm text-muted-foreground mb-2">
                                    Select a diver who has been part of this team:
                                </div>
                                <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {unregisteredDivers.map((diver) => (
                                        <div
                                            key={diver.id}
                                            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                                selectedDiverId === diver.id
                                                    ? 'border-primary bg-primary/10'
                                                    : 'hover:bg-muted'
                                            }`}
                                            onClick={() => setSelectedDiverId(diver.id)}
                                        >
                                            <div className="font-medium">
                                                {diver.firstName} {diver.lastName}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {diver.gender} • {diver.birthdate ? new Date(diver.birthdate).toLocaleDateString() : 'No birthdate'}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                Previously in seasons: {diver.seasons.map(s => s.seasonId).join(', ') || 'None'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Button 
                                    onClick={handleRegisterExisting}
                                    disabled={!selectedDiverId || isPending}
                                    className="w-full"
                                >
                                    Register Selected Diver
                                </Button>
                            </>
                        )}
                    </TabsContent>

                    <TabsContent value="new" className="space-y-4">
                        <div className="text-sm text-muted-foreground mb-4">
                            Create a new diver and automatically register them for season {seasonId}:
                        </div>
                        <DiverForm 
                            teamId={teamId} 
                            onSubmit={handleCreateNewDiverWithRegistration}
                        />
                    </TabsContent>
                </Tabs>

                <Processing open={isPending} />
            </DialogContent>
        </Dialog>
    );
};
