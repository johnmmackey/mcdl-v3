import { useState } from 'react';
import { ActionIcon, Button, CheckIcon, Combobox, Grid, GridCol, Group, Menu, MenuDropdown, Pill, PillsInput, useCombobox } from '@mantine/core';
import { IconChevronRight, IconPlus, IconX, IconSettings, IconChevronDown, IconSelector} from '@tabler/icons-react';
import classes from "./teamselect.module.css"

import { Team, TeamSeason } from '@/app/lib/definitions';

export const TeamSelect = ({
    teams,
    mTeams,
    setMTeams
}: Readonly<{
    teams: string[],
    mTeams: string[],
    setMTeams: (( fn: (s: string[]) => string[] ) => void ) & ((s: string[]) => void)
}>) => {
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
        onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
    });

    const [search, setSearch] = useState('');


    const handlemTeamsSelect = (val: string) => {
        setMTeams((current) =>
            current.includes(val) ? current.filter((v) => v !== val) : [...current, val]
        );

        setSearch('');
    }

    const handlemTeamsRemove = (val: string) =>
        setMTeams((current) => current.filter((v) => v !== val));

    const mTeamss = mTeams.map((item) => (
        <Pill key={item} withRemoveButton onRemove={() => handlemTeamsRemove(item)}>
            {item}
        </Pill>
    ));

    const options = teams
        .filter((e: string) => !mTeams.includes(e))
        .filter((item) => item.toLowerCase().includes(search.trim().toLowerCase()))
        .sort()
        .map((item) => (
            <Combobox.Option value={item} key={item} active={mTeams.includes(item)}>
                <Group gap="sm">
                    {mTeams.includes(item) ? <CheckIcon size={12} /> : null}
                    <span>{item}</span>
                </Group>
            </Combobox.Option>
        ));

    return (
        <>
            <Combobox store={combobox} onOptionSubmit={handlemTeamsSelect} withinPortal={false} classNames={{ header: classes.header }}>
                <Combobox.Header>
                    Teams in Meet
                </Combobox.Header>
                <Combobox.DropdownTarget>
                    <PillsInput onClick={() => combobox.openDropdown()} rightSection={
                        <Menu shadow="md" width={200}>
                            <Menu.Target>
                               <IconSelector size={16}/>
                            </Menu.Target>

                            <Menu.Dropdown>
                                <Menu.Item leftSection={<IconPlus size={14} />} onClick={() => setMTeams(teams)}>
                                    Add All Teams
                                </Menu.Item>
                                <Menu.Item leftSection={<IconX size={14} />} onClick={() => setMTeams([])}>
                                    Remove All Teams
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>

                    }>
                        <Pill.Group>
                            {mTeamss}
                            <Combobox.EventsTarget>
                                <PillsInput.Field
                                    onFocus={() => combobox.openDropdown()}
                                    onBlur={() => combobox.closeDropdown()}
                                    value={search}
                                    placeholder="Search..."
                                    onChange={(event) => {
                                        combobox.updateSelectedOptionIndex();
                                        setSearch(event.currentTarget.value);
                                    }}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Backspace' && search.length === 0) {
                                            event.preventDefault();
                                            handlemTeamsRemove(mTeams[mTeams.length - 1]);
                                        }
                                    }}
                                />
                            </Combobox.EventsTarget>
                        </Pill.Group>
                    </PillsInput>
                </Combobox.DropdownTarget>

                <Combobox.Dropdown>
                    <Combobox.Options mah={200} style={{ overflowY: 'auto' }}>
                        {options.length > 0 ? options : <Combobox.Empty>Nothing found...</Combobox.Empty>}
                    </Combobox.Options>
                </Combobox.Dropdown>
            </Combobox >

        </>

    );
}