import { NextResponse } from 'next/server'

// Islamic Quiz Questions - Progressive Difficulty
export const QUIZ_QUESTIONS = {
  // EASY - Basic Islamic Knowledge
  easy: [
    {
      id: 'e1',
      question: 'How many pillars of Islam are there?',
      options: ['3', '5', '7', '10'],
      correct: 1,
      explanation: 'There are 5 pillars of Islam: Shahadah, Salah, Zakat, Sawm, and Hajj.',
      category: 'basics'
    },
    {
      id: 'e2',
      question: 'What is the first pillar of Islam?',
      options: ['Salah', 'Zakat', 'Shahadah', 'Hajj'],
      correct: 2,
      explanation: 'Shahadah (Declaration of Faith) is the first pillar - declaring there is no god but Allah and Muhammad is His Messenger.',
      category: 'basics'
    },
    {
      id: 'e3',
      question: 'How many daily prayers are obligatory?',
      options: ['3', '4', '5', '6'],
      correct: 2,
      explanation: 'Five daily prayers are obligatory: Fajr, Dhuhr, Asr, Maghrib, and Isha.',
      category: 'salah'
    },
    {
      id: 'e4',
      question: 'What do we say before eating?',
      options: ['Alhamdulillah', 'Bismillah', 'MashAllah', 'SubhanAllah'],
      correct: 1,
      explanation: 'We say "Bismillah" (In the name of Allah) before eating.',
      category: 'daily'
    },
    {
      id: 'e5',
      question: 'What is the holy book of Islam?',
      options: ['Torah', 'Bible', 'Quran', 'Psalm'],
      correct: 2,
      explanation: 'The Quran is the holy book of Islam, revealed to Prophet Muhammad ﷺ.',
      category: 'quran'
    },
    {
      id: 'e6',
      question: 'What is the Islamic greeting?',
      options: ['Hello', 'Good morning', 'Assalamu Alaikum', 'Hi'],
      correct: 2,
      explanation: 'Assalamu Alaikum means "Peace be upon you" - the Islamic greeting.',
      category: 'daily'
    },
    {
      id: 'e7',
      question: 'In which month do Muslims fast?',
      options: ['Shaban', 'Ramadan', 'Muharram', 'Dhul Hijjah'],
      correct: 1,
      explanation: 'Muslims fast during the holy month of Ramadan.',
      category: 'fasting'
    },
    {
      id: 'e8',
      question: 'How many surahs are in the Quran?',
      options: ['100', '114', '120', '30'],
      correct: 1,
      explanation: 'The Quran contains 114 surahs (chapters).',
      category: 'quran'
    },
    {
      id: 'e9',
      question: 'What is the first surah of the Quran?',
      options: ['Al-Baqarah', 'Al-Fatihah', 'Al-Ikhlas', 'An-Nas'],
      correct: 1,
      explanation: 'Al-Fatihah (The Opening) is the first surah of the Quran.',
      category: 'quran'
    },
    {
      id: 'e10',
      question: 'Where do Muslims go for Hajj?',
      options: ['Medina', 'Jerusalem', 'Makkah', 'Cairo'],
      correct: 2,
      explanation: 'Hajj is performed in Makkah, Saudi Arabia - the holiest city in Islam.',
      category: 'hajj'
    },
  ],

  // MEDIUM - Intermediate Knowledge
  medium: [
    {
      id: 'm1',
      question: 'What is the name of the Prophet\'s nursing mother (رضي الله عنها)?',
      options: ['Aminah', 'Halimah as-Sa\'diyah', 'Khadijah', 'Fatimah'],
      correct: 1,
      explanation: 'Halimah as-Sa\'diyah (رضي الله عنها) was the Prophet\'s nursing mother who cared for him in the desert.',
      category: 'seerah'
    },
    {
      id: 'm2',
      question: 'Which uncle of the Prophet ﷺ rejected Islam till his death?',
      options: ['Hamzah', 'Abbas', 'Abu Talib', 'Abu Lahab'],
      correct: 2,
      explanation: 'Abu Talib, the Prophet\'s uncle who raised him, died without accepting Islam, though he protected the Prophet ﷺ.',
      category: 'seerah'
    },
    {
      id: 'm3',
      question: 'How many prophets are mentioned by name in the Quran?',
      options: ['25', '50', '124,000', '99'],
      correct: 0,
      explanation: '25 prophets are mentioned by name in the Quran, though there were 124,000 prophets sent to humanity.',
      category: 'prophets'
    },
    {
      id: 'm4',
      question: 'Which surah has no Bismillah at the beginning?',
      options: ['Al-Fatihah', 'Al-Baqarah', 'At-Tawbah', 'Ya-Sin'],
      correct: 2,
      explanation: 'Surah At-Tawbah (Bara\'ah) is the only surah that does not begin with Bismillah.',
      category: 'quran'
    },
    {
      id: 'm5',
      question: 'What is Ayat al-Kursi?',
      options: ['Verse of Light', 'Verse of the Throne', 'Verse of Mercy', 'Verse of Guidance'],
      correct: 1,
      explanation: 'Ayat al-Kursi (Verse of the Throne) is from Surah Al-Baqarah (2:255), describing Allah\'s greatness.',
      category: 'quran'
    },
    {
      id: 'm6',
      question: 'Who was the first muezzin in Islam?',
      options: ['Bilal ibn Rabah', 'Abu Bakr', 'Umar', 'Ali'],
      correct: 0,
      explanation: 'Bilal ibn Rabah (رضي الله عنه) was the first muezzin, chosen by the Prophet ﷺ for his beautiful voice.',
      category: 'history'
    },
    {
      id: 'm7',
      question: 'What is Qunoot?',
      options: ['A type of prayer', 'Supplication in Witr', 'Islamic tax', 'Pilgrimage rite'],
      correct: 1,
      explanation: 'Qunoot is a supplication made during Witr prayer, typically in the last rak\'ah.',
      category: 'fiqh'
    },
    {
      id: 'm8',
      question: 'Which companion compiled the Quran into one book?',
      options: ['Abu Bakr', 'Umar', 'Uthman', 'Ali'],
      correct: 2,
      explanation: 'Uthman (رضي الله عنه) commissioned the compilation of the Quran into one standard text.',
      category: 'history'
    },
    {
      id: 'm9',
      question: 'What is the number of rak\'ahs in Witr prayer?',
      options: ['1', '3', '5', 'Can vary'],
      correct: 3,
      explanation: 'Witr can be prayed as 1, 3, 5, 7, 9, or 11 rak\'ahs - the minimum is 1 rak\'ah.',
      category: 'fiqh'
    },
    {
      id: 'm10',
      question: 'Which prophet could speak to animals?',
      options: ['Dawud (AS)', 'Sulaiman (AS)', 'Isa (AS)', 'Yusuf (AS)'],
      correct: 1,
      explanation: 'Prophet Sulaiman (AS) was blessed with the ability to understand and communicate with animals and jinn.',
      category: 'prophets'
    },
  ],

  // HARD - Advanced Knowledge
  hard: [
    {
      id: 'h1',
      question: 'What is the name of the Prophet\'s foster sister who nursed with him?',
      options: ['Halimah', 'Shayma', 'Khadijah', 'Aminah'],
      correct: 1,
      explanation: 'Shayma was the daughter of Halimah and the Prophet\'s foster sister through nursing.',
      category: 'seerah'
    },
    {
      id: 'h2',
      question: 'How many verses are in Surah Al-Baqarah?',
      options: ['200', '286', '100', '150'],
      correct: 1,
      explanation: 'Surah Al-Baqarah has 286 verses - it is the longest surah in the Quran.',
      category: 'quran'
    },
    {
      id: 'h3',
      question: 'Which wife of the Prophet ﷺ was the first to pass away after him?',
      options: ['Aisha', 'Khadijah', 'Zainab bint Khuzaima', 'Hafsa'],
      correct: 2,
      explanation: 'Zainab bint Khuzaima (رضي الله عنها), known as "Mother of the Poor", was the first wife to pass away after Khadijah.',
      category: 'seerah'
    },
    {
      id: 'h4',
      question: 'What is the name of the angel who carries the throne of Allah?',
      options: ['Jibreel', 'Mikail', 'Israfil', 'All angels carry it'],
      correct: 3,
      explanation: 'According to hadith, four angels carry the Throne of Allah, and on the Day of Judgment, eight will carry it.',
      category: 'angels'
    },
    {
      id: 'h5',
      question: 'In which cave did the Prophet ﷺ receive the first revelation?',
      options: ['Cave of Thawr', 'Cave of Hira', 'Cave of the Seven Sleepers', 'Cave of Abraham'],
      correct: 1,
      explanation: 'The first revelation was received in the Cave of Hira on Jabal an-Nour (Mountain of Light).',
      category: 'seerah'
    },
    {
      id: 'h6',
      question: 'What is the meaning of "Al-Muttaqun" in the Quran?',
      options: ['Believers', 'The pious/God-conscious', 'Scholars', 'Martyrs'],
      correct: 1,
      explanation: 'Al-Muttaqun refers to the pious, God-conscious believers who fear Allah and follow His commands.',
      category: 'quran'
    },
    {
      id: 'h7',
      question: 'Which battle did the Muslims lose?',
      options: ['Badr', 'Uhud', 'Khandaq', 'All were victories'],
      correct: 1,
      explanation: 'The Battle of Uhud was a setback for Muslims due to archers disobeying the Prophet\'s orders.',
      category: 'history'
    },
    {
      id: 'h8',
      question: 'How many daughters did the Prophet ﷺ have?',
      options: ['2', '3', '4', '5'],
      correct: 2,
      explanation: 'The Prophet ﷺ had 4 daughters: Zainab, Ruqayyah, Umm Kulthum, and Fatimah (رضي الله عنهن).',
      category: 'seerah'
    },
    {
      id: 'h9',
      question: 'What year was the Hijrah (migration to Medina)?',
      options: ['610 CE', '622 CE', '630 CE', '632 CE'],
      correct: 1,
      explanation: 'The Hijrah took place in 622 CE, marking the beginning of the Islamic calendar.',
      category: 'history'
    },
    {
      id: 'h10',
      question: 'Who was the last companion to see the Prophet ﷺ before his passing?',
      options: ['Abu Bakr', 'Ali', 'Anas ibn Malik', 'Aisha'],
      correct: 2,
      explanation: 'Anas ibn Malik (رضي الله عنه) was one of the last companions to see the Prophet ﷺ before he passed away.',
      category: 'seerah'
    },
  ],

  // HOLY MOLY - Expert Level
  holyMoly: [
    {
      id: 'hm1',
      question: 'What is the exact wording of the opening of Surah Al-Kauthar?',
      options: ['إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ', 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', 'قُلْ هُوَ اللَّهُ أَحَدٌ', 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ'],
      correct: 0,
      explanation: 'Surah Al-Kauthar begins: إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ (Indeed, We have granted you Al-Kauthar).',
      category: 'quran'
    },
    {
      id: 'hm2',
      question: 'Recite the complete Ayat al-Kursi. What comes after "وَلَا يَئُودُهُ حِفْظُهُمَا"?',
      options: ['وَهُوَ الْعَلِيُّ الْعَظِيمُ', 'وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ', 'لَا إِكْرَاهَ فِي الدِّينِ', 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ'],
      correct: 1,
      explanation: 'After "وَلَا يَئُودُهُ حِفْظُهُمَا" comes "وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ" (His Throne extends over the heavens and the earth).',
      category: 'quran'
    },
    {
      id: 'hm3',
      question: 'What is the Arabic text for the Qunoot supplication?',
      options: ['اللَّهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ', 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً', 'اللَّهُمَّ إِنَّا نَسْتَعِينُكَ', 'All of the above can be Qunoot'],
      correct: 3,
      explanation: 'There are multiple Qunoot supplications. The most common includes: اللَّهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ and other variations.',
      category: 'fiqh'
    },
    {
      id: 'hm4',
      question: 'What was the name of the Prophet\'s paternal aunt who accepted Islam?',
      options: ['Atikah', 'Safiyyah', 'Arwa', 'Barrah'],
      correct: 1,
      explanation: 'Safiyyah bint Abdul Muttalib (رضي الله عنها) was the Prophet\'s paternal aunt who accepted Islam.',
      category: 'seerah'
    },
    {
      id: 'hm5',
      question: 'How many letters are in Surah Al-Fatihah (excluding Bismillah)?',
      options: ['100', '113', '125', '139'],
      correct: 2,
      explanation: 'Surah Al-Fatihah has 25 words and 113 letters (some scholars say 125 depending on counting method).',
      category: 'quran'
    },
    {
      id: 'hm6',
      question: 'Which companion was known as "Saifullah" (Sword of Allah)?',
      options: ['Ali ibn Abi Talib', 'Khalid ibn al-Walid', 'Hamzah ibn Abdul Muttalib', 'Umar ibn al-Khattab'],
      correct: 1,
      explanation: 'Khalid ibn al-Walid (رضي الله عنه) was given the title "Saifullah" by the Prophet ﷺ.',
      category: 'history'
    },
    {
      id: 'hm7',
      question: 'What is the last verse revealed in the Quran?',
      options: ['Al-Ma\'idah 5:3', 'Al-Baqarah 2:281', 'An-Nasr 110:3', 'At-Tawbah 9:128'],
      correct: 0,
      explanation: 'Scholars differ, but many consider verse 5:3 (about the completion of religion) or 2:281 (about fearing Allah) as the last revealed.',
      category: 'quran'
    },
    {
      id: 'hm8',
      question: 'Name the Prophet\'s family member who was his foster brother through Halimah?',
      options: ['Abdullah', 'Abdullah ibn Abdul Muttalib', 'Abdullah ibn al-Harith', 'Masruh'],
      correct: 2,
      explanation: 'Abdullah ibn al-Harith was the Prophet\'s foster brother through Halimah as-Sa\'diyah\'s nursing.',
      category: 'seerah'
    },
    {
      id: 'hm9',
      question: 'What is the exact number of sajdas (prostrations) of recitation in the Quran?',
      options: ['10', '14', '15', '16'],
      correct: 2,
      explanation: 'There are 15 sajdas of recitation (sajdat at-tilawah) in the Quran according to the Shafi\'i school.',
      category: 'quran'
    },
    {
      id: 'hm10',
      question: 'Recite the complete Dua Qunoot. What follows "وَعَافِنِي فِيمَنْ عَافَيْتَ"?',
      options: ['وَتَوَفَّنِي إِذَا تَوَفَّيْتَ', 'وَتَوَلَّنِي فِيمَنْ تَوَلَّيْتَ', 'وَاجْعَلْنِي مِنَ التَّوَّابِينَ', 'وَاعْفُ عَنِّي وَارْحَمْنِي'],
      correct: 0,
      explanation: 'After "وَعَافِنِي فِيمَنْ عَافَيْتَ" comes "وَتَوَفَّنِي إِذَا تَوَفَّيْتَ" (And cause me to die when You cause others to die).',
      category: 'fiqh'
    },
  ],
}

// GET - Get quiz questions
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const difficulty = searchParams.get('difficulty')
    const count = parseInt(searchParams.get('count') || '10')

    if (difficulty && difficulty in QUIZ_QUESTIONS) {
      const questions = QUIZ_QUESTIONS[difficulty as keyof typeof QUIZ_QUESTIONS]
      return NextResponse.json({
        success: true,
        questions: questions.slice(0, count),
        total: questions.length
      })
    }

    // Return all questions grouped by difficulty
    return NextResponse.json({
      success: true,
      questions: QUIZ_QUESTIONS,
      total: Object.values(QUIZ_QUESTIONS).flat().length
    })
  } catch (error) {
    console.error('Error fetching quiz questions:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch quiz questions' }, { status: 500 })
  }
}

// POST - Save quiz score (leaderboard)
export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { name, score, total, difficulty, timeTaken } = data

    // In a real app, this would save to database
    // For now, we return success and let client store in localStorage
    return NextResponse.json({
      success: true,
      message: 'Score recorded',
      score: {
        name,
        score,
        total,
        difficulty,
        timeTaken,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Error saving quiz score:', error)
    return NextResponse.json({ success: false, error: 'Failed to save score' }, { status: 500 })
  }
}
