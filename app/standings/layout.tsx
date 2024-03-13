import { SeasonalPage } from "@/app/ui/SeasonalPage";

export default function MeetsSeasonsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SeasonalPage base="/standings" heading="Divisional Standings">
            {children}
        </SeasonalPage>
    );
}