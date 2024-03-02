import { SeasonDropdown } from "@/app/ui/SeasonDropdown";

export default function MeetsSeasonsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            <h1 className="text-center text-2xl text-bold">Meet Schedule & Results</h1>
            <div className="flex justify-center">
                <SeasonDropdown base="/meets/season" />     
            </div>
            {children}
        </div>
    );
}