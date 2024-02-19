'use client';

import { useRouter } from 'next/navigation';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, Pencil } from 'lucide-react';
import { AutomaticForm } from './_components/automatic-form';
import { ManualForm } from './_components/manual-form';
import { getProfile } from '@/actions/get-profile';

const CreatePage = () => {
  const router = useRouter();

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <Tabs defaultValue="manual" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manual">
            <div className="flex items-center">
              <p className="mr-2">Manual</p>
              <Pencil className="h-3 w-3" />
            </div>
          </TabsTrigger>
          <TabsTrigger value="ai">
            <div className="flex items-center">
              <p className="mr-2">Dengan AI</p>
              <Bot className="h-3 w-3" />
            </div>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="manual">
          <ManualForm />
        </TabsContent>
        <TabsContent value="ai">
          <AutomaticForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreatePage;
