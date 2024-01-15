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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';

interface UploadExcelProps {
  quizId: string;
}

export const UploadExcel = ({ quizId }: UploadExcelProps) => {
  const [checkValidty, setCheckValidity] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [excelData, setExcelData] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState<any[]>([]);
  const [valMsg, setValMsg] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const router = useRouter();
  const validityMesages = [
    'Mengecek kesesuaian Kolom',
    'Mengecek kelengkapan soal nomor',
  ];
  const columnExplanation = [
    {
      kolom: 'pertanyaan',
      penjelasan:
        ' Isinya pokok pertanyaan dari soal. Masukkan pemantik/narasi/bahan literasi kedalam bagian ini',
      contoh:
        'Mengapa daerah-daerah pesisir sering kali rentan terhadap bencana banjir?',
    },

    {
      kolom: 'jawaban',
      penjelasan: ' Berisi jawaban yang benar dari soal',
      contoh:
        'Karena daerah pesisir rentan terhadap naiknya permukaan air laut',
    },
    {
      kolom: 'pilihan_jawaban',
      penjelasan:
        ' Ini isinya pilihan-pilihan jawaban.  Untuk memisahkan antar pilihan jawaban gunakan titik koma (;). Pastiin jawaban bener ada di salah satu pilihan. Pastiin juga tanda baca dan spasinya benar. Pastiin nama kolomnya pilihan_jawaban bukan pilihan jawaban atau pilihanjawaban',
      contoh:
        'Karena daerah pesisir cenderung memiliki curah hujan tinggi;Karena daerah pesisir rentan terhadap naiknya permukaan air laut;Karena daerah pesisir sering mengalami kekeringan;Karena daerah pesisir memiliki jumlah penduduk yang tinggi;Semua Jawaban Benar',
    },
    {
      kolom: 'pembahasan',
      penjelasan:
        'Penjelasan tentang jawaban yang bener. Minimal 50 karakter yaa',
      contoh:
        'Daerah pesisir rentan terhadap bencana banjir karena rentan terhadap naiknya permukaan air laut, yang dapat disebabkan oleh faktor seperti pasang surut, cuaca ekstrem, atau perubahan iklim yang menyebabkan bencana banjir di daerah tersebut',
    },
  ];
  const exampleExcel = [
    {
      pertanyaan:
        'Apa yang menjadi faktor utama dalam pembentukan garis Wallace?',
      jawaban: 'Isolasi geografis',
      pilihan_jawaban:
        'Aktivitas gunung berapi;Perubahan iklim secara drastis;Pergerakan lempeng tektonik;Isolasi geografis;Semua Jawaban Benar',
      pembahasan:
        'Garis Wallace adalah garis pemisah yang menandai batas antara fauna Asia dan Australia. Garis ini terbentuk karena isolasi geografis, memungkinkan evolusi spesies-spesies yang berbeda di wilayah Asia dan Australia',
    },
    {
      pertanyaan:
        '8.	Di Indonesia, terdapat keragaman budaya yang mencakup berbagai suku, bahasa, dan tradisi. Salah satu contoh yang mencerminkan asimilasi budaya yang unik adalah?',
      jawaban: 'Integrasi unsur-unsur lokal dalam seni wayang kulit.',
      pilihan_jawaban:
        'Penurunan penggunaan bahasa lokal di masyarakat.;Pelestarian budaya murni tanpa pengaruh luar.;Wayang kulit yang hanya mempertahankan akar cerita dari India.;Integrasi unsur-unsur lokal dalam seni wayang kulit.;Kesenian yang tidak mengalami perubahan dari generasi ke generasi.',
      pembahasan:
        'Integrasi unsur-unsur lokal dalam seni wayang kulit. Seni tradisional seperti wayang kulit di Indonesia tidak hanya mengadopsi cerita-cerita dari India, tetapi juga mengalami asimilasi budaya dengan memasukkan unsur-unsur lokal seperti musik, penampilan tokoh, dan cerita-cerita yang bersumber dari budaya lokal. Ini mencerminkan proses asimilasi budaya di mana unsur-unsur budaya asing dan lokal bersatu membentuk identitas budaya yang unik',
    },
  ];
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
        <p className="font-semibold text-lg">Tips untuk Nge-Upload!</p>
        <p>Sebelum nge-upload coba baca dulu beberapa hal berikut:</p>
        <Separator className="my-2" />
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              Gimana sih caranya nge-upload soal yang bener?
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <p>Mau nge-upload soal? Pastiin dulu ya beberapa hal ini:</p>
                <p className="ml-2">
                  1. Pastikan format filenya
                  <span className="font-bold"> .xlsx</span> atau
                  <span className="font-bold"> .xls</span>.
                </p>
                <p className="ml-2">
                  2. Di dalam file, harus ada 4 kolom nih:{' '}
                  <span className="font-bold">pertanyaan</span>,{' '}
                  <span className="font-bold">jawaban</span>,{' '}
                  <span className="font-bold">pilihan_jawaban</span>, sama{' '}
                  <span className="font-bold">pembahasan</span>. Penjelasan
                  sederhana buat setiap kolom:
                </p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      {Object.keys(columnExplanation[0]).map((key) => (
                        <TableHead key={key}>{key}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {columnExplanation.map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {Object.values(row).map((value: any, colIndex) => (
                          <TableCell key={colIndex}>{value}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <p className="ml-2">
                  3. Buat yang masih bingung, bisa cek contoh format excel yang
                  bener, bisa didownload di{' '}
                  <a
                    href="https://utfs.io/f/35fd85cd-4cfc-41bb-8255-ef007d6d5ef9-igpp8e.xlsx"
                    download="basic-question-template.xlsx"
                  >
                    <span className="text-sky-700">sini</span>
                  </a>
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              Kok aku upload soal lama sekali?
            </AccordionTrigger>
            <AccordionContent>
              Kalau jumlah soalnya banyak maka perlu waktu yang cukup lama.
              Jangan lupa periksa koneksi internetmu ya!
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="relative">
        {isUploading && (
          <div className="absolute h-full w-full top-0 right-0 bg-slate-500/20 rouded-m flex items-center justify-center">
            <Loader2 className="animate-spin h-10 w-10 text-sky-700" />
          </div>
        )}
        <div>
          <label
            className="block my-2 text-sm font-medium text-gray-700"
            htmlFor="file_upload"
          >
            Upload File
          </label>
          <input
            className="block w-full text-sm text-gray-500
        file:mr-4 file:py-2 file:px-4
        file:rounded-full file:border-0
        file:text-sm file:font-semibold
        file:bg-blue-50 file:text-blue-700
        hover:file:bg-blue-100"
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
          />
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
            <Button onClick={onUploadHandler}>Upload Soal</Button>
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
