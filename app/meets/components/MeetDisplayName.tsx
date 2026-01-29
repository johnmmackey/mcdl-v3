import { MeetWithTeams } from "@/app/lib/types/meet";

export async function MeetDisplayName(props: { meet: MeetWithTeams }): Promise<string> {
    return props.meet.customName || props.meet.defaultName
}