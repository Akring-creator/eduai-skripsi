'use client';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/db';
import { Quiz, Option } from '@prisma/client';
import axios from 'axios';
import { ArrowRightToLine } from 'lucide-react';
const docx = require('docx');
const {
  AlignmentType,
  convertInchesToTwip,
  Document,
  HeadingLevel,
  LevelFormat,
  Packer,
  Tab,
  TabStopType,
  TabStopPosition,
  Paragraph,
  TextRun,
  UnderlineType,
} = docx;

interface Question {
  id: string;
  questionType: string;
  question: string;
  imageUrl: string | null;
  answer: string;
  explanation: string;
  options: Option[]; // Tambahkan properti options dengan tipe Option[]
  quizId: string;
  position: number;
  createdAt: Date;
  updateAt: Date;
}

interface ExportToWordHandlerProps {
  initialData: Quiz & { questions: Question[] };
}
class DocumentCreator {
  create(initialData: Quiz & { questions: Question[] }) {
    const document = new Document({
      title: initialData.title,
      description: initialData.description,
      style: {
        default: {
          document: {
            run: {
              size: '12pt',
              font: 'Times New Roman',
            },
            paragraph: {
              alignment: AlignmentType.JUSTIFIED,
            },
          },
        },
      },
      sections: [
        {
          children: [
            this.createQuizTitle(initialData.title),
            ...initialData.questions
              .map((question: Question, index: number) => {
                const arr = [];
                const questionNumber = index + 1;
                if (question.questionType === 'multipleChoice') {
                  arr.push(
                    this.createQuestion(
                      `${questionNumber}: ${question.question}`
                    )
                  );
                  let keyAnswer = '';
                  question.options.map((option: any, index: number) => {
                    const utfValue = 65 + index;
                    const char = String.fromCharCode(utfValue);
                    keyAnswer = char;
                    arr.push(this.createOptions(option.option, char));
                  });
                  const keyAnswerFormatted = `Kunci Jawaban: ${keyAnswer}.`;
                  const explanation = `Penjelasan: ${question.explanation}`;
                  arr.push(
                    this.createParagraph(keyAnswerFormatted),
                    this.createParagraph(explanation)
                  );
                } else if (question.questionType === 'shortAnswer') {
                  arr.push(
                    this.createQuestion(
                      `${questionNumber}. ${question.question}?`
                    )
                  );

                  const answer = `Jawaban: ${question.answer}`;
                  const explanation = `Penjelasan: ${question.explanation}`;
                  arr.push(
                    this.createParagraph(answer),
                    this.createParagraph(explanation)
                  );
                }
                arr.push(this.createParagraph(''));
                return arr;
              })
              .reduce((prev: any, curr: any) => prev.concat(curr), []),
          ],
        },
      ],
    });

    return document;
  }

  createQuizTitle(text: string) {
    return new Paragraph({
      children: [
        new TextRun({
          text: text,
          size: 24,
          bold: true,
        }),
      ],
      alignment: AlignmentType.CENTER,
    });
  }

  createQuestion(text: any) {
    return new Paragraph({
      text: text,
    });
  }
  createParagraph(text: any) {
    return new Paragraph({
      children: [
        new TextRun({
          text: text,
        }),
      ],
      spacing: {
        after: 100,
      },
    });
  }
  createOptions(text: string, char: string) {
    const formatted = `${char}. ${text}`;
    return new Paragraph({
      children: [new TextRun({ text: formatted })],
      spacing: {
        after: 100,
      },
    });
  }
}

const ExportToWordHandler = ({ initialData }: ExportToWordHandlerProps) => {
  const documentCreator = new DocumentCreator();
  const doc = documentCreator.create(initialData);
  const makeDocx = () => {
    Packer.toBuffer(doc).then((buffer: any) => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `${initialData.title}.docx`;
      link.click();
    });
  };
  return (
    <Button onClick={makeDocx} className="hover:opacity-75">
      <ArrowRightToLine className="w-4 h-4 mr-2" />
      Export
    </Button>
  );
};

export default ExportToWordHandler;
