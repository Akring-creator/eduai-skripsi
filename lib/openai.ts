const OpenAI = require('openai');

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is also the default, can be omitted
});

export const basicType = async (
  numOfQuestion: number,
  numOfOption: number,
  material: string,
  guidance: string,
  example_question: string
) => {
  const inputMaterial = material.replace(/"/g, '\\"');
  const examplePrompt = {
    basic: {
      user: 'Buatlah 2 soal pilihan ganda dengan 4 pilihan jawaban dan pembahasannya dengan ketentuan tambahan sebagai berikut: Semua soal harus berbentuk analisis dari materi yang diberikan,.Materi yang akan digunakan adalah:\nGrup C dalam iklim koppen:\n Cfa = Iklim subtropis basah; dengan suhu rata-rata pada bulan terdingin di atas 0 °C (32 °F) dan memiliki setidaknya satu bulan dengan suhu rata-rata di atas 22 °C (72 °F). Tidak ada perbedaan yang signifikan antara curah hujan bulanan. Cfb = Iklim laut; dengan suhu rata-rata pada bulan terdingin di atas 0 °C (32 °F) dan memiliki setidaknya empat bulan dengan suhu rata-rata di atas 10 °C (50 °F) dan di bawah 22 °C (72 °F). Tidak ada perbedaan yang signifikan antara curah hujan bulanan. Cfc = Iklim subartik oseanik; dengan suhu rata-rata pada bulan terdingin di atas 0 °C (32 °F) dan memiliki 1-3 bulan dengan suhu rata-rata di atas 10 °C (50 °F) dan di bawah 22 °C (72 °F). Tidak ada perbedaan yang signifikan antara curah hujan bulanan. Cwa = Iklim subtropis yang dipengaruhi angin muson; dengan suhu rata-rata pada bulan terdingin di atas 0 °C (32 °F) namun di bawah 18 °C (64 °F). Memiliki setidaknya satu bulan dengan suhu rata-rata di atas 22 °C (72 °F) dan empat bulan dengan suhu rata-rata di atas 10 °C (50 °F). Curah hujan di musim panas sepuluh kali lebih banyak dibandingkan di musim dingin. Cwb = Iklim subtropis dataran tinggi dengan musim dingin yang kering; bulan terdingin memiliki suhu udara rata-rata di atas 0 °C (32 °F), suhu rata-rata setiap bulan di bawah 22 °C (72 °F), dan memiliki setidaknya empat bulan dengan suhu rata-rata di atas 10 °C (50 °F). Curah hujan di musim panas sepuluh kali lebih banyak dibandingkan di musim dingin. Cwc = Iklim subtropis dataran tiggi dingin atau iklim lautan subkutub; dengan suhu rata-rata bulan terdingin di atas 0 °C (32 °F) dan 1-3 bulan dengan suhu rata-rata di atas 10 °C (50 °F). Memiliki curah hujan bulan terpanas terbanyak sekitar sepuluh kali lipat dibanding bulan terdingin. Curah hujan di musim panas sepuluh kali lebih banyak dibandingkan di musim dingin. Csa = Iklim mediterania dengan musim panas yang terik; bulan terdingin memiliki suhu rata-rata di atas 0 °C (32 °F) dan setidaknya satu bulan 22 °C (72 °F) dan empat bulan dengan suhu di atas 10 °C (50 °F). Curah hujan di musim dingin tiga kali lebih banyak dibanding di musim panas dan curah hujan pada bulan terkering kurang dari 30 mm (1,2 in). Csb = Iklim mediterania dengan musim panas yang hangat; bulan terdingin memiliki suhu rata-rata di atas 0 °C (32 °F), dan setidaknya empat bulan dengan suhu rata-rata di atas 0 °C (32 °F) dengan suhu rata-rata pada setiap bulan tidak melebihi 22 °C (72 °F). Curah hujan di musim dingin tiga kali lebih banyak dibanding di musim panas dan curah hujan pada bulan terkering kurang dari 30 mm (1,2 in). Csc = Iklim mediterania dengan musim panas yang dingin, dengan suhu rata-rata pada bulan terdingin di atas 0 °C (32 °F) dan setidaknya 1-3 bulan dengan suhu rata-rata di atas 10 °C (50 °F). Curah hujan di musim dingin tiga kali lebih banyak dibanding di musim panas dan curah hujan pada bulan terkering kurang dari 30 mm (1,2 in).',
      assistant:
        '{ "soal_1": { "question": "Daerah yang memiliki suhu rata-rata pada bulan terdingin 3°C dan memiliki 3 bulan dengan suhu rata-rata di atas 10°C dan di bawah 22°C. Curah hujan di musim panas tidak jauh berbeda dengan musim dingin. Jenis iklim koppen apakah yang sesuai dengan deskripsi tersebut?", "options" : ["Iklim subtropis basah (Cfa)","Iklim subartik oseanik (Cfc)","Iklim laut (Cfb)","Iklim subtropis dataran tinggi (Cwb)"],"answer": "Iklim subartik oseanik (Cfc)", "explanation" : "Iklim subartik oseanik memiliki suhu rata-rata pada bulan terdingin di atas 0 °C (32 °F) dan memiliki 1-3 bulan dengan suhu rata-rata di atas 10 °C (50 °F) dan di bawah 22 °C (72 °F). Tidak ada perbedaan yang signifikan antara curah hujan bulanan."},"soal_2": {"question": "Kota X memiliki suhu rata-rata bulan terdingin di bawah 0°C dan suhu rata-rata bulan terhangat di atas 22°C. Apa klasifikasi iklim yang dominan di kota X berdasarkan klasifikasi iklim Koppen?", "options" : ["Af", "Bwh", "Cfa", "Dfa"], "answer": "Cfa","explanation": "Berdasarkan klasifikasi iklim Koppen, kota X termasuk ke dalam Grup C (sedang) dengan tipe iklim Cfa (Iklim subtropis lembap dengan musim panas panjang dan lembap). Kriteria Cfa adalah dengan suhu rata-rata pada bulan terdingin di atas 0 °C (32 °F) dan memiliki setidaknya satu bulan dengan suhu rata-rata di atas 22 °C (72 °F). Tidak ada perbedaan yang signifikan antara curah hujan bulanan. kota X masuk dalam kriteria Cfa."}}',
    },
    literation: {
      user: 'Buatlah  2 soal pilihan ganda dengan 4 pilihan jawaban dan pembahasannya dengan ketentuan tambahan sebagai berikut: semua soal harus memiliki bahan bacaan dengan panjang minimal 200 karakter sebelum masuk ke pertanyaannya.Materi yang akan digunakan adalah: Zonasi Flora dan Fauna di Indonesia',
      assistant:
        '{ "soal_1": { "question": "Indonesia adalah negara yang memiliki keanekaragaman flora dan fauna yang sangat kaya. Salah satu faktor yang mempengaruhi zonasi flora dan fauna di Indonesia adalah letak geografisnya. Indonesia terletak di antara dua benua dan dua samudra, sehingga menjadi perlintasan bagi berbagai spesies flora dan fauna dari berbagai wilayah. Selain itu, faktor iklim juga mempengaruhi zonasi flora dan fauna di Indonesia. Iklim di Indonesia terbagi menjadi beberapa tipe, seperti iklim tropis basah, iklim tropis kering, dan iklim tropis pegunungan. Berdasarkan penjelasan tersebut, apa faktor yang mempengaruhi zonasi flora dan fauna di Indonesia?", "options" : ["Letak geografis","Suhu rata-rata","Curah hujan","Tekanan udara"],"answer": "Letak geografis", "explanation" : "Letak geografis Indonesia yang berada di antara dua benua dan dua samudra mempengaruhi zonasi flora dan fauna di negara ini. Hal ini membuat Indonesia menjadi perlintasan bagi berbagai spesies flora dan fauna dari berbagai wilayah."},"soal_2": {"question": "Indonesia memiliki beberapa zona flora dan fauna yang berbeda-beda. Salah satu zona flora dan fauna yang terkenal di Indonesia adalah hutan hujan tropis. Hutan hujan tropis merupakan zona yang memiliki keanekaragaman hayati yang sangat tinggi. Apa yang menjadi karakteristik utama hutan hujan tropis?", "options" : ["Suhu yang rendah sepanjang tahun","Curah hujan yang tinggi sepanjang tahun","Kelembaban udara yang rendah","Tanaman yang tumbuh sangat jarang"],"answer": "Curah hujan yang tinggi sepanjang tahun","explanation": "Karakteristik utama hutan hujan tropis adalah curah hujan yang tinggi sepanjang tahun. Hal ini menjadi faktor penting dalam menjaga keanekaragaman hayati yang tinggi di zona ini, karena curah hujan yang tinggi memberikan nutrisi yang cukup untuk tanaman dan menyediakan habitat yang cocok bagi berbagai spesies flora dan fauna."}}',
    },
  };
  const system_prompt =
    'Kamu adalah seorang pendidik yang memiliki kemampuan membuat soal  berjenis pilihan ganda berdasarkan materi yang diberikan oleh pengguna. Setiap soal yang kamu buat disimpan dalam bentuk JSON dengan format sebagai berikut :{soal_n: {question:  , options : [] , answer: ,   explanation : }} \n Berikut merupakan penjelasan dari format tersebut: n merupakan nomor urut soal, question berisi pertanyaan yang dihasilkan, options merupakan sebuah array yang berisi pilihan jawaban, answer merupakan jawaban yang benar dan explanation merupakan penjelasan dari jawaban yang benar, panjang explanation minimal 50 karakter. Berikut merupakan ketentuan umum dalam membuat soal:\njawaban yang benar harus menjadi pilihan jawaban dan panjang kalimat antar pilihan jawaban harus mendekati atau sama panjang. Selain ketentuan tadi, terdapat ketentuan tambahan yang akan ditentukan oleh pengguna, gunakan ketentuan tambahan dalam pembuatan soal!. Jika pengguna menyediakan contoh soal maka gunakan contoh soal tersebut sebagai panduan tambahan untuk pembuatan soal';

  const user_prompt = `Buatlah ${numOfQuestion} soal pilihan ganda dengan ${numOfOption} pilihan jawaban dan pembahasannya dengan ketentuan tambahan sebagai berikut: ${guidance}. Materi yang akan digunakan adalah:${inputMaterial}`;

  try {
    const data = await openai.chat.completions.create({
      temperature: 0.7,
      response_format: { type: 'json_object' },
      model: 'gpt-3.5-turbo-1106',
      messages: [
        { role: 'system', content: system_prompt },
        { role: 'user', content: examplePrompt.basic.user },
        { role: 'assistant', content: examplePrompt.basic.assistant },
        { role: 'user', content: user_prompt },
      ],
    });
    const raw = data.choices[0].message?.content;
    const content = JSON.parse(raw);
    const result = [];
    for (const key in content) {
      if (content.hasOwnProperty(key)) {
        const value = content[key];
        const { question, options, answer, explanation } = value;

        if (options.includes(answer)) {
          // Membuat objek JavaScript langsung tanpa perlu menggunakan JSON.parse()
          const questionFormat = {
            question,
            options, // Menggunakan string JSON yang sudah dibuat sebelumnya
            answer,
            explanation,
          };

          result.push(questionFormat);
        }
      }
    }
    return result;
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    return [];
  }
};
// Assuming openai is properly configured

export const chapterGenerator = async (
  title: string,
  chapters: number,
  maxRetryCount = 10
) => {
  const systemPrompt =
    'seorang kursus developer yang akan membantu untuk pengembangan kursus dari materi yang ingin diajarkan. Output dihasilkan dalam bentuk JSON dengan format sebagai berikut: {title: "berisi judul dari user", chapters: "array string yang berisi judul chapter", description: "berisi deskripsi dari kursus"}';
  const userExamplePrompt =
    'Saya ingin membuat kursus berjudul Perencanaan Wilayah Kota Kelas XII SMA yang terdiri dari 4 chapter! Kembangkan kursus tersebut untuk saya!';
  const assistantExamplePrompt =
    '{title: "Perencanaan Wilayah Kota Kelas XII SMA", chapters: ["Pengenalan Perencanaan Wilayah Kota","Konsep Dasar Perencanaan Wilayah Kota","Tahapan Perencanaan Wilayah Kota","Isu Kontemporer dalam Perencanaan Wilayah Kota"], description: "Dengan kursus ini, diharapkan siswa dapat memahami konsep-konsep dasar perencanaan wilayah kota, mengenal tahapan-tahapan dalam perencanaan wilayah kota, dan juga memahami isu-isu kontemporer yang terkait dengan perencanaan wilayah kota. Selain itu, siswa juga akan dilatih untuk berpikir kritis, melakukan analisis, dan mengambil keputusan dalam konteks perencanaan wilayah kota."}';
  const userPrompt = `Saya ingin membuat kursus berjudul ${title} yang terdiri dari ${chapters} chapter! Kembangkan kursus tersebut untuk saya!`;

  let attempt = 1;

  while (attempt <= maxRetryCount) {
    try {
      console.log(`Attempt ${attempt}: Generating chapters for ${title}`);
      const data = await openai.chat.completions.create({
        temperature: 0.7,
        response_format: { type: 'json_object' },
        model: 'gpt-3.5-turbo-1106',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userExamplePrompt },
          { role: 'assistant', content: assistantExamplePrompt },
          { role: 'user', content: userPrompt },
        ],
      });

      const raw = data.choices[0].message?.content;
      const content = JSON.parse(raw);

      if (content.chapters.length === 0) {
        throw new Error(`Generated chapters are empty.`);
      }

      const mandatoryKeys = ['title', 'chapters', 'description'];
      for (const key of mandatoryKeys) {
        if (!(key in content)) {
          throw new Error(
            `Mandatory key '${key}' not found in the content object.`
          );
        }
      }

      // Mandatory keys found, exit the loop
      return content;
    } catch (error) {
      console.error(`Error in attempt ${attempt}: ${error}`);

      // Wait for a moment before trying again
      await new Promise((resolve) => setTimeout(resolve, 1000));
      attempt++;
    }
  }

  console.error(`Failed to get results after ${maxRetryCount} attempts.`);
  return null;
};

export const transcriptSummarizer = async (
  transcript: string,
  retryCount = 10
) => {
  const system_prompt =
    'seorang kursus developer yang akan membantu untuk merangkup transkrip dari video youtube. Kamu cuma perlu mengambil inti dari video tersebut. Tidak perlu memasukkan sponsor atau pengenalan diri dari kreator youtube tersebut. Jangan gunakan tanda petik satu atau petik dua dalam rangkuman tersebut. Jumlah maksimal karakter dari transkrip adalah 2000 karakter. Output dihasilkan dalam bentuk JSON dengan format sebagai berikut: {transcript: "Isi dari rangkuman video tersebut"}';
  const user_example_prompt =
    "Rangkumkan transcript youtube berikut: today I'm going to tell you why I'm switching to flatter the reasoning behind it and then we'll go over the project to show you the progress so far and how I tackled some areas like State Management storage or navigation as some of you know I have an Android app with about 13 million downloads I've talked about it in a previous video you can watch it the link is in the description below at the moment it is written in a mix of cotlin and Java the calculator part is Legacy Java code and to be honest I hardly understand it by now the rest of it like the converters here are written in cotlin it has a Firebase backhand and when the user is logged in it stores all the settings and the data in a fir store database now why am I switching everything to flatter I can think of three major reasons dated UI technical depth and lack of iio support first dated UI the app looks a bit too old and it needs a refresh also the last time I wrote it I didn't really have a plan I scribbled a sketch on a piece of paper and began to code as a result the user experience could be better I usually do this refresh every 2 to 3 years it helps to keep the users engaged to let them know the app is maintained and it's not an abandoned project this time I found a designer who wireframe the screens for the app it's not much and the app as you'll see is not going to look exactly like this but they help a lot when it comes to improving the user experience throughout it and later with structuring the code well what has that to do with flut to be honest the is simple and 80% of it it's just UI so I might as well just rewrite it from scratch and flatter will help me do that it's so much easier to write UI and flatter after you get the hang of it a list for example looks just like this a few lines of code compared to the recycler view adapter view item behemat we had on Android and it just works everywhere the second reason is technical depth as you might have already noticed I have not made the switch yet to Jetpack compose I'm still using good old XML views I got so used to them that it's hard to even imagine something better but the whole life cycle binding view model live data monster we had for a long time now on Android it's just ah also Android decided to deprecate so many methods I had used for years and years I knew I had to switch sometimes but I just wasn't ready yet this goes hand in hand with a third reason which is lack of iOS support I always wanted to have my app on iOS 2 but I was pretty intimidated by it knowing how much time it took me to gain my Android development experience now with a family and with kids I just didn't have that luxury anymore hiring a developer was also in my mind and I almost got to do it when it hit me why not flut I can hit two birds with one stone get rid of the technical depth and have my app on iOS 2 all that by learning one framework instead of two jetpack compose and iOS and there are big names in the industry that already use it so here is what I have so far I'm going to show you my flatter project and how I handled State Management resources like strings localization and images authentication navigation storage and maybe theming and responsive UI in the end I feel that these are the building blocks of any flatter project now for State Management I use River pod the second iteration of Provider I had to choose between it and block and for me as a fresh flatter developer it was a bit easier to comprehend and I liked it it lets me keep every component State separate and I don't really have to worry about inherited or stateful widgets so much I just use stateless widgets with providers easy for Strings and localization I use the flatter localization package I need translations for my app and with it I can put every translation in a single folder it will then generate me all the classes needed to use them accordingly here you can see the strings class I made as a wrapper over the generate localization class in the app I will call strings of context to get every string and it will handle localization on its own for images I use flutter gen and flut SVG I need to be able to handle Vector files and this allows me to do it it generates the assets class with the contents of the assets folder as in the strings case I can later use the SVG files in code using images of context to get every Vector as a widget authentication is handled through Firebase it's just a single click class with a sign in a sign out and a user provider through this provider I can throughout the app check the user authentication State and get the user details if the user is not null we're logged in if the user is null we're logged out navigation is handled through go router since flatter can run in the browser too I needed an easy way to be able to manage links with it I can use an address like/ settings to go straight to the apps settings it helps with inapp navigation to handling the navigation stack I definitely recommend it for storage well here things get more interesting I have two layers of storage a local one and the remote one if the user is logged out I store everything in the shared preferences if the user logs in this local data gets synchronized with the data on the cloud in this case the fir store database I handled this through two River POD notifiers at an abstract level when I create a repository I can choose it to be local or remote for example the settings repository is synchronized to Firebase and the theme repository it's local on the device I use a key for each repository to save the data either locally or as a fir store document the model class holds the data and handles Json serialization and parsing the Notifier updates the data and stores it accordingly and the provider well it provides you can see I used an autod dispose Notifier provider that's because I want the providers to be disposed when not in use it's not nice to keep Firebase connections open for themes I build everything theme based on a seed color and I can have light and dark variations for everything theme I keep them in the configuration and I can initialize them like this changing the color here changes the theme then I can listen to the theme provider remember storage to rebuild the app whenever the theme changes this way I can easily do this with this single line of code last we get to the responsive UI it's basically an inherited widget I made I can initialize it like this and provide a phone t and desktop layout in the three I can get the current layout with layout of context and these three methods I'm about to start building the main calculator sounds easy on paper but it's pretty complicated with history graphs different layouts for different screen sizes and so on that's what I have so far not much but it's a nice starting block let me know what you think what I missed what I could have explain better as always I was Andre thank you for watching";
  const assistant_example_prompt =
    "{'transcript': 'Why switching to Flutter for  Android app? . There are three major reasons: outdated UI, technical depth, and lack of iOS support. The current app looks old and needs a refresh, and the speaker plans to do this by rewriting it using Flutter. They also mention that they havent switched to Jetpack Compose yet and have been using XML views instead, but they find it difficult to imagine something better. Additionally, the speaker expresses their desire to have their app on iOS as well. To address these issues, they decided to switch to Flutter, which would allow them to rewrite the app from scratch while also having iOS support.\n\nThe speaker then goes on to discuss their progress so far in using Flutter. They explain how they handled state management, resources like strings and localization, images, authentication, navigation, storage, theming, and responsive UI. For state management, they use Riverpod, which allows them to keep each components state separate using stateless widgets with providers. They use the Flutter localization package for strings and localization, FlutterGen and Flutter SVG for handling images, and Firebase for authentication. They manage navigation with GoRouter and handle storage through two layers: local storage using shared preferences and cloud storage using Firestore. They also mention using a theme-based approach for theming and building a responsive UI using an inherited widget.\n\nIn conclusion, the speaker provides an update on their progress with Flutter and invites feedback on what they have shared so far.'}";
  const user_prompt = `Rangkumkan transcript youtube berikut:${transcript}`;

  let attempt = 1;

  while (attempt <= retryCount) {
    try {
      const data = await openai.chat.completions.create({
        temperature: 0.7,
        response_format: { type: 'json_object' },
        model: 'gpt-3.5-turbo-1106',
        messages: [
          { role: 'system', content: system_prompt },
          { role: 'user', content: user_example_prompt },
          { role: 'assistant', content: assistant_example_prompt },
          { role: 'user', content: user_prompt },
        ],
      });

      const raw = data.choices[0].message?.content;
      const content = JSON.parse(raw);

      const mandatoryKeys = ['transcript'];
      for (const key of mandatoryKeys) {
        if (!(key in content)) {
          console.error(
            `Kunci wajib '${key}' tidak ditemukan dalam objek content.`
          );
          // Tunggu sebentar sebelum mencoba lagi
          await new Promise((resolve) => setTimeout(resolve, 500));
          attempt++;
          continue;
        }
      }

      // Kunci wajib ditemukan, keluar dari loop
      return content;
    } catch (error) {
      console.error(`Terjadi kesalahan pada percobaan ke-${attempt}:`, error);

      // Tunggu sebentar sebelum mencoba lagi
      await new Promise((resolve) => setTimeout(resolve, 1000));
      attempt++;
    }
  }

  console.error(`Gagal mendapatkan hasil setelah ${retryCount} percobaan.`);
  return null;
};
