"use client";
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { SearchIcon } from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

import { DiverWithSeason, DiverBase } from '@/app/lib/types/diver';
import { createDiverSeasonRegistration, createDiver } from '@/app/lib/api';
import { DiverForm } from './DiverForm';
import { Processing } from "@/app/ui/Processing";

export const AddRegistrationClient = ({
    teamId,
    seasonId,
    allTeamDivers,
}: Readonly<{
    teamId: string,
    seasonId: number,
    allTeamDivers: DiverWithSeason[],
}>) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDiverIds, setSelectedDiverIds] = useState<Set<number>>(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const diversPerPage = 50;

    // Filter out divers already registered for this season
    const unregisteredDivers = allTeamDivers.filter(d => 
        !d.seasons.some(s => s.seasonId === seasonId)
    );

    // Filter by search query
    const filteredDivers = unregisteredDivers.filter(d => {
        const query = searchQuery.toLowerCase();
        return (
            d.firstName.toLowerCase().includes(query) ||
            d.lastName.toLowerCase().includes(query) ||
            `${d.firstName} ${d.lastName}`.toLowerCase().includes(query)
        );
    });

    // Pagination calculations
    const totalPages = Math.ceil(filteredDivers.length / diversPerPage);
    const startIndex = (currentPage - 1) * diversPerPage;
    const endIndex = startIndex + diversPerPage;
    const paginatedDivers = filteredDivers.slice(startIndex, endIndex);

    // Reset to page 1 when search changes
    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
    };

    const toggleDiverSelection = (diverId: number) => {
        setSelectedDiverIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(diverId)) {
                newSet.delete(diverId);
            } else {
                newSet.add(diverId);
            }
            return newSet;
        });
    };

    const handleRegisterExisting = () => {
        if (selectedDiverIds.size === 0) {
            toast.error('Please select at least one diver');
            return;
        }

        startTransition(async () => {
            let successCount = 0;
            let errorCount = 0;
            const errors: string[] = [];

            for (const diverId of selectedDiverIds) {
                const result = await createDiverSeasonRegistration({
                    diverId: diverId,
                    seasonId: seasonId,
                    ageGroupId: 0, // Will be calculated by backend
                    firstYear: false,
                    inactive: false,
                    registrationDate: new Date().toISOString().split('T')[0],
                });

                if (result.error) {
                    errorCount++;
                    const diver = allTeamDivers.find(d => d.id === diverId);
                    errors.push(`${diver?.firstName} ${diver?.lastName}`);
                } else {
                    successCount++;
                }
            }

            if (successCount > 0) {
                toast.success(`${successCount} diver${successCount > 1 ? 's' : ''} registered for season`);
            }
            if (errorCount > 0) {
                toast.error(`Failed to register ${errorCount} diver${errorCount > 1 ? 's' : ''}`, {
                    description: errors.join(', ')
                });
            }
            
            router.push(`/teams/${teamId}/divers`);
        });
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
                    router.push(`/teams/${teamId}/divers`);
                }
            }
        });
    };

    return (
        <div>
            <Tabs defaultValue="existing" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
                    <TabsTrigger value="existing">Select Existing Diver</TabsTrigger>
                    <TabsTrigger value="new">Create New Diver</TabsTrigger>
                </TabsList>

                <TabsContent value="existing" className="space-y-4">
                    {unregisteredDivers.length === 0 ? (
                        <Card className="p-8 text-center text-muted-foreground">
                            <p className="text-lg mb-2">All team divers are already registered for this season.</p>
                            <p className="text-sm">Switch to the "Create New Diver" tab to add a new team member.</p>
                        </Card>
                    ) : (
                        <>
                            <div className="mb-4">
                                <div className="relative max-w-md">
                                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder="Search divers by name..."
                                        value={searchQuery}
                                        onChange={(e) => handleSearchChange(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <p className="text-sm text-muted-foreground">
                                        {filteredDivers.length} of {unregisteredDivers.length} divers • {selectedDiverIds.size} selected
                                    </p>
                                    {totalPages > 1 && (
                                        <p className="text-sm text-muted-foreground">
                                            Page {currentPage} of {totalPages}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="border rounded-lg">
                                {filteredDivers.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        No divers found matching "{searchQuery}"
                                    </div>
                                ) : (
                                    <div className="divide-y">
                                        {paginatedDivers
                                            .sort((a, b) => a.lastName.localeCompare(b.lastName))
                                            .map((diver) => (
                                                <div
                                                    key={diver.id}
                                                    className="flex items-center gap-3 px-3 py-2 hover:bg-muted cursor-pointer transition-colors"
                                                    onClick={() => toggleDiverSelection(diver.id)}
                                                >
                                                    <Checkbox
                                                        checked={selectedDiverIds.has(diver.id)}
                                                        onCheckedChange={() => toggleDiverSelection(diver.id)}
                                                    />
                                                    <div className="flex-1 font-medium">
                                                        {diver.firstName} {diver.lastName} <span className="text-muted-foreground">({diver.gender})</span>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                )}
                            </div>

                            {totalPages > 1 && (
                                <div className="flex items-center justify-between pt-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </Button>
                                    <div className="flex gap-2">
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            let pageNum;
                                            if (totalPages <= 5) {
                                                pageNum = i + 1;
                                            } else if (currentPage <= 3) {
                                                pageNum = i + 1;
                                            } else if (currentPage >= totalPages - 2) {
                                                pageNum = totalPages - 4 + i;
                                            } else {
                                                pageNum = currentPage - 2 + i;
                                            }
                                            return (
                                                <Button
                                                    key={pageNum}
                                                    variant={currentPage === pageNum ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => setCurrentPage(pageNum)}
                                                    className="w-10"
                                                >
                                                    {pageNum}
                                                </Button>
                                            );
                                        })}
                                    </div>
                                    <Button
                                        variant="outline"
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                    </Button>
                                </div>
                            )}

                            <div className="flex gap-4 pt-4 border-t">
                                <Button 
                                    onClick={handleRegisterExisting}
                                    disabled={selectedDiverIds.size === 0 || isPending}
                                    size="lg"
                                >
                                    Register {selectedDiverIds.size > 0 ? `${selectedDiverIds.size} ` : ''}Selected Diver{selectedDiverIds.size !== 1 ? 's' : ''}
                                </Button>
                                <Button 
                                    variant="outline"
                                    onClick={() => router.push(`/teams/${teamId}/divers`)}
                                    disabled={isPending}
                                    size="lg"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </>
                    )}
                </TabsContent>

                <TabsContent value="new" className="space-y-4">
                    <Card className="p-6 max-w-2xl">
                        <h3 className="text-lg font-semibold mb-4">Create New Diver</h3>
                        <p className="text-sm text-muted-foreground mb-6">
                            This will create a new diver for the team and automatically register them for season {seasonId}.
                        </p>
                        <DiverForm 
                            teamId={teamId} 
                            onSubmit={handleCreateNewDiverWithRegistration}
                            showCancelButton={false}
                        />
                        <div className="flex gap-4 pt-4 border-t mt-6">
                            <Button 
                                type="button"
                                variant="outline"
                                onClick={() => router.push(`/teams/${teamId}/divers`)}
                                disabled={isPending}
                            >
                                Cancel
                            </Button>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>

            <Processing open={isPending} />
        </div>
    );
};
