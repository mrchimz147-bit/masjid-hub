import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Seed Wudu and Salah guides with Shafi methodology
export async function POST() {
  try {
    // Wudu steps according to Shafi'i school
    const wuduSteps = [
      {
        category: 'wudu',
        stepNumber: 1,
        title: 'Intention (Niyyah)',
        arabicText: 'نَوَيْتُ الْوُضُوءَ لِرَفْعِ الْحَدَثِ الأَصْغَرِ فَرْضًا لِلَّهِ تَعَالَى',
        transliteration: 'Nawaytu al-wudu li-rafi\'il-hadathil-asghar fardan lillahi ta\'ala',
        translation: 'I intend to perform wudu to remove minor impurity as an obligation for Allah the Exalted',
      },
      {
        category: 'wudu',
        stepNumber: 2,
        title: 'Say Bismillah',
        arabicText: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
        transliteration: 'Bismillahir-rahmanir-raheem',
        translation: 'In the name of Allah, the Most Gracious, the Most Merciful',
      },
      {
        category: 'wudu',
        stepNumber: 3,
        title: 'Wash Hands (3 times)',
        arabicText: null,
        transliteration: null,
        translation: 'Wash both hands up to the wrists, including between the fingers. Make sure to remove anything that may prevent water from reaching the skin (rings, etc.).',
      },
      {
        category: 'wudu',
        stepNumber: 4,
        title: 'Rinse Mouth (3 times)',
        arabicText: null,
        transliteration: null,
        translation: 'Take water in your right hand and rinse your mouth thoroughly. Use miswak or fingers to clean teeth if available.',
      },
      {
        category: 'wudu',
        stepNumber: 5,
        title: 'Clean Nose (3 times)',
        arabicText: null,
        transliteration: null,
        translation: 'Sniff water into the nose with the right hand and blow it out with the left hand. Clean the nostrils thoroughly.',
      },
      {
        category: 'wudu',
        stepNumber: 6,
        title: 'Wash Face (3 times)',
        arabicText: null,
        transliteration: null,
        translation: 'Wash the entire face from the top of the forehead to the bottom of the chin, and from ear to ear. Make sure water reaches all parts.',
      },
      {
        category: 'wudu',
        stepNumber: 7,
        title: 'Wash Arms (3 times each)',
        arabicText: null,
        transliteration: null,
        translation: 'Wash the right arm from fingertips to elbow, then the left arm. In Shafi\'i school, it is recommended to include a small portion above the elbow.',
      },
      {
        category: 'wudu',
        stepNumber: 8,
        title: 'Wipe Head (Masah)',
        arabicText: null,
        transliteration: null,
        translation: 'Wipe the entire head with wet hands once. In Shafi\'i school, the entire head must be wiped - from the forehead to the back and back to the forehead.',
      },
      {
        category: 'wudu',
        stepNumber: 9,
        title: 'Wipe Ears',
        arabicText: null,
        transliteration: null,
        translation: 'Wipe the inside of the ears with the index fingers and the outside with the thumbs using fresh water. This is part of the head wiping in Shafi\'i method.',
      },
      {
        category: 'wudu',
        stepNumber: 10,
        title: 'Wash Feet (3 times each)',
        arabicText: null,
        transliteration: null,
        translation: 'Wash the right foot up to and including the ankles, then the left foot. Use the pinky finger to clean between the toes. Make sure water reaches all areas.',
      },
      {
        category: 'wudu',
        stepNumber: 11,
        title: 'Dua After Wudu',
        arabicText: 'أَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
        transliteration: 'Ashhadu an la ilaha illallah wahdahu la sharika lah, wa ashhadu anna Muhammadan abduhu wa rasuluh',
        translation: 'I bear witness that there is no deity but Allah alone, without partner, and I bear witness that Muhammad is His servant and messenger',
      },
    ]

    // Salah steps according to Shafi'i school
    const salahSteps = [
      {
        category: 'salah',
        stepNumber: 1,
        title: 'Intention (Niyyah)',
        arabicText: null,
        transliteration: null,
        translation: 'Make intention in your heart for the specific prayer you are about to perform (Fajr, Dhuhr, etc.). In Shafi\'i school, intention should specify: the prayer, that it is obligatory, and facing the Ka\'bah.',
      },
      {
        category: 'salah',
        stepNumber: 2,
        title: 'Takbirat al-Ihram',
        arabicText: 'اللَّهُ أَكْبَرُ',
        transliteration: 'Allahu Akbar',
        translation: 'Allah is the Greatest. Raise hands to ear level (for men) or shoulder level (for women) and say Allahu Akbar to enter the prayer.',
      },
      {
        category: 'salah',
        stepNumber: 3,
        title: 'Opening Supplication',
        arabicText: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالَى جَدُّكَ وَلاَ إِلَهَ غَيْرُكَ',
        transliteration: 'Subhanaka Allahumma wa bihamdika, wa tabarakasmuka, wa ta\'ala jadduka, wa la ilaha ghayruk',
        translation: 'Glory be to You, O Allah, and praise be to You. Blessed is Your Name, exalted is Your Majesty, and there is no deity besides You.',
      },
      {
        category: 'salah',
        stepNumber: 4,
        title: 'Recite Al-Fatiha',
        arabicText: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝ الرَّحْمَنِ الرَّحِيمِ ۝ مَالِكِ يَوْمِ الدِّينِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ۝ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلاَ الضَّالِّينَ',
        transliteration: 'Bismillahir-rahmanir-raheem. Alhamdu lillahi rabbil-alameen. Ar-rahmanir-raheem. Maliki yawmid-deen. Iyyaka na\'budu wa iyyaka nasta\'een. Ihdinas-siratal-mustaqeem. Siratal-lazeena an\'amta alayhim ghayril-maghdubi alayhim walad-dalleen.',
        translation: 'In the name of Allah, the Most Gracious, the Most Merciful. All praise is for Allah, Lord of all worlds. The Most Gracious, the Most Merciful. Master of the Day of Judgment. You alone we worship, and You alone we ask for help. Guide us on the Straight Path.',
      },
      {
        category: 'salah',
        stepNumber: 5,
        title: 'Recite Surah',
        arabicText: null,
        transliteration: null,
        translation: 'Recite another surah or verses from the Quran after Al-Fatiha. Common choices: Al-Ikhlas, Al-Falaq, An-Nas, or any surah you have memorized.',
      },
      {
        category: 'salah',
        stepNumber: 6,
        title: 'Ruku (Bowing)',
        arabicText: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ',
        transliteration: 'Subhana rabbiyal-azeem',
        translation: 'Glory be to my Lord, the Most Great. Bow with hands on knees, back straight, and say this 3 times.',
      },
      {
        category: 'salah',
        stepNumber: 7,
        title: 'Standing from Ruku',
        arabicText: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ',
        transliteration: 'Sami\'a Allahu liman hamidah',
        translation: 'Allah hears the one who praises Him. Rise from ruku and say this, then add: رَبَّنَا لَكَ الْحَمْدُ (Rabbana lakal-hamd - Our Lord, to You belongs all praise).',
      },
      {
        category: 'salah',
        stepNumber: 8,
        title: 'Sujud (Prostration)',
        arabicText: 'سُبْحَانَ رَبِّيَ الأَعْلَى',
        transliteration: 'Subhana rabbiyal-a\'la',
        translation: 'Glory be to my Lord, the Most High. Prostrate with forehead, nose, both hands, knees, and toes touching the ground. Say this 3 times.',
      },
      {
        category: 'salah',
        stepNumber: 9,
        title: 'Jalsa (Sitting between Sujud)',
        arabicText: null,
        transliteration: null,
        translation: 'Sit briefly between the two prostrations. In Shafi\'i school, sit on the left foot with the right foot upright (iftirash position).',
      },
      {
        category: 'salah',
        stepNumber: 10,
        title: 'Second Sujud',
        arabicText: 'سُبْحَانَ رَبِّيَ الأَعْلَى',
        transliteration: 'Subhana rabbiyal-a\'la',
        translation: 'Glory be to my Lord, the Most High. Perform the second prostration the same as the first.',
      },
      {
        category: 'salah',
        stepNumber: 11,
        title: 'Tashahhud',
        arabicText: 'التَّحِيَّاتُ الْمُبَارَكَاتُ الصَّلَوَاتُ الطَّيِّبَاتُ لِلَّهِ',
        transliteration: 'At-tahiyyatu al-mubarakatus-salawatu at-tayyibatu lillah',
        translation: 'All greetings, blessings, and good prayers are for Allah.',
      },
      {
        category: 'salah',
        stepNumber: 12,
        title: 'Salawat',
        arabicText: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ',
        transliteration: 'Allahumma salli ala Muhammad',
        translation: 'O Allah, send blessings upon Muhammad and the family of Muhammad.',
      },
      {
        category: 'salah',
        stepNumber: 13,
        title: 'Salam (Ending Prayer)',
        arabicText: 'السَّلاَمُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ',
        transliteration: 'As-salamu alaykum wa rahmatullah',
        translation: 'Peace be upon you and the mercy of Allah. Turn your head to the right, then to the left, saying this each time.',
      },
    ]

    // Clear existing guides and insert new ones
    await db.guideStep.deleteMany({})
    
    for (const step of [...wuduSteps, ...salahSteps]) {
      await db.guideStep.create({ data: step })
    }

    // Seed duas
    const duas = [
      {
        title: 'Morning Dua',
        category: 'morning',
        arabicText: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ',
        transliteration: 'Asbahna wa asbahal-mulku lillah, wal-hamdu lillah',
        translation: 'We have entered the morning and the dominion belongs to Allah, and all praise is for Allah',
        order: 1,
      },
      {
        title: 'Evening Dua',
        category: 'evening',
        arabicText: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ',
        transliteration: 'Amsayna wa amsal-mulku lillah, wal-hamdu lillah',
        translation: 'We have entered the evening and the dominion belongs to Allah, and all praise is for Allah',
        order: 1,
      },
      {
        title: 'Before Eating',
        category: 'eating',
        arabicText: 'بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ',
        transliteration: 'Bismillahi wa ala barakatillah',
        translation: 'In the name of Allah and with the blessings of Allah',
        order: 1,
      },
      {
        title: 'After Eating',
        category: 'eating',
        arabicText: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
        transliteration: 'Alhamdu lillahil-lathee at\'amana wa saqana wa ja\'alana muslimeen',
        translation: 'Praise be to Allah Who has fed us and given us drink and made us Muslims',
        order: 2,
      },
      {
        title: 'Before Sleeping',
        category: 'sleeping',
        arabicText: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
        transliteration: 'Bismika Allahumma amutu wa ahya',
        translation: 'In Your name, O Allah, I die and I live',
        order: 1,
      },
      {
        title: 'Travel Dua',
        category: 'travel',
        arabicText: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ',
        transliteration: 'Subhanal-lathee sakhkhara lana hadha wa ma kunna lahu muqrineen',
        translation: 'Glory be to Him Who has brought this under our control, for we could never have accomplished it by ourselves',
        order: 1,
      },
      {
        title: 'Entering Masjid',
        category: 'mosque',
        arabicText: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
        transliteration: 'Allahumma iftah li abwaba rahmatik',
        translation: 'O Allah, open for me the gates of Your mercy',
        order: 1,
      },
      {
        title: 'Leaving Masjid',
        category: 'mosque',
        arabicText: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ',
        transliteration: 'Allahumma inni as-aluka min fadlik',
        translation: 'O Allah, I ask You for Your bounty',
        order: 2,
      },
      {
        title: 'Entering Home',
        category: 'home',
        arabicText: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ الْمَوْلِجِ وَخَيْرَ الْمَخْرَجِ',
        transliteration: 'Allahumma inni as-aluka khayral-mawliji wa khayral-makhraj',
        translation: 'O Allah, I ask You for the best of entering and the best of leaving',
        order: 1,
      },
    ]

    await db.dua.deleteMany({})
    for (const dua of duas) {
      await db.dua.create({ data: dua })
    }

    // Seed some announcements
    await db.announcement.deleteMany({})
    await db.announcement.create({
      data: {
        title: 'Welcome to Masjid Hub',
        content: 'Assalamu Alaikum! This is your official masjid app for prayer times, announcements, and Islamic learning. Please check back regularly for updates.',
        category: 'general',
        priority: 1,
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      guides: { wudu: wuduSteps.length, salah: salahSteps.length },
      duas: duas.length,
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to seed database',
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST to /api/seed to populate the database with Wudu, Salah guides, and Duas',
  })
}
