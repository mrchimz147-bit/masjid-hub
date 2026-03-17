import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// All 114 Surahs data
const SURAH_DATA = [
  { number: 1, name: "Al-Fatihah", arabicName: "الفاتحة", totalAyahs: 7, juz: 1 },
  { number: 2, name: "Al-Baqarah", arabicName: "البقرة", totalAyahs: 286, juz: [1, 2, 3] },
  { number: 3, name: "Ali 'Imran", arabicName: "آل عمران", totalAyahs: 200, juz: [3, 4] },
  { number: 4, name: "An-Nisa", arabicName: "النساء", totalAyahs: 176, juz: [4, 5, 6] },
  { number: 5, name: "Al-Ma'idah", arabicName: "المائدة", totalAyahs: 120, juz: [6, 7] },
  { number: 6, name: "Al-An'am", arabicName: "الأنعام", totalAyahs: 165, juz: [7, 8] },
  { number: 7, name: "Al-A'raf", arabicName: "الأعراف", totalAyahs: 206, juz: [8, 9] },
  { number: 8, name: "Al-Anfal", arabicName: "الأنفال", totalAyahs: 75, juz: [9, 10] },
  { number: 9, name: "At-Tawbah", arabicName: "التوبة", totalAyahs: 129, juz: [10, 11] },
  { number: 10, name: "Yunus", arabicName: "يونس", totalAyahs: 109, juz: [11] },
  { number: 11, name: "Hud", arabicName: "هود", totalAyahs: 123, juz: [11, 12] },
  { number: 12, name: "Yusuf", arabicName: "يوسف", totalAyahs: 111, juz: [12, 13] },
  { number: 13, name: "Ar-Ra'd", arabicName: "الرعد", totalAyahs: 43, juz: [13] },
  { number: 14, name: "Ibrahim", arabicName: "إبراهيم", totalAyahs: 52, juz: [13] },
  { number: 15, name: "Al-Hijr", arabicName: "الحجر", totalAyahs: 99, juz: [14] },
  { number: 16, name: "An-Nahl", arabicName: "النحل", totalAyahs: 128, juz: [14] },
  { number: 17, name: "Al-Isra", arabicName: "الإسراء", totalAyahs: 111, juz: [15] },
  { number: 18, name: "Al-Kahf", arabicName: "الكهف", totalAyahs: 110, juz: [15, 16] },
  { number: 19, name: "Maryam", arabicName: "مريم", totalAyahs: 98, juz: [16] },
  { number: 20, name: "Taha", arabicName: "طه", totalAyahs: 135, juz: [16] },
  { number: 21, name: "Al-Anbiya", arabicName: "الأنبياء", totalAyahs: 112, juz: [17] },
  { number: 22, name: "Al-Hajj", arabicName: "الحج", totalAyahs: 78, juz: [17] },
  { number: 23, name: "Al-Mu'minun", arabicName: "المؤمنون", totalAyahs: 118, juz: [18] },
  { number: 24, name: "An-Nur", arabicName: "النور", totalAyahs: 64, juz: [18] },
  { number: 25, name: "Al-Furqan", arabicName: "الفرقان", totalAyahs: 77, juz: [18, 19] },
  { number: 26, name: "Ash-Shu'ara", arabicName: "الشعراء", totalAyahs: 227, juz: [19] },
  { number: 27, name: "An-Naml", arabicName: "النمل", totalAyahs: 93, juz: [19, 20] },
  { number: 28, name: "Al-Qasas", arabicName: "القصص", totalAyahs: 88, juz: [20] },
  { number: 29, name: "Al-'Ankabut", arabicName: "العنكبوت", totalAyahs: 69, juz: [20, 21] },
  { number: 30, name: "Ar-Rum", arabicName: "الروم", totalAyahs: 60, juz: [21] },
  { number: 31, name: "Luqman", arabicName: "لقمان", totalAyahs: 34, juz: [21] },
  { number: 32, name: "As-Sajdah", arabicName: "السجدة", totalAyahs: 30, juz: [21] },
  { number: 33, name: "Al-Ahzab", arabicName: "الأحزاب", totalAyahs: 73, juz: [21, 22] },
  { number: 34, name: "Saba", arabicName: "سبأ", totalAyahs: 54, juz: [22] },
  { number: 35, name: "Fatir", arabicName: "فاطر", totalAyahs: 45, juz: [22] },
  { number: 36, name: "Ya-Sin", arabicName: "يس", totalAyahs: 83, juz: [22, 23] },
  { number: 37, name: "As-Saffat", arabicName: "الصافات", totalAyahs: 182, juz: [23] },
  { number: 38, name: "Sad", arabicName: "ص", totalAyahs: 88, juz: [23] },
  { number: 39, name: "Az-Zumar", arabicName: "الزمر", totalAyahs: 75, juz: [23, 24] },
  { number: 40, name: "Ghafir", arabicName: "غافر", totalAyahs: 85, juz: [24] },
  { number: 41, name: "Fussilat", arabicName: "فصلت", totalAyahs: 54, juz: [24, 25] },
  { number: 42, name: "Ash-Shura", arabicName: "الشورى", totalAyahs: 53, juz: [25] },
  { number: 43, name: "Az-Zukhruf", arabicName: "الزخرف", totalAyahs: 89, juz: [25] },
  { number: 44, name: "Ad-Dukhan", arabicName: "الدخان", totalAyahs: 59, juz: [25] },
  { number: 45, name: "Al-Jathiyah", arabicName: "الجاثية", totalAyahs: 37, juz: [25] },
  { number: 46, name: "Al-Ahqaf", arabicName: "الأحقاف", totalAyahs: 35, juz: [26] },
  { number: 47, name: "Muhammad", arabicName: "محمد", totalAyahs: 38, juz: [26] },
  { number: 48, name: "Al-Fath", arabicName: "الفتح", totalAyahs: 29, juz: [26] },
  { number: 49, name: "Al-Hujurat", arabicName: "الحجرات", totalAyahs: 18, juz: [26] },
  { number: 50, name: "Qaf", arabicName: "ق", totalAyahs: 45, juz: [26] },
  { number: 51, name: "Adh-Dhariyat", arabicName: "الذاريات", totalAyahs: 60, juz: [26, 27] },
  { number: 52, name: "At-Tur", arabicName: "الطور", totalAyahs: 49, juz: [27] },
  { number: 53, name: "An-Najm", arabicName: "النجم", totalAyahs: 62, juz: [27] },
  { number: 54, name: "Al-Qamar", arabicName: "القمر", totalAyahs: 55, juz: [27] },
  { number: 55, name: "Ar-Rahman", arabicName: "الرحمن", totalAyahs: 78, juz: [27] },
  { number: 56, name: "Al-Waqi'ah", arabicName: "الواقعة", totalAyahs: 96, juz: [27] },
  { number: 57, name: "Al-Hadid", arabicName: "الحديد", totalAyahs: 29, juz: [27] },
  { number: 58, name: "Al-Mujadila", arabicName: "المجادلة", totalAyahs: 22, juz: [28] },
  { number: 59, name: "Al-Hashr", arabicName: "الحشر", totalAyahs: 24, juz: [28] },
  { number: 60, name: "Al-Mumtahanah", arabicName: "الممتحنة", totalAyahs: 13, juz: [28] },
  { number: 61, name: "As-Saf", arabicName: "الصف", totalAyahs: 14, juz: [28] },
  { number: 62, name: "Al-Jumu'ah", arabicName: "الجمعة", totalAyahs: 11, juz: [28] },
  { number: 63, name: "Al-Munafiqun", arabicName: "المنافقون", totalAyahs: 11, juz: [28] },
  { number: 64, name: "At-Taghabun", arabicName: "التغابن", totalAyahs: 18, juz: [28] },
  { number: 65, name: "At-Talaq", arabicName: "الطلاق", totalAyahs: 12, juz: [28] },
  { number: 66, name: "At-Tahrim", arabicName: "التحريم", totalAyahs: 12, juz: [28] },
  { number: 67, name: "Al-Mulk", arabicName: "الملك", totalAyahs: 30, juz: [29] },
  { number: 68, name: "Al-Qalam", arabicName: "القلم", totalAyahs: 52, juz: [29] },
  { number: 69, name: "Al-Haqqah", arabicName: "الحاقة", totalAyahs: 52, juz: [29] },
  { number: 70, name: "Al-Ma'arij", arabicName: "المعارج", totalAyahs: 44, juz: [29] },
  { number: 71, name: "Nuh", arabicName: "نوح", totalAyahs: 28, juz: [29] },
  { number: 72, name: "Al-Jinn", arabicName: "الجن", totalAyahs: 28, juz: [29] },
  { number: 73, name: "Al-Muzzammil", arabicName: "المزمل", totalAyahs: 20, juz: [29] },
  { number: 74, name: "Al-Muddaththir", arabicName: "المدثر", totalAyahs: 56, juz: [29] },
  { number: 75, name: "Al-Qiyamah", arabicName: "القيامة", totalAyahs: 40, juz: [29] },
  { number: 76, name: "Al-Insan", arabicName: "الإنسان", totalAyahs: 31, juz: [29] },
  { number: 77, name: "Al-Mursalat", arabicName: "المرسلات", totalAyahs: 50, juz: [29] },
  { number: 78, name: "An-Naba", arabicName: "النبأ", totalAyahs: 40, juz: [30] },
  { number: 79, name: "An-Nazi'at", arabicName: "النازعات", totalAyahs: 46, juz: [30] },
  { number: 80, name: "'Abasa", arabicName: "عبس", totalAyahs: 42, juz: [30] },
  { number: 81, name: "At-Takwir", arabicName: "التكوير", totalAyahs: 29, juz: [30] },
  { number: 82, name: "Al-Infitar", arabicName: "الانفطار", totalAyahs: 19, juz: [30] },
  { number: 83, name: "Al-Mutaffifin", arabicName: "المطففين", totalAyahs: 36, juz: [30] },
  { number: 84, name: "Al-Inshiqaq", arabicName: "الانشقاق", totalAyahs: 25, juz: [30] },
  { number: 85, name: "Al-Buruj", arabicName: "البروج", totalAyahs: 22, juz: [30] },
  { number: 86, name: "At-Tariq", arabicName: "الطارق", totalAyahs: 17, juz: [30] },
  { number: 87, name: "Al-A'la", arabicName: "الأعلى", totalAyahs: 19, juz: [30] },
  { number: 88, name: "Al-Ghashiyah", arabicName: "الغاشية", totalAyahs: 26, juz: [30] },
  { number: 89, name: "Al-Fajr", arabicName: "الفجر", totalAyahs: 30, juz: [30] },
  { number: 90, name: "Al-Balad", arabicName: "البلد", totalAyahs: 20, juz: [30] },
  { number: 91, name: "Ash-Shams", arabicName: "الشمس", totalAyahs: 15, juz: [30] },
  { number: 92, name: "Al-Layl", arabicName: "الليل", totalAyahs: 21, juz: [30] },
  { number: 93, name: "Ad-Duha", arabicName: "الضحى", totalAyahs: 11, juz: [30] },
  { number: 94, name: "Ash-Sharh", arabicName: "الشرح", totalAyahs: 8, juz: [30] },
  { number: 95, name: "At-Tin", arabicName: "التين", totalAyahs: 8, juz: [30] },
  { number: 96, name: "Al-'Alaq", arabicName: "العلق", totalAyahs: 19, juz: [30] },
  { number: 97, name: "Al-Qadr", arabicName: "القدر", totalAyahs: 5, juz: [30] },
  { number: 98, name: "Al-Bayyinah", arabicName: "البينة", totalAyahs: 8, juz: [30] },
  { number: 99, name: "Az-Zalzalah", arabicName: "الزلزلة", totalAyahs: 8, juz: [30] },
  { number: 100, name: "Al-'Adiyat", arabicName: "العاديات", totalAyahs: 11, juz: [30] },
  { number: 101, name: "Al-Qari'ah", arabicName: "القارعة", totalAyahs: 11, juz: [30] },
  { number: 102, name: "At-Takathur", arabicName: "التكاثر", totalAyahs: 8, juz: [30] },
  { number: 103, name: "Al-'Asr", arabicName: "العصر", totalAyahs: 3, juz: [30] },
  { number: 104, name: "Al-Humazah", arabicName: "الهمزة", totalAyahs: 9, juz: [30] },
  { number: 105, name: "Al-Fil", arabicName: "الفيل", totalAyahs: 5, juz: [30] },
  { number: 106, name: "Quraysh", arabicName: "قريش", totalAyahs: 4, juz: [30] },
  { number: 107, name: "Al-Ma'un", arabicName: "الماعون", totalAyahs: 7, juz: [30] },
  { number: 108, name: "Al-Kawthar", arabicName: "الكوثر", totalAyahs: 3, juz: [30] },
  { number: 109, name: "Al-Kafirun", arabicName: "الكافرون", totalAyahs: 6, juz: [30] },
  { number: 110, name: "An-Nasr", arabicName: "النصر", totalAyahs: 3, juz: [30] },
  { number: 111, name: "Al-Masad", arabicName: "المسد", totalAyahs: 5, juz: [30] },
  { number: 112, name: "Al-Ikhlas", arabicName: "الإخلاص", totalAyahs: 4, juz: [30] },
  { number: 113, name: "Al-Falaq", arabicName: "الفلق", totalAyahs: 5, juz: [30] },
  { number: 114, name: "An-Nas", arabicName: "الناس", totalAyahs: 6, juz: [30] },
]

// GET surah list or user progress
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const surahNumber = searchParams.get('surah')

    // Return specific surah info
    if (surahNumber) {
      const surah = SURAH_DATA.find(s => s.number === parseInt(surahNumber))
      if (!surah) {
        return NextResponse.json({ error: 'Surah not found' }, { status: 404 })
      }
      
      // Get user progress if userId provided
      let progress = null
      if (userId) {
        progress = await db.hifzProgress.findUnique({
          where: { userId_surahNumber: { userId, surahNumber: parseInt(surahNumber) } }
        })
      }
      
      return NextResponse.json({ surah, progress })
    }

    // Return all surahs with user progress
    let userProgress: Array<{ surahNumber: number; status: string; memorizedAyahs: number }> = []
    if (userId) {
      userProgress = await db.hifzProgress.findMany({
        where: { userId },
        select: { surahNumber: true, status: true, memorizedAyahs: true }
      })
    }

    const surahsWithProgress = SURAH_DATA.map(surah => {
      const progress = userProgress.find(p => p.surahNumber === surah.number)
      return {
        ...surah,
        status: progress?.status || 'not_started',
        memorizedAyahs: progress?.memorizedAyahs || 0,
        progress: progress ? Math.round((progress.memorizedAyahs / surah.totalAyahs) * 100) : 0
      }
    })

    return NextResponse.json(surahsWithProgress)
  } catch (error) {
    console.error('Error fetching hifz data:', error)
    return NextResponse.json({ error: 'Failed to fetch hifz data' }, { status: 500 })
  }
}

// POST - Update hifz progress
export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { userId, surahNumber, status, memorizedAyahs, notes } = data

    const surah = SURAH_DATA.find(s => s.number === surahNumber)
    if (!surah) {
      return NextResponse.json({ error: 'Invalid surah number' }, { status: 400 })
    }

    const progress = await db.hifzProgress.upsert({
      where: { userId_surahNumber: { userId, surahNumber } },
      update: {
        status,
        memorizedAyahs: memorizedAyahs || 0,
        notes,
        lastRevisedAt: new Date(),
        updatedAt: new Date(),
        ...(status === 'memorized' && { memorizedDate: new Date() })
      },
      create: {
        userId,
        surahNumber,
        surahName: surah.name,
        totalAyahs: surah.totalAyahs,
        juzNumber: Array.isArray(surah.juz) ? surah.juz[0] : surah.juz,
        status,
        memorizedAyahs: memorizedAyahs || 0,
        notes
      }
    })

    return NextResponse.json({ success: true, progress })
  } catch (error) {
    console.error('Error updating hifz progress:', error)
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 })
  }
}

// Get statistics
export async function PUT(request: Request) {
  try {
    const { userId } = await request.json()
    
    const progress = await db.hifzProgress.findMany({ where: { userId } })
    
    const stats = {
      totalMemorized: progress.filter(p => p.status === 'memorized').length,
      inProgress: progress.filter(p => p.status === 'memorizing').length,
      needsRevision: progress.filter(p => p.status === 'needs_revision').length,
      totalAyahsMemorized: progress.reduce((sum, p) => sum + p.memorizedAyahs, 0),
      juzCompleted: new Set(progress.filter(p => p.status === 'memorized').map(p => p.juzNumber)).size,
      recentActivity: progress
        .filter(p => p.lastRevisedAt)
        .sort((a, b) => (b.lastRevisedAt?.getTime() || 0) - (a.lastRevisedAt?.getTime() || 0))
        .slice(0, 5)
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching hifz stats:', error)
    return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 })
  }
}
