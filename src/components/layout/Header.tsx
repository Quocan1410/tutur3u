import { BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Avatar } from '@mantine/core';
import Link from 'next/link';
import { useAppearance } from '../../hooks/useAppearance';

interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  const { segments, changeLeftSidebar } = useAppearance();

  const getSegmentColor = (index: number) => {
    const colors = [
      'bg-blue-300/20 text-blue-300 hover:bg-blue-300/10',
      'bg-indigo-300/20 text-indigo-300 hover:bg-indigo-300/10',
      'bg-purple-300/20 text-purple-300 hover:bg-purple-300/10',
      'bg-pink-300/20 text-pink-300 hover:bg-pink-300/10',
      'bg-green-300/20 text-green-300 hover:bg-green-300/10',
      'bg-red-300/20 text-red-300 hover:bg-red-300/10',
      'bg-yellow-300/20 text-yellow-300 hover:bg-yellow-300/10',
    ];

    return colors[index % colors.length];
  };

  return (
    <div
      className={`${className} mb-4 w-full flex justify-between items-center`}
    >
      <Avatar
        className="block md:hidden hover:cursor-pointer"
        size={37}
        color="blue"
        radius="xl"
        onClick={() => changeLeftSidebar('open')}
      />
      <div className="hidden md:block">
        {segments.length > 0 ? (
          <div className="flex items-center gap-2">
            {segments.map((segment, index) => (
              <div key={index} className="flex items-center gap-2">
                {index > 0 && <span className="text-zinc-500 text-xl">/</span>}
                <Link
                  href={segment.href}
                  className={`px-6 py-2 text-xl font-bold rounded-full ${getSegmentColor(
                    index
                  )} transition duration-300`}
                >
                  {segment.content}
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div />
        )}
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 hover:bg-zinc-300/10 hover:text-zinc-300 hover:border-zinc-600 rounded hover:cursor-pointer transition duration-150">
          <MagnifyingGlassIcon className="w-6 h-6" />
        </button>
        <button className="p-2 hover:bg-zinc-300/10 hover:text-zinc-300 hover:border-zinc-600 rounded hover:cursor-pointer transition duration-150">
          <BellIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}