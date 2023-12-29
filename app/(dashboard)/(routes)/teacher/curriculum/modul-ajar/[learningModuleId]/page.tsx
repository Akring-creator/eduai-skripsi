import { IconBadge } from '@/components/icon-badge';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import {
  CircleDollarSign,
  LayoutDashboard,
  ListChecks,
  File,
  AlignLeft,
} from 'lucide-react';
import { redirect } from 'next/navigation';
import { TitleForm } from './_components/title-form';
import { DescriptionForm } from './_components/description-form';
import { ImageForm } from './_components/image-form';
import { PriceForm } from './_components/price-form';

import { ChapterForm } from './_components/chapter-form';
import { Banner } from '@/components/banners';
import { Actions } from './_components/actions';
import { WriterForm } from './_components/writer-form';
import { PhaseForm } from './_components/phase-form';
import { InstituteForm } from './_components/institute-form';
import { LearningYearForm } from './_components/learning-year-form';

const LearningModuleIdPage = async ({
  params,
}: {
  params: { learningModuleId: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect('/');
  }

  const learningModule = await db.learningModule.findUnique({
    where: {
      id: params.learningModuleId,
      userId: userId,
    },
    include: {
      // Profil Pelajar Pancasila
      tripleP: true,

      // Tujuan Pembelajaran
      learningObjective: true,

      // Alur Tujuan Pembelajaran
      learningObjectiveFlows: true,

      //Pemahaman Bermakna
      meaningfulComprehension: true,

      //Pertanyaan Pemantik
      triggerQuestion: true,

      // Kegiatan Pembelajaran
      learningFlow: {
        include: {
          //Aktifitas Pembelajaran:
          learningActivities: {
            include: {
              // Isi dari Aktifitas Pembelajaran
              learningPhase: {
                orderBy: {
                  position: 'asc',
                },
              },
            },
          },
        },
      },
    },
  });

  const phases = await db.phase.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  const subject = await db.subject.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  const moda = await db.learningModa.findMany({
    orderBy: {
      moda: 'asc',
    },
  });

  const studentTarget = await db.studentTarget.findMany({
    orderBy: {
      target: 'asc',
    },
  });
  const educationLevel = await db.educationLevel.findMany({
    orderBy: {
      position: 'asc',
    },
  });

  if (!learningModule) {
    return redirect('/');
  }

  const requiredFields = [
    learningModule.title,
    learningModule.writer,
    learningModule.institute,
    learningModule.learningYear,
    learningModule.numOfMeeting,
    learningModule.learningHours,
    learningModule.educationLevelId,
    learningModule.phaseId,
    learningModule.class,
    learningModule.subjectId,
    learningModule.modaId,
    learningModule.model,
    learningModule.studentTargetId,
    learningModule.tripleP,
    learningModule.method,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields} / ${totalFields})`;

  const isComplete = requiredFields.every(Boolean);
  return (
    <>
      {!learningModule.isPublished && (
        <Banner label="Modul ajar ini tidak publik dan hanya bisa dilihat secara pribadi" />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Konfigurasi Modul Ajar</h1>
            <span className="text-sm text-slate-700">
              Progress Pengisian {completionText}
            </span>
          </div>
          {/* Action */}
          <Actions
            disabled={!isComplete}
            learningModuleId={params.learningModuleId}
            isPublished={learningModule.isPublished}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={AlignLeft} size="md" />
              <h2 className="text-xl font-medium">Identitas Modul Ajar</h2>
            </div>
            <TitleForm
              initialData={learningModule}
              learningModuleId={learningModule.id}
              phaseOptions={phases.map((phase) => ({
                label: phase.name,
                value: phase.id,
              }))}
              educationLevelOptions={educationLevel.map((level) => ({
                label: level.name,
                value: level.id,
              }))}
            />
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Chapter Kursus</h2>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign} />
                <h2 className="text-xl">Harga Kursus</h2>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-x-2"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LearningModuleIdPage;
