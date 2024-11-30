import { SeasonalPage } from "@/app/ui/SeasonalPage";

export default function MeetsSeasonsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SeasonalPage base="/meets/season" heading="Meet Schedule & Results">
            {children}
        </SeasonalPage>
    );
}