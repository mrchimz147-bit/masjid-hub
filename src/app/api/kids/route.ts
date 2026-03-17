import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Nasheeds with YouTube links
const nasheeds = [
  {
    id: 'n1',
    title: 'Tala\'a al-Badru \'Alayna',
    titleAr: 'طلع البدر علينا',
    description: 'Beautiful nasheed welcoming the Prophet ﷺ to Medina',
    videoUrl: 'https://www.youtube.com/embed/QDswuBC5WQ8',
    category: 'nasheed'
  },
  {
    id: 'n2',
    title: 'Ya Nabi Salam \'Alayka',
    titleAr: 'يا نبي سلام عليك',
    description: 'Sending peace and blessings upon the Prophet ﷺ',
    videoUrl: 'https://www.youtube.com/embed/f6U-R7Nf9KY',
    category: 'nasheed'
  },
  {
    id: 'n3',
    title: 'Assalamu \'Alayka',
    titleAr: 'السلام عليك',
    description: 'Beautiful greeting of peace',
    videoUrl: 'https://www.youtube.com/eC7TRdacpGU',
    category: 'nasheed'
  },
  {
    id: 'n4',
    title: 'Wayakhaibatan',
    titleAr: 'ويال خبطان',
    description: 'Islamic nasheed for children',
    videoUrl: 'https://www.youtube.com/embed/pPsOdNpCPwQ',
    category: 'nasheed'
  },
  {
    id: 'n5',
    title: 'Bismillah Song',
    titleAr: 'بسم الله',
    description: 'Learn to say Bismillah before everything',
    videoUrl: 'https://www.youtube.com/embed/JG-x-lIeMrU',
    category: 'nasheed'
  },
  {
    id: 'n6',
    title: 'Alhamdulillah Song',
    titleAr: 'الحمد لله',
    description: 'Learn to say Alhamdulillah for everything',
    videoUrl: 'https://www.youtube.com/embed/8EoPKDv7TQY',
    category: 'nasheed'
  }
]

// Sahaba Stories
const sahabaStories = [
  {
    id: 's1',
    title: 'Abu Bakr As-Siddiq (RA)',
    titleAr: 'أبو بكر الصديق',
    description: 'The first Caliph and closest companion of the Prophet ﷺ',
    content: `Abu Bakr As-Siddiq (may Allah be pleased with him) was the first man to accept Islam. He was known as "As-Siddiq" which means "The Truthful One" because he always believed the Prophet ﷺ without question.

When the Prophet ﷺ said he had traveled from Makkah to Jerusalem and then to heaven in one night (Isra and Mi'raj), many people did not believe him. But Abu Bakr said, "If the Prophet said it, then it is true!" That's when he got the title "As-Siddiq."

He was the Prophet's closest friend and companion. He was always there to help the Muslims. When the Prophet ﷺ passed away, Abu Bakr became the first Caliph (leader) of the Muslims.

Lesson: Always be truthful and believe in Allah and His Messenger. Be a good friend who supports others.`,
    category: 'story'
  },
  {
    id: 's2',
    title: 'Umar ibn Al-Khattab (RA)',
    titleAr: 'عمر بن الخطاب',
    description: 'The second Caliph known for his justice and strength',
    content: `Umar ibn Al-Khattab (may Allah be pleased with him) was one of the most powerful and just rulers in Islamic history. Before becoming Muslim, he was actually against Islam! But when he heard the beautiful verses of the Quran, his heart softened, and he became one of the strongest defenders of Islam.

As Caliph, Umar was famous for his justice. He would walk the streets at night to make sure everyone was safe and had enough food. One night, he saw a mother and her children crying because they were hungry. Umar himself carried food on his back to help them!

He lived a simple life even though he was the leader of a huge empire. He wore simple clothes and ate simple food, just like the poorest person in his kingdom.

Lesson: Be fair and just. Help those in need. Live simply and don't show off.`,
    category: 'story'
  },
  {
    id: 's3',
    title: 'Uthman ibn Affan (RA)',
    titleAr: 'عثمان بن عفان',
    description: 'The third Caliph known for his generosity and modesty',
    content: `Uthman ibn Affan (may Allah be pleased with him) was known as "Dhun-Nurayn" which means "Possessor of Two Lights" because he married two daughters of the Prophet ﷺ - first Ruqayyah, and after she passed away, he married Umm Kulthum.

He was very generous. When the Muslims needed a well for water in Medina, Uthman bought a well and gave it to the Muslims for free. During a difficult time, he donated 1,000 camels loaded with food and supplies to help the Muslim army.

Uthman was also very modest. Even when he was Caliph, he would wake up at night to pray, and he would avoid looking at things that were not appropriate. He helped compile the Quran into one standard book so everyone could read it correctly.

Lesson: Be generous with what you have. Be modest and keep good company with good friends.`,
    category: 'story'
  },
  {
    id: 's4',
    title: 'Ali ibn Abi Talib (RA)',
    titleAr: 'علي بن أبي طالب',
    description: 'The fourth Caliph, cousin and son-in-law of the Prophet ﷺ',
    content: `Ali ibn Abi Talib (may Allah be pleased with him) was the cousin of the Prophet ﷺ and grew up in the Prophet's house. He was the first child to accept Islam at a young age.

Ali was very brave and strong. He was an excellent warrior and fought in many battles to defend Islam. He was also very wise and known for his knowledge and justice. Many of his sayings and teachings are still studied today.

The Prophet ﷺ said about Ali: "I am the city of knowledge and Ali is its gate." This shows how much knowledge and wisdom Ali had. He became the fourth Caliph and ruled with justice.

Lesson: Be brave but also seek knowledge. Stand up for what is right, even when it's hard.`,
    category: 'story'
  },
  {
    id: 's5',
    title: 'Bilal ibn Rabah (RA)',
    titleAr: 'بلال بن رباح',
    description: 'The first muezzin, known for his beautiful voice and faith',
    content: `Bilal ibn Rabah (may Allah be pleased with him) was an Ethiopian slave before Islam. He was one of the first people to accept Islam. Because he became Muslim, his master tortured him - he was made to lie on hot sand with heavy rocks on his chest. But Bilal refused to give up his faith. He kept saying "Ahad! Ahad!" which means "One! One!" - affirming that Allah is One.

Abu Bakr bought Bilal and freed him. Bilal became one of the closest companions of the Prophet ﷺ. He had a beautiful voice, and the Prophet ﷺ chose him to be the first muezzin - the person who calls the Adhan (call to prayer).

Even today, Bilal is remembered as an example of someone who never gave up his faith, no matter how difficult things became. He was honored by the Prophet ﷺ and will always be remembered as one of the greatest companions.

Lesson: Be brave in your faith. Don't give up when things are hard. Trust in Allah.`,
    category: 'story'
  },
  {
    id: 's6',
    title: 'Khadijah bint Khuwaylid (RA)',
    titleAr: 'خديجة بنت خويلد',
    description: 'The first wife of the Prophet ﷺ and Mother of the Believers',
    content: `Khadijah (may Allah be pleased with her) was a successful businesswoman in Makkah. She was known for her intelligence, kindness, and good character. She hired the Prophet Muhammad ﷺ to lead her trade caravans, and she was impressed by his honesty and trustworthiness.

She was the first person to believe in the Prophet ﷺ when he received the first revelation. When the Prophet ﷺ was scared after seeing Angel Jibreel, Khadijah comforted him and believed in him completely. She said, "Allah will never disgrace you."

Khadijah supported the Prophet ﷺ with her wealth and stood by him through all the difficulties. She was the mother of all his children except one. The Prophet ﷺ loved her dearly and never forgot her kindness even after she passed away.

Lesson: Be kind and supportive to your family. Believe in and encourage those you love.`,
    category: 'story'
  },
  {
    id: 's7',
    title: 'Fatimah bint Muhammad (RA)',
    titleAr: 'فاطمة بنت محمد',
    description: 'The beloved daughter of the Prophet ﷺ',
    content: `Fatimah (may Allah be pleased with her) was the youngest daughter of the Prophet Muhammad ﷺ. She was known for her piety, modesty, and devotion to Allah. She was very close to her father and loved him deeply.

Even though she was the daughter of the Prophet ﷺ, she lived a simple life. She would grind wheat by hand and carry water, doing all her household chores herself. She was a devoted wife to Ali and a loving mother to her children.

The Prophet ﷺ said: "Fatimah is part of me. Whatever hurts her, hurts me, and whatever pleases her, pleases me." She is one of the four greatest women in Paradise, along with Maryam (Mary), Khadijah, and Asiyah (the wife of Pharaoh).

Lesson: Be humble and simple. Love your family. Devote yourself to prayer and worship.`,
    category: 'story'
  },
  {
    id: 's8',
    title: 'Abdullah ibn Mas\'ud (RA)',
    titleAr: 'عبدالله بن مسعود',
    description: 'Known for his beautiful Quran recitation',
    content: `Abdullah ibn Mas'ud (may Allah be pleased with him) was a young shepherd when he first met the Prophet ﷺ. He became Muslim at a young age and was one of the first to accept Islam. 

He was known for his beautiful recitation of the Quran. The Prophet ﷺ said, "Whoever wants to hear the Quran fresh as it was revealed, let him hear it from Ibn Mas'ud." He learned the Quran directly from the Prophet ﷺ and memorized over 70 surahs from him.

Ibn Mas'ud lived a humble life. He used to say, "I am a man who was a shepherd, and Allah honored me with Islam." He became one of the greatest scholars of the Quran and taught many people about Islam.

Lesson: Learn and recite the Quran beautifully. Stay humble no matter how much knowledge you gain.`,
    category: 'story'
  }
]

// Islamic Quiz Games
const quizGames = [
  {
    id: 'g1',
    title: 'Prophets of Allah',
    description: 'Test your knowledge about the Prophets',
    questions: [
      {
        question: 'Who was the first Prophet?',
        options: ['Prophet Ibrahim (AS)', 'Prophet Adam (AS)', 'Prophet Nuh (AS)', 'Prophet Musa (AS)'],
        correct: 1
      },
      {
        question: 'Which Prophet could talk to animals?',
        options: ['Prophet Dawud (AS)', 'Prophet Sulaiman (AS)', 'Prophet Isa (AS)', 'Prophet Yusuf (AS)'],
        correct: 1
      },
      {
        question: 'Which Prophet was swallowed by a whale?',
        options: ['Prophet Yunus (AS)', 'Prophet Nuh (AS)', 'Prophet Musa (AS)', 'Prophet Isa (AS)'],
        correct: 0
      },
      {
        question: 'How many Prophets are mentioned in the Quran by name?',
        options: ['25', '50', '100', '124,000'],
        correct: 0
      },
      {
        question: 'Which Prophet built the Kaaba with his son?',
        options: ['Prophet Musa (AS)', 'Prophet Ibrahim (AS)', 'Prophet Muhammad (ﷺ)', 'Prophet Ismail (AS)'],
        correct: 1
      }
    ],
    category: 'game'
  },
  {
    id: 'g2',
    title: 'Five Pillars of Islam',
    description: 'Learn about the foundations of Islam',
    questions: [
      {
        question: 'What is the first Pillar of Islam?',
        options: ['Salah', 'Zakat', 'Shahadah', 'Hajj'],
        correct: 2
      },
      {
        question: 'How many daily prayers are obligatory?',
        options: ['3', '4', '5', '6'],
        correct: 2
      },
      {
        question: 'What percentage of wealth is given as Zakat?',
        options: ['1%', '2.5%', '5%', '10%'],
        correct: 1
      },
      {
        question: 'During which month do Muslims fast?',
        options: ['Shaban', 'Ramadan', 'Muharram', 'Dhul Hijjah'],
        correct: 1
      },
      {
        question: 'Which city must Muslims visit for Hajj?',
        options: ['Medina', 'Jerusalem', 'Makkah', 'Cairo'],
        correct: 2
      }
    ],
    category: 'game'
  },
  {
    id: 'g3',
    title: 'Quran Knowledge',
    description: 'Test your knowledge about the Holy Quran',
    questions: [
      {
        question: 'How many surahs are in the Quran?',
        options: ['100', '114', '120', '130'],
        correct: 1
      },
      {
        question: 'What is the first surah of the Quran?',
        options: ['Al-Baqarah', 'Al-Fatihah', 'Al-Ikhlas', 'An-Nas'],
        correct: 1
      },
      {
        question: 'Which surah is called "The Heart of the Quran"?',
        options: ['Surah Yaseen', 'Surah Al-Mulk', 'Surah Al-Kahf', 'Surah Ar-Rahman'],
        correct: 0
      },
      {
        question: 'How many juz (parts) is the Quran divided into?',
        options: ['20', '25', '30', '40'],
        correct: 2
      },
      {
        question: 'Which surah has no Bismillah at the beginning?',
        options: ['Surah At-Tawbah', 'Surah An-Nas', 'Surah Al-Fatihah', 'Surah Ya-Sin'],
        correct: 0
      }
    ],
    category: 'game'
  },
  {
    id: 'g4',
    title: 'Islamic Manners',
    description: 'Learn about good Islamic etiquette',
    questions: [
      {
        question: 'What do we say before eating?',
        options: ['Alhamdulillah', 'Bismillah', 'SubhanAllah', 'Allahu Akbar'],
        correct: 1
      },
      {
        question: 'What do we say after eating?',
        options: ['Bismillah', 'Alhamdulillah', 'MashAllah', 'JazakAllah'],
        correct: 1
      },
      {
        question: 'What do we say when we sneeze?',
        options: ['Alhamdulillah', 'Bismillah', 'MashAllah', 'Ya Allah'],
        correct: 0
      },
      {
        question: 'What is the Islamic greeting?',
        options: ['Good morning', 'Hello', 'Assalamu Alaikum', 'Hi'],
        correct: 2
      },
      {
        question: 'What should we reply to Assalamu Alaikum?',
        options: ['Wa Alaikum Assalam', 'Hello', 'Thank you', 'Goodbye'],
        correct: 0
      }
    ],
    category: 'game'
  }
]

// Arabic for Kids
const arabicForKids = [
  {
    id: 'a1',
    letter: 'ا',
    letterName: 'Alif',
    word: 'أسد',
    wordMeaning: 'Lion',
    audioUrl: '',
    category: 'arabic'
  },
  {
    id: 'a2',
    letter: 'ب',
    letterName: 'Ba',
    word: 'بطة',
    wordMeaning: 'Duck',
    audioUrl: '',
    category: 'arabic'
  },
  {
    id: 'a3',
    letter: 'ت',
    letterName: 'Ta',
    word: 'تفاح',
    wordMeaning: 'Apple',
    audioUrl: '',
    category: 'arabic'
  },
  {
    id: 'a4',
    letter: 'ث',
    letterName: 'Tha',
    word: 'ثعلب',
    wordMeaning: 'Fox',
    audioUrl: '',
    category: 'arabic'
  },
  {
    id: 'a5',
    letter: 'ج',
    letterName: 'Jim',
    word: 'جمل',
    wordMeaning: 'Camel',
    audioUrl: '',
    category: 'arabic'
  },
  {
    id: 'a6',
    letter: 'ح',
    letterName: 'Ha',
    word: 'حصان',
    wordMeaning: 'Horse',
    audioUrl: '',
    category: 'arabic'
  },
  {
    id: 'a7',
    letter: 'خ',
    letterName: 'Kha',
    word: 'خروف',
    wordMeaning: 'Sheep',
    audioUrl: '',
    category: 'arabic'
  },
  {
    id: 'a8',
    letter: 'د',
    letterName: 'Dal',
    word: 'دجاجة',
    wordMeaning: 'Chicken',
    audioUrl: '',
    category: 'arabic'
  },
  {
    id: 'a9',
    letter: 'ذ',
    letterName: 'Dhal',
    word: 'ذئب',
    wordMeaning: 'Wolf',
    audioUrl: '',
    category: 'arabic'
  },
  {
    id: 'a10',
    letter: 'ر',
    letterName: 'Ra',
    word: 'رمان',
    wordMeaning: 'Pomegranate',
    audioUrl: '',
    category: 'arabic'
  },
  {
    id: 'a11',
    letter: 'ز',
    letterName: 'Zay',
    word: 'زرافة',
    wordMeaning: 'Giraffe',
    audioUrl: '',
    category: 'arabic'
  },
  {
    id: 'a12',
    letter: 'س',
    letterName: 'Sin',
    word: 'سمكة',
    wordMeaning: 'Fish',
    audioUrl: '',
    category: 'arabic'
  },
  {
    id: 'a13',
    letter: 'ش',
    letterName: 'Shin',
    word: 'شمس',
    wordMeaning: 'Sun',
    audioUrl: '',
    category: 'arabic'
  },
  {
    id: 'a14',
    letter: 'ص',
    letterName: 'Sad',
    word: 'صقر',
    wordMeaning: 'Falcon',
    audioUrl: '',
    category: 'arabic'
  },
  {
    id: 'a15',
    letter: 'ض',
    letterName: 'Dad',
    word: 'ضفدع',
    wordMeaning: 'Frog',
    audioUrl: '',
    category: 'arabic'
  },
  {
    id: 'a16',
    letter: 'ط',
    letterName: 'Ta',
    word: 'طائر',
    wordMeaning: 'Bird',
    audioUrl: '',
    category: 'arabic'
  }
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    if (category === 'nasheeds') {
      return NextResponse.json({ content: nasheeds })
    } else if (category === 'stories') {
      return NextResponse.json({ content: sahabaStories })
    } else if (category === 'games') {
      return NextResponse.json({ content: quizGames })
    } else if (category === 'arabic') {
      return NextResponse.json({ content: arabicForKids })
    }

    // Return all content
    return NextResponse.json({
      nasheeds,
      stories: sahabaStories,
      games: quizGames,
      arabic: arabicForKids
    })
  } catch (error) {
    console.error('Error fetching kids content:', error)
    return NextResponse.json({ error: 'Failed to fetch kids content' }, { status: 500 })
  }
}
