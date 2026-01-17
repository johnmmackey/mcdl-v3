
/*

function x () {
    return (


                {divSlotCounts.map((d, index) => (
                    <Card key={d.divId} className='mb-8'>
                        <CardHeader>
                            <CardTitle className='text-center'>Div {d.divId}</CardTitle>
                        </CardHeader>

                        <CardContent className='px-2 md:px-8'>
                            {editMode &&
                                <>
                                    <div className='flex justify-center text-sm'># Teams:</div>
                                    <div className='flex justify-center mb-4' >

                                        <Select
                                            value={d.slotCount.toString()}
                                            onValueChange={val => handleSlotCountChange(d.divId, Number(val))}
                                        >
                                            <SelectTrigger className="">
                                                <SelectValue placeholder="# teams" />
                                            </SelectTrigger>

                                            <SelectContent>
                                                {[2, 3, 4, 5, 6].map(n => (
                                                    <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </>
                            }
                            {Array.from({ length: d.slotCount }).map((n, slotIndex) =>
                                <Droppable key={slotIndex} id={transformDivSeedToIndex(d.divId, slotIndex + 1, divSlotCounts)}>
                                    <div className='w-24 min-h-[62px] my-2 p-0 flex justify-center border rounded-lg'>
                                        {orderedTeams[transformDivSeedToIndex(d.divId, slotIndex + 1, divSlotCounts)]
                                            ? <DraggableTeam
                                                id={orderedTeams[transformDivSeedToIndex(d.divId, slotIndex + 1, divSlotCounts)]}
                                                label={orderedTeams[transformDivSeedToIndex(d.divId, slotIndex + 1, divSlotCounts)]}
                                                fullName={(teams.find(t => t.id === orderedTeams[transformDivSeedToIndex(d.divId, slotIndex + 1, divSlotCounts)])?.name) || ''}
                                                draggable={editMode}
                                            />
                                            : <span className='mt-3 text-lg opacity-20'>Seed {slotIndex + 1}</span>
                                        }
                                    </div>
                                </Droppable>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div className='flex w-full justify-center gap-8 flex-wrap' >

                {divSlotCounts.map((d, index) => (
                    <Card key={d.divId} className='mb-8'>
                        <CardHeader>
                            <CardTitle className='text-center'>Div {d.divId}</CardTitle>
                        </CardHeader>

                        <CardContent className='px-2 md:px-8'>
                            {editMode &&
                                <>
                                    <div className='flex justify-center text-sm'># Teams:</div>
                                    <div className='flex justify-center mb-4' >

                                        <Select
                                            value={d.slotCount.toString()}
                                            onValueChange={val => handleSlotCountChange(d.divId, Number(val))}
                                        >
                                            <SelectTrigger className="">
                                                <SelectValue placeholder="# teams" />
                                            </SelectTrigger>

                                            <SelectContent>
                                                {[2, 3, 4, 5, 6].map(n => (
                                                    <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </>
                            }
                            {Array.from({ length: d.slotCount }).map((n, slotIndex) =>
                                <Droppable key={slotIndex} id={transformDivSeedToIndex(d.divId, slotIndex + 1, divSlotCounts)}>
                                    <div className='w-24 min-h-[62px] my-2 p-0 flex justify-center border rounded-lg'>
                                        {orderedTeams[transformDivSeedToIndex(d.divId, slotIndex + 1, divSlotCounts)]
                                            ? <DraggableTeam
                                                id={orderedTeams[transformDivSeedToIndex(d.divId, slotIndex + 1, divSlotCounts)]}
                                                label={orderedTeams[transformDivSeedToIndex(d.divId, slotIndex + 1, divSlotCounts)]}
                                                fullName={(teams.find(t => t.id === orderedTeams[transformDivSeedToIndex(d.divId, slotIndex + 1, divSlotCounts)])?.name) || ''}
                                                draggable={editMode}
                                            />
                                            : <span className='mt-3 text-lg opacity-20'>Seed {slotIndex + 1}</span>
                                        }
                                    </div>
                                </Droppable>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>


            {editMode &&
                <div>
                    <Card className='mb-8 w-full'>
                        <CardHeader>
                            <CardTitle>Unassigned Teams</CardTitle>
                        </CardHeader>
                        <CardContent className='flex flex-wrap'>
                            {teams.filter(t => !orderedTeams.includes(t.id)).map((team, index) => (

                                <DraggableTeam key={team.id} id={team.id} label={team.id} fullName={team.name || ''} draggable={true} />

                            ))}

                        </CardContent>
                    </Card>
                </div>
            }
        </DndContext>
    )
}

*/