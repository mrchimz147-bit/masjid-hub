import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Collection of Hadiths
const hadiths = [
  {
    contentAr: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ",
    contentEn: "Actions are judged by intentions",
    contentSn: "Mabasa anotongwa nechinangwa",
    contentNd: "Imisebenzi iyahlazwa ngumqondo",
    source: "Bukhari & Muslim"
  },
  {
    contentAr: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ",
    contentEn: "A Muslim is one from whose tongue and hand other Muslims are safe",
    contentSn: "Musilimu ndiye anviri vamwe vasati vadyiwa nenzara yake kana kuwanikwa nemaoko ake",
    contentNd: "UmSumulumanzi ngumuntu abanye aboSumulumanzi bakhuseleko eklwini nasezandleni zakhe",
    source: "Bukhari & Muslim"
  },
  {
    contentAr: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
    contentEn: "Whoever believes in Allah and the Last Day, let him speak good or remain silent",
    contentSn: "Ukatenda kuAllah nemusi wokupedzisira, taura zvakanaka kana nyarara",
    contentNd: "Olowolise kuAllah nangesikhathi sokugcina, makakhulume okuhle kanye alethe",
    source: "Bukhari & Muslim"
  },
  {
    contentAr: "لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
    contentEn: "None of you truly believes until he loves for his brother what he loves for himself",
    contentSn: "Hapana munhu anotenda zvachose kusvika ada kumunhu imwe chaauda kwaari pachake",
    contentNd: "Akukho munye oza kukholwa kuze afune umfowabo lokhu afithele yena",
    source: "Bukhari & Muslim"
  },
  {
    contentAr: "الطُّهُورُ شَطْرُ الإِيمَانِ",
    contentEn: "Cleanliness is half of faith",
    contentSn: "Kuchena kwakafanira nekwetendero kwese",
    contentNd: "Ukuhlanzeka ingxenye yokukholwa",
    source: "Muslim"
  },
  {
    contentAr: "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ",
    contentEn: "Whoever takes a path seeking knowledge, Allah makes easy for him a path to Paradise",
    contentSn: "Ufanofamba nzira ari kutsvaga ruzivo, Allah vachamutsungirira nzira yokusvika kudenga",
    contentNd: "Olowohamba indlela afithe isazisi, uAllah uzakumsiza indlela eya eParadesi",
    source: "Muslim"
  },
  {
    contentAr: "الدُّعَاءُ هُوَ الْعِبَادَةُ",
    contentEn: "Supplication (Dua) is worship",
    contentSn: "Kukumbira (Dua) ndiko kunamata",
    contentNd: "Isicelo (Dua) yinkolo",
    source: "Tirmidhi"
  },
  {
    contentAr: "تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ صَدَقَةٌ",
    contentEn: "Your smile for your brother is charity",
    contentSn: "Kuseka kwako kumunhu imwe kwakafanana nerpazvipo",
    contentNd: "Ukuhlekela umfowako yimali yomusa",
    source: "Tirmidhi"
  },
  {
    contentAr: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
    contentEn: "The best among you are those who learn the Quran and teach it",
    contentSn: "Munhuakanaka pakati penyu ndiye anodzidza Quran oti dzidzise vamwe",
    contentNd: "Olungileyo phakathi kwenu nguye ofunda iQur'an aze ayafundisa",
    source: "Bukhari"
  },
  {
    contentAr: "إِذَا قَامَتِ السَّاعَةُ وَبِيَدِ أَحَدِكُمْ فَسِيلَةٌ فَإِنِ اسْتَطَاعَ أَنْ لاَ يَقُومَ حَتَّى يَغْرِسَهَا فَلْيَفْعَلْ",
    contentEn: "If the Hour begins and one of you has a palm shoot in his hand, let him plant it if he can",
    contentSn: "Kana nguva yokupedzisira yava kuuya uine muchero mumawoko ako, ita mazano amaisa munda",
    contentNd: "Uma isikhathi sokugcina sifike unensimu esandleni sakho, mayenze ukuyisindisa",
    source: "Ahmad"
  }
]

// Collection of Quran Verses
const quranVerses = [
  {
    contentAr: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
    contentEn: "Indeed, Allah is with those who are patient",
    contentSn: "Zvirokwazvo, Allah vari navari vane tsitsi",
    contentNd: "Ngempela uAllah ukanye nabanothenba",
    source: "Quran 2:153"
  },
  {
    contentAr: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ",
    contentEn: "And whoever fears Allah - He will make for him a way out and provide for him from where he does not expect",
    contentSn: "Ukatya Allah - vachakutungamira kuwanira nzira yokubuda vakupa kubva panzvimbo isina kufungirwa",
    contentNd: "Olowesaba uAllah - uzakumenzela indlela yokuphuma amnike lokhu akalindelanga",
    source: "Quran 65:2-3"
  },
  {
    contentAr: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
    contentEn: "For indeed, with hardship comes ease",
    contentSn: "Zvirokwazvo, netsaona kune nyasha",
    contentNd: "Ngempela, nobunzima kuza usizo",
    source: "Quran 94:5"
  },
  {
    contentAr: "وَاصْبِرْ وَمَا صَبْرُكَ إِلَّا بِاللَّهِ",
    contentEn: "And be patient, and your patience is not but through Allah",
    contentSn: "Ugare netsitsi, uye tsitsi dzako hadzina kana imwe chete kubva kuAllah",
    contentNd: "Ubekezele, okubekezelela kwakho akunalutho ngaphandle koAllah",
    source: "Quran 16:127"
  },
  {
    contentAr: "ادْعُونِي أَسْتَجِبْ لَكُمْ",
    contentEn: "Call upon Me; I will respond to you",
    contentSn: "Kundidana; ndichapindura",
    contentNd: "Mangibize; ngizakuphendula",
    source: "Quran 40:60"
  },
  {
    contentAr: "إِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ",
    contentEn: "Indeed, Allah does not waste the reward of those who do good",
    contentSn: "Zvirokwazvo, Allah havapamhidziri mubayiro wevakanaka",
    contentNd: "Ngempela uAllah akalahli umvuzo wabenzi bokuhle",
    source: "Quran 11:115"
  },
  {
    contentAr: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
    contentEn: "And whoever relies upon Allah - then He is sufficient for him",
    contentSn: "Ukatenda kuAllah - ndivo vakakwana",
    contentNd: "Olowathemba kuAllah - nguye oyanele",
    source: "Quran 65:3"
  },
  {
    contentAr: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
    contentEn: "Allah does not burden a soul beyond that it can bear",
    contentSn: "Allah havape mutoro mumusoro wemunhu kunze kwehavanaasimba",
    contentNd: "UAllah akaniki umuntu umthwalo ongaphezu kwamandla akhe",
    source: "Quran 2:286"
  },
  {
    contentAr: "وَقُل رَّبِّ زِدْنِي عِلْمًا",
    contentEn: "And say: My Lord, increase me in knowledge",
    contentSn: "Uti: Ishe, ndipedzai ruzivo",
    contentNd: "Uthi: Nkosi, undinge isazisi",
    source: "Quran 20:114"
  },
  {
    contentAr: "إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ",
    contentEn: "Indeed we belong to Allah, and indeed to Him we will return",
    contentSn: "Zvirokwazvo tiri vaAllah, uye zvirokwazvo kwavari tichadzoka",
    contentNd: "Ngempela sika uAllah, futhi ngempela kuYe sizobuya",
    source: "Quran 2:156"
  }
]

// GET - Get daily content
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'all'
    
    // Get today's date (Bulawayo timezone - CAT UTC+2)
    const now = new Date()
    const bulawayoTime = new Date(now.getTime() + (2 * 60 * 60 * 1000)) // Add 2 hours for CAT
    const today = new Date(bulawayoTime.toISOString().split('T')[0])
    
    // Check if we have content for today
    let hadithContent = await db.dailyContent.findFirst({
      where: { type: 'hadith', date: today }
    })
    
    let verseContent = await db.dailyContent.findFirst({
      where: { type: 'quran_verse', date: today }
    })
    
    // If no content for today, create new from collection
    if (!hadithContent) {
      const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
      const hadithIndex = dayOfYear % hadiths.length
      
      hadithContent = await db.dailyContent.create({
        data: {
          type: 'hadith',
          ...hadiths[hadithIndex],
          date: today
        }
      })
    }
    
    if (!verseContent) {
      const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
      const verseIndex = (dayOfYear + 5) % quranVerses.length // Offset to get different content
      
      verseContent = await db.dailyContent.create({
        data: {
          type: 'quran_verse',
          ...quranVerses[verseIndex],
          date: today
        }
      })
    }
    
    if (type === 'hadith') {
      return NextResponse.json({ success: true, content: hadithContent })
    } else if (type === 'quran_verse') {
      return NextResponse.json({ success: true, content: verseContent })
    }
    
    return NextResponse.json({ 
      success: true, 
      hadith: hadithContent, 
      quranVerse: verseContent 
    })
  } catch (error) {
    console.error('Error fetching daily content:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch daily content' }, { status: 500 })
  }
}
