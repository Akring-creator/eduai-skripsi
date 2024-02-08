'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Camera } from 'lucide-react';

interface ProfileImageProps {
  imageUrl: string;
}
export const ProfileImage = ({ imageUrl }: ProfileImageProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  const HiddenComponent = () => {
    return (
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-slate-700 bg-opacity-40 flex justify-center items-center text-slate-200">
        <Camera />
      </div>
    );
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative w-40 h-40 overflow-hidden rounded-full"
      >
        <Image
          alt="Profile Picture"
          className="object-cover rounded-full"
          height={160}
          src={imageUrl}
          width={160}
        />
        {isHovered && <HiddenComponent />}
      </div>
    </div>
  );
};
