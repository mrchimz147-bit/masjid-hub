import { NextResponse } from 'next/server'

// Hardcoded Arabic Learning Content - Works without database
const HARDCODED_ARABIC_CONTENT = {
  // Arabic Alphabet
  alphabet: [
    { id: 'a1', letter: 'ا', arabicText: 'ا', transliteration: 'Alif', translation: 'A', description: 'First letter of Arabic alphabet' },
    { id: 'a2', letter: 'ب', arabicText: 'ب', transliteration: 'Ba', translation: 'B', description: 'Second letter' },
    { id: 'a3', letter: 'ت', arabicText: 'ت', transliteration: 'Ta', translation: 'T', description: 'Third letter' },
    { id: 'a4', letter: 'ث', arabicText: 'ث', transliteration: 'Tha', translation: 'Th', description: 'Fourth letter' },
    { id: 'a5', letter: 'ج', arabicText: 'ج', transliteration: 'Jim', translation: 'J', description: 'Fifth letter' },
    { id: 'a6', letter: 'ح', arabicText: 'ح', transliteration: 'Ha', translation: 'H (heavy)', description: 'Sixth letter' },
    { id: 'a7', letter: 'خ', arabicText: 'خ', transliteration: 'Kha', translation: 'Kh', description: 'Seventh letter' },
    { id: 'a8', letter: 'د', arabicText: 'د', transliteration: 'Dal', translation: 'D', description: 'Eighth letter' },
    { id: 'a9', letter: 'ذ', arabicText: 'ذ', transliteration: 'Dhal', translation: 'Dh', description: 'Ninth letter' },
    { id: 'a10', letter: 'ر', arabicText: 'ر', transliteration: 'Ra', translation: 'R', description: 'Tenth letter' },
    { id: 'a11', letter: 'ز', arabicText: 'ز', transliteration: 'Zay', translation: 'Z', description: 'Eleventh letter' },
    { id: 'a12', letter: 'س', arabicText: 'س', transliteration: 'Sin', translation: 'S', description: 'Twelfth letter' },
    { id: 'a13', letter: 'ش', arabicText: 'ش', transliteration: 'Shin', translation: 'Sh', description: 'Thirteenth letter' },
    { id: 'a14', letter: 'ص', arabicText: 'ص', transliteration: 'Sad', translation: 'S (heavy)', description: 'Fourteenth letter' },
    { id: 'a15', letter: 'ض', arabicText: 'ض', transliteration: 'Dad', translation: 'D (heavy)', description: 'Fifteenth letter' },
    { id: 'a16', letter: 'ط', arabicText: 'ط', transliteration: 'Ta', translation: 'T (heavy)', description: 'Sixteenth letter' },
    { id: 'a17', letter: 'ظ', arabicText: 'ظ', transliteration: 'Dha', translation: 'Dh (heavy)', description: 'Seventeenth letter' },
    { id: 'a18', letter: 'ع', arabicText: 'ع', transliteration: 'Ayn', translation: 'A (deep)', description: 'Eighteenth letter' },
    { id: 'a19', letter: 'غ', arabicText: 'غ', transliteration: 'Ghayn', translation: 'Gh', description: 'Nineteenth letter' },
    { id: 'a20', letter: 'ف', arabicText: 'ف', transliteration: 'Fa', translation: 'F', description: 'Twentieth letter' },
    { id: 'a21', letter: 'ق', arabicText: 'ق', transliteration: 'Qaf', translation: 'Q', description: 'Twenty-first letter' },
    { id: 'a22', letter: 'ك', arabicText: 'ك', transliteration: 'Kaf', translation: 'K', description: 'Twenty-second letter' },
    { id: 'a23', letter: 'ل', arabicText: 'ل', transliteration: 'Lam', translation: 'L', description: 'Twenty-third letter' },
    { id: 'a24', letter: 'م', arabicText: 'م', transliteration: 'Mim', translation: 'M', description: 'Twenty-fourth letter' },
    { id: 'a25', letter: 'ن', arabicText: 'ن', transliteration: 'Nun', translation: 'N', description: 'Twenty-fifth letter' },
    { id: 'a26', letter: 'ه', arabicText: 'ه', transliteration: 'Ha', translation: 'H', description: 'Twenty-sixth letter' },
    { id: 'a27', letter: 'و', arabicText: 'و', transliteration: 'Waw', translation: 'W/Oo', description: 'Twenty-seventh letter' },
    { id: 'a28', letter: 'ي', arabicText: 'ي', transliteration: 'Ya', translation: 'Y/Ee', description: 'Twenty-eighth letter' },
  ],

  // Common Islamic Vocabulary
  vocabulary: [
    { id: 'v1', arabicText: 'اللَّه', transliteration: 'Allah', translation: 'God', description: 'The Creator' },
    { id: 'v2', arabicText: 'رَسُول', transliteration: 'Rasul', translation: 'Messenger', description: 'Prophet sent with a book' },
    { id: 'v3', arabicText: 'نَبِي', transliteration: 'Nabi', translation: 'Prophet', description: 'Prophet of Allah' },
    { id: 'v4', arabicText: 'قُرْآن', transliteration: 'Quran', translation: 'The Quran', description: 'Holy book of Islam' },
    { id: 'v5', arabicText: 'صَلَاة', transliteration: 'Salah', translation: 'Prayer', description: 'Five daily prayers' },
    { id: 'v6', arabicText: 'زَكَاة', transliteration: 'Zakah', translation: 'Charity', description: 'Obligatory alms' },
    { id: 'v7', arabicText: 'صَوْم', transliteration: 'Sawm', translation: 'Fasting', description: 'Fasting in Ramadan' },
    { id: 'v8', arabicText: 'حَج', transliteration: 'Hajj', translation: 'Pilgrimage', description: 'Pilgrimage to Makkah' },
    { id: 'v9', arabicText: 'مَسْجِد', transliteration: 'Masjid', translation: 'Mosque', description: 'Place of worship' },
    { id: 'v10', arabicText: 'إِيمَان', transliteration: 'Iman', translation: 'Faith', description: 'Belief in Allah' },
    { id: 'v11', arabicText: 'إِسْلَام', transliteration: 'Islam', translation: 'Submission', description: 'Submission to Allah' },
    { id: 'v12', arabicText: 'سُنَّة', transliteration: 'Sunnah', translation: 'Way of Prophet', description: 'Prophetic tradition' },
    { id: 'v13', arabicText: 'حَدِيث', transliteration: 'Hadith', translation: 'Narration', description: 'Sayings of Prophet ﷺ' },
    { id: 'v14', arabicText: 'جَنَّة', transliteration: 'Jannah', translation: 'Paradise', description: 'Garden of eternal bliss' },
    { id: 'v15', arabicText: 'نَار', transliteration: 'Nar', translation: 'Hellfire', description: 'Place of punishment' },
    { id: 'v16', arabicText: 'مَلَائِكَة', transliteration: 'Malaikah', translation: 'Angels', description: 'Created beings of light' },
    { id: 'v17', arabicText: 'رَحْمَة', transliteration: 'Rahmah', translation: 'Mercy', description: 'Allah\'s mercy' },
    { id: 'v18', arabicText: 'مَغْفِرَة', transliteration: 'Maghfirah', translation: 'Forgiveness', description: 'Allah\'s forgiveness' },
    { id: 'v19', arabicText: 'تَوْبَة', transliteration: 'Tawbah', translation: 'Repentance', description: 'Turning back to Allah' },
    { id: 'v20', arabicText: 'دُعَاء', transliteration: 'Dua', translation: 'Supplication', description: 'Prayer to Allah' },
  ],

  // Common Islamic Phrases
  phrases: [
    { id: 'p1', arabicText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', transliteration: 'Bismillah ir-Rahman ir-Rahim', translation: 'In the name of Allah, the Most Gracious, the Most Merciful', description: 'Said before beginning any action' },
    { id: 'p2', arabicText: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', transliteration: 'Alhamdulillahi Rabbil Alamin', translation: 'All praise is due to Allah, Lord of all worlds', description: 'Expression of gratitude' },
    { id: 'p3', arabicText: 'السَّلَامُ عَلَيْكُمْ', transliteration: 'Assalamu Alaikum', translation: 'Peace be upon you', description: 'Islamic greeting' },
    { id: 'p4', arabicText: 'وَعَلَيْكُمُ السَّلَامُ', transliteration: 'Wa Alaikum Assalam', translation: 'And peace be upon you too', description: 'Reply to Islamic greeting' },
    { id: 'p5', arabicText: 'اللَّهُ أَكْبَرُ', transliteration: 'Allahu Akbar', translation: 'Allah is the Greatest', description: 'Said in prayer and on happy occasions' },
    { id: 'p6', arabicText: 'سُبْحَانَ اللَّهِ', transliteration: 'SubhanAllah', translation: 'Glory be to Allah', description: 'Said in amazement or praise' },
    { id: 'p7', arabicText: 'مَا شَاءَ اللَّهُ', transliteration: 'MashAllah', translation: 'What Allah wills', description: 'Said when seeing something good' },
    { id: 'p8', arabicText: 'إِنْ شَاءَ اللَّهُ', transliteration: 'InshAllah', translation: 'If Allah wills', description: 'Said when planning future actions' },
    { id: 'p9', arabicText: 'أَسْتَغْفِرُ اللَّهَ', transliteration: 'Astaghfirullah', translation: 'I seek forgiveness from Allah', description: 'Seeking forgiveness' },
    { id: 'p10', arabicText: 'جَزَاكَ اللَّهُ خَيْرًا', transliteration: 'JazakAllah Khair', translation: 'May Allah reward you with goodness', description: 'Thanking someone' },
    { id: 'p11', arabicText: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', transliteration: 'La hawla wa la quwwata illa billah', translation: 'There is no power or strength except with Allah', description: 'Said in times of difficulty' },
    { id: 'p12', arabicText: 'صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ', transliteration: 'SallAllahu Alayhi wa Sallam', translation: 'May Allah send blessings and peace upon him', description: 'Blessing upon the Prophet ﷺ' },
    { id: 'p13', arabicText: 'يَا رَبّ', transliteration: 'Ya Rabb', translation: 'O Lord', description: 'Calling upon Allah' },
    { id: 'p14', arabicText: 'آمِين', transliteration: 'Ameen', translation: 'Amen / So be it', description: 'Said after making dua' },
    { id: 'p15', arabicText: 'رَضِيَ اللَّهُ عَنْهُ', transliteration: 'RadiAllahu Anhu', translation: 'May Allah be pleased with him', description: 'Said after a companion\'s name' },
  ],

  // Numbers in Arabic
  numbers: [
    { id: 'n1', arabicText: 'وَاحِد', transliteration: 'Wahid', translation: 'One (1)', description: 'Number one' },
    { id: 'n2', arabicText: 'اثْنَانِ', transliteration: 'Ithnan', translation: 'Two (2)', description: 'Number two' },
    { id: 'n3', arabicText: 'ثَلَاثَةٌ', transliteration: 'Thalatha', translation: 'Three (3)', description: 'Number three' },
    { id: 'n4', arabicText: 'أَرْبَعَةٌ', transliteration: 'Arba\'a', translation: 'Four (4)', description: 'Number four' },
    { id: 'n5', arabicText: 'خَمْسَةٌ', transliteration: 'Khamsa', translation: 'Five (5)', description: 'Number five' },
    { id: 'n6', arabicText: 'سِتَّةٌ', transliteration: 'Sitta', translation: 'Six (6)', description: 'Number six' },
    { id: 'n7', arabicText: 'سَبْعَةٌ', transliteration: 'Sab\'a', translation: 'Seven (7)', description: 'Number seven' },
    { id: 'n8', arabicText: 'ثَمَانِيَةٌ', transliteration: 'Thamaniya', translation: 'Eight (8)', description: 'Number eight' },
    { id: 'n9', arabicText: 'تِسْعَةٌ', transliteration: 'Tis\'a', translation: 'Nine (9)', description: 'Number nine' },
    { id: 'n10', arabicText: 'عَشَرَةٌ', transliteration: 'Ashara', translation: 'Ten (10)', description: 'Number ten' },
  ],

  // Days of the Week
  days: [
    { id: 'd1', arabicText: 'يَوْمُ الْأَحَدِ', transliteration: 'Yawm al-Ahad', translation: 'Sunday', description: 'First day' },
    { id: 'd2', arabicText: 'يَوْمُ الْإِثْنَيْنِ', transliteration: 'Yawm al-Ithnayn', translation: 'Monday', description: 'Second day' },
    { id: 'd3', arabicText: 'يَوْمُ الثُّلَاثَاءِ', transliteration: 'Yawm ath-Thulatha', translation: 'Tuesday', description: 'Third day' },
    { id: 'd4', arabicText: 'يَوْمُ الْأَرْبِعَاءِ', transliteration: 'Yawm al-Arbi\'a', translation: 'Wednesday', description: 'Fourth day' },
    { id: 'd5', arabicText: 'يَوْمُ الْخَمِيسِ', transliteration: 'Yawm al-Khamis', translation: 'Thursday', description: 'Fifth day' },
    { id: 'd6', arabicText: 'يَوْمُ الْجُمُعَةِ', transliteration: 'Yawm al-Jumu\'ah', translation: 'Friday (Day of Gathering)', description: 'Sixth day - Jumu\'ah day' },
    { id: 'd7', arabicText: 'يَوْمُ السَّبْتِ', transliteration: 'Yawm as-Sabt', translation: 'Saturday', description: 'Seventh day' },
  ],
}

// GET - Get Arabic learning content
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    
    // Return hardcoded content
    if (category && category in HARDCODED_ARABIC_CONTENT) {
      const content = HARDCODED_ARABIC_CONTENT[category as keyof typeof HARDCODED_ARABIC_CONTENT].map((item, idx) => ({
        ...item,
        category,
        order: idx
      }))
      return NextResponse.json({ success: true, content, grouped: { [category]: content } })
    }
    
    // Return all content grouped
    const grouped: Record<string, any[]> = {}
    const allContent: any[] = []
    
    for (const [cat, items] of Object.entries(HARDCODED_ARABIC_CONTENT)) {
      const contentWithCategory = items.map((item, idx) => ({
        ...item,
        category: cat,
        order: idx
      }))
      grouped[cat] = contentWithCategory
      allContent.push(...contentWithCategory)
    }
    
    return NextResponse.json({ success: true, content: allContent, grouped })
  } catch (error) {
    console.error('Error fetching Arabic content:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch Arabic content' }, { status: 500 })
  }
}
