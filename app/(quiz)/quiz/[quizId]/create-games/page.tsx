'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, Calendar, Clock, Pencil } from 'lucide-react';
import ScheduledGame from './_components/scheduled-game';
import { FlashGame } from './_components/flash-game';

const CreateGamePage = ({ params }: { params: { quizId: string } }) => {
  return (
    <div>
      <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
        <Tabs defaultValue="flash" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="flash">
              <div className="flex items-center">
                <p className="mr-2">Main Cepat</p>
                <Clock className="h-3 w-3" />
              </div>
            </TabsTrigger>
            <TabsTrigger value="scheduled">
              <div className="flex items-center">
                <p className="mr-2">Terjadwal</p>
                <Calendar className="h-3 w-3" />
              </div>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="flash">
            <FlashGame quizId={params.quizId} />
          </TabsContent>
          <TabsContent value="scheduled">
            <ScheduledGame />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CreateGamePage;
