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
  create(questions: any) {
    const document = new Document({
      sections: [
        {
          children: [
            this.createHeading('Kuis Pilihan Ganda'),
            ...questions
              .map((question: any, index: number) => {
                const arr = [];
                const questionNumber = index + 1;
                if (question.type === 'pilihan ganda') {
                  arr.push(
                    this.createQuestion(
                      `${questionNumber}: ${question.question}`
                    )
                  );
                  question.options.map((option: string, index: number) => {
                    arr.push(this.createOptions(option, index));
                  });
                  const answer = `Kunci Jawaban: ${question.answer}`;
                  const explanation = `Penjelasan: ${question.explanation}`;
                  arr.push(
                    this.createParagraph(answer),
                    this.createParagraph(explanation)
                  );
                } else if (question.type === 'isian singkat') {
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

  createHeading(text: any) {
    return new Paragraph({
      text: text,
      heading: HeadingLevel.HEADING_1,
      thematicBreak: true,
    });
  }

  createQuestion(text: any) {
    return new Paragraph({
      text: text,
    });
  }
  createParagraph(text: any) {
    return new Paragraph({
      children: [new TextRun(text)],
      spacing: {
        after: 100,
      },
    });
  }
  createOptions(text: string, index: number) {
    const utfValue = 65 + index;
    const char = String.fromCharCode(utfValue);
    const formatted = `${char}. ${text}`;
    return new Paragraph({
      children: [
        new TextRun({ children: [new Tab(), new TextRun(formatted)] }),
      ],
      spacing: {
        after: 100,
      },
    });
  }
}

const ExportToWordHandler = ({ initialData }: ExportToWordHandlerProps) => {
  console.log(initialData.questions[1].options);

  const questions = [
    {
      type: 'pilihan ganda',
      question: 'Berapa Hasil 1 + 1',
      options: ['1', '2', '3', '4', '5'],
      answer: '2',
      explanation: '1 + 1 sama dengan 2',
    },
    {
      type: 'pilihan ganda',
      question: 'Berapa Hasil 40 - 3',
      options: ['36', '37', '38', '34', '33'],
      answer: '37',
      explanation: '40 - 3 sama dengan 37',
    },
    {
      type: 'isian singkat',
      question: 'Berapa Hasil 186 + 13',
      answer: '199',
      explanation: '186 + 13 sama dengan 199',
    },
  ];
  const documentCreator = new DocumentCreator();
  const doc = documentCreator.create(questions);
  const makeDocx = () => {
    Packer.toBuffer(doc).then((buffer: any) => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'My_Document.docx';
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
