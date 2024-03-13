import { SeasonDropdown } from "@/app/ui/SeasonDropdown";

export const SeasonalPage = function ({
  heading,
  base,
  children,
}: Readonly<{
  heading: string,
  base: string,
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl text-bold mb-1">{heading}</h1>
      <SeasonDropdown base={base} />
      <div className="mt-8">
        {children}
      </div>
    </div>
  );
}