import { Button } from '@/components/ui/button';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { Quiz, Option } from '@prisma/client';
import axios from 'axios';
import { ArrowRightToLine } from 'lucide-react';
import { NextResponse } from 'next/server';

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
interface InitialData {
  title: string;
  description: string;
  // Add other properties as needed
}

interface Question {
  id: string;
  question: string;
  questionType: string;
  options: Option[];
  imageUrl: string | null;
  answer: string;
  isPublished: boolean;
  explanation: string;
  quizId: string;
  position: number;
  createdAt: Date;
  updateAt: Date;
}
export class DocumentCreator {
  create(initialData: Quiz & { questions: Question[] }) {
    const document = new Document({
      title: initialData.title,
      description: initialData.description,
      styles: {
        paragraphStyles: [
          {
            id: 'default',
            name: 'Default',
            basedOn: 'Normal',
            next: 'Normal',
            quickFormat: true,
            run: {
              size: 24,
              font: 'Times New Roman',
              bold: true,
            },
            paragraph: {
              alignment: AlignmentType.CENTER,
              spacing: {
                after: 100,
              },
            },
          },
          // You can add more styles as needed
        ],
      },
      sections: [
        {
          children: [
            this.createQuizTitle(initialData.title),
            ...initialData.questions.flatMap(
              (question: Question, index: number) => {
                const arr = [];
                const questionNumber = index + 1;

                if (question.questionType === 'multipleChoice') {
                  arr.push(
                    this.createQuestion(
                      `${questionNumber}: ${question.question}`
                    )
                  );

                  let keyAnswer = '';
                  question.options.forEach((option: any, index: number) => {
                    const utfValue = 65 + index;
                    const char = String.fromCharCode(utfValue);

                    if (option.isKeyAnswer) {
                      keyAnswer = char;
                    }

                    arr.push(this.createOptions(option.option, char));
                  });

                  const keyAnswerFormatted = `Kunci Jawaban: ${keyAnswer}.`;
                  const explanation = `Penjelasan: ${question.explanation}`;

                  arr.push(
                    this.createParagraph(keyAnswerFormatted),
                    this.createParagraph(explanation),
                    this.createParagraph('') // Empty paragraph for separation
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
                    this.createParagraph(explanation),
                    this.createParagraph('') // Empty paragraph for separation
                  );
                }

                return arr;
              }
            ),
          ],
        },
      ],
    });

    return document;
  }

  createQuizTitle(text: string) {
    return new Paragraph({
      text: text,
      heading: HeadingLevel.HEADING_1,
    });
  }

  createQuestion(text: any) {
    return new Paragraph({
      text: text,
      style: 'default', // Applying the 'default' paragraph style
    });
  }

  createParagraph(text: any) {
    return new Paragraph({
      text: text,
      spacing: {
        after: 100,
      },
    });
  }

  createOptions(text: string, char: string) {
    const formatted = `${char}. ${text}`;
    return new Paragraph({
      text: formatted,
      spacing: {
        after: 100,
      },
    });
  }
}

export class ExperimentDocumentCreator {
  private initialData: InitialData;

  constructor(initialData: InitialData) {
    this.initialData = initialData;
  }

  create() {
    const { title, description } = this.initialData;

    const document = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: title,
                  bold: true,
                  size: 24,
                  font: 'Times New Roman',
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: title,
                  bold: true,
                  size: 24,
                  font: 'Times New Roman',
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: title,
                  bold: true,
                  size: 24,
                  font: 'Times New Roman',
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: title,
                  bold: true,
                  size: 24,
                  font: 'Times New Roman',
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: title,
                  bold: true,
                  size: 24,
                  font: 'Times New Roman',
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: title,
                  bold: true,
                  size: 24,
                  font: 'Times New Roman',
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: title,
                  bold: true,
                  size: 24,
                  font: 'Times New Roman',
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: title,
                  bold: true,
                  size: 24,
                  font: 'Times New Roman',
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: title,
                  bold: true,
                  size: 24,
                  font: 'Times New Roman',
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: title,
                  bold: true,
                  size: 24,
                  font: 'Times New Roman',
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: title,
                  bold: true,
                  size: 24,
                  font: 'Times New Roman',
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.LEFT,
              children: [
                new TextRun({
                  text: description,
                  size: 12,
                  font: 'Arial',
                }),
              ],
            }),
            // Add more paragraphs or elements as needed
          ],
        },
      ],
    });

    return document;
  }
}
