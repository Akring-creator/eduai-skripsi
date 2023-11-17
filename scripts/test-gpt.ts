const OpenAI = require('openai');

// Selanjutnya, Anda dapat menggunakan modul OpenAI di sini


const openai = new OpenAI({
  apiKey: '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' // This is also the default, can be omitted
});



export const multipleChoice= async (
  numOfQuestion : number,  numOfOption: number,   material : string,  guidance : string,  quizId: string
  ) => {
    const inputMaterial = material.replace(/"/g, '\\"')
    const system_prompt  = 'Kamu adalah seorang pendidik yang memiliki kemampuan membuat soal  berjenis pilihan ganda berdasarkan materi yang diberikan oleh pengguna. Setiap soal yang kamu buat disimpan dalam bentuk JSON dengan format sebagai berikut :{soal_n: {question:  , options : [] , answer: ,   explanation : }} \n Berikut merupakan penjelasan dari format tersebut: n merupakan nomor urut soal, question berisi pertanyaan yang dihasilkan, options merupakan sebuah array yang berisi pilihan jawaban, answer merupakan jawaban yang benar dan explanation merupakan penjelasan dari jawaban yang benar. Berikut merupakan ketentuan umum dalam membuat soal:\njawaban yang benar harus menjadi pilihan jawaban dan panjang kalimat antar pilihan jawaban harus mendekati atau sama panjang, jumlah pilihan jawaban harus sesuai dengan permintaan pengguna. Selain itu, terdapat ketentuan lain yang akan ditentukan oleh pengguna '
    const example_user_prompt = "Buatlah 2 soal pilihan ganda dengan 4 pilihan jawaban dan pembahasannya dengan ketentuan sebagai berikut: Soal harus menggunakan bahasa yang jelas dan dapat dipahami, soal merupakan soal studi kasus. Berikut ini merupakan materinya:\nGrup C dalam iklim koppen: iklim subtropis (mesotermal) Tipe iklim ini memiliki suhu rata-rata bulan terdingin antara 0 °C (32 °F) dan 18 °C (64 °F) dan memiliki setidaknya satu bulan dengan suhu rata-rata di atas 10 °C (50 °F). Cfa = Iklim subtropis basah; dengan suhu rata-rata pada bulan terdingin di atas 0 °C (32 °F) dan memiliki setidaknya satu bulan dengan suhu rata-rata di atas 22 °C (72 °F). Tidak ada perbedaan yang signifikan antara curah hujan bulanan. Cfb = Iklim laut; dengan suhu rata-rata pada bulan terdingin di atas 0 °C (32 °F) dan memiliki setidaknya empat bulan dengan suhu rata-rata di atas 10 °C (50 °F) dan di bawah 22 °C (72 °F). Tidak ada perbedaan yang signifikan antara curah hujan bulanan. Cfc = Iklim subartik oseanik; dengan suhu rata-rata pada bulan terdingin di atas 0 °C (32 °F) dan memiliki 1-3 bulan dengan suhu rata-rata di atas 10 °C (50 °F) dan di bawah 22 °C (72 °F). Tidak ada perbedaan yang signifikan antara curah hujan bulanan. Cwa = Iklim subtropis yang dipengaruhi angin muson; dengan suhu rata-rata pada bulan terdingin di atas 0 °C (32 °F) namun di bawah 18 °C (64 °F). Memiliki setidaknya satu bulan dengan suhu rata-rata di atas 22 °C (72 °F) dan empat bulan dengan suhu rata-rata di atas 10 °C (50 °F). Curah hujan di musim panas sepuluh kali lebih banyak dibandingkan di musim dingin. Cwb = Iklim subtropis dataran tinggi dengan musim dingin yang kering; bulan terdingin memiliki suhu udara rata-rata di atas 0 °C (32 °F), suhu rata-rata setiap bulan di bawah 22 °C (72 °F), dan memiliki setidaknya empat bulan dengan suhu rata-rata di atas 10 °C (50 °F). Curah hujan di musim panas sepuluh kali lebih banyak dibandingkan di musim dingin. Cwc = Iklim subtropis dataran tiggi dingin atau iklim lautan subkutub; dengan suhu rata-rata bulan terdingin di atas 0 °C (32 °F) dan 1-3 bulan dengan suhu rata-rata di atas 10 °C (50 °F). Memiliki curah hujan bulan terpanas terbanyak sekitar sepuluh kali lipat dibanding bulan terdingin. Curah hujan di musim panas sepuluh kali lebih banyak dibandingkan di musim dingin. Csa = Iklim mediterania dengan musim panas yang terik; bulan terdingin memiliki suhu rata-rata di atas 0 °C (32 °F) dan setidaknya satu bulan 22 °C (72 °F) dan empat bulan dengan suhu di atas 10 °C (50 °F). Curah hujan di musim dingin tiga kali lebih banyak dibanding di musim panas dan curah hujan pada bulan terkering kurang dari 30 mm (1,2 in). Csb = Iklim mediterania dengan musim panas yang hangat; bulan terdingin memiliki suhu rata-rata di atas 0 °C (32 °F), dan setidaknya empat bulan dengan suhu rata-rata di atas 0 °C (32 °F) dengan suhu rata-rata pada setiap bulan tidak melebihi 22 °C (72 °F). Curah hujan di musim dingin tiga kali lebih banyak dibanding di musim panas dan curah hujan pada bulan terkering kurang dari 30 mm (1,2 in). Csc = Iklim mediterania dengan musim panas yang dingin, dengan suhu rata-rata pada bulan terdingin di atas 0 °C (32 °F) dan setidaknya 1-3 bulan dengan suhu rata-rata di atas 10 °C (50 °F). Curah hujan di musim dingin tiga kali lebih banyak dibanding di musim panas dan curah hujan pada bulan terkering kurang dari 30 mm (1,2 in)."
    const example_output = "{ \"soal_1\": { \"question\": \"Daerah yang memiliki suhu rata-rata pada bulan terdingin 3°C dan memiliki 3 bulan dengan suhu rata-rata di atas 10°C dan di bawah 22°C. Curah hujan di musim panas tidak jauh berbeda dengan musim dingin. Jenis iklim koppen apakah yang sesuai dengan deskripsi tersebut?\", \"options\" : [\"Iklim subtropis basah (Cfa)\",\"Iklim subartik oseanik (Cfc)\",\"Iklim laut (Cfb)\",\"Iklim subtropis dataran tinggi (Cwb)\"],\"answer\": \"Iklim subartik oseanik (Cfc)\", \"explanation\" : \"Iklim subartik oseanik memiliki suhu rata-rata pada bulan terdingin di atas 0 °C (32 °F) dan memiliki 1-3 bulan dengan suhu rata-rata di atas 10 °C (50 °F) dan di bawah 22 °C (72 °F). Tidak ada perbedaan yang signifikan antara curah hujan bulanan.\"},\"soal_2\": {\"question\": \"Kota X memiliki suhu rata-rata bulan terdingin di bawah 0°C dan suhu rata-rata bulan terhangat di atas 22°C. Apa klasifikasi iklim yang dominan di kota X berdasarkan klasifikasi iklim Koppen?\", \"options\" : [\"Af\", \"Bwh\", \"Cfa\", \"Dfa\"], \"answer\": \"Cfa\",\"explanation\": \"Berdasarkan klasifikasi iklim Koppen, kota X termasuk ke dalam Grup C (sedang) dengan tipe iklim Cfa (Iklim subtropis lembap dengan musim panas panjang dan lembap). Kriteria Cfa adalah dengan suhu rata-rata pada bulan terdingin di atas 0 °C (32 °F) dan memiliki setidaknya satu bulan dengan suhu rata-rata di atas 22 °C (72 °F). Tidak ada perbedaan yang signifikan antara curah hujan bulanan. kota X masuk dalam kriteria Cfa.\"}}"
    const user_prompt = `Buatlah ${numOfQuestion} soal pilihan ganda dengan ${numOfOption} pilihan jawaban dan pembahasannya dengan ketentuan sebagai berikut: Soal harus menggunakan bahasa yang jelas dan dapat dipahami, ${guidance}. Berikut ini merupakan materinya:${inputMaterial}`

    try {
      const data = await openai.chat.completions.create({
      temperature: 0.9,
      response_format : { "type": "json_object" },
      model: 'gpt-3.5-turbo-1106',
      messages: [
        { role: "system", content: system_prompt},
        { role: "user", content: example_user_prompt },
        { role: "assistant", content: example_output },
        { role: "assistant", content: user_prompt },
      ],
    });
    const raw = data.choices[0].message?.content;
    const content = JSON.parse(raw)
    const result = [];
    for (const key in content) {
        if (content.hasOwnProperty(key)) {
            const value = content[key];
            const { question, options, answer, explanation } = value;

            // Membuat objek JavaScript langsung tanpa perlu menggunakan JSON.parse()
            const questionFormat = {
                question,
                options, // Menggunakan string JSON yang sudah dibuat sebelumnya
                answer,
                explanation,
                quizId : quizId
            };
        
        result.push(questionFormat);
          }}
      return result  
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
        return [];
    }

}