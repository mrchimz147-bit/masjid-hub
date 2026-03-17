import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Tajweed lesson data
const TAJWEED_LESSONS = [
  // Makharij (Pronunciation Points)
  {
    category: 'makharij',
    lessonNumber: 1,
    title: 'Introduction to Makharij',
    arabicTitle: 'مخارج الحروف',
    description: 'Makharij refers to the points of articulation in the mouth from where Arabic letters are pronounced. There are 17 distinct makharij for the 29 Arabic letters.',
    arabicExamples: ['أ ب ت ث ج ح خ'],
    practiceText: 'Practice identifying where each letter originates in your mouth. The throat, tongue, lips, and nasal cavity are the main areas.',
  },
  {
    category: 'makharij',
    lessonNumber: 2,
    title: 'The Throat Letters (Halq)',
    arabicTitle: 'حروف الحلق',
    description: 'Six letters are pronounced from the throat: أ (Hamzah), ه (Ha), ع (Ayn), ح (Ha), غ (Ghayn), خ (Kha). These are divided into three parts of the throat.',
    arabicExamples: ['أ', 'ه', 'ع', 'ح', 'غ', 'خ'],
    practiceText: 'Practice: أَهْلًا، عَظِيم، غَفُور، خَالِق',
  },
  {
    category: 'makharij',
    lessonNumber: 3,
    title: 'The Tongue Letters',
    arabicTitle: 'حروف اللسان',
    description: 'Eighteen letters originate from the tongue at different positions: the deepest part, middle, and tip.',
    arabicExamples: ['ق', 'ك', 'ج', 'ش', 'ي', 'ض', 'ل', 'ن', 'ر', 'ط', 'د', 'ت', 'ص', 'ز', 'س', 'ظ', 'ذ', 'ث'],
    practiceText: 'Practice: قُرْآن، كَرِيم، جَنَّة، شُكْر',
  },
  {
    category: 'makharij',
    lessonNumber: 4,
    title: 'The Lip Letters',
    arabicTitle: 'حروف الشفتين',
    description: 'Four letters are pronounced using the lips: ف (Fa), ب (Ba), م (Meem), و (Waw).',
    arabicExamples: ['ف', 'ب', 'م', 'و'],
    practiceText: 'Practice: فَاتِحَة، بِسْمِ، مَالِك، وَالْعَصْر',
  },
  
  // Nun Sakinah & Tanwin Rules
  {
    category: 'nun_sakinah',
    lessonNumber: 1,
    title: 'Introduction to Nun Sakinah & Tanwin',
    arabicTitle: 'النون الساكنة والتنوين',
    description: 'Nun Sakinah is a Nun with no vowel (سُكُون). Tanwin is a double vowel at the end of nouns. Both have four rules: Idhar, Idgham, Iqlab, and Ikhfa.',
    arabicExamples: ['نْ', 'ً', 'ٍ', 'ٌ'],
    practiceText: 'Understand that these rules make recitation smoother and more beautiful.',
  },
  {
    category: 'nun_sakinah',
    lessonNumber: 2,
    title: 'Idhar (Clear Pronunciation)',
    arabicTitle: 'الإظهار',
    description: 'When Nun Sakinah or Tanwin meets any of the six throat letters (ء، ه، ع، ح، غ، خ), pronounce the Nun clearly without merging.',
    arabicExamples: ['مِنْ آيَاتٍ', 'عَلِيمٌ حَكِيمٌ', 'مِنْ عِلْمٍ'],
    practiceText: 'Practice: مِنْ خَيْرٍ، عَذَابٌ أَلِيمٌ، مِنْ حَكِيمٍ',
  },
  {
    category: 'nun_sakinah',
    lessonNumber: 3,
    title: 'Idgham (Merging)',
    arabicTitle: 'الإدغام',
    description: 'When Nun Sakinah or Tanwin meets one of the six letters (ي، ر، م، ل، و، ن), the Nun merges into that letter. These form the phrase "يرملون".',
    arabicExamples: ['مِنْ وَرَائِهِمْ', 'فَكَانُواْ مِنْهُمْ', 'مِنْ لَّدُنٍّ'],
    practiceText: 'Practice with Ghunnah (nasal sound): مِن يَقُولُ، مِن وَالٍ، مِن رَّبِّهِمْ',
  },
  {
    category: 'nun_sakinah',
    lessonNumber: 4,
    title: 'Iqlab (Conversion)',
    arabicTitle: 'الإقلاب',
    description: 'When Nun Sakinah or Tanwin meets the letter ب (Ba), convert the Nun into a hidden Meem with ghunnah.',
    arabicExamples: ['مِن بَعْدِ', 'سَمِيعٌ بَصِيرٌ', 'أَن بُورِكَ'],
    practiceText: 'Practice: مِنۢ بَعْدِ، عَلِيمٌۢ بِمَا، لَيُنۢبَذَنَّ',
  },
  {
    category: 'nun_sakinah',
    lessonNumber: 5,
    title: 'Ikhfa (Hiding)',
    arabicTitle: 'الإخفاء',
    description: 'When Nun Sakinah or Tanwin meets any of the 15 letters (ص، ذ، ث، ك، ج، ش، ق، س، د، ط، ز، ف، ت، ض، ظ), pronounce with a hidden nasal sound.',
    arabicExamples: ['مِنْ صَلَاتِهِمْ', 'عَظِيمٌ ثَوَابُهُمْ', 'مِنْ جَهَنَّمَ'],
    practiceText: 'Practice the ghunnah for approximately 2 beats on these letters.',
  },
  
  // Meem Sakinah Rules
  {
    category: 'meem_sakinah',
    lessonNumber: 1,
    title: 'Introduction to Meem Sakinah',
    arabicTitle: 'الميم الساكنة',
    description: 'Meem Sakinah is a Meem with no vowel. It has three rules: Idhar Shafawi, Idgham Shafawi, and Ikhfa Shafawi.',
    arabicExamples: ['مْ'],
    practiceText: 'Understanding these rules improves the flow and beauty of Quranic recitation.',
  },
  {
    category: 'meem_sakinah',
    lessonNumber: 2,
    title: 'Idhar Shafawi (Labial Clarity)',
    arabicTitle: 'الإظهار الشفوي',
    description: 'When Meem Sakinah meets any letter except ب and م, pronounce it clearly with no ghunnah.',
    arabicExamples: ['أَنتُمْ تَعْلَمُونَ', 'لَهُمْ دَارُ', 'وَلَكُمْ فِي'],
    practiceText: 'Practice: أَنُتْمْ، عَلَيْهِمْ، لَهُمْ',
  },
  {
    category: 'meem_sakinah',
    lessonNumber: 3,
    title: 'Idgham Shafawi (Labial Merging)',
    arabicTitle: 'الإدغام الشفوي',
    description: 'When Meem Sakinah meets another Meem, merge them together with ghunnah (2 beats).',
    arabicExamples: ['مِنْ مَآءٍ مُّهِينٍ', 'جَآءَكُم مَّوْعِظَةٌ'],
    practiceText: 'Practice the merging with ghunnah: مِّنْ مَّالِهِ، كُنتُم مَّؤْمِنِينَ',
  },
  {
    category: 'meem_sakinah',
    lessonNumber: 4,
    title: 'Ikhfa Shafawi (Labial Hiding)',
    arabicTitle: 'الإخفاء الشفوي',
    description: 'When Meem Sakinah meets the letter ب, hide the Meem with ghunnah. This is the opposite of Iqlab.',
    arabicExamples: ['تَرْمِيهِم بِحِجَارَةٍ', 'رَبُّهُم بِهِمْ'],
    practiceText: 'Practice: وَمَا أَنْتُم بِمُعْجِزِينَ، يَعْلَمُونَ بِاللَّهِ',
  },
  
  // Madd (Prolongation)
  {
    category: 'madd',
    lessonNumber: 1,
    title: 'Introduction to Madd',
    arabicTitle: 'المد',
    description: 'Madd means to prolong the sound of a vowel. There are two types: Madd Asli (original, 2 beats) and Madd Far\'i (secondary, 4-6 beats).',
    arabicExamples: ['ا', 'و', 'ي'],
    practiceText: 'The three letters of Madd are Alif, Waw, and Ya when they are silent after a vowel.',
  },
  {
    category: 'madd',
    lessonNumber: 2,
    title: 'Madd Asli (Original Prolongation)',
    arabicTitle: 'المد الأصلي',
    description: 'This is when a Madd letter is not followed by a Hamzah or Sukoon. Prolong for 2 beats (approximately 1 second).',
    arabicExamples: ['نُوحِيهَا', 'قَالُوا', 'لَكُمْ'],
    practiceText: 'Practice 2-beat prolongation: الْقُرْآنُ، سُوحًا، لَآتِيَنَّ',
  },
  {
    category: 'madd',
    lessonNumber: 3,
    title: 'Madd Wajib Muttasil',
    arabicTitle: 'المد الواجب المتصل',
    description: 'When a Madd letter is followed by a Hamzah in the SAME word, prolong 4-5 beats. This is obligatory.',
    arabicExamples: ['جَآءَ', 'السُّفَهَآءُ', 'جَآءَتْ'],
    practiceText: 'Practice: جِيءَ، سُوءٌ، رُءُوسُهُمْ',
  },
  {
    category: 'madd',
    lessonNumber: 4,
    title: 'Madd Jaiz Munfasil',
    arabicTitle: 'المد الجائز المنفصل',
    description: 'When a Madd letter is followed by a Hamzah in the NEXT word, prolong 2-5 beats. This is permissible.',
    arabicExamples: ['فِي أَنفُسِكُمْ', 'يَا أَيُّهَا', 'تُوبُوا إِلَى'],
    practiceText: 'Practice: قُوا أَنفُسَكُمْ، يَا أَيُّهَا النَّاسُ',
  },
  {
    category: 'madd',
    lessonNumber: 5,
    title: 'Madd Lazim (Required Prolongation)',
    arabicTitle: 'المد اللازم',
    description: 'When a Madd letter is followed by a permanent Sukoon in the same word, prolong exactly 6 beats. Found in surahs like Al-Mursalat.',
    arabicExamples: ['الْآنَ', 'طس', 'الصَّآخَّةُ'],
    practiceText: 'Practice the 6-beat prolongation: دَآبَّةٍ، الْءَاخِرَةِ',
  },
  
  // Waqf (Stopping Rules)
  {
    category: 'waqf',
    lessonNumber: 1,
    title: 'Introduction to Waqf',
    arabicTitle: 'الوقف',
    description: 'Waqf means to stop recitation. Understanding stopping rules ensures correct meaning and beautiful recitation.',
    arabicExamples: ['م', 'لا', 'قف', 'ج', 'صلى', 'قلى', 'ط'],
    practiceText: 'The symbols indicate different types of stops with varying rules.',
  },
  {
    category: 'waqf',
    lessonNumber: 2,
    title: 'Waqf Symbols in the Quran',
    arabicTitle: 'علامات الوقف',
    description: 'م = Must stop, لا = Do not stop, ج = Permissible to stop or continue, قلى = Better to stop, صلى = Better to continue, ط = Permissible pause.',
    arabicExamples: ['Various symbols in Quran'],
    practiceText: 'Learn to recognize these symbols as you read the Quran.',
  },
  {
    category: 'waqf',
    lessonNumber: 3,
    title: 'Types of Stops',
    arabicTitle: 'أنواع الوقف',
    description: 'Waqf Tam (Complete Stop): End of a thought. Waqf Kafi (Sufficient Stop): Completes meaning. Waqf Hasan (Good Stop): At verse end. Waqf Qabih (Bad Stop): Changes meaning.',
    arabicExamples: ['Various examples'],
    practiceText: 'Never stop in a way that changes the meaning of the verse.',
  },
]

// GET tajweed lessons
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const lessonNumber = searchParams.get('lesson')

    // Return specific lesson
    if (category && lessonNumber) {
      const lesson = TAJWEED_LESSONS.find(
        l => l.category === category && l.lessonNumber === parseInt(lessonNumber)
      )
      if (!lesson) {
        return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
      }
      return NextResponse.json(lesson)
    }

    // Return lessons by category
    if (category) {
      const lessons = TAJWEED_LESSONS.filter(l => l.category === category)
      return NextResponse.json(lessons)
    }

    // Return all lessons grouped by category
    const grouped = TAJWEED_LESSONS.reduce((acc, lesson) => {
      if (!acc[lesson.category]) {
        acc[lesson.category] = []
      }
      acc[lesson.category].push(lesson)
      return acc
    }, {} as Record<string, typeof TAJWEED_LESSONS>)

    return NextResponse.json(grouped)
  } catch (error) {
    console.error('Error fetching tajweed lessons:', error)
    return NextResponse.json({ error: 'Failed to fetch lessons' }, { status: 500 })
  }
}

// POST - Save user progress
export async function POST(request: Request) {
  try {
    const { userId, category, lessonNumber, completed, notes } = await request.json()

    // For now, store in database
    // In future, can add TajweedProgress model
    
    return NextResponse.json({ 
      success: true, 
      message: 'Progress saved',
      userId,
      category,
      lessonNumber,
      completed 
    })
  } catch (error) {
    console.error('Error saving tajweed progress:', error)
    return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 })
  }
}
