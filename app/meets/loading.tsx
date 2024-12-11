import { IconRefresh } from '@tabler/icons-react';

export default function Loading() {
  return (
    <div className="grid min-h-[140px] w-full place-items-center overflow-x-scroll rounded-lg p-6 lg:overflow-visible">
      <IconRefresh className="animate-spin text-gray-200" size={128}/>
    </div>
  );
}

