import { IconBadge } from '@/components/icon-badge';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { AlignLeft, Blocks, Workflow } from 'lucide-react';
import { redirect } from 'next/navigation';
import { ModuleIdentityForm } from './_components/module-identity-form';

import { Banner } from '@/components/banners';
import { Actions } from './_components/actions';

import { LearningVariableForm } from './_components/learning-variable-form';
import LearningFlowList from './_components/learning-flow-list';
import { LearningFlowForm } from './_components/learning-flow-form';

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
          <div className="space-y-6">
            <div className="flex items-center gap-x-2">
              <IconBadge icon={AlignLeft} size="md" />
              <h2 className="text-xl font-medium">Identitas Modul Ajar</h2>
            </div>
            <ModuleIdentityForm
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
              subjectOptions={subject.map((subject) => ({
                label: subject.name,
                value: subject.id,
              }))}
            />
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Blocks} size="md" />
              <h2 className="text-xl font-medium">Kustomisasi Pembelajaran</h2>
            </div>
            <LearningVariableForm />
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Workflow} size="md" />
              <h2 className="text-xl font-medium">Kegiatan Pembelajaran</h2>
            </div>
            <LearningFlowForm
              initialData={learningModule}
              learningModuleId={learningModule.id}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default LearningModuleIdPage;
