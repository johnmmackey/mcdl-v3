import { revalidateTag } from "next/cache";
import { MeetTeam } from './definitions';
import { accessToken } from "@/app/lib/data"

export class Meet {
    id: number | null;
    seasonId: number;
    name: string | null;
    parentMeet: number | null;
    meetDate: string;
    entryDeadline: string;
    hostPool: string | null;
    coordinatorPool: string | null;
    meetType: string;
    divisionId: number | null;
    week: number | null;
    scoresPublished: string | null;
    teams: MeetTeam[]

    constructor({
        id,
        seasonId,
        name,
        parentMeet,
        meetDate,
        entryDeadline,
        hostPool,
        coordinatorPool,
        meetType,
        divisionId,
        week,
        scoresPublished,
        teams
    }: Readonly<{
        id?: number,
        seasonId?: number,
        name?: string | null,
        parentMeet?: number | null,
        meetDate?: string,
        entryDeadline?: string | null,
        hostPool?: string | null,
        coordinatorPool?: string | null,
        meetType?: string,
        divisionId?: number | null,
        week?: number | null,
        scoresPublished?: string | null,
        teams?: MeetTeam[]
    }>) {
        this.id = id || null;
        this.seasonId = seasonId || new Date().getFullYear();
        this.name = name || null;
        this.parentMeet = parentMeet || null;
        this.meetDate = meetDate || new Date().toISOString(),
        this.entryDeadline = entryDeadline || meetDate || new Date().toISOString(),
        this.hostPool = hostPool || null;
        this.coordinatorPool = coordinatorPool || null;
        this.meetType = meetType || 'Dual';
        this.divisionId = divisionId || null;
        this.week = week || null;
        this.scoresPublished = (typeof scoresPublished === 'undefined') ? null : scoresPublished;
        this.teams = teams || [];
    }


    static async getById(id: number): Promise<Meet> {
        // 'this' refers to the class (MyClass) itself within the static method
        const r = await fetch(`${process.env.DATA_URL}/meets/${id}`, { next: { revalidate: 30, tags: [`meet:${id}`] } });
        if (!r.ok)
            throw new Error(`Error retrieving meet ${id}: ${r.statusText}`);

        return new this(await r.json());
    }

}