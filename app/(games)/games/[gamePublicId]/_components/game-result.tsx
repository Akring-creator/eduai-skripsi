import Image from 'next/image';

interface GameResultProps {
  imageUrl: string | null;
  gamename: string;
  result: { rightAnswer: number; wrongAnswer: number };
}
const GameResult = ({ imageUrl, gamename, result }: GameResultProps) => {
  console.log(result);
  return (
    <div className="grid h-screen items-center justify-center p-4 text-center">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
          Hasil {gamename}
        </h1>
        <div className="flex justify-center">
          <Image
            src={
              imageUrl
                ? imageUrl
                : 'https://uploadthing.com/f/d02b1c91-dd8b-4caf-a629-199f39f3662f-9lxp8g.png'
            }
            alt="Quiz Image"
            width={300}
            height={300}
            className="rounded"
          />
        </div>
      </div>

      <div className="mx-auto grid grid-cols-2 gap-4 max-w-sm sm:grid-cols-2 md:gap-6 md:max-w-2xl lg:grid-cols-2 lg:max-w-4xl xl:grid-cols-2xl mt-8">
        <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-blue-200 dark:bg-blue-900 shadow-sm">
          <div className="grid gap-1 text-center">
            <div className="text-5xl font-semibold text-blue-600 dark:text-blue-300">
              {result.rightAnswer}
            </div>
            <p className="text-base font-medium tracking-wide uppercase text-gray-500 dark:text-gray-400">
              Jawaban Benar
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-red-200 dark:bg-red-900 shadow-sm">
          <div className="grid gap-1 text-center">
            <div className="text-5xl font-semibold text-red-600 dark:text-red-300">
              {result.wrongAnswer}
            </div>
            <p className="text-base font-medium tracking-wide uppercase text-gray-500 dark:text-gray-400">
              Jawaban Salah
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameResult;
