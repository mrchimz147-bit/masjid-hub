import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// All 114 Surahs with their details
const surahs = [
  { number: 1, name: "Al-Fatihah", arabicName: "الفاتحة", englishName: "The Opening", ayahs: 7, juz: 1, revelation: "Meccan", meaning: "The Opening Chapter of the Quran" },
  { number: 2, name: "Al-Baqarah", arabicName: "البقرة", englishName: "The Cow", ayahs: 286, juz: 1, revelation: "Medinan", meaning: "The longest surah, contains Ayat al-Kursi" },
  { number: 3, name: "Aal-E-Imran", arabicName: "آل عمران", englishName: "The Family of Imran", ayahs: 200, juz: 3, revelation: "Medinan", meaning: "The family of Imran (father of Maryam)" },
  { number: 4, name: "An-Nisa", arabicName: "النساء", englishName: "The Women", ayahs: 176, juz: 4, revelation: "Medinan", meaning: "Laws regarding women and family" },
  { number: 5, name: "Al-Ma'idah", arabicName: "المائدة", englishName: "The Table Spread", ayahs: 120, juz: 6, revelation: "Medinan", meaning: "The table of food from heaven" },
  { number: 6, name: "Al-An'am", arabicName: "الأنعام", englishName: "The Cattle", ayahs: 165, juz: 7, revelation: "Meccan", meaning: "The cattle, livestock" },
  { number: 7, name: "Al-A'raf", arabicName: "الأعراف", englishName: "The Heights", ayahs: 206, juz: 8, revelation: "Meccan", meaning: "The elevated places" },
  { number: 8, name: "Al-Anfal", arabicName: "الأنفال", englishName: "The Spoils of War", ayahs: 75, juz: 9, revelation: "Medinan", meaning: "The war booty" },
  { number: 9, name: "At-Tawbah", arabicName: "التوبة", englishName: "The Repentance", ayahs: 129, juz: 10, revelation: "Medinan", meaning: "No Bismillah, deals with repentance" },
  { number: 10, name: "Yunus", arabicName: "يونس", englishName: "Jonah", ayahs: 109, juz: 11, revelation: "Meccan", meaning: "Prophet Yunus (Jonah)" },
  { number: 11, name: "Hud", arabicName: "هود", englishName: "Hud", ayahs: 123, juz: 11, revelation: "Meccan", meaning: "Prophet Hud" },
  { number: 12, name: "Yusuf", arabicName: "يوسف", englishName: "Joseph", ayahs: 111, juz: 12, revelation: "Meccan", meaning: "Prophet Yusuf's story" },
  { number: 13, name: "Ar-Ra'd", arabicName: "الرعد", englishName: "The Thunder", ayahs: 43, juz: 13, revelation: "Medinan", meaning: "Thunder" },
  { number: 14, name: "Ibrahim", arabicName: "إبراهيم", englishName: "Abraham", ayahs: 52, juz: 13, revelation: "Meccan", meaning: "Prophet Ibrahim" },
  { number: 15, name: "Al-Hijr", arabicName: "الحجر", englishName: "The Rocky Tract", ayahs: 99, juz: 14, revelation: "Meccan", meaning: "The valley of Hijr" },
  { number: 16, name: "An-Nahl", arabicName: "النحل", englishName: "The Bee", ayahs: 128, juz: 14, revelation: "Meccan", meaning: "The bee" },
  { number: 17, name: "Al-Isra", arabicName: "الإسراء", englishName: "The Night Journey", ayahs: 111, juz: 15, revelation: "Meccan", meaning: "Isra and Mi'raj" },
  { number: 18, name: "Al-Kahf", arabicName: "الكهف", englishName: "The Cave", ayahs: 110, juz: 15, revelation: "Meccan", meaning: "The People of the Cave" },
  { number: 19, name: "Maryam", arabicName: "مريم", englishName: "Mary", ayahs: 98, juz: 16, revelation: "Meccan", meaning: "Maryam (Mary), mother of Isa" },
  { number: 20, name: "Ta-Ha", arabicName: "طه", englishName: "Ta-Ha", ayahs: 135, juz: 16, revelation: "Meccan", meaning: "Mystical letters" },
  { number: 21, name: "Al-Anbiya", arabicName: "الأنبياء", englishName: "The Prophets", ayahs: 112, juz: 17, revelation: "Meccan", meaning: "Stories of prophets" },
  { number: 22, name: "Al-Hajj", arabicName: "الحج", englishName: "The Pilgrimage", ayahs: 78, juz: 17, revelation: "Medinan", meaning: "Hajj pilgrimage" },
  { number: 23, name: "Al-Mu'minun", arabicName: "المؤمنون", englishName: "The Believers", ayahs: 118, juz: 18, revelation: "Meccan", meaning: "Characteristics of believers" },
  { number: 24, name: "An-Nur", arabicName: "النور", englishName: "The Light", ayahs: 64, juz: 18, revelation: "Medinan", meaning: "Light, contains verse of light" },
  { number: 25, name: "Al-Furqan", arabicName: "الفرقان", englishName: "The Criterion", ayahs: 77, juz: 18, revelation: "Meccan", meaning: "The distinguisher between truth and falsehood" },
  { number: 26, name: "Ash-Shu'ara", arabicName: "الشعراء", englishName: "The Poets", ayahs: 227, juz: 19, revelation: "Meccan", meaning: "Stories of prophets" },
  { number: 27, name: "An-Naml", arabicName: "النمل", englishName: "The Ant", ayahs: 93, juz: 19, revelation: "Meccan", meaning: "Prophet Sulaiman and the ant" },
  { number: 28, name: "Al-Qasas", arabicName: "القصص", englishName: "The Stories", ayahs: 88, juz: 20, revelation: "Meccan", meaning: "Story of Musa" },
  { number: 29, name: "Al-Ankabut", arabicName: "العنكبوت", englishName: "The Spider", ayahs: 69, juz: 20, revelation: "Meccan", meaning: "Parable of spider's web" },
  { number: 30, name: "Ar-Rum", arabicName: "الروم", englishName: "The Romans", ayahs: 60, juz: 21, revelation: "Meccan", meaning: "Romans" },
  { number: 31, name: "Luqman", arabicName: "لقمان", englishName: "Luqman", ayahs: 34, juz: 21, revelation: "Meccan", meaning: "Wisdom of Luqman" },
  { number: 32, name: "As-Sajdah", arabicName: "السجدة", englishName: "The Prostration", ayahs: 30, juz: 21, revelation: "Meccan", meaning: "Prostration" },
  { number: 33, name: "Al-Ahzab", arabicName: "الأحزاب", englishName: "The Combined Forces", ayahs: 73, juz: 21, revelation: "Medinan", meaning: "Battle of the Trench" },
  { number: 34, name: "Saba", arabicName: "سبأ", englishName: "Sheba", ayahs: 54, juz: 22, revelation: "Meccan", meaning: "Queen of Sheba" },
  { number: 35, name: "Fatir", arabicName: "فاطر", englishName: "Originator", ayahs: 45, juz: 22, revelation: "Meccan", meaning: "The Creator" },
  { number: 36, name: "Ya-Sin", arabicName: "يس", englishName: "Ya Sin", ayahs: 83, juz: 22, revelation: "Meccan", meaning: "Heart of the Quran" },
  { number: 37, name: "As-Saffat", arabicName: "الصافات", englishName: "Those Who Set The Ranks", ayahs: 182, juz: 23, revelation: "Meccan", meaning: "The Rangers" },
  { number: 38, name: "Sad", arabicName: "ص", englishName: "The Letter Sad", ayahs: 88, juz: 23, revelation: "Meccan", meaning: "Mystical letter Sad" },
  { number: 39, name: "Az-Zumar", arabicName: "الزمر", englishName: "The Troops", ayahs: 75, juz: 23, revelation: "Meccan", meaning: "The Groups" },
  { number: 40, name: "Ghafir", arabicName: "غافر", englishName: "The Forgiver", ayahs: 85, juz: 24, revelation: "Meccan", meaning: "The Believer" },
  { number: 41, name: "Fussilat", arabicName: "فصلت", englishName: "Explained in Detail", ayahs: 54, juz: 24, revelation: "Meccan", meaning: "Detailed exposition" },
  { number: 42, name: "Ash-Shura", arabicName: "الشورى", englishName: "The Consultation", ayahs: 53, juz: 25, revelation: "Meccan", meaning: "Consultation" },
  { number: 43, name: "Az-Zukhruf", arabicName: "الزخرف", englishName: "The Ornaments of Gold", ayahs: 89, juz: 25, revelation: "Meccan", meaning: "Gold adornments" },
  { number: 44, name: "Ad-Dukhan", arabicName: "الدخان", englishName: "The Smoke", ayahs: 59, juz: 25, revelation: "Meccan", meaning: "The smoke" },
  { number: 45, name: "Al-Jathiyah", arabicName: "الجاثية", englishName: "The Crouching", ayahs: 37, juz: 25, revelation: "Meccan", meaning: "The Kneeling" },
  { number: 46, name: "Al-Ahqaf", arabicName: "الأحقاف", englishName: "The Wind-Curved Sandhills", ayahs: 35, juz: 26, revelation: "Meccan", meaning: "The winding sand tracts" },
  { number: 47, name: "Muhammad", arabicName: "محمد", englishName: "Muhammad", ayahs: 38, juz: 26, revelation: "Medinan", meaning: "The Prophet Muhammad" },
  { number: 48, name: "Al-Fath", arabicName: "الفتح", englishName: "The Victory", ayahs: 29, juz: 26, revelation: "Medinan", meaning: "Victory of Mecca" },
  { number: 49, name: "Al-Hujurat", arabicName: "الحجرات", englishName: "The Rooms", ayahs: 18, juz: 26, revelation: "Medinan", meaning: "Etiquette with the Prophet" },
  { number: 50, name: "Qaf", arabicName: "ق", englishName: "The Letter Qaf", ayahs: 45, juz: 26, revelation: "Meccan", meaning: "Mystical letter Qaf" },
  { number: 51, name: "Adh-Dhariyat", arabicName: "الذاريات", englishName: "The Winnowing Winds", ayahs: 60, juz: 26, revelation: "Meccan", meaning: "The Scatterers" },
  { number: 52, name: "At-Tur", arabicName: "الطور", englishName: "The Mount", ayahs: 49, juz: 27, revelation: "Meccan", meaning: "Mount Sinai" },
  { number: 53, name: "An-Najm", arabicName: "النجم", englishName: "The Star", ayahs: 62, juz: 27, revelation: "Meccan", meaning: "The Star" },
  { number: 54, name: "Al-Qamar", arabicName: "القمر", englishName: "The Moon", ayahs: 55, juz: 27, revelation: "Meccan", meaning: "The Moon" },
  { number: 55, name: "Ar-Rahman", arabicName: "الرحمن", englishName: "The Beneficent", ayahs: 78, juz: 27, revelation: "Medinan", meaning: "The Most Merciful" },
  { number: 56, name: "Al-Waqi'ah", arabicName: "الواقعة", englishName: "The Inevitable", ayahs: 96, juz: 27, revelation: "Meccan", meaning: "The Event" },
  { number: 57, name: "Al-Hadid", arabicName: "الحديد", englishName: "The Iron", ayahs: 29, juz: 27, revelation: "Medinan", meaning: "Iron" },
  { number: 58, name: "Al-Mujadila", arabicName: "المجادلة", englishName: "The Pleading Woman", ayahs: 22, juz: 28, revelation: "Medinan", meaning: "The woman who pleads" },
  { number: 59, name: "Al-Hashr", arabicName: "الحشر", englishName: "The Exile", ayahs: 24, juz: 28, revelation: "Medinan", meaning: "The Gathering" },
  { number: 60, name: "Al-Mumtahanah", arabicName: "الممتحنة", englishName: "She that is to be examined", ayahs: 13, juz: 28, revelation: "Medinan", meaning: "The Examined One" },
  { number: 61, name: "As-Saff", arabicName: "الصف", englishName: "The Ranks", ayahs: 14, juz: 28, revelation: "Medinan", meaning: "The Battle Array" },
  { number: 62, name: "Al-Jumu'ah", arabicName: "الجمعة", englishName: "The Congregation", ayahs: 11, juz: 28, revelation: "Medinan", meaning: "Friday Prayer" },
  { number: 63, name: "Al-Munafiqun", arabicName: "المنافقون", englishName: "The Hypocrites", ayahs: 11, juz: 28, revelation: "Medinan", meaning: "The Hypocrites" },
  { number: 64, name: "At-Taghabun", arabicName: "التغابن", englishName: "The Mutual Disillusion", ayahs: 18, juz: 28, revelation: "Medinan", meaning: "Mutual Loss and Gain" },
  { number: 65, name: "At-Talaq", arabicName: "الطلاق", englishName: "The Divorce", ayahs: 12, juz: 28, revelation: "Medinan", meaning: "Divorce laws" },
  { number: 66, name: "At-Tahrim", arabicName: "التحريم", englishName: "The Prohibition", ayahs: 12, juz: 28, revelation: "Medinan", meaning: "The Prohibited Things" },
  { number: 67, name: "Al-Mulk", arabicName: "الملك", englishName: "The Sovereignty", ayahs: 30, juz: 29, revelation: "Meccan", meaning: "The Kingdom" },
  { number: 68, name: "Al-Qalam", arabicName: "القلم", englishName: "The Pen", ayahs: 52, juz: 29, revelation: "Meccan", meaning: "The Pen" },
  { number: 69, name: "Al-Haqqah", arabicName: "الحاقة", englishName: "The Reality", ayahs: 52, juz: 29, revelation: "Meccan", meaning: "The Sure Reality" },
  { number: 70, name: "Al-Ma'arij", arabicName: "المعارج", englishName: "The Ascending Stairways", ayahs: 44, juz: 29, revelation: "Meccan", meaning: "The Ways of Ascent" },
  { number: 71, name: "Nuh", arabicName: "نوح", englishName: "Noah", ayahs: 28, juz: 29, revelation: "Meccan", meaning: "Prophet Nuh" },
  { number: 72, name: "Al-Jinn", arabicName: "الجن", englishName: "The Jinn", ayahs: 28, juz: 29, revelation: "Meccan", meaning: "The Jinn" },
  { number: 73, name: "Al-Muzzammil", arabicName: "المزمل", englishName: "The Enshrouded One", ayahs: 20, juz: 29, revelation: "Meccan", meaning: "The Enwrapped One" },
  { number: 74, name: "Al-Muddaththir", arabicName: "المدثر", englishName: "The Cloaked One", ayahs: 56, juz: 29, revelation: "Meccan", meaning: "The Cloaked One" },
  { number: 75, name: "Al-Qiyamah", arabicName: "القيامة", englishName: "The Resurrection", ayahs: 40, juz: 29, revelation: "Meccan", meaning: "The Rising of the Dead" },
  { number: 76, name: "Al-Insan", arabicName: "الإنسان", englishName: "The Human", ayahs: 31, juz: 29, revelation: "Medinan", meaning: "Man" },
  { number: 77, name: "Al-Mursalat", arabicName: "المرسلات", englishName: "The Emissaries", ayahs: 50, juz: 29, revelation: "Meccan", meaning: "The Winds Sent Forth" },
  { number: 78, name: "An-Naba", arabicName: "النبأ", englishName: "The Tidings", ayahs: 40, juz: 30, revelation: "Meccan", meaning: "The Great News" },
  { number: 79, name: "An-Nazi'at", arabicName: "النازعات", englishName: "Those who drag forth", ayahs: 46, juz: 30, revelation: "Meccan", meaning: "The Soul-Snatchers" },
  { number: 80, name: "Abasa", arabicName: "عبس", englishName: "He Frowned", ayahs: 42, juz: 30, revelation: "Meccan", meaning: "The Prophet frowned" },
  { number: 81, name: "At-Takwir", arabicName: "التكوير", englishName: "The Overthrowing", ayahs: 29, juz: 30, revelation: "Meccan", meaning: "The Shrouding" },
  { number: 82, name: "Al-Infitar", arabicName: "الانفطار", englishName: "The Cleaving", ayahs: 19, juz: 30, revelation: "Meccan", meaning: "The Cleaving Asunder" },
  { number: 83, name: "Al-Mutaffifin", arabicName: "المطففين", englishName: "The Defrauding", ayahs: 36, juz: 30, revelation: "Meccan", meaning: "The Dealers in Fraud" },
  { number: 84, name: "Al-Inshiqaq", arabicName: "الانشقاق", englishName: "The Sundering", ayahs: 25, juz: 30, revelation: "Meccan", meaning: "The Rending Asunder" },
  { number: 85, name: "Al-Buruj", arabicName: "البروج", englishName: "The Mansions of the Stars", ayahs: 22, juz: 30, revelation: "Meccan", meaning: "The Constellations" },
  { number: 86, name: "At-Tariq", arabicName: "الطارق", englishName: "The Nightcomer", ayahs: 17, juz: 30, revelation: "Meccan", meaning: "The Night Star" },
  { number: 87, name: "Al-A'la", arabicName: "الأعلى", englishName: "The Most High", ayahs: 19, juz: 30, revelation: "Meccan", meaning: "The Most High" },
  { number: 88, name: "Al-Ghashiyah", arabicName: "الغاشية", englishName: "The Overwhelming", ayahs: 26, juz: 30, revelation: "Meccan", meaning: "The Overwhelming Event" },
  { number: 89, name: "Al-Fajr", arabicName: "الفجر", englishName: "The Dawn", ayahs: 30, juz: 30, revelation: "Meccan", meaning: "The Dawn" },
  { number: 90, name: "Al-Balad", arabicName: "البلد", englishName: "The City", ayahs: 20, juz: 30, revelation: "Meccan", meaning: "The City" },
  { number: 91, name: "Ash-Shams", arabicName: "الشمس", englishName: "The Sun", ayahs: 15, juz: 30, revelation: "Meccan", meaning: "The Sun" },
  { number: 92, name: "Al-Layl", arabicName: "الليل", englishName: "The Night", ayahs: 21, juz: 30, revelation: "Meccan", meaning: "The Night" },
  { number: 93, name: "Ad-Duhaa", arabicName: "الضحى", englishName: "The Morning Hours", ayahs: 11, juz: 30, revelation: "Meccan", meaning: "The Morning Brightness" },
  { number: 94, name: "Ash-Sharh", arabicName: "الشرح", englishName: "The Relief", ayahs: 8, juz: 30, revelation: "Meccan", meaning: "The Expansion" },
  { number: 95, name: "At-Tin", arabicName: "التين", englishName: "The Fig", ayahs: 8, juz: 30, revelation: "Meccan", meaning: "The Fig" },
  { number: 96, name: "Al-Alaq", arabicName: "العلق", englishName: "The Clot", ayahs: 19, juz: 30, revelation: "Meccan", meaning: "First revelation" },
  { number: 97, name: "Al-Qadr", arabicName: "القدر", englishName: "The Power", ayahs: 5, juz: 30, revelation: "Meccan", meaning: "Night of Power (Laylatul Qadr)" },
  { number: 98, name: "Al-Bayyinah", arabicName: "البينة", englishName: "The Clear Proof", ayahs: 8, juz: 30, revelation: "Medinan", meaning: "The Clear Evidence" },
  { number: 99, name: "Az-Zalzalah", arabicName: "الزلزلة", englishName: "The Earthquake", ayahs: 8, juz: 30, revelation: "Medinan", meaning: "The Earthquake" },
  { number: 100, name: "Al-Adiyat", arabicName: "العاديات", englishName: "The Courser", ayahs: 11, juz: 30, revelation: "Meccan", meaning: "The Charging Steeds" },
  { number: 101, name: "Al-Qari'ah", arabicName: "القارعة", englishName: "The Calamity", ayahs: 11, juz: 30, revelation: "Meccan", meaning: "The Striking Hour" },
  { number: 102, name: "At-Takathur", arabicName: "التكاثر", englishName: "The Rivalry in world", ayahs: 8, juz: 30, revelation: "Meccan", meaning: "Competition in Worldly Increase" },
  { number: 103, name: "Al-Asr", arabicName: "العصر", englishName: "The Declining Day", ayahs: 3, juz: 30, revelation: "Meccan", meaning: "Time Through the Ages" },
  { number: 104, name: "Al-Humazah", arabicName: "الهمزة", englishName: "The Traducer", ayahs: 9, juz: 30, revelation: "Meccan", meaning: "The Slanderer" },
  { number: 105, name: "Al-Fil", arabicName: "الفيل", englishName: "The Elephant", ayahs: 5, juz: 30, revelation: "Meccan", meaning: "The Elephant" },
  { number: 106, name: "Quraysh", arabicName: "قريش", englishName: "Quraysh", ayahs: 4, juz: 30, revelation: "Meccan", meaning: "The Tribe of Quraysh" },
  { number: 107, name: "Al-Ma'un", arabicName: "الماعون", englishName: "The Small Kindnesses", ayahs: 7, juz: 30, revelation: "Meccan", meaning: "Almsgiving" },
  { number: 108, name: "Al-Kawthar", arabicName: "الكوثر", englishName: "The Abundance", ayahs: 3, juz: 30, revelation: "Meccan", meaning: "The River in Paradise" },
  { number: 109, name: "Al-Kafirun", arabicName: "الكافرون", englishName: "The Disbelievers", ayahs: 6, juz: 30, revelation: "Meccan", meaning: "The Disbelievers" },
  { number: 110, name: "An-Nasr", arabicName: "النصر", englishName: "The Divine Support", ayahs: 3, juz: 30, revelation: "Medinan", meaning: "The Help" },
  { number: 111, name: "Al-Masad", arabicName: "المسد", englishName: "The Palm Fiber", ayahs: 5, juz: 30, revelation: "Meccan", meaning: "Abu Lahab" },
  { number: 112, name: "Al-Ikhlas", arabicName: "الإخلاص", englishName: "The Sincerity", ayahs: 4, juz: 30, revelation: "Meccan", meaning: "Sincerity, Tawheed" },
  { number: 113, name: "Al-Falaq", arabicName: "الفلق", englishName: "The Daybreak", ayahs: 5, juz: 30, revelation: "Meccan", meaning: "The Dawn, protection" },
  { number: 114, name: "An-Nas", arabicName: "الناس", englishName: "Mankind", ayahs: 6, juz: 30, revelation: "Meccan", meaning: "Mankind, protection" },
]

// Tajweed Lessons
const tajweedLessons = [
  // Makharij (Pronunciation Points)
  { category: "makharij", title: "Introduction to Makharij", arabicTitle: "مخارج الحروف", description: "Makharij refers to the points of articulation of Arabic letters. There are 17 specific points in the mouth and throat from which the 29 Arabic letters originate.", arabicExamples: '["أ", "ب", "ت", "ث", "ج", "ح", "خ"]', order: 1 },
  { category: "makharij", title: "Al-Jawf (Oral Cavity)", arabicTitle: "الجوف", description: "The empty space in the mouth and throat. Letters: Alif, Waw, and Ya (as madd letters). These are the only letters that originate from the open oral cavity.", arabicExamples: '["ا (مد)", "و (مد)", "ي (مد)"]', order: 2 },
  { category: "makharij", title: "Al-Halq (Throat)", arabicTitle: "الحلق", description: "The throat has three sections: Aqsal-Halq (farthest), Wasat (middle), and Adna (nearest). Letters: Hamzah, Ha, Ayn, Hha, Ghayn, Khha.", arabicExamples: '["ء", "هـ", "ع", "ح", "غ", "خ"]', order: 3 },
  { category: "makharij", title: "Al-Lisan (Tongue)", arabicTitle: "اللسان", description: "The tongue has 10 makharij for 18 letters. It is divided into multiple positions including the tip, edges, and back.", arabicExamples: '["ق", "ك", "ج", "ش", "ي"]', order: 4 },
  { category: "makharij", title: "Ash-Shafatan (Lips)", arabicTitle: "الشفتان", description: "The lips have two makharij for four letters. Ba is articulated with both lips meeting. Fa is articulated with the inside of the lower lip touching the edges of the upper front teeth.", arabicExamples: '["ب", "ف", "م", "و"]', order: 5 },
  { category: "makharij", title: "Al-Khayshum (Nasal Cavity)", arabicTitle: "الخيشوم", description: "The nasal cavity is the point of articulation for Ghunnah (nasalization). This applies to Mim and Nun when they have shaddah or are in certain states.", arabicExamples: '["نّ", "مّ"]', order: 6 },
  
  // Sifaat (Letter Attributes)
  { category: "sifaat", title: "Introduction to Sifaat", arabicTitle: "صفات الحروف", description: "Sifaat are the characteristics or attributes of Arabic letters. They determine how a letter is pronounced and distinguish letters that share the same makhraj.", arabicExamples: '["قوي", "رخو", "مستعل", "منخفض"]', order: 1 },
  { category: "sifaat", title: "Jahr vs Hams", arabicTitle: "الجهر والهمس", description: "Jahr (Voiced): Strong airflow, vocal cords vibrate. Hams (Unvoiced): Weak airflow, vocal cords don't vibrate. Examples: Jahr - Ba, Jim, Dal. Hams - Fa, Kaf, Ta.", arabicExamples: '["ب جهر", "ف همس", "ج جهر", "ك همس"]', order: 2 },
  { category: "sifaat", title: "Shiddah vs Rakhawah", arabicTitle: "الشدة والرخاوة", description: "Shiddah (Strength): Letter stops airflow completely. Rakhawah (Softness): Air continues flowing. Letters of Shiddah: Q-T-B-J-D. Letters of Rakhawah: all others.", arabicExamples: '["ق شديدة", "خ رخوة"]', order: 3 },
  { category: "sifaat", title: "Isti'la vs Istifaal", arabicTitle: "الاستعلاء والاستفال", description: "Isti'la (Elevation): Tongue rises to roof of mouth. Letters: Qaf, Ghayn, Kha, Hha, Dad, Ta, Dhal, Sin. Istifaal (Lowering): Tongue stays flat.", arabicExamples: '["ط مستعلية", "د منخفضة"]', order: 4 },
  { category: "sifaat", title: "Itbaq vs Infitaah", arabicTitle: "الإطباق والانفتاح", description: "Itbaq (Curling): Tongue curls upward. Letters: Dad, Ta, Dhal, Sin. Infitaah (Opening): Tongue remains flat. Only these four letters have Itbaq.", arabicExamples: '["ص مطبقة", "ت منفتحة"]', order: 5 },
  
  // Rules of Nun Sakinah & Tanwin
  { category: "nun_sakinah", title: "Introduction to Nun Sakinah", arabicTitle: "أحكام النون الساكنة والتنوين", description: "Nun Sakinah is a Nun with no vowel. Tanwin is a double vowel at the end of nouns. Both have four rules: Idhar, Idgham, Iqlab, and Ikhfa.", arabicExamples: '["نْ", "ً", "ٍ", "ٌ"]', order: 1 },
  { category: "nun_sakinah", title: "Idhar (Clear Pronunciation)", arabicTitle: "الإظهار", description: "Pronounce Nun Sakinah or Tanwin clearly without ghunnah when followed by any of the 6 throat letters: Hamzah, Ha, Ayn, Hha, Ghayn, Khha.", arabicExamples: '["نَأْي", "مِنْ خَوْفٍ", "عَلِيمٌ حَكِيمٌ"]', order: 2 },
  { category: "nun_sakinah", title: "Idgham (Merging)", arabicTitle: "الإدغام", description: "Merge Nun Sakinah into the following letter. Two types: With Ghunnah (Yarmalun: Ya, Ra, Mim, Lam, Waw, Nun) and Without Ghunnah (Ra, Lam only in one word).", arabicExamples: '["مِن يَقُولُ", "مِن رَّبِّ", "فَمِن وَجْدٍ"]', order: 3 },
  { category: "nun_sakinah", title: "Iqlab (Conversion)", arabicTitle: "الإقلاب", description: "When Nun Sakinah or Tanwin is followed by Ba, convert it to a hidden Mim with ghunnah. Only one letter triggers this: Ba.", arabicExamples: '["مِن بَعْدِ", "أَنۢبِئْهُمْ", "سَمِيعٌ بَصِيرٌ"]', order: 4 },
  { category: "nun_sakinah", title: "Ikhfa (Hiding)", arabicTitle: "الإخفاء", description: "Pronounce Nun Sakinah or Tanwin somewhere between Idhar and Idgham with ghunnah. Triggered by 15 letters: Ta, Tha, Jim, Dal, Dhal, Zay, Sin, Shin, Sad, Dad, Ta, Zha, Fa, Qaf, Kaf.", arabicExamples: '["مِن جَاءَ", "كِتَابٌ تَرَاهُ", "أَنذَرْتُكُمْ"]', order: 5 },
  
  // Rules of Meem Sakinah
  { category: "meem_sakinah", title: "Introduction to Meem Sakinah", arabicTitle: "أحكام الميم الساكنة", description: "Meem Sakinah is a Mim with no vowel. It has three rules: Idgham Shafawi, Ikhfa Shafawi, and Idhar Shafawi.", arabicExamples: '["مْ"]', order: 1 },
  { category: "meem_sakinah", title: "Idgham Shafawi", arabicTitle: "الإدغام الشفوي", description: "When Meem Sakinah is followed by another Mim, merge them with ghunnah. The two Mims become one with shaddah and ghunnah.", arabicExamples: '["مِمَّا", "وَمَّا", "لَمَّا"]', order: 2 },
  { category: "meem_sakinah", title: "Ikhfa Shafawi", arabicTitle: "الإخفاء الشفوي", description: "When Meem Sakinah is followed by Ba, hide the Mim with ghunnah. Pronounce somewhere between clear and merged.", arabicExamples: '["تَرْمِيهِم بِحِجَارَةٍ", "رَبُّهُم بِأَمْرِهِ"]', order: 3 },
  { category: "meem_sakinah", title: "Idhar Shafawi", arabicTitle: "الإظهار الشفوي", description: "Pronounce Meem Sakinah clearly when followed by any letter other than Mim or Ba. This is the default rule.", arabicExamples: '["أَمْ لَمْ", "أَمْ كَانُوا", "لَهُمْ خَيْرٌ"]', order: 4 },
  
  // Rules of Madd (Prolongation)
  { category: "madd", title: "Introduction to Madd", arabicTitle: "أحكام المد", description: "Madd means prolongation or stretching. It occurs with three letters: Alif, Waw, and Ya (when they are sakinah after a vowel).", arabicExamples: '["ا", "و", "ي"]', order: 1 },
  { category: "madd", title: "Madd Asli (Original)", arabicTitle: "المد الأصلي", description: "Basic prolongation of 2 counts (harakah). Occurs when there is no hamzah or sukoon after the madd letter. This is the natural length.", arabicExamples: '["قَالُوا", "نُوحِيهَا", "الْعَالَمِينَ"]', order: 2 },
  { category: "madd", title: "Madd Wajib Muttasil", arabicTitle: "المد الواجب المتصل", description: "Required prolonged madd of 4-5 counts when a hamzah follows the madd letter in the same word. Required in Shafi'i recitation.", arabicExamples: '["جَاءَ", "سُوءٌ", "الْقُرْآنِ"]', order: 3 },
  { category: "madd", title: "Madd Ja'iz Munfasil", arabicTitle: "المد الجائز المنفصل", description: "Permissible prolonged madd of 4-5 counts when a hamzah follows the madd letter in the next word. Permissible to stretch 2 or 4-5.", arabicExamples: '["إِنَّا أَعْطَيْنَاكَ", "قُوا أَنفُسَكُمْ"]', order: 4 },
  { category: "madd", title: "Madd Lazim", arabicTitle: "المد اللازم", description: "Obligatory prolonged madd of 6 counts when a sukoon follows the madd letter. This occurs in certain words and is always 6 counts.", arabicExamples: '["آمِنِينَ", "آلذَّكَرَيْنِ", "الطَّامَّةُ"]', order: 5 },
  
  // Waqf (Stopping Rules)
  { category: "waqf", title: "Introduction to Waqf", arabicTitle: "أحكام الوقف", description: "Waqf means stopping or pausing in recitation. There are different types of stops with specific rules for ending letters.", arabicExamples: '["ـ", "،", "؛"]', order: 1 },
  { category: "waqf", title: "Waqf Tam (Complete Stop)", arabicTitle: "الوقف التام", description: "Complete stop at the end of a verse or complete thought. The meaning is complete. Usually indicated by a verse ending.", arabicExamples: '["وَأُولَـٰئِكَ هُمُ الْمُفْلِحُونَ"]', order: 2 },
  { category: "waqf", title: "Waqf Kafi (Sufficient Stop)", arabicTitle: "الوقف الكافي", description: "Sufficient stop where the meaning is understood but connected to what follows. May continue or stop here.", arabicExamples: '["الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ"]', order: 3 },
  { category: "waqf", title: "Waqf Hasan (Good Stop)", arabicTitle: "الوقف الحسن", description: "Good stop but better to continue if possible. The meaning is understood but connected to following verse.", arabicExamples: '["الرَّحْمَـٰنِ الرَّحِيمِ"]', order: 4 },
  { category: "waqf", title: "Waqf Qabih (Improper Stop)", arabicTitle: "الوقف القبيح", description: "Improper stop that breaks the meaning. Should not stop here as it distorts or confuses the message.", arabicExamples: '["لَا إِلَـٰهَ إِلَّا"]', order: 5 },
  { category: "waqf", title: "End Letter Rules", arabicTitle: "أحكام أواخر الكلمات", description: "When stopping, if the word ends with a vowel, we give it sukoon. If it ends with Tanwin, it becomes a sukoon. Exception: Words ending with Ta Marbuta become Ha.", arabicExamples: '["عَلِيمًا → عَلِيمْ", "رَحْمَةً → رَحْمَةْ"]', order: 6 },
]

export async function POST() {
  try {
    // Seed Surahs
    const existingSurahs = await db.surah.count()
    
    if (existingSurahs === 0) {
      await db.surah.createMany({
        data: surahs.map(s => ({
          number: s.number,
          name: s.name,
          arabicName: s.arabicName,
          englishName: s.englishName,
          ayahs: s.ayahs,
          juz: s.juz,
          revelation: s.revelation,
          meaning: s.meaning,
        }))
      })
    }
    
    // Seed Tajweed Lessons
    const existingLessons = await db.tajweedLesson.count()
    
    if (existingLessons === 0) {
      await db.tajweedLesson.createMany({
        data: tajweedLessons.map(l => ({
          category: l.category,
          title: l.title,
          arabicTitle: l.arabicTitle,
          description: l.description,
          arabicExamples: l.arabicExamples,
          order: l.order,
        }))
      })
    }
    
    // Seed Arabic Content
    const existingArabic = await db.arabicContent.count()
    
    if (existingArabic === 0) {
      const arabicAlphabet = [
        { category: 'alphabet', letter: 'ا', arabicText: 'ا', transliteration: 'Alif', translation: 'The first letter', order: 1 },
        { category: 'alphabet', letter: 'ب', arabicText: 'ب', transliteration: 'Ba', translation: 'The second letter', order: 2 },
        { category: 'alphabet', letter: 'ت', arabicText: 'ت', transliteration: 'Ta', translation: 'The third letter', order: 3 },
        { category: 'alphabet', letter: 'ث', arabicText: 'ث', transliteration: 'Tha', translation: 'The fourth letter', order: 4 },
        { category: 'alphabet', letter: 'ج', arabicText: 'ج', transliteration: 'Jim', translation: 'The fifth letter', order: 5 },
        { category: 'alphabet', letter: 'ح', arabicText: 'ح', transliteration: 'Ha', translation: 'The sixth letter', order: 6 },
        { category: 'alphabet', letter: 'خ', arabicText: 'خ', transliteration: 'Kha', translation: 'The seventh letter', order: 7 },
        { category: 'alphabet', letter: 'د', arabicText: 'د', transliteration: 'Dal', translation: 'The eighth letter', order: 8 },
        { category: 'alphabet', letter: 'ذ', arabicText: 'ذ', transliteration: 'Dhal', translation: 'The ninth letter', order: 9 },
        { category: 'alphabet', letter: 'ر', arabicText: 'ر', transliteration: 'Ra', translation: 'The tenth letter', order: 10 },
        { category: 'alphabet', letter: 'ز', arabicText: 'ز', transliteration: 'Zay', translation: 'The eleventh letter', order: 11 },
        { category: 'alphabet', letter: 'س', arabicText: 'س', transliteration: 'Sin', translation: 'The twelfth letter', order: 12 },
        { category: 'alphabet', letter: 'ش', arabicText: 'ش', transliteration: 'Shin', translation: 'The thirteenth letter', order: 13 },
        { category: 'alphabet', letter: 'ص', arabicText: 'ص', transliteration: 'Sad', translation: 'The fourteenth letter', order: 14 },
        { category: 'alphabet', letter: 'ض', arabicText: 'ض', transliteration: 'Dad', translation: 'The fifteenth letter', order: 15 },
        { category: 'alphabet', letter: 'ط', arabicText: 'ط', transliteration: 'Ta', translation: 'The sixteenth letter', order: 16 },
        { category: 'alphabet', letter: 'ظ', arabicText: 'ظ', transliteration: 'Za', translation: 'The seventeenth letter', order: 17 },
        { category: 'alphabet', letter: 'ع', arabicText: 'ع', transliteration: 'Ayn', translation: 'The eighteenth letter', order: 18 },
        { category: 'alphabet', letter: 'غ', arabicText: 'غ', transliteration: 'Ghayn', translation: 'The nineteenth letter', order: 19 },
        { category: 'alphabet', letter: 'ف', arabicText: 'ف', transliteration: 'Fa', translation: 'The twentieth letter', order: 20 },
        { category: 'alphabet', letter: 'ق', arabicText: 'ق', transliteration: 'Qaf', translation: 'The twenty-first letter', order: 21 },
        { category: 'alphabet', letter: 'ك', arabicText: 'ك', transliteration: 'Kaf', translation: 'The twenty-second letter', order: 22 },
        { category: 'alphabet', letter: 'ل', arabicText: 'ل', transliteration: 'Lam', translation: 'The twenty-third letter', order: 23 },
        { category: 'alphabet', letter: 'م', arabicText: 'م', transliteration: 'Mim', translation: 'The twenty-fourth letter', order: 24 },
        { category: 'alphabet', letter: 'ن', arabicText: 'ن', transliteration: 'Nun', translation: 'The twenty-fifth letter', order: 25 },
        { category: 'alphabet', letter: 'هـ', arabicText: 'هـ', transliteration: 'Ha', translation: 'The twenty-sixth letter', order: 26 },
        { category: 'alphabet', letter: 'و', arabicText: 'و', transliteration: 'Waw', translation: 'The twenty-seventh letter', order: 27 },
        { category: 'alphabet', letter: 'ي', arabicText: 'ي', transliteration: 'Ya', translation: 'The twenty-eighth letter', order: 28 },
      ]
      
      const vocabulary = [
        { category: 'vocabulary', arabicText: 'بِسْمِ اللَّهِ', transliteration: 'Bismillah', translation: 'In the name of Allah', order: 1 },
        { category: 'vocabulary', arabicText: 'السَّلَامُ عَلَيْكُمْ', transliteration: 'Assalamu Alaikum', translation: 'Peace be upon you', order: 2 },
        { category: 'vocabulary', arabicText: 'الْحَمْدُ لِلَّهِ', transliteration: 'Alhamdulillah', translation: 'Praise be to Allah', order: 3 },
        { category: 'vocabulary', arabicText: 'اللَّهُ أَكْبَرُ', transliteration: 'Allahu Akbar', translation: 'Allah is the Greatest', order: 4 },
        { category: 'vocabulary', arabicText: 'مَاشَاءَ اللَّهُ', transliteration: 'Mashallah', translation: 'What Allah has willed', order: 5 },
        { category: 'vocabulary', arabicText: 'إِنْ شَاءَ اللَّهُ', transliteration: 'Inshallah', translation: 'If Allah wills', order: 6 },
        { category: 'vocabulary', arabicText: 'سُبْحَانَ اللَّهِ', transliteration: 'Subhanallah', translation: 'Glory be to Allah', order: 7 },
        { category: 'vocabulary', arabicText: 'أَسْتَغْفِرُ اللَّهَ', transliteration: 'Astaghfirullah', translation: 'I seek forgiveness from Allah', order: 8 },
        { category: 'vocabulary', arabicText: 'لَا إِلَهَ إِلَّا اللَّهُ', transliteration: 'La ilaha illallah', translation: 'There is no god but Allah', order: 9 },
        { category: 'vocabulary', arabicText: 'مَسْجِد', transliteration: 'Masjid', translation: 'Mosque', order: 10 },
        { category: 'vocabulary', arabicText: 'صَلَاة', transliteration: 'Salah', translation: 'Prayer', order: 11 },
        { category: 'vocabulary', arabicText: 'صِيَام', transliteration: 'Siyam', translation: 'Fasting', order: 12 },
        { category: 'vocabulary', arabicText: 'زَكَاة', transliteration: 'Zakat', translation: 'Charity', order: 13 },
        { category: 'vocabulary', arabicText: 'حَجّ', transliteration: 'Hajj', translation: 'Pilgrimage', order: 14 },
        { category: 'vocabulary', arabicText: 'قُرْآن', transliteration: 'Quran', translation: 'The Holy Quran', order: 15 },
      ]
      
      const phrases = [
        { category: 'phrases', arabicText: 'كَيْفَ حَالُكَ؟', transliteration: 'Kayf haluk?', translation: 'How are you?', order: 1 },
        { category: 'phrases', arabicText: 'أَنَا بِخَيْرٍ', transliteration: 'Ana bikhair', translation: 'I am fine', order: 2 },
        { category: 'phrases', arabicText: 'شُكْرًا', transliteration: 'Shukran', translation: 'Thank you', order: 3 },
        { category: 'phrases', arabicText: 'عَفْوًا', transliteration: 'Afwan', translation: 'You\'re welcome', order: 4 },
        { category: 'phrases', arabicText: 'مِنْ فَضْلِكَ', transliteration: 'Min fadlik', translation: 'Please', order: 5 },
        { category: 'phrases', arabicText: 'حَيَّاكَ اللَّهُ', transliteration: 'Hayyakallah', translation: 'May Allah greet you', order: 6 },
        { category: 'phrases', arabicText: 'مَعَ السَّلَامَةِ', transliteration: 'Ma\'a as-salama', translation: 'Goodbye', order: 7 },
        { category: 'phrases', arabicText: 'تَبَارَكَ اللَّهُ', transliteration: 'Tabarakallah', translation: 'Blessed is Allah', order: 8 },
        { category: 'phrases', arabicText: 'جَزَاكَ اللَّهُ خَيْرًا', transliteration: 'Jazakallah khair', translation: 'May Allah reward you', order: 9 },
        { category: 'phrases', arabicText: 'يَا رَبّ', transliteration: 'Ya Rabb', translation: 'O Lord', order: 10 },
      ]
      
      await db.arabicContent.createMany({
        data: [...arabicAlphabet, ...vocabulary, ...phrases]
      })
    }
    
    // Create sample Qurbani animals
    const existingAnimals = await db.qurbaniAnimal.count()
    
    if (existingAnimals === 0) {
      await db.qurbaniAnimal.createMany({
        data: [
          { type: 'cow', name: 'Cow 1', totalShares: 7, filledShares: 0, price: 700, year: new Date().getFullYear() },
          { type: 'cow', name: 'Cow 2', totalShares: 7, filledShares: 0, price: 700, year: new Date().getFullYear() },
          { type: 'sheep', name: 'Sheep 1', totalShares: 1, filledShares: 0, price: 150, year: new Date().getFullYear() },
          { type: 'sheep', name: 'Sheep 2', totalShares: 1, filledShares: 0, price: 150, year: new Date().getFullYear() },
          { type: 'goat', name: 'Goat 1', totalShares: 1, filledShares: 0, price: 120, year: new Date().getFullYear() },
        ]
      })
    }
    
    // Create sample livestream
    const existingStreams = await db.liveStream.count()
    
    if (existingStreams === 0) {
      await db.liveStream.create({
        data: {
          title: 'Jumu\'ah Prayer',
          description: 'Weekly Friday prayer livestream',
          streamUrl: 'https://www.youtube.com/live/example',
          streamType: 'youtube',
          isLive: false,
          event: 'jumuah',
          scheduledTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        }
      })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      surahs: surahs.length,
      tajweedLessons: tajweedLessons.length,
    })
  } catch (error) {
    console.error('Error seeding database:', error)
    return NextResponse.json({ success: false, error: 'Failed to seed database' }, { status: 500 })
  }
}

export async function GET() {
  return POST()
}
