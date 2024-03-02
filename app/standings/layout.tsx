import { SeasonDropdown } from "@/app/ui/SeasonDropdown";

export default function StandingsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            <h1 className="text-center text-2xl text-bold">Divisional Standings</h1>
            <div className="flex justify-center">
                <SeasonDropdown base="/standings" />     
            </div>
            {children}
        </div>
    );
}