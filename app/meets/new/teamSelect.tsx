import { useState } from 'react';
import { ActionIcon, Button, CheckIcon, Combobox, Grid, GridCol, Group, Pill, PillsInput, useCombobox } from '@mantine/core';
import { IconChevronRight, IconPlus, IconX } from '@tabler/icons-react';
import classes from "./teamselect.module.css"

import { Team, TeamSeason } from '@/app/lib/definitions';

export const TeamSelect = ({
    teams
}: Readonly<{
    teams: string[]
}>) => {
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
        onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
    });

    const [search, setSearch] = useState('');
    const [value, setValue] = useState<string[]>([]);

    const handleValueSelect = (val: string) => {
        setValue((current) =>
            current.includes(val) ? current.filter((v) => v !== val) : [...current, val]
        );

        setSearch('');
    }

    const handleValueRemove = (val: string) =>
        setValue((current) => current.filter((v) => v !== val));

    const values = value.map((item) => (
        <Pill key={item} withRemoveButton onRemove={() => handleValueRemove(item)}>
            {item}
        </Pill>
    ));

    const options = teams
        .filter((e: string) => !value.includes(e))
        .filter((item) => item.toLowerCase().includes(search.trim().toLowerCase()))
        .sort()
        .map((item) => (
            <Combobox.Option value={item} key={item} active={value.includes(item)}>
                <Group gap="sm">
                    {value.includes(item) ? <CheckIcon size={12} /> : null}
                    <span>{item}</span>
                </Group>
            </Combobox.Option>
        ));

    return (
        <>
            <Combobox store={combobox} onOptionSubmit={handleValueSelect} withinPortal={false} classNames={{ header: classes.header }}>
                <Combobox.Header>
                    Teams in Meet
                </Combobox.Header>
                <Combobox.DropdownTarget>
                    <PillsInput onClick={() => combobox.openDropdown()} rightSection={
                        <div className='flex h-full pt-1 pr-4'>
                            <ActionIcon
                                radius={0}
                                variant="transparent"
                                size={24}
                                onClick={() => setValue(teams)}
                            >
                                <IconPlus />
                            </ActionIcon>
                            <ActionIcon
                                radius={0}
                                variant="transparent"
                                size={24}
                                onClick={() => setValue([])}
                            >
                                <IconX />
                            </ActionIcon>
                        </div>

                    }>
                        <Pill.Group>
                            {values}

                            <Combobox.EventsTarget>
                                <PillsInput.Field
                                    onFocus={() => combobox.openDropdown()}
                                    onBlur={() => combobox.closeDropdown()}
                                    value={search}
                                    placeholder="Search values"
                                    onChange={(event) => {
                                        combobox.updateSelectedOptionIndex();
                                        setSearch(event.currentTarget.value);
                                    }}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Backspace' && search.length === 0) {
                                            event.preventDefault();
                                            handleValueRemove(value[value.length - 1]);
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