import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ClipLoader from 'react-spinners/ClipLoader';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Image from 'next/image';
import { useState, ChangeEvent, useEffect } from 'react';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Loader2, XCircle } from 'lucide-react';

interface UploadExcelProps {
  quizId: string;
}

export const UploadExcel = ({ quizId }: UploadExcelProps) => {
  const router = useRouter();
  const validityMesages = [
    'Mengecek kesesuaian Kolom',
    'Mengecek kelengkapan soal nomor',
  ];
  const [checkValidty, setCheckValidity] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [excelData, setExcelData] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState<any[]>([]);
  const [valMsg, setValMsg] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  useEffect(() => {
    if (isValid) {
      uploadToDatabase();
      setIsValid(false);
    }
  }, [isValid]);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    setCheckValidity(true);
    setIsValidating(false);
    setErrorMsg([]);
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const data = event.target?.result as string;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const parsedData = XLSX.utils.sheet_to_json(sheet);

          // Set state dengan hasil parsing
          setExcelData(parsedData);
        } catch (error) {
          console.error('Error parsing Excel file:', error);
          // Tambahkan logika penanganan kesalahan di sini
        }
      };

      reader.readAsBinaryString(file);
    }
  };
  const checkColumnValidty = (column: String[]) => {
    setValMsg(validityMesages[0]);

    const requiredColumn = [
      'pertanyaan',
      'jawaban',
      'pilihan_jawaban',
      'pembahasan',
    ];

    const missingColumns = requiredColumn.filter(
      (columnName) => !column.includes(columnName)
    );

    if (missingColumns.length > 0) {
      setErrorMsg((prev) => [
        ...prev,
        {
          index: 'File',
          msg: `Kolom ini ngak ada: ${missingColumns.join(', ')}`,
        },
      ]);

      return false;
    }

    return true;
  };

  const checkQuestionComponent = () => {
    const troubledQuestionIndex: number[] = [];

    excelData.forEach((data, index) => {
      setValMsg(validityMesages[1] + ` ${index + 1}`);
      try {
        const stringifiedData = {
          answer: data.jawaban.toString(),
          explanation: data.pembahasan.toString(),
          options: data.pilihan_jawaban.toString(),
          question: data.pertanyaan.toString(),
        };
      } catch (error) {
        troubledQuestionIndex.push(index);
        setErrorMsg((prev) => [
          ...prev,
          { index: `Soal ${index + 1}`, msg: `Soal gagal dikonversi` },
        ]);
      }

      if (!troubledQuestionIndex.includes(index)) {
        try {
          const options = data.pilihan_jawaban.toString();
          const optionsArray: string[] = options.split(';');
        } catch (error) {
          troubledQuestionIndex.push(index);
          setErrorMsg((prev) => [
            ...prev,
            {
              index: `Soal ${index + 1}`,
              msg: `Pilihan jawaban gagal dikonversi`,
            },
          ]);
        }
      }

      if (!troubledQuestionIndex.includes(index)) {
        const options = data.pilihan_jawaban.toString();
        const answer = data.jawaban.toString();
        const optionsArray: string[] = options.split(';');
        if (!optionsArray.includes(answer)) {
          setErrorMsg((prev) => [
            ...prev,
            {
              index: `Soal ${index + 1}`,
              msg: `Jawaban tidak terdapat dalam pilihan jawaban`,
            },
          ]);
        }
      }

      if (!troubledQuestionIndex.includes(index)) {
        const explanation = data.pembahasan.toString();
        if (!(explanation.length >= 50)) {
          setErrorMsg((prev) => [
            ...prev,
            {
              index: `Soal ${index + 1}`,
              msg: `Pembahasan tidak memenuhi ketentuan panjang minimal yaitu 50 karakter`,
            },
          ]);
        }
      }
    });
    if (troubledQuestionIndex.length === 0) {
      setIsValid(true);
    }
  };

  const uploadToDatabase = async () => {
    const quiz: any = [];
    excelData.forEach((data) => {
      const stringifyData = {
        answer: data.jawaban.toString(),
        explanation: data.pembahasan.toString(),
        options: data.pilihan_jawaban.toString().split(';'),
        question: data.pertanyaan.toString(),
      };
      quiz.push(stringifyData);
    });
    try {
      setIsUploading(true);
      await axios.post(`/api/quiz/${quizId}/questions/multiple-choice`, quiz);
      toast.success('Soal ditambahkan');
      router.refresh();
    } catch (error) {
      toast.error('Terdapat kendala');
    } finally {
      setIsUploading(false);
    }
  };

  const onUploadHandler = () => {
    setCheckValidity(false);
    setIsValidating(true);

    const validColumn = checkColumnValidty(Object.keys(excelData[0]));

    if (validColumn) {
      checkQuestionComponent();
    }
    setIsValidating(false);
  };
  const totalQuestion = excelData.length;

  return (
    <div className="overflow-auto h-[500px] max-h-screen p-4">
      <div className="flex justify-center">
        <Image
          src={'/import-excel.gif'}
          height={400}
          width={400}
          alt="Import Excel GIF"
        />
      </div>
      <div>
        <p>Siapkan file excelmu, gunakan format seperti berikut:</p>
      </div>

      <div className="relative">
        {isUploading && (
          <div className="absolute h-full w-full top-0 right-0 bg-slate-500/20 rouded-m flex items-center justify-center">
            <Loader2 className="animate-spin h-10 w-10 text-sky-700" />
          </div>
        )}
        <div>
          <Input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
          {excelData.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  {Object.keys(excelData[0]).map((key) => (
                    <TableHead key={key}>{key}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {excelData.slice(0, 3).map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {Object.values(row).map((value: any, colIndex) => (
                      <TableCell key={colIndex}>{value}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="italic text-sm text-slate-500 mx-auto my-2">
              Tidak ada data
            </p>
          )}
          <div hidden={!checkValidty} className="text-right">
            <Button onClick={onUploadHandler}>Import Soal</Button>
          </div>
          <div hidden={!isValidating} className="text-center mb-2">
            <ClipLoader color="bg-sky-700" />
            <p>{valMsg}</p>
          </div>

          {errorMsg.length > 0 && (
            <div className="mt-4">
              <div className="flex border border-gray-300 p-4 items-center space-x-4 mb-4">
                <XCircle className="text-red-500 h-10 w-10" />
                <p className="text-base text-gray-700">
                  Oops, kayaknya belum bisa deh upload soalmu. Mungkin cek dulu
                  ya masalahnya.
                </p>
              </div>

              <div className="bg-gray-200 p-4 rounded shadow-md">
                {errorMsg.map((content, index) => (
                  <p key={index} className="text-red-500">
                    <span className="font-bold text-sm">{content.index}</span>:{' '}
                    {content.msg}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
