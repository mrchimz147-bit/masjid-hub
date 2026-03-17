import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@zeenatulislam.org' },
    update: {},
    create: {
      email: 'admin@zeenatulislam.org',
      name: 'Admin User',
      role: 'ADMIN',
    },
  })

  // Create imam user
  const imam = await prisma.user.upsert({
    where: { email: 'imam@zeenatulislam.org' },
    update: {},
    create: {
      email: 'imam@zeenatulislam.org',
      name: 'Sheikh Ahmad',
      role: 'MODERATOR',
    },
  })

  // Seed Prayer Times for next 30 days
  const today = new Date()
  const baseTimes = {
    fajr: '05:00',
    sunrise: '06:15',
    dhuhr: '12:10',
    asr: '15:45',
    maghrib: '18:05',
    isha: '19:20',
  }

  for (let i = 0; i < 30; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() + i)

    // Slight variations for each day
    const variation = Math.floor(i / 3)
    const fajrMin = (5 + variation) % 2 === 0 ? '05' : '04'
    const maghribMin = (18 + variation) % 2 === 0 ? '05' : '10'

    await prisma.prayerTime.upsert({
      where: { date },
      update: {},
      create: {
        date,
        fajr: `${fajrMin}:${(30 + i) % 60}`.padStart(5, '0').slice(0, 5),
        sunrise: `06:${(15 + i) % 60}`.padStart(5, '0').slice(0, 5),
        dhuhr: `12:${(10 + i) % 60}`.padStart(5, '0').slice(0, 5),
        asr: `15:${(45 + i) % 60}`.padStart(5, '0').slice(0, 5),
        maghrib: `18:${maghribMin}`,
        isha: `19:${(20 + i) % 60}`.padStart(5, '0').slice(0, 5),
      },
    })
  }
  console.log('✅ Prayer times seeded')

  // Seed Wudu Steps
  const wuduSteps = [
    { stepNumber: 1, title: 'Niyyah (Intention)', arabicText: 'نِيَّةُ الْوُضُوءِ', transliteration: 'Niyyat al-Wudu', translation: 'Make the intention in your heart to perform wudu for the sake of Allah.' },
    { stepNumber: 2, title: 'Bismillah', arabicText: 'بِسْمِ اللَّهِ', transliteration: 'Bismillah', translation: 'Say "In the name of Allah" before starting.' },
    { stepNumber: 3, title: 'Wash Hands', arabicText: 'غَسْلُ الْيَدَيْنِ', transliteration: 'Ghasl al-Yadayn', translation: 'Wash both hands up to the wrists three times, starting with the right hand.' },
    { stepNumber: 4, title: 'Rinse Mouth', arabicText: 'الْمَضْمَضَةُ', transliteration: 'Al-Madmadah', translation: 'Rinse your mouth three times with water, using your right hand.' },
    { stepNumber: 5, title: 'Clean Nose', arabicText: 'الِاسْتِنْشَاقُ', transliteration: 'Al-Istinshaq', translation: 'Clean your nose by sniffing water and blowing it out three times.' },
    { stepNumber: 6, title: 'Wash Face', arabicText: 'غَسْلُ الْوَجْهِ', transliteration: 'Ghasl al-Wajh', translation: 'Wash your entire face three times, from forehead to chin and ear to ear.' },
    { stepNumber: 7, title: 'Wash Arms', arabicText: 'غَسْلُ الذِّرَاعَيْنِ', transliteration: 'Ghasl al-Dhira\'ayn', translation: 'Wash both arms from fingertips to elbows, right arm first, three times each.' },
    { stepNumber: 8, title: 'Wipe Head', arabicText: 'مَسْحُ الرَّأْسِ', transliteration: 'Mash al-Ra\'s', translation: 'Wipe your entire head once with wet hands, from front to back.' },
    { stepNumber: 9, title: 'Clean Ears', arabicText: 'تَنْظِيفُ الأُذُنَيْنِ', transliteration: 'Tanzif al-Udhunayn', translation: 'Clean both ears by inserting wet index fingers inside and wiping the outside with thumbs.' },
    { stepNumber: 10, title: 'Wash Feet', arabicText: 'غَسْلُ الْقَدَمَيْنِ', transliteration: 'Ghasl al-Qadamayn', translation: 'Wash both feet up to the ankles three times, starting with the right foot.' },
    { stepNumber: 11, title: 'Recite Shahada', arabicText: 'أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ', transliteration: 'Ashhadu an la ilaha illallah wahdahu la sharika lahu wa ashhadu anna Muhammadan \'abduhu wa rasuluhu', translation: 'I bear witness that there is no deity but Allah alone, and I bear witness that Muhammad is His servant and messenger.' },
    { stepNumber: 12, title: 'Dua After Wudu', arabicText: 'اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ', transliteration: 'Allahummaj\'alni minat-tawwabin waj\'alni minal-mutatahhirin', translation: 'O Allah, make me among those who repent and make me among those who purify themselves.' },
  ]

  for (const step of wuduSteps) {
    await prisma.guideStep.upsert({
      where: { category_stepNumber: { category: 'wudu', stepNumber: step.stepNumber } },
      update: {},
      create: { category: 'wudu', ...step },
    })
  }
  console.log('✅ Wudu steps seeded')

  // Seed Salah Steps
  const salahSteps = [
    { stepNumber: 1, title: 'Stand Facing Qibla', arabicText: 'الْقِيَامُ', transliteration: 'Al-Qiyam', translation: 'Stand upright facing the Qibla (direction of Kaaba in Makkah) with intention in your heart.' },
    { stepNumber: 2, title: 'Takbir al-Ihram', arabicText: 'اللَّهُ أَكْبَرُ', transliteration: 'Allahu Akbar', translation: 'Raise hands to ears and say "Allah is the Greatest" to begin the prayer.' },
    { stepNumber: 3, title: 'Recite Al-Fatiha', arabicText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ...', transliteration: 'Bismillahir-Rahmanir-Rahim. Alhamdu lillahi rabbil-\'alamin...', translation: 'In the name of Allah, the Most Gracious, the Most Merciful. All praise is due to Allah, Lord of all worlds...' },
    { stepNumber: 4, title: 'Ruku (Bow)', arabicText: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ', transliteration: 'Subhana Rabbiyal-\'Adhim', translation: 'Bow down, hands on knees, and say "Glory be to my Lord, the Most Great" three times.' },
    { stepNumber: 5, title: 'I\'tidal (Stand)', arabicText: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ', transliteration: 'Sami\'allahu liman hamidah', translation: 'Stand upright from ruku saying "Allah hears those who praise Him" then "Our Lord, all praise is due to You".' },
    { stepNumber: 6, title: 'Sujud (Prostrate)', arabicText: 'سُبْحَانَ رَبِّيَ الْأَعْلَى', transliteration: 'Subhana Rabbiyal-A\'la', translation: 'Prostrate with forehead, nose, hands, knees, and feet touching the ground. Say "Glory be to my Lord, the Most High" three times.' },
    { stepNumber: 7, title: 'Jalsa (Sit)', arabicText: 'رَبِّ اغْفِرْ لِي', transliteration: 'Rabbighfir li', translation: 'Sit briefly between the two prostrations saying "My Lord, forgive me".' },
    { stepNumber: 8, title: 'Tashahhud & Salam', arabicText: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ', transliteration: 'Assalamu \'alaykum wa rahmatullah', translation: 'Recite the Tashahhud, then turn head right and left saying "Peace and mercy of Allah be upon you".' },
  ]

  for (const step of salahSteps) {
    await prisma.guideStep.upsert({
      where: { category_stepNumber: { category: 'salah', stepNumber: step.stepNumber } },
      update: {},
      create: { category: 'salah', ...step },
    })
  }
  console.log('✅ Salah steps seeded')

  // Seed Daily Duas
  const duas = [
    { title: 'Waking Up', category: 'morning', arabicText: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ', transliteration: 'Alhamdu lillahil-lathee ahyana ba\'da ma amatana wa ilayhin-nushoor', translation: 'All praise is due to Allah who gave us life after causing us to die, and to Him is the return.', order: 1 },
    { title: 'Morning Azkar', category: 'morning', arabicText: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ', transliteration: 'Asbahna wa asbahal mulku lillah, walhamdu lillah', translation: 'We have entered the morning and the dominion belongs to Allah, and all praise is due to Allah.', order: 2 },
    { title: 'Before Eating', category: 'eating', arabicText: 'بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ', transliteration: 'Bismillahi wa \'ala barkatillah', translation: 'In the name of Allah and with the blessings of Allah.', order: 3 },
    { title: 'After Eating', category: 'eating', arabicText: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ', transliteration: 'Alhamdu lillahil-lathee at\'amana wa saqana wa ja\'alana muslimeen', translation: 'All praise is due to Allah who fed us, gave us drink, and made us Muslims.', order: 4 },
    { title: 'Before Sleeping', category: 'sleeping', arabicText: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا', transliteration: 'Bismika Allahumma amutu wa ahya', translation: 'In Your name, O Allah, I die and I live.', order: 5 },
    { title: 'Entering Home', category: 'home', arabicText: 'بِسْمِ اللَّهِ وَلَجْنَا وَبِسْمِ اللَّهِ خَرَجْنَا وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا', transliteration: 'Bismillahi walajna, wa bismillahi kharajna, wa \'ala rabbina tawakkalna', translation: 'In the name of Allah we enter and in the name of Allah we leave, and upon our Lord we depend.', order: 6 },
    { title: 'Leaving Home', category: 'home', arabicText: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', transliteration: 'Bismillahi, tawakkaltu \'alallah, wa la hawla wa la quwwata illa billah', translation: 'In the name of Allah, I place my trust in Allah, and there is no might nor power except with Allah.', order: 7 },
    { title: 'Entering Mosque', category: 'mosque', arabicText: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ', transliteration: 'Allahumma iftah li abwaba rahmatik', translation: 'O Allah, open for me the gates of Your mercy.', order: 8 },
    { title: 'Leaving Mosque', category: 'mosque', arabicText: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ', transliteration: 'Allahumma inni as\'aluka min fadlik', translation: 'O Allah, I ask You for Your bounty.', order: 9 },
    { title: 'Entering Bathroom', category: 'bathroom', arabicText: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ', transliteration: 'Allahumma inni a\'udhu bika minal-khubuthi wal-khaba\'ith', translation: 'O Allah, I seek refuge with You from all evil and harmful things.', order: 10 },
    { title: 'Leaving Bathroom', category: 'bathroom', arabicText: 'غُفْرَانَكَ', transliteration: 'Ghufranak', translation: 'I ask for Your forgiveness.', order: 11 },
    { title: 'Travel by Vehicle', category: 'travel', arabicText: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ', transliteration: 'Subhanal-lathee sakhkhara lana hadha wa ma kunna lahu muqrinin', translation: 'Glory be to Him who has subjected this to us, and we could never have it by our efforts.', order: 12 },
    { title: 'Evening Azkar', category: 'evening', arabicText: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ', transliteration: 'Amsayna wa amsal mulku lillah, walhamdu lillah', translation: 'We have entered the evening and the dominion belongs to Allah, and all praise is due to Allah.', order: 13 },
    { title: 'Dua for Parents', category: 'daily', arabicText: 'رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا', transliteration: 'Rabbighfir li wa liwalidayya warhamhuma kama rabbayani saghira', translation: 'My Lord, forgive me and my parents, and have mercy on them as they raised me when I was young.', order: 14 },
    { title: 'Before Wudu', category: 'daily', arabicText: 'بِسْمِ اللَّهِ', transliteration: 'Bismillah', translation: 'In the name of Allah.', order: 15 },
  ]

  for (const dua of duas) {
    await prisma.dua.upsert({
      where: { id: dua.order.toString() },
      update: {},
      create: dua,
    })
  }
  console.log('✅ Duas seeded')

  // Seed Announcements
  await prisma.announcement.createMany({
    data: [
      {
        title: 'Janaza Announcement',
        content: 'Inna lillahi wa inna ilayhi raji\'un. The Janaza prayer for the late Haji Ibrahim will be held after Dhuhr prayer today at the masjid. May Allah grant him Jannah.',
        category: 'emergency',
        priority: 1,
      },
      {
        title: 'Community Meeting',
        content: 'All members are requested to attend the annual general meeting this Saturday after Maghrib prayer. Agenda items include Madressa expansion and hall renovation.',
        category: 'committee',
        priority: 2,
      },
      {
        title: 'Daily Reminder',
        content: 'Remember to recite Surah Al-Kahf on this blessed day of Jumu\'ah. The Prophet (SAW) said: "Whoever recites Surah Al-Kahf on Friday, a light will shine for him between this Friday and the next."',
        category: 'daily_reminder',
        priority: 3,
      },
    ],
  })
  console.log('✅ Announcements seeded')

  console.log('🎉 Database seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
