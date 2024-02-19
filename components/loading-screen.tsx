import React, { useState, useEffect } from 'react';
import { RotatingSquare } from 'react-loader-spinner';
import { Card, CardContent } from './ui/card';
import Image from 'next/image';

interface LoadingScreenProps {
  sentences: string[];
  imgUrl: string;
  imgWidth: number;
  imgHeight: number;
  loaderSize: number;
}

const LoadingScreen = ({
  sentences,
  imgUrl,
  imgWidth,
  imgHeight,
  loaderSize,
}: LoadingScreenProps) => {
  const [randomSentence, setRandomSentence] = useState<string>('');

  useEffect(() => {
    const intervalId = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * sentences.length);
      setRandomSentence(sentences[randomIndex]);
    }, 2000); // Ganti setiap 3 detik

    return () => clearInterval(intervalId);
  }, [sentences]);

  return (
    <div className="flex flex-col items-center justify-center">
      <Image
        src={imgUrl}
        height={imgHeight}
        width={imgWidth}
        alt="Loading GIF"
      />
      <div className="flex items-center mt-2">
        <RotatingSquare
          height={loaderSize}
          width={loaderSize}
          color="#0ea4e9"
          ariaLabel="rotating-square-loading"
          wrapperStyle={{}}
          visible={true}
        />
        <span className="text-base ml-2">{randomSentence}</span>
      </div>
    </div>
  );
};

export default LoadingScreen;
