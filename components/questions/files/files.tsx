import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useState, ChangeEvent } from 'react';
import * as XLSX from 'xlsx';

interface UploadExcelProps {
  quizId: string;
}

export const UploadExcel = ({ quizId }: UploadExcelProps) => {
  const exampleData = [
    {
      question: 'Berapa hasil 1+1',
      answer: '2',
      options: '2;6;8',
      explanation:
        'hasil dari penjumlahan 1 + 1 = 2. Sama seperti 1 apel ditambah 1 apel maka menghasilkan 2 apel',
    },
    {
      question: 'Jelaskan mengenai Geografi!',
      answer: 'Geografi merupakan ilmu bumi',
      options:
        'Geografi merupakan ilmu bumi;Geografi merupakan ilmu manusia;Geografi merupakan ilmu tumbuhan',
      explanation:
        'Geografi merupakan ilmu yang mempelajari tentang bumi dan isinya',
    },
  ];
  const [checkValidty, setCheckValidity] = useState(false);
  const [excelData, setExcelData] = useState([]);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
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
          console.log(excelData);
        } catch (error) {
          console.error('Error parsing Excel file:', error);
          // Tambahkan logika penanganan kesalahan di sini
        }
      };

      reader.readAsBinaryString(file);
    }
    setCheckValidity(!checkValidty);
  };

  const checkValidtyHandler = () => {
    setCheckValidity(!checkValidty);
  };

  return (
    <div>
      <div>
        <p>Siapkan file excelmu, gunakan format seperti berikut:</p>
      </div>
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
                {Object.values(row).map((value, colIndex) => (
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
        <Button onClick={checkValidtyHandler}>Cek Kesesuaian</Button>
      </div>
    </div>
  );
};
