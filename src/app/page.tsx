'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useAppStore } from '@/lib/store'
import { usePrayerAlarm } from '@/hooks/use-prayer-alarm'
import { MASJID_LOCATION } from '@/lib/prayer-utils'
import { t, Language } from '@/lib/i18n'

// Bulawayo timezone helper (CAT - UTC+2)
const getBulawayoTime = () => {
  const now = new Date()
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000)
  return new Date(utc + (2 * 3600000)) // Add 2 hours for CAT
}

const formatBulawayoTime = () => {
  return getBulawayoTime().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

const formatBulawayoDate = () => {
  return getBulawayoTime().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

// Icons as SVG components
const HomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)

const PrayerIcon = ({ active }: { active?: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
)

const LearnIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
)

const CommunityIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const MoreIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="19" r="1" />
  </svg>
)

const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
)

const MicIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
)

const AlertIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

const MosqueIcon = () => (
  <svg width="32" height="32" viewBox="0 0 64 64" fill="none" className="mosque-icon">
    <path d="M32 4C26 4 22 8 22 14C22 16 23 18 24 20H18V26H12V56H52V26H46V20H40C41 18 42 16 42 14C42 8 38 4 32 4Z" fill="#D4AF37" stroke="#1B5E20" strokeWidth="2"/>
    <rect x="28" y="30" width="8" height="26" fill="#1B5E20"/>
    <circle cx="32" cy="14" r="3" fill="#1B5E20"/>
    <rect x="8" y="50" width="48" height="6" fill="#1B5E20"/>
  </svg>
)

// Types
interface PrayerTime {
  id: string
  date: string
  fajr: string
  sunrise: string
  dhuhr: string
  asr: string
  maghrib: string
  isha: string
}

interface GuideStep {
  id: string
  category: string
  stepNumber: number
  title: string
  arabicText: string | null
  transliteration: string | null
  translation: string | null
  imageUrl: string | null
  audioUrl: string | null
}

interface Dua {
  id: string
  title: string
  category: string
  arabicText: string
  transliteration: string
  translation: string
  audioUrl: string | null
}

interface Comment {
  id: string
  announcementId: string
  name: string
  content: string
  createdAt: string
}

interface Announcement {
  id: string
  title: string
  content: string
  category: string
  priority: number
  createdAt: string
  comments?: Comment[]
}

interface Surah {
  id: string
  number: number
  name: string
  arabicName: string
  englishName: string
  ayahs: number
  juz: number
  revelation: string
  meaning: string | null
  hifzProgress?: { status: string }[]
}

interface TajweedLesson {
  id: string
  category: string
  title: string
  arabicTitle: string | null
  description: string
  arabicExamples: string | null
  order: number
}

interface ArabicContent {
  id: string
  category: string
  letter: string | null
  arabicText: string
  transliteration: string | null
  translation: string | null
  audioUrl: string | null
  imageUrl: string | null
  order: number
}

interface QurbaniAnimal {
  id: string
  type: string
  name: string | null
  totalShares: number
  filledShares: number
  price: number
  contributions: { id: string; shares: number; amount: number; donorName: string | null }[]
}

interface LiveStream {
  id: string
  title: string
  description: string | null
  streamUrl: string
  streamType: string
  isLive: boolean
  event: string | null
  scheduledTime: string | null
}

interface Member {
  id: string
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
  city: string | null
  isVolunteer: boolean
  isVulnerable: boolean
}

interface Tribute {
  id: string
  name: string
  relationship: string | null
  message: string
  isApproved: boolean
  isHighlighted: boolean
  submittedAt: string
}

interface Photo {
  id: string
  title: string
  description: string | null
  imageUrl: string
  category: string
  uploadedBy: string
  uploaderName: string | null
  isApproved: boolean
  isFeatured: boolean
  createdAt: string
}

interface DailyContent {
  id: string
  type: string
  contentAr: string
  contentEn: string
  contentSn: string | null
  contentNd: string | null
  source: string
  date: string
}

// Hardcoded Wudu Steps - Works without database
const HARDCODED_WUDU_STEPS: GuideStep[] = [
  {
    id: 'wudu-1',
    category: 'wudu',
    stepNumber: 1,
    title: 'Niyyah (Intention)',
    arabicText: 'نِيَّةُ الْوُضُوءِ',
    transliteration: 'Niy-yat al-wuḍū',
    translation: 'Make the intention in your heart to perform wudu for the sake of Allah. Intention is the foundation of all acts of worship.',
    imageUrl: null,
    audioUrl: null
  },
  {
    id: 'wudu-2',
    category: 'wudu',
    stepNumber: 2,
    title: 'Bismillah',
    arabicText: 'بِسْمِ اللَّهِ',
    transliteration: 'Bis-mil-lāh',
    translation: 'Say "Bismillah" (In the name of Allah) before beginning wudu. This brings blessing to your ablution.',
    imageUrl: null,
    audioUrl: null
  },
  {
    id: 'wudu-3',
    category: 'wudu',
    stepNumber: 3,
    title: 'Wash Hands',
    arabicText: 'غَسْلُ الْيَدَيْنِ',
    transliteration: 'Ghas-lul yadayn',
    translation: 'Wash both hands up to the wrists three times, starting with the right hand. Clean between the fingers thoroughly.',
    imageUrl: null,
    audioUrl: null
  },
  {
    id: 'wudu-4',
    category: 'wudu',
    stepNumber: 4,
    title: 'Rinse Mouth',
    arabicText: 'الْمَضْمَضَةُ',
    transliteration: 'Al-maḍ-ma-ḍah',
    translation: 'Rinse your mouth three times with water using your right hand. Use a miswak or toothbrush if available.',
    imageUrl: null,
    audioUrl: null
  },
  {
    id: 'wudu-5',
    category: 'wudu',
    stepNumber: 5,
    title: 'Clean Nose',
    arabicText: 'الِاسْتِنْشَاقُ',
    transliteration: 'Al-is-tin-shāq',
    translation: 'Inhale water into your nose gently and then blow it out three times. Clean the nostrils with the left hand.',
    imageUrl: null,
    audioUrl: null
  },
  {
    id: 'wudu-6',
    category: 'wudu',
    stepNumber: 6,
    title: 'Wash Face',
    arabicText: 'غَسْلُ الْوَجْهِ',
    transliteration: 'Ghas-lul wajh',
    translation: 'Wash your entire face three times, from the hairline to the chin and from ear to ear. Ensure water reaches all areas.',
    imageUrl: null,
    audioUrl: null
  },
  {
    id: 'wudu-7',
    category: 'wudu',
    stepNumber: 7,
    title: 'Wash Arms',
    arabicText: 'غَسْلُ الذِّرَاعَيْنِ',
    transliteration: 'Ghas-ludh-dhir-\'ayn',
    translation: 'Wash both arms from the fingertips up to and including the elbows three times, starting with the right arm.',
    imageUrl: null,
    audioUrl: null
  },
  {
    id: 'wudu-8',
    category: 'wudu',
    stepNumber: 8,
    title: 'Wipe Head',
    arabicText: 'مَسْحُ الرَّأْسِ',
    transliteration: 'Mas-hur ra\'s',
    translation: 'Wipe your entire head once with wet hands, from the forehead to the back of the head and back to the forehead.',
    imageUrl: null,
    audioUrl: null
  },
  {
    id: 'wudu-9',
    category: 'wudu',
    stepNumber: 9,
    title: 'Clean Ears',
    arabicText: 'تَنْظِيفُ الأُذُنَيْنِ',
    transliteration: 'Tan-ẓīful udhu-nayn',
    translation: 'Wipe the inside of both ears with your index fingers and the outside with your thumbs, using fresh water.',
    imageUrl: null,
    audioUrl: null
  },
  {
    id: 'wudu-10',
    category: 'wudu',
    stepNumber: 10,
    title: 'Wash Feet',
    arabicText: 'غَسْلُ الْقَدَمَيْنِ',
    transliteration: 'Ghas-lul qa-da-mayn',
    translation: 'Wash both feet up to and including the ankles three times, starting with the right foot. Clean between the toes.',
    imageUrl: null,
    audioUrl: null
  },
  {
    id: 'wudu-11',
    category: 'wudu',
    stepNumber: 11,
    title: 'Recite Shahada',
    arabicText: 'أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
    transliteration: 'Ash-ha-du an lā ilā-ha il-lal-lāh waḥ-dahū lā sha-rī-ka lah, wa ash-ha-du an-na Muḥam-ma-dan \'ab-duhū wa ra-sū-luh',
    translation: 'I bear witness that there is no deity except Allah, alone without partner, and I bear witness that Muhammad is His servant and messenger.',
    imageUrl: null,
    audioUrl: null
  },
  {
    id: 'wudu-12',
    category: 'wudu',
    stepNumber: 12,
    title: 'Dua After Wudu',
    arabicText: 'اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ',
    transliteration: 'Al-lāhum-maj-\'al-nī mi-nat-taw-wā-bīn, waj-\'al-nī mi-nal-mu-ta-tah-hirīn',
    translation: 'O Allah, make me among those who constantly turn to You in repentance, and make me among those who purify themselves.',
    imageUrl: null,
    audioUrl: null
  }
]

// Hardcoded Salah Steps - Works without database
const HARDCODED_SALAH_STEPS: GuideStep[] = [
  {
    id: 'salah-1',
    category: 'salah',
    stepNumber: 1,
    title: 'Stand Facing Qibla',
    arabicText: 'الْقِيَامُ',
    transliteration: 'Al-qiyām',
    translation: 'Stand upright facing the Qibla (direction of the Ka\'bah in Makkah). Make the intention in your heart for the specific prayer you are about to perform.',
    imageUrl: null,
    audioUrl: null
  },
  {
    id: 'salah-2',
    category: 'salah',
    stepNumber: 2,
    title: 'Takbir al-Ihram',
    arabicText: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Al-lāhu Ak-bar',
    translation: 'Raise both hands to the level of your ears and say "Allahu Akbar" (Allah is the Greatest). This enters you into the state of prayer.',
    imageUrl: null,
    audioUrl: null
  },
  {
    id: 'salah-3',
    category: 'salah',
    stepNumber: 3,
    title: 'Recite Al-Fatiha',
    arabicText: 'الْفَاتِحَةُ',
    transliteration: 'Al-Fā-ti-ḥah',
    translation: 'Recite Surah Al-Fatiha, followed by another Surah or verses from the Quran. This is an essential pillar of the prayer.',
    imageUrl: null,
    audioUrl: null
  },
  {
    id: 'salah-4',
    category: 'salah',
    stepNumber: 4,
    title: 'Ruku (Bow)',
    arabicText: 'الرُّكُوعُ',
    transliteration: 'Ar-ru-kū',
    translation: 'Bow down, placing your hands on your knees with your back straight. Say "Subḥāna Rabbiyal Aẓīm" (Glory be to my Lord, the Most Great) three times.',
    imageUrl: null,
    audioUrl: null
  },
  {
    id: 'salah-5',
    category: 'salah',
    stepNumber: 5,
    title: 'I\'tidal (Stand)',
    arabicText: 'الِاعْتِدَالُ',
    transliteration: 'Al-i\'ti-dāl',
    translation: 'Rise from bowing while saying "Sami\'al-lāhu li-man ḥamidah" (Allah hears the one who praises Him), then say "Rabbanā wa lakal-ḥamd" (Our Lord, to You is all praise).',
    imageUrl: null,
    audioUrl: null
  },
  {
    id: 'salah-6',
    category: 'salah',
    stepNumber: 6,
    title: 'Sujud (Prostrate)',
    arabicText: 'السُّجُودُ',
    transliteration: 'As-su-jūd',
    translation: 'Prostrate with your forehead, nose, hands, knees, and toes touching the ground. Say "Subḥāna Rabbiyal A\'lā" (Glory be to my Lord, the Most High) three times.',
    imageUrl: null,
    audioUrl: null
  },
  {
    id: 'salah-7',
    category: 'salah',
    stepNumber: 7,
    title: 'Jalsa (Sit)',
    arabicText: 'الْجَلْسَةُ',
    transliteration: 'Al-jal-sah',
    translation: 'Sit briefly between the two prostrations, resting on your left foot while keeping the right foot upright. Then perform the second prostration.',
    imageUrl: null,
    audioUrl: null
  },
  {
    id: 'salah-8',
    category: 'salah',
    stepNumber: 8,
    title: 'Tashahhud & Salam',
    arabicText: 'التَّشَهُّدُ وَالسَّلَامُ',
    transliteration: 'At-ta-shah-hud was-salām',
    translation: 'Recite the Tashahhud, then send blessings upon the Prophet. End the prayer by turning your head to the right saying "As-salāmu \'alaykum wa raḥmatul-lāh" and then to the left.',
    imageUrl: null,
    audioUrl: null
  }
]

// API Fetcher with offline caching
async function fetchData<T>(endpoint: string, cacheKey: string): Promise<T> {
  try {
    const response = await fetch(`/api/${endpoint}`)
    if (!response.ok) throw new Error('Network error')
    const data = await response.json()
    localStorage.setItem(`masjid-${cacheKey}`, JSON.stringify(data))
    return data
  } catch {
    const cached = localStorage.getItem(`masjid-${cacheKey}`)
    if (cached) {
      return JSON.parse(cached)
    }
    return [] as T
  }
}

export default function MasjidHub() {
  const { 
    activeTab, setActiveTab, 
    isOffline, setOffline, 
    language, setLanguage,
    languageSelected, setLanguageSelected,
    cachedData, setCachedData, 
    learnSubTab, setLearnSubTab, 
    communitySubTab, setCommunitySubTab,
    moreSubTab, setMoreSubTab,
    hifzStats, setHifzStats,
    currentMemberId, setCurrentMemberId,
    backgroundAudioEnabled, setBackgroundAudioEnabled,
    clickSoundEnabled, setClickSoundEnabled
  } = useAppStore()

  // Translation helper
  const tr = (key: string) => t(key, language as Language)

  // Click sound effect
  const playClickSound = useCallback(() => {
    if (!clickSoundEnabled || typeof window === 'undefined') return
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH2LkZeWj4B2bGFmcHyGjI2Kh4J4bGZodn2EiYqJhYF6cGttdX6Bg4OEgX96dXJ0d3x+fnx5dnRycHl9gIGBgH16d3V0cnl8fXx6d3Rycnl7fHx7enV0cnJ5e3x8e3p1dHJyeXt8fHt6dXRycnl7fHx7enV0cnJ5e3x8e3p1dHJyeXt8fHt6dXRycnl7fHw=')
      audio.volume = 0.2
      audio.play().catch(() => {})
    } catch {
      // Ignore audio errors
    }
  }, [clickSoundEnabled])

  // Prayer alarm hook for Adhan and notifications
  const {
    playAdhan,
    stopAdhan,
    isPlaying,
    nextPrayer,
    jumuahCountdown,
    requestNotificationPermission,
    hasNotificationPermission,
  } = usePrayerAlarm()

  // User location for GPS directions
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  // Get distance to masjid
  const getDistanceToMasjid = (lat: number, lng: number): string => {
    const R = 6371 // Earth's radius in km
    const dLat = (MASJID_LOCATION.latitude - lat) * Math.PI / 180
    const dLon = (MASJID_LOCATION.longitude - lng) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat * Math.PI / 180) * Math.cos(MASJID_LOCATION.latitude * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    const distance = R * c
    return distance.toFixed(1)
  }

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.error('Error getting location:', error)
        }
      )
    }
  }

  // Get directions to masjid
  const handleGetDirections = () => {
    const url = userLocation
      ? `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${MASJID_LOCATION.latitude},${MASJID_LOCATION.longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${MASJID_LOCATION.latitude},${MASJID_LOCATION.longitude}`
    window.open(url, '_blank')
  }

  // Data states
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([])
  const [wuduSteps] = useState<GuideStep[]>(HARDCODED_WUDU_STEPS)
  const [salahSteps] = useState<GuideStep[]>(HARDCODED_SALAH_STEPS)
  const [duas, setDuas] = useState<Dua[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [surahs, setSurahs] = useState<Surah[]>([])
  const [tajweedLessons, setTajweedLessons] = useState<TajweedLesson[]>([])
  const [arabicContent, setArabicContent] = useState<ArabicContent[]>([])
  const [qurbaniAnimals, setQurbaniAnimals] = useState<QurbaniAnimal[]>([])
  const [liveStreams, setLiveStreams] = useState<LiveStream[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [tributes, setTributes] = useState<Tribute[]>([])

  // UI states
  const [loading, setLoading] = useState(true)
  const [currentGuideStep, setCurrentGuideStep] = useState(0)
  const [guideAudioPlaying, setGuideAudioPlaying] = useState<string | null>(null)
  const [selectedDuaCategory, setSelectedDuaCategory] = useState<string>('all')
  const [questionText, setQuestionText] = useState('')
  const [questionSubmitted, setQuestionSubmitted] = useState(false)
  const [bookingForm, setBookingForm] = useState({
    facility: 'main_hall',
    purpose: '',
    date: '',
    startTime: '',
    endTime: '',
    notes: '',
  })
  const [bookingSubmitted, setBookingSubmitted] = useState(false)
  const [donationAmount, setDonationAmount] = useState('')
  const [donationType, setDonationType] = useState('general')
  
  // AI Chat states
  const [aiResponse, setAiResponse] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [showAiChat, setShowAiChat] = useState(false)
  const [aiAudio, setAiAudio] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  // Member registration
  const [memberForm, setMemberForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', province: '', country: 'Zimbabwe',
    latitude: '', longitude: '', isVolunteer: false, isVulnerable: false,
    emergencyContact: '', emergencyName: ''
  })
  const [memberSubmitted, setMemberSubmitted] = useState(false)

  // Qurbani contribution
  const [qurbaniForm, setQurbaniForm] = useState({ animalId: '', shares: 1, donorName: '', donorPhone: '' })
  const [qurbaniSubmitted, setQurbaniSubmitted] = useState(false)

  // Alert/Panic
  const [alertSent, setAlertSent] = useState(false)

  // Tribute states
  const [tributeForm, setTributeForm] = useState({ name: '', relationship: '', message: '' })
  const [tributeSubmitted, setTributeSubmitted] = useState(false)
  const [showTributeModal, setShowTributeModal] = useState(false)

  // Comment states for announcements
  const [commentForm, setCommentForm] = useState({ name: '', content: '' })
  const [commentSubmitted, setCommentSubmitted] = useState(false)
  const [activeCommentAnnouncement, setActiveCommentAnnouncement] = useState<string | null>(null)
  const [announcementComments, setAnnouncementComments] = useState<Record<string, Comment[]>>({})
  const [loadingComments, setLoadingComments] = useState<string | null>(null)

  // Kids Section states
  const [kidsSubTab, setKidsSubTab] = useState<'menu' | 'nasheeds' | 'stories' | 'games' | 'arabic'>('menu')
  const [kidsNasheeds, setKidsNasheeds] = useState<any[]>([])
  const [kidsStories, setKidsStories] = useState<any[]>([])
  const [kidsGames, setKidsGames] = useState<any[]>([])
  const [kidsArabic, setKidsArabic] = useState<any[]>([])
  const [selectedStory, setSelectedStory] = useState<any | null>(null)
  const [activeQuiz, setActiveQuiz] = useState<any | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [quizScore, setQuizScore] = useState(0)
  const [showQuizResult, setShowQuizResult] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)

  // Qibla Compass states
  const [compassHeading, setCompassHeading] = useState<number | null>(null)
  const [compassError, setCompassError] = useState<string | null>(null)
  const [qiblaAngle] = useState(20) // Qibla direction from Bulawayo is approximately 20° NE
  const [compassSupported, setCompassSupported] = useState(false)

  // Live Stream Recording states
  const [showRecordingModal, setShowRecordingModal] = useState(false)
  const [selectedRecording, setSelectedRecording] = useState<LiveStream | null>(null)
  const [recordedStreams, setRecordedStreams] = useState<LiveStream[]>([])

  // Photo Album states
  const [photos, setPhotos] = useState<Photo[]>([])
  const [showPhotoUpload, setShowPhotoUpload] = useState(false)
  const [photoForm, setPhotoForm] = useState({ title: '', description: '', category: 'general', imageUrl: '' })
  const [photoUploaded, setPhotoUploaded] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)

  // Daily Content states
  const [dailyHadith, setDailyHadith] = useState<DailyContent | null>(null)
  const [dailyVerse, setDailyVerse] = useState<DailyContent | null>(null)

  // Dedication Audio states
  const [dedicationAudioPlaying, setDedicationAudioPlaying] = useState(false)
  const [currentSurah, setCurrentSurah] = useState<string | null>(null)
  const dedicationAudioRef = useRef<HTMLAudioElement | null>(null)

  // Dedication Surahs for recitation
  const dedicationSurahs = [
    { name: 'Surah Al-Mulk', nameAr: 'سورة الملك', url: 'https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/067.mp3' },
    { name: 'Surah Yaseen', nameAr: 'سورة يس', url: 'https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/036.mp3' },
    { name: 'Surah Al-Kahf', nameAr: 'سورة الكهف', url: 'https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/018.mp3' }
  ]

  // Play dedication surah
  const playDedicationSurah = (url: string, name: string) => {
    if (dedicationAudioRef.current) {
      dedicationAudioRef.current.pause()
      dedicationAudioRef.current = null
    }
    if (currentSurah === name && dedicationAudioPlaying) {
      setDedicationAudioPlaying(false)
      setCurrentSurah(null)
      return
    }
    const audio = new Audio(url)
    audio.volume = 0.7
    audio.onended = () => {
      setDedicationAudioPlaying(false)
      setCurrentSurah(null)
    }
    dedicationAudioRef.current = audio
    audio.play().then(() => {
      setDedicationAudioPlaying(true)
      setCurrentSurah(name)
    }).catch(() => {
      setDedicationAudioPlaying(false)
    })
  }

  // Web Speech API for Arabic text-to-speech
  const speakArabicText = (text: string, stepId: string) => {
    // Stop if already playing this step
    if (guideAudioPlaying === stepId && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel()
      setGuideAudioPlaying(null)
      return
    }

    // Cancel any existing speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'ar-SA'
    utterance.rate = 0.8
    utterance.pitch = 1

    // Try to find an Arabic voice
    const voices = window.speechSynthesis.getVoices()
    const arabicVoice = voices.find(v => v.lang.includes('ar')) || voices[0]
    if (arabicVoice) {
      utterance.voice = arabicVoice
    }

    utterance.onstart = () => setGuideAudioPlaying(stepId)
    utterance.onend = () => setGuideAudioPlaying(null)
    utterance.onerror = () => setGuideAudioPlaying(null)

    window.speechSynthesis.speak(utterance)
  }

  // Current time display
  const [currentTime, setCurrentTime] = useState(formatBulawayoTime())
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(formatBulawayoTime())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Check online status
  useEffect(() => {
    const handleOnline = () => setOffline(false)
    const handleOffline = () => setOffline(true)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    setOffline(!navigator.onLine)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [setOffline])

  // Load all data on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [pt, d, ann, hifz, tajweed, arabic, qurbani, streams, tributesData, photosData, dailyContentData] = await Promise.all([
          fetchData<PrayerTime[]>('prayer-times', 'prayer-times'),
          fetchData<Dua[]>('duas', 'duas'),
          fetchData<Announcement[]>('announcements', 'announcements'),
          fetchData<{surahs: Surah[]}>('hifz?all=true', 'hifz'),
          fetchData<{lessons: TajweedLesson[]}>('tajweed', 'tajweed'),
          fetchData<{content: ArabicContent[]}>('arabic', 'arabic'),
          fetchData<{animals: QurbaniAnimal[]}>('qurbani', 'qurbani'),
          fetchData<{streams: LiveStream[]}>('livestream', 'livestream'),
          fetchData<{tributes: Tribute[]}>('tributes', 'tributes'),
          fetchData<{photos: Photo[]}>('photos', 'photos'),
          fetchData<{hadith: DailyContent, quranVerse: DailyContent}>('daily-content', 'daily-content'),
        ])

        setPrayerTimes(pt)
        // Wudu and Salah steps are now hardcoded - no database dependency
        setDuas(d)
        setAnnouncements(ann)
        setSurahs(hifz.surahs || [])
        setTajweedLessons(tajweed.lessons || [])
        setArabicContent(arabic.content || [])
        setQurbaniAnimals(qurbani.animals || [])
        setLiveStreams(streams.streams || [])
        setTributes(tributesData.tributes || [])
        setPhotos(photosData.photos || [])
        setDailyHadith(dailyContentData.hadith || null)
        setDailyVerse(dailyContentData.quranVerse || null)

        setCachedData({
          prayerTimes: pt,
          guides: [...HARDCODED_WUDU_STEPS, ...HARDCODED_SALAH_STEPS],
          duas: d,
          announcements: ann,
        })
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [setCachedData])

  // Get today's prayer times
  const todayPrayer = prayerTimes.find(pt => {
    const ptDate = new Date(pt.date).toDateString()
    return ptDate === new Date().toDateString()
  }) || prayerTimes[0]

  // Get current prayer
  const getCurrentPrayer = useCallback(() => {
    if (!todayPrayer) return 'fajr'
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const currentTime = hours * 60 + minutes

    const times = [
      { name: 'fajr', time: todayPrayer.fajr },
      { name: 'sunrise', time: todayPrayer.sunrise },
      { name: 'dhuhr', time: todayPrayer.dhuhr },
      { name: 'asr', time: todayPrayer.asr },
      { name: 'maghrib', time: todayPrayer.maghrib },
      { name: 'isha', time: todayPrayer.isha },
    ]

    for (let i = times.length - 1; i >= 0; i--) {
      const [h, m] = times[i].time.split(':').map(Number)
      const prayerMinutes = h * 60 + m
      if (currentTime >= prayerMinutes) {
        return times[i === times.length - 1 ? i : i + 1].name
      }
    }
    return 'fajr'
  }, [todayPrayer])

  // Prayer names
  const prayerNames: Record<string, string> = {
    fajr: 'Fajr', sunrise: 'Sunrise', dhuhr: 'Dhuhr', asr: 'Asr', maghrib: 'Maghrib', isha: 'Isha',
  }

  // Dua categories
  const duaCategories = [
    { id: 'all', label: 'All' }, { id: 'morning', label: 'Morning' }, { id: 'evening', label: 'Evening' },
    { id: 'eating', label: 'Eating' }, { id: 'sleeping', label: 'Sleeping' }, { id: 'travel', label: 'Travel' },
    { id: 'mosque', label: 'Mosque' }, { id: 'home', label: 'Home' }, { id: 'daily', label: 'Daily' },
  ]

  // Filter duas
  const filteredDuas = selectedDuaCategory === 'all' ? duas : duas.filter(d => d.category === selectedDuaCategory)

  // Handle AI chat with voice
  const handleAiChat = async (enableTTS = false) => {
    if (!questionText.trim()) return
    
    setAiLoading(true)
    setAiResponse('')
    setAiAudio(null)
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: questionText, enableTTS }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        setAiResponse(data.answer)
        if (data.audio) setAiAudio(data.audio)
        setShowAiChat(true)
      } else {
        setAiResponse('I apologize, but I could not process your question. Please try again.')
        setShowAiChat(true)
      }
    } catch {
      setAiResponse('Connection error. Please try again.')
      setShowAiChat(true)
    } finally {
      setAiLoading(false)
    }
  }

  // Voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []
      
      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data)
      }
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const reader = new FileReader()
        reader.onloadend = async () => {
          const base64 = reader.result as string
          const base64Data = base64.split(',')[1]
          
          setAiLoading(true)
          try {
            const response = await fetch('/api/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ audioBase64: base64Data, enableTTS: true }),
            })
            const data = await response.json()
            if (data.success) {
              setQuestionText(data.question)
              setAiResponse(data.answer)
              if (data.audio) setAiAudio(data.audio)
              setShowAiChat(true)
            }
          } catch {
            setAiResponse('Voice recognition failed. Please try typing.')
            setShowAiChat(true)
          } finally {
            setAiLoading(false)
          }
        }
        reader.readAsDataURL(audioBlob)
      }
      
      mediaRecorder.start()
      setIsRecording(true)
    } catch {
      alert('Microphone access denied. Please enable microphone permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  // Handle question submission to Imam
  const handleSubmitQuestion = async () => {
    if (!questionText.trim()) return
    try {
      await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: questionText }),
      })
      setQuestionText('')
      setQuestionSubmitted(true)
      setTimeout(() => setQuestionSubmitted(false), 3000)
    } catch (error) {
      console.error('Error submitting question:', error)
    }
  }

  // Handle booking submission
  const handleSubmitBooking = async () => {
    if (!bookingForm.purpose || !bookingForm.date) return
    try {
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingForm),
      })
      setBookingForm({ facility: 'main_hall', purpose: '', date: '', startTime: '', endTime: '', notes: '' })
      setBookingSubmitted(true)
      setTimeout(() => setBookingSubmitted(false), 3000)
    } catch (error) {
      console.error('Error submitting booking:', error)
    }
  }

  // Handle donation
  const handleDonation = (method: string) => {
    alert(`Donation of $${donationAmount || '0'} via ${method} would be processed.`)
  }

  // Handle member registration
  const handleMemberSubmit = async () => {
    if (!memberForm.firstName || !memberForm.lastName) return
    try {
      const response = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberForm),
      })
      const data = await response.json()
      if (data.success) {
        setCurrentMemberId(data.member.id)
        setMemberSubmitted(true)
        setTimeout(() => setMemberSubmitted(false), 3000)
      }
    } catch (error) {
      console.error('Error registering member:', error)
    }
  }

  // Handle Qurbani contribution
  const handleQurbaniSubmit = async () => {
    if (!qurbaniForm.animalId || !qurbaniForm.donorName) return
    const animal = qurbaniAnimals.find(a => a.id === qurbaniForm.animalId)
    if (!animal) return
    
    try {
      const amount = animal.price / animal.totalShares * qurbaniForm.shares
      await fetch('/api/qurbani', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...qurbaniForm, amount, type: 'contribution' }),
      })
      setQurbaniSubmitted(true)
      setQurbaniForm({ animalId: '', shares: 1, donorName: '', donorPhone: '' })
      setTimeout(() => setQurbaniSubmitted(false), 3000)
      // Refresh data
      const updated = await fetchData<{animals: QurbaniAnimal[]}>('qurbani', 'qurbani')
      setQurbaniAnimals(updated.animals || [])
    } catch (error) {
      console.error('Error submitting contribution:', error)
    }
  }

  // Handle panic button
  const handlePanic = async () => {
    if (!currentMemberId) {
      alert('Please register as a member first to use the panic button.')
      return
    }
    try {
      await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderId: currentMemberId, type: 'panic', message: 'Emergency assistance needed!' }),
      })
      setAlertSent(true)
      setTimeout(() => setAlertSent(false), 5000)
    } catch (error) {
      console.error('Error sending alert:', error)
    }
  }

  // Handle tribute submission
  const handleTributeSubmit = async () => {
    if (!tributeForm.name || !tributeForm.message) return
    try {
      await fetch('/api/tributes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tributeForm),
      })
      setTributeForm({ name: '', relationship: '', message: '' })
      setTributeSubmitted(true)
      setShowTributeModal(false)
      setTimeout(() => setTributeSubmitted(false), 3000)
    } catch (error) {
      console.error('Error submitting tribute:', error)
    }
  }

  // Handle Hifz progress update
  const handleHifzUpdate = async (surahId: string, status: string) => {
    if (!currentMemberId) return
    try {
      await fetch('/api/hifz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentMemberId, surahId, status }),
      })
    } catch (error) {
      console.error('Error updating hifz:', error)
    }
  }

  // Load comments for an announcement
  const loadComments = async (announcementId: string) => {
    setLoadingComments(announcementId)
    try {
      const response = await fetch(`/api/comments?announcementId=${announcementId}`)
      const data = await response.json()
      if (data.comments) {
        setAnnouncementComments(prev => ({
          ...prev,
          [announcementId]: data.comments
        }))
      }
    } catch (error) {
      console.error('Error loading comments:', error)
    } finally {
      setLoadingComments(null)
    }
  }

  // Submit comment to API
  const handleSubmitComment = async (announcementId: string) => {
    if (!commentForm.name || !commentForm.content) return
    playClickSound()
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          announcementId,
          name: commentForm.name,
          content: commentForm.content,
        }),
      })
      const data = await response.json()
      if (data.success) {
        setAnnouncementComments(prev => ({
          ...prev,
          [announcementId]: [data.comment, ...(prev[announcementId] || [])]
        }))
        setCommentForm({ name: '', content: '' })
        setCommentSubmitted(true)
        setTimeout(() => setCommentSubmitted(false), 2000)
      }
    } catch (error) {
      console.error('Error submitting comment:', error)
    }
  }

  // Load kids content
  const loadKidsContent = async () => {
    try {
      const response = await fetch('/api/kids')
      const data = await response.json()
      if (data.nasheeds) setKidsNasheeds(data.nasheeds)
      if (data.stories) setKidsStories(data.stories)
      if (data.games) setKidsGames(data.games)
      if (data.arabic) setKidsArabic(data.arabic)
    } catch (error) {
      console.error('Error loading kids content:', error)
    }
  }

  // Handle quiz answer
  const handleQuizAnswer = (answerIndex: number) => {
    if (!activeQuiz || selectedAnswer !== null) return
    setSelectedAnswer(answerIndex)
    const isCorrect = answerIndex === activeQuiz.questions[currentQuestion].correct
    if (isCorrect) {
      setQuizScore(prev => prev + 1)
    }
    setTimeout(() => {
      if (currentQuestion < activeQuiz.questions.length - 1) {
        setCurrentQuestion(prev => prev + 1)
        setSelectedAnswer(null)
      } else {
        setShowQuizResult(true)
      }
    }, 1000)
  }

  // Start new quiz
  const startQuiz = (quiz: any) => {
    setActiveQuiz(quiz)
    setCurrentQuestion(0)
    setQuizScore(0)
    setShowQuizResult(false)
    setSelectedAnswer(null)
  }

  // Qibla Compass - Device orientation handler
  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        // Alpha is the compass direction in degrees
        setCompassHeading(event.alpha)
        setCompassError(null)
      }
    }

    // Check if DeviceOrientationEvent is available
    if (window.DeviceOrientationEvent) {
      // On iOS 13+, we need to request permission
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        // iOS 13+ - need to request permission via button click
        setCompassSupported(true)
      } else {
        // Non-iOS or older iOS - add listener directly
        window.addEventListener('deviceorientation', handleOrientation)
        setCompassSupported(true)
      }
    } else {
      setCompassError('Compass not supported on this device')
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation)
    }
  }, [])

  // Request compass permission for iOS
  const requestCompassPermission = async () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission()
        if (permission === 'granted') {
          window.addEventListener('deviceorientation', (event: DeviceOrientationEvent) => {
            if (event.alpha !== null) {
              setCompassHeading(event.alpha)
            }
          })
          setCompassSupported(true)
          setCompassError(null)
        } else {
          setCompassError('Permission denied for compass')
        }
      } catch (error) {
        setCompassError('Error requesting compass permission')
      }
    }
  }

  // Calculate Qibla pointer rotation
  const getQiblaRotation = () => {
    if (compassHeading === null) return qiblaAngle
    // Rotate the pointer to show Qibla direction relative to current heading
    return qiblaAngle - compassHeading
  }

  // Load kids content when tab is selected
  useEffect(() => {
    if (learnSubTab === 'kids' && kidsNasheeds.length === 0) {
      loadKidsContent()
    }
  }, [learnSubTab])

  // Get current guide steps
  const currentSteps = learnSubTab === 'wudu' ? wuduSteps : salahSteps

  // Emergency announcements
  const emergencyAnnouncements = announcements.filter(a => a.category === 'emergency')

  // Group tajweed by category
  const tajweedGrouped = tajweedLessons.reduce((acc, l) => {
    if (!acc[l.category]) acc[l.category] = []
    acc[l.category].push(l)
    return acc
  }, {} as Record<string, TajweedLesson[]>)

  // Group Arabic content by category
  const arabicGrouped = arabicContent.reduce((acc, c) => {
    if (!acc[c.category]) acc[c.category] = []
    acc[c.category].push(c)
    return acc
  }, {} as Record<string, ArabicContent[]>)

  // Get location
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setMemberForm({
          ...memberForm,
          latitude: pos.coords.latitude.toString(),
          longitude: pos.coords.longitude.toString()
        })
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <MosqueIcon />
          <p className="mt-4 text-primary font-medium">Loading Masjid Hub...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background content-area">
      {/* Offline Banner */}
      {isOffline && (
        <div className="offline-banner">📴 You are offline. Some features may be limited.</div>
      )}

      {/* Header */}
      <header className="header">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MosqueIcon />
            <div>
              <h1 className="text-xl font-bold">{tr('home') === 'Home' ? 'Masjid Hub' : tr('home')}</h1>
              <p className="text-xs opacity-80">Zeenat-ul-Islam, Bulawayo</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-sm font-bold">{currentTime}</p>
              <p className="text-xs opacity-80">CAT (Bulawayo)</p>
            </div>
            <button 
              onClick={() => {
                playClickSound()
                setLanguageSelected(false)
              }}
              className="text-xs bg-white/20 px-2 py-1 rounded flex items-center gap-1"
            >
              {language === 'en' ? '🇬🇧' : language === 'sn' ? '🇿🇼' : '🇿🇼'}
              {language.toUpperCase()}
            </button>
            {isOffline && <span className="text-xs bg-red-500/80 px-2 py-1 rounded">Offline</span>}
          </div>
        </div>
      </header>

      {/* Language Selection Modal */}
      {!languageSelected && (
        <div className="language-modal-overlay" onClick={() => setLanguageSelected(true)}>
          <div className="language-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-primary mb-2">Select Language / Sarudza Mutauro / Khetha Ulimi</h2>
            <p className="text-sm text-gray-500 mb-4">Choose your preferred language</p>
            <div className="space-y-3">
              <button 
                onClick={() => { playClickSound(); setLanguage('en'); setLanguageSelected(true); }}
                className={`language-option ${language === 'en' ? 'active' : ''}`}
              >
                <span className="text-2xl">🇬🇧</span>
                <div>
                  <p className="font-bold">English</p>
                  <p className="text-xs text-gray-500">Continue in English</p>
                </div>
              </button>
              <button 
                onClick={() => { playClickSound(); setLanguage('sn'); setLanguageSelected(true); }}
                className={`language-option ${language === 'sn' ? 'active' : ''}`}
              >
                <span className="text-2xl">🇿🇼</span>
                <div>
                  <p className="font-bold">Shona</p>
                  <p className="text-xs text-gray-500">Enda mberi muShona</p>
                </div>
              </button>
              <button 
                onClick={() => { playClickSound(); setLanguage('nd'); setLanguageSelected(true); }}
                className={`language-option ${language === 'nd' ? 'active' : ''}`}
              >
                <span className="text-2xl">🇿🇼</span>
                <div>
                  <p className="font-bold">Ndebele</p>
                  <p className="text-xs text-gray-500">Qhubeka ngesiNdebele</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="p-4 pb-24">
        {/* HOME TAB */}
        {activeTab === 'home' && (
          <div className="space-y-4">
            {/* Emergency Banner */}
            {emergencyAnnouncements.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <h3 className="font-bold text-red-800">{emergencyAnnouncements[0].title}</h3>
                    <p className="text-sm text-red-700 mt-1">{emergencyAnnouncements[0].content}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Dedication Section - In Loving Memory of Hajji Dawood Cassim */}
            <div className="dedication-card">
              <div className="dedication-image-container">
                <img 
                  src="/images/hajji-dawood-cassim.jpg" 
                  alt="Hajji Dawood Cassim رحمة الله عليه"
                  className="dedication-image"
                />
                <div className="dedication-overlay" />
                <div className="dedication-badge">
                  <span>رحمة الله عليه</span>
                </div>
              </div>
              
              <div className="dedication-content">
                <div className="text-center mb-4">
                  <h2 className="dedication-title">In Loving Memory of</h2>
                  <h3 className="dedication-name">Hajji Dawood Cassim</h3>
                  <p className="dedication-arabic">رحمة الله عليه</p>
                  <p className="dedication-arabic-translation">(May Allah have mercy on him)</p>
                </div>

                {/* Quran Recitation Section */}
                <div className="dedication-quran-section">
                  <h4 className="text-sm font-bold text-primary mb-2 text-center">📖 Recite Quran for His Soul</h4>
                  <div className="flex gap-2 justify-center flex-wrap">
                    {dedicationSurahs.map((surah) => (
                      <button
                        key={surah.name}
                        onClick={() => { playClickSound(); playDedicationSurah(surah.url, surah.name); }}
                        className={`quran-play-btn ${currentSurah === surah.name && dedicationAudioPlaying ? 'playing' : ''}`}
                      >
                        {currentSurah === surah.name && dedicationAudioPlaying ? '⏸️' : '▶️'} {surah.name}
                        <span className="block text-xs arabic-text">{surah.nameAr}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="dedication-dua">
                  <p className="dedication-bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
                  
                  <div className="dedication-arabic-dua">
                    <p>يَا رَبِّ ارْحَمْ عَبْدَكَ دَاوُودَ</p>
                    <p>وَأَنْزِلْ عَلَى قَبْرِهِ نُورًا وَسُكُونًا</p>
                    <p>وَاجْعَلْ قَبْرَهُ رَوْضَةً مِنْ رِيَاضِ الْجَنَّةِ</p>
                    <p>وَاَكْرِمْ نُزُلَهُ وَوَسِّعْ مُدْخَلَهُ</p>
                  </div>

                  <div className="dedication-translation">
                    <p>O Allah, have mercy upon Your servant Dawood</p>
                    <p>And descend upon his grave light and tranquility</p>
                    <p>Make his grave a garden from the gardens of Paradise</p>
                    <p>And honor his resting place and widen his entrance</p>
                  </div>

                  <div className="dedication-divider" />

                  <div className="dedication-arabic-dua">
                    <p>اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَعَافِهِ وَاعْفُ عَنْهُ</p>
                    <p>وَأَكْرِمْ نُزُلَهُ وَوَسِّعْ مُدْخَلَهُ</p>
                    <p>وَاغْسِلْهُ بِالْمَاءِ وَالثَّلْجِ وَالْبَرَدِ</p>
                    <p>وَنَقِّهِ مِنَ الذُّنُوبِ وَالْخَطَايَا كَمَا نَقَّيْتَ الثَّوْبَ الْأَبْيَضَ مِنَ الدَّنَسِ</p>
                  </div>

                  <div className="dedication-translation">
                    <p>O Allah, forgive him, have mercy upon him, give him peace, and pardon him</p>
                    <p>Honor his resting place, widen his entrance</p>
                    <p>Wash him with water, snow, and hail</p>
                    <p>Purify him from sins and mistakes as a white garment is purified from dirt</p>
                  </div>
                </div>

                <div className="dedication-tribute">
                  <p className="dedication-tribute-text">
                    Hajji Dawood Cassim was a pillar of our community - a man of unwavering faith, boundless generosity, and dedication to the House of Allah. His legacy lives on through every soul he touched, every prayer he led, and every heart he warmed with his kindness.
                  </p>
                  <p className="dedication-tribute-text mt-3">
                    This application is dedicated as a <strong>Sadaqah Jaariyah</strong> (continuous charity) in his blessed memory. May every prayer time reminder, every verse of Quran memorized, every act of worship facilitated through this app be a source of eternal reward for him and his family.
                  </p>
                  <div className="dedication-sadaqah">
                    <p className="dedication-arabic-small">اللَّهُمَّ اجْعَلْ هَذَا الْعَمَلَ صَدَقَةً جَارِيَةً لَهُ</p>
                    <p className="dedication-translation-small">O Allah, make this work a continuous charity for him</p>
                  </div>
                </div>

                <button 
                  onClick={() => { playClickSound(); setShowTributeModal(true); }}
                  className="dedication-cta"
                >
                  🤲 {tr('shareTribute')}
                </button>

                {tributeSubmitted && (
                  <div className="dedication-success">
                    ✅ {tr('tributeSubmitted')}
                  </div>
                )}
              </div>
            </div>

            {/* Daily Content - Hadith & Quran Verse */}
            {(dailyHadith || dailyVerse) && (
              <div className="daily-content-section">
                {dailyHadith && (
                  <div className="daily-content-card hadith">
                    <div className="daily-content-header">
                      <span className="daily-content-icon">📖</span>
                      <h3>{tr('hadithOfTheDay')}</h3>
                    </div>
                    <div className="daily-content-body">
                      <p className="daily-content-arabic">{dailyHadith.contentAr}</p>
                      <p className="daily-content-translation">
                        {language === 'en' ? dailyHadith.contentEn : 
                         language === 'sn' ? (dailyHadith.contentSn || dailyHadith.contentEn) :
                         (dailyHadith.contentNd || dailyHadith.contentEn)}
                      </p>
                      <p className="daily-content-source">{dailyHadith.source}</p>
                    </div>
                  </div>
                )}
                
                {dailyVerse && (
                  <div className="daily-content-card verse">
                    <div className="daily-content-header">
                      <span className="daily-content-icon">☪️</span>
                      <h3>{tr('quranVerseOfTheDay')}</h3>
                    </div>
                    <div className="daily-content-body">
                      <p className="daily-content-arabic">{dailyVerse.contentAr}</p>
                      <p className="daily-content-translation">
                        {language === 'en' ? dailyVerse.contentEn : 
                         language === 'sn' ? (dailyVerse.contentSn || dailyVerse.contentEn) :
                         (dailyVerse.contentNd || dailyVerse.contentEn)}
                      </p>
                      <p className="daily-content-source">{dailyVerse.source}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Today's Prayer Times */}
            <div className="card">
              <h2 className="text-lg font-bold text-primary mb-4">Today&apos;s Prayer Times</h2>
              {todayPrayer ? (
                <div className="grid grid-cols-3 gap-2">
                  {['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'].map((prayer) => (
                    <div key={prayer} className={`prayer-card ${getCurrentPrayer() === prayer ? 'highlight' : ''}`}>
                      <p className="text-xs opacity-80">{prayerNames[prayer]}</p>
                      <p className="text-xl font-bold">{todayPrayer[prayer as keyof typeof todayPrayer]}</p>
                    </div>
                  ))}
                </div>
              ) : <p className="text-gray-500">Prayer times unavailable</p>}
            </div>

            {/* Jumu'ah Countdown */}
            <div className="card bg-gradient-to-r from-primary to-emerald-700 text-white">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                🕌 Jumu'ah (Friday Prayer)
              </h3>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-white/20 rounded-lg p-2">
                  <p className="text-2xl font-bold">{jumuahCountdown?.days ?? 0}</p>
                  <p className="text-xs">Days</p>
                </div>
                <div className="bg-white/20 rounded-lg p-2">
                  <p className="text-2xl font-bold">{jumuahCountdown?.hours ?? 0}</p>
                  <p className="text-xs">Hours</p>
                </div>
                <div className="bg-white/20 rounded-lg p-2">
                  <p className="text-2xl font-bold">{jumuahCountdown?.minutes ?? 0}</p>
                  <p className="text-xs">Minutes</p>
                </div>
                <div className="bg-white/20 rounded-lg p-2">
                  <p className="text-2xl font-bold">{jumuahCountdown?.isToday ? '🎉' : '⏳'}</p>
                  <p className="text-xs">{jumuahCountdown?.isToday ? 'Today!' : 'Until'}</p>
                </div>
              </div>
              <p className="text-sm mt-3 opacity-90">
                Khutbah: 12:45 PM | Prayer: 1:15 PM
              </p>
            </div>

            {/* Next Prayer Countdown & Alarm */}
            <div className="card border-2 border-primary">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-primary">⏰ Next Prayer</h3>
                <button 
                  onClick={requestNotificationPermission}
                  className={`text-xs px-3 py-1 rounded-full ${hasNotificationPermission ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
                >
                  {hasNotificationPermission ? '🔔 Notifications On' : 'Enable Notifications'}
                </button>
              </div>
              {nextPrayer && (
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">{nextPrayer.name}</p>
                  <p className="text-gray-500">{nextPrayer.time}</p>
                  <p className="text-xl text-accent font-medium mt-2">
                    {nextPrayer.remaining}
                  </p>
                </div>
              )}
              <div className="flex gap-2 mt-4">
                <button 
                  onClick={playAdhan}
                  disabled={isPlaying}
                  className="flex-1 py-2 bg-primary text-white rounded-lg font-medium disabled:opacity-50"
                >
                  🔊 {isPlaying ? 'Playing...' : 'Play Adhan'}
                </button>
                {isPlaying && (
                  <button 
                    onClick={stopAdhan}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg"
                  >
                    Stop
                  </button>
                )}
              </div>
            </div>

            {/* GPS Directions to Masjid */}
            <div className="card">
              <h3 className="font-bold text-primary mb-3">📍 Directions to Masjid</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Zeenat-ul-Islam Masjid</p>
                  <p className="text-sm text-gray-500">Bulawayo, Zimbabwe</p>
                  {userLocation && (
                    <p className="text-xs text-accent mt-1">
                      {getDistanceToMasjid(userLocation.lat, userLocation.lng)} km away
                    </p>
                  )}
                </div>
                <button
                  onClick={handleGetDirections}
                  className="bg-primary text-white px-4 py-3 rounded-xl font-medium flex items-center gap-2"
                >
                  🧭 Get Directions
                </button>
              </div>
              {!userLocation && (
                <button
                  onClick={getCurrentLocation}
                  className="w-full mt-3 py-2 border border-primary text-primary rounded-lg text-sm"
                >
                  📍 Detect My Location
                </button>
              )}
            </div>

            {/* Live Stream Banner */}
            {liveStreams.find(s => s.isLive) && (
              <div className="card bg-gradient-to-r from-red-500 to-red-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      🔴 LIVE NOW
                    </h3>
                    <p className="text-sm opacity-90">{liveStreams.find(s => s.isLive)?.title}</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('community')}
                    className="bg-white text-red-600 px-4 py-2 rounded-lg font-bold"
                  >
                    Watch
                  </button>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { setActiveTab('learn'); setLearnSubTab('hifz') }}
                className="card bg-emerald-50 hover:bg-emerald-100 text-center py-4"
              >
                <span className="text-2xl block mb-1">📖</span>
                <span className="text-sm font-medium">Hifz Tracker</span>
              </button>
              <button
                onClick={() => { setActiveTab('learn'); setLearnSubTab('tajweed') }}
                className="card bg-purple-50 hover:bg-purple-100 text-center py-4"
              >
                <span className="text-2xl block mb-1">🎙️</span>
                <span className="text-sm font-medium">Tajweed</span>
              </button>
              <button
                onClick={() => { setActiveTab('learn'); setLearnSubTab('arabic') }}
                className="card bg-blue-50 hover:bg-blue-100 text-center py-4"
              >
                <span className="text-2xl block mb-1">🔤</span>
                <span className="text-sm font-medium">Learn Arabic</span>
              </button>
              <button
                onClick={() => { setActiveTab('community'); setCommunitySubTab('qurbani') }}
                className="card bg-orange-50 hover:bg-orange-100 text-center py-4"
              >
                <span className="text-2xl block mb-1">🐑</span>
                <span className="text-sm font-medium">Qurbani</span>
              </button>
            </div>

            {/* Quick Donate */}
            <div className="card bg-gradient-to-r from-primary to-emerald-700 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">Support Your Masjid</h3>
                  <p className="text-sm opacity-80">Donations for operations & charity</p>
                </div>
                <button onClick={() => setActiveTab('more')} className="btn-accent">Donate</button>
              </div>
            </div>

            {/* Latest Announcements */}
            <div className="card">
              <h3 className="font-bold text-primary mb-3">📢 Latest Announcements</h3>
              {announcements.slice(0, 3).map((ann) => (
                <div key={ann.id} className="border-l-4 border-primary pl-3 py-2 mb-2 last:mb-0">
                  <p className="font-medium">{ann.title}</p>
                  <p className="text-sm text-gray-600 line-clamp-2">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PRAYER TAB */}
        {activeTab === 'prayer' && (
          <div className="space-y-4">
            <div className="card">
              <h2 className="text-lg font-bold text-primary mb-4">📅 Monthly Prayer Timetable</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-primary text-white">
                      <th className="p-2 text-left rounded-tl-lg">Date</th>
                      {['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((h) => (
                        <th key={h} className="p-2">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {prayerTimes.slice(0, 10).map((pt, idx) => {
                      const date = new Date(pt.date)
                      const isToday = date.toDateString() === new Date().toDateString()
                      return (
                        <tr key={pt.id} className={`${isToday ? 'bg-emerald-100 font-bold' : idx % 2 === 0 ? 'bg-gray-50' : ''}`}>
                          <td className="p-2 border-b">
                            {date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' })}
                            {isToday && <span className="ml-1 text-xs text-primary">(Today)</span>}
                          </td>
                          <td className="p-2 border-b text-center">{pt.fajr}</td>
                          <td className="p-2 border-b text-center">{pt.sunrise}</td>
                          <td className="p-2 border-b text-center">{pt.dhuhr}</td>
                          <td className="p-2 border-b text-center">{pt.asr}</td>
                          <td className="p-2 border-b text-center">{pt.maghrib}</td>
                          <td className="p-2 border-b text-center">{pt.isha}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Qibla Direction */}
            <div className="card">
              <h3 className="font-bold text-primary mb-2">🧭 Qibla Direction</h3>
              
              {/* Compass Container */}
              <div className="flex flex-col items-center py-6">
                {/* Visual Compass */}
                <div 
                  className="w-48 h-48 rounded-full border-4 border-primary relative"
                  style={{ 
                    background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                    transform: compassHeading !== null ? `rotate(${-compassHeading}deg)` : 'none',
                    transition: 'transform 0.1s ease-out'
                  }}
                >
                  {/* Cardinal Directions */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 text-sm font-bold text-primary">N</div>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-sm font-bold text-gray-400">S</div>
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">W</div>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">E</div>
                  
                  {/* Center point */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full" />
                  
                  {/* Tick marks */}
                  {[...Array(12)].map((_, i) => (
                    <div 
                      key={i}
                      className="absolute top-0 left-1/2 w-0.5 h-2 bg-gray-300 origin-bottom"
                      style={{ transform: `translateX(-50%) rotate(${i * 30}deg)`, top: '8px' }}
                    />
                  ))}
                </div>
                
                {/* Qibla Pointer - Fixed pointing to Qibla */}
                <div 
                  className="absolute mt-6"
                  style={{ 
                    transform: `rotate(${getQiblaRotation()}deg)`,
                    transition: 'transform 0.3s ease-out'
                  }}
                >
                  <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-b-[80px] border-l-transparent border-r-transparent border-b-primary opacity-80" />
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 text-2xl">🕋</div>
                </div>
                
                {/* Current Heading Display */}
                {compassHeading !== null && (
                  <div className="mt-20 text-center">
                    <p className="text-2xl font-bold text-primary">{Math.round(compassHeading)}°</p>
                    <p className="text-sm text-gray-500">
                      {compassHeading >= 337.5 || compassHeading < 22.5 ? 'Facing North' :
                       compassHeading >= 22.5 && compassHeading < 67.5 ? 'Facing North-East' :
                       compassHeading >= 67.5 && compassHeading < 112.5 ? 'Facing East' :
                       compassHeading >= 112.5 && compassHeading < 157.5 ? 'Facing South-East' :
                       compassHeading >= 157.5 && compassHeading < 202.5 ? 'Facing South' :
                       compassHeading >= 202.5 && compassHeading < 247.5 ? 'Facing South-West' :
                       compassHeading >= 247.5 && compassHeading < 292.5 ? 'Facing West' :
                       'Facing North-West'}
                    </p>
                  </div>
                )}
                
                {/* Error / Permission Message */}
                {compassError && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                    <p className="text-sm text-yellow-700">{compassError}</p>
                  </div>
                )}
                
                {/* iOS Permission Button */}
                {compassSupported && compassHeading === null && !compassError && (
                  <button
                    onClick={requestCompassPermission}
                    className="btn-primary mt-4"
                  >
                    🧭 Enable Compass
                  </button>
                )}
                
                {!compassSupported && !compassError && (
                  <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg text-center">
                    <p className="text-sm text-gray-600">
                      Rotate your device to find Qibla direction
                    </p>
                  </div>
                )}
              </div>
              
              <div className="text-center pt-4 border-t mt-4">
                <p className="text-sm text-gray-600">
                  From Bulawayo, face approximately <strong className="text-primary">20° North-East</strong>
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Qibla direction from Bulawayo, Zimbabwe to Makkah, Saudi Arabia
                </p>
              </div>
            </div>
          </div>
        )}

        {/* LEARN TAB */}
        {activeTab === 'learn' && (
          <div className="space-y-4">
            {/* Sub-tabs */}
            <div className="tab-pills flex-wrap">
              {[
                { id: 'wudu', label: '💧 Wudu' },
                { id: 'salah', label: '🕌 Salah' },
                { id: 'duas', label: '📿 Duas' },
                { id: 'hifz', label: '📖 Hifz' },
                { id: 'tajweed', label: '🎙️ Tajweed' },
                { id: 'arabic', label: '🔤 Arabic' },
                { id: 'kids', label: '🎨 Kids' },
                { id: 'janaza', label: '🤲 Janaza' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { setLearnSubTab(tab.id as typeof learnSubTab); setCurrentGuideStep(0) }}
                  className={`tab-pill ${learnSubTab === tab.id ? 'active' : ''}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Guide Carousel */}
            {(learnSubTab === 'wudu' || learnSubTab === 'salah') && (
              <div className="space-y-4">
                {/* Header with progress */}
                <div className="card bg-gradient-to-r from-primary to-emerald-700 text-white">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg">
                      {learnSubTab === 'wudu' ? '💧 Wudu Guide' : '🕌 Salah Guide'}
                    </h3>
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                      Step {currentGuideStep + 1} of {currentSteps.length}
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-3 w-full bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-white h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentGuideStep + 1) / currentSteps.length) * 100}%` }}
                    />
                  </div>
                </div>

                {currentSteps.length > 0 ? (
                  <>
                    {/* Step Card */}
                    <div className="card border-2 border-primary/20 shadow-lg">
                      {/* Step Number Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold shadow-md">
                            {currentSteps[currentGuideStep]?.stepNumber}
                          </div>
                          <h3 className="text-xl font-bold text-primary">
                            {currentSteps[currentGuideStep]?.title}
                          </h3>
                        </div>
                      </div>

                      {/* Arabic Text */}
                      {currentSteps[currentGuideStep]?.arabicText && (
                        <div className="bg-gradient-to-r from-primary/5 to-emerald-50 rounded-xl p-6 mb-4 text-center border border-primary/10">
                          <p className="arabic-text text-3xl md:text-4xl leading-relaxed" dir="rtl">
                            {currentSteps[currentGuideStep]?.arabicText}
                          </p>
                          
                          {/* Audio Play Button */}
                          <button
                            onClick={() => {
                              playClickSound()
                              speakArabicText(currentSteps[currentGuideStep]?.arabicText || '', currentSteps[currentGuideStep]?.id || '')
                            }}
                            className={`mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                              guideAudioPlaying === currentSteps[currentGuideStep]?.id 
                                ? 'bg-red-500 text-white' 
                                : 'bg-primary text-white hover:bg-primary/90'
                            }`}
                          >
                            {guideAudioPlaying === currentSteps[currentGuideStep]?.id ? (
                              <>
                                <span className="text-lg">⏹️</span>
                                Stop Audio
                              </>
                            ) : (
                              <>
                                <span className="text-lg">🔊</span>
                                Play Audio
                              </>
                            )}
                          </button>
                        </div>
                      )}

                      {/* Transliteration */}
                      {currentSteps[currentGuideStep]?.transliteration && (
                        <div className="mb-3 px-2">
                          <p className="text-sm text-gray-500 mb-1">Transliteration:</p>
                          <p className="transliteration text-lg md:text-xl italic text-gray-700">
                            {currentSteps[currentGuideStep]?.transliteration}
                          </p>
                        </div>
                      )}

                      {/* Translation */}
                      {currentSteps[currentGuideStep]?.translation && (
                        <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-primary">
                          <p className="text-sm text-gray-500 mb-1">Translation:</p>
                          <p className="text-gray-700 leading-relaxed">
                            {currentSteps[currentGuideStep]?.translation}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Navigation Dots */}
                    <div className="flex justify-center gap-2 flex-wrap py-2">
                      {currentSteps.map((step, idx) => (
                        <button 
                          key={step.id}
                          onClick={() => setCurrentGuideStep(idx)} 
                          className={`w-8 h-8 rounded-full text-xs font-medium transition-all ${
                            idx === currentGuideStep 
                              ? 'bg-primary text-white scale-110 shadow-md' 
                              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                          }`}
                        >
                          {idx + 1}
                        </button>
                      ))}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center gap-4 px-2">
                      <button 
                        onClick={() => { playClickSound(); setCurrentGuideStep(Math.max(0, currentGuideStep - 1)) }} 
                        disabled={currentGuideStep === 0} 
                        className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                      >
                        ← Previous
                      </button>
                      <button 
                        onClick={() => { playClickSound(); setCurrentGuideStep(Math.min(currentSteps.length - 1, currentGuideStep + 1)) }} 
                        disabled={currentGuideStep === currentSteps.length - 1} 
                        className="flex-1 py-3 px-4 bg-primary text-white rounded-xl font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                      >
                        Next →
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="card text-center py-8">
                    <p className="text-gray-500">Loading guide steps...</p>
                  </div>
                )}
              </div>
            )}

            {/* Hifz Tracker */}
            {learnSubTab === 'hifz' && (
              <div className="space-y-4">
                <div className="card bg-gradient-to-r from-emerald-50 to-emerald-100 border-2 border-emerald-200">
                  <h3 className="font-bold text-primary text-xl mb-4">📖 Hifz Progress Tracker</h3>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-white rounded-lg p-3 text-center">
                      <p className="text-3xl font-bold text-emerald-600">{surahs.filter(s => s.hifzProgress?.[0]?.status === 'memorized').length}</p>
                      <p className="text-xs text-gray-500">Memorized</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <p className="text-3xl font-bold text-blue-600">{surahs.filter(s => s.hifzProgress?.[0]?.status === 'memorizing').length}</p>
                      <p className="text-xs text-gray-500">In Progress</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <p className="text-3xl font-bold text-orange-600">{surahs.filter(s => s.hifzProgress?.[0]?.status === 'needs_revision').length}</p>
                      <p className="text-xs text-gray-500">Needs Revision</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <p className="text-3xl font-bold text-gray-400">{114 - surahs.filter(s => s.hifzProgress?.[0]?.status).length}</p>
                      <p className="text-xs text-gray-500">Not Started</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                    <div className="bg-emerald-500 h-4 rounded-full" style={{ width: `${(surahs.filter(s => s.hifzProgress?.[0]?.status === 'memorized').length / 114) * 100}%` }}></div>
                  </div>
                  <p className="text-xs text-center text-gray-500">{surahs.filter(s => s.hifzProgress?.[0]?.status === 'memorized').length} of 114 surahs memorized</p>
                </div>

                <div className="card">
                  <h4 className="font-bold text-primary mb-3">Juz Amma (Juz 30)</h4>
                  <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                    {surahs.filter(s => s.juz === 30).map((surah) => (
                      <div key={surah.id} className="border rounded-lg p-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">{surah.number}</span>
                          <div>
                            <p className="text-sm font-medium">{surah.englishName}</p>
                            <p className="text-xs text-gray-500 arabic-text">{surah.arabicName}</p>
                          </div>
                        </div>
                        <select 
                          className="text-xs border rounded px-1 py-0.5"
                          onChange={(e) => handleHifzUpdate(surah.id, e.target.value)}
                        >
                          <option value="">Set Status</option>
                          <option value="memorizing">📖 Learning</option>
                          <option value="memorized">✅ Done</option>
                          <option value="needs_revision">🔄 Revision</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card">
                  <h4 className="font-bold text-primary mb-3">All Surahs</h4>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {surahs.slice(0, 20).map((surah) => (
                      <div key={surah.id} className="border rounded-lg p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center">{surah.number}</span>
                          <div>
                            <p className="font-medium">{surah.englishName}</p>
                            <p className="text-sm arabic-text">{surah.arabicName} • {surah.ayahs} ayahs • Juz {surah.juz}</p>
                          </div>
                        </div>
                        <select 
                          className="text-xs border rounded px-2 py-1"
                          onChange={(e) => handleHifzUpdate(surah.id, e.target.value)}
                        >
                          <option value="">Status</option>
                          <option value="memorizing">Learning</option>
                          <option value="memorized">Memorized</option>
                          <option value="needs_revision">Revision</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tajweed Lessons */}
            {learnSubTab === 'tajweed' && (
              <div className="space-y-4">
                <div className="card bg-gradient-to-r from-purple-50 to-purple-100 border-2 border-purple-200">
                  <h3 className="font-bold text-primary text-xl">🎙️ Tajweed Lessons</h3>
                  <p className="text-sm text-gray-600 mt-1">Master the art of Quran recitation</p>
                </div>

                {Object.entries(tajweedGrouped).map(([category, lessons]) => (
                  <div key={category} className="card">
                    <h4 className="font-bold text-primary mb-3 flex items-center gap-2">
                      {category === 'makharij' && '🗣️ Makharij (Pronunciation Points)'}
                      {category === 'sifaat' && '✨ Sifaat (Letter Attributes)'}
                      {category === 'nun_sakinah' && 'ن Nun Sakinah Rules'}
                      {category === 'meem_sakinah' && 'م Meem Sakinah Rules'}
                      {category === 'madd' && 'ٓ Madd (Prolongation)'}
                      {category === 'waqf' && '⏸️ Waqf (Stopping Rules)'}
                    </h4>
                    <div className="space-y-2">
                      {lessons.map((lesson) => (
                        <div key={lesson.id} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{lesson.title}</p>
                              {lesson.arabicTitle && <p className="text-sm arabic-text">{lesson.arabicTitle}</p>}
                            </div>
                            <button className="text-primary text-sm">View →</button>
                          </div>
                          <p className="text-xs text-gray-500 mt-2 line-clamp-2">{lesson.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Arabic Learning */}
            {learnSubTab === 'arabic' && (
              <div className="space-y-4">
                <div className="card bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200">
                  <h3 className="font-bold text-primary text-xl">🔤 Learn Arabic</h3>
                  <p className="text-sm text-gray-600 mt-1">Master the Arabic language</p>
                </div>

                {/* Alphabet */}
                {arabicGrouped.alphabet && (
                  <div className="card">
                    <h4 className="font-bold text-primary mb-3">Arabic Alphabet</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {arabicGrouped.alphabet.map((letter) => (
                        <div key={letter.id} className="border rounded-lg p-2 text-center bg-white hover:bg-blue-50 cursor-pointer">
                          <p className="text-3xl arabic-text">{letter.arabicText}</p>
                          <p className="text-xs text-gray-500">{letter.transliteration}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Vocabulary */}
                {arabicGrouped.vocabulary && (
                  <div className="card">
                    <h4 className="font-bold text-primary mb-3">Common Vocabulary</h4>
                    <div className="space-y-2">
                      {arabicGrouped.vocabulary.map((word) => (
                        <div key={word.id} className="border rounded-lg p-3 flex items-center justify-between">
                          <div>
                            <p className="text-xl arabic-text">{word.arabicText}</p>
                            <p className="text-sm text-gray-500">{word.transliteration}</p>
                          </div>
                          <p className="text-sm">{word.translation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Phrases */}
                {arabicGrouped.phrases && (
                  <div className="card">
                    <h4 className="font-bold text-primary mb-3">Common Phrases</h4>
                    <div className="space-y-2">
                      {arabicGrouped.phrases.map((phrase) => (
                        <div key={phrase.id} className="border rounded-lg p-3">
                          <p className="text-xl arabic-text text-right">{phrase.arabicText}</p>
                          <p className="text-sm text-gray-500">{phrase.transliteration}</p>
                          <p className="text-sm mt-1">{phrase.translation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Duas */}
            {learnSubTab === 'duas' && (
              <div>
                <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
                  {duaCategories.map((cat) => (
                    <button key={cat.id} onClick={() => setSelectedDuaCategory(cat.id)} className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${selectedDuaCategory === cat.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}>
                      {cat.label}
                    </button>
                  ))}
                </div>
                <div className="space-y-3">
                  {filteredDuas.map((dua) => (
                    <div key={dua.id} className="dua-card">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-primary">{dua.title}</h4>
                        <button className="audio-btn"><PlayIcon /></button>
                      </div>
                      <p className="arabic-text text-xl mb-2">{dua.arabicText}</p>
                      <p className="transliteration text-sm">{dua.transliteration}</p>
                      <p className="text-gray-600 text-sm mt-2">{dua.translation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Kids Section */}
            {learnSubTab === 'kids' && (
              <div className="space-y-4">
                {/* Header */}
                <div className="card bg-gradient-to-r from-pink-50 to-yellow-50 border-2 border-yellow-200">
                  <div className="text-center py-4">
                    <span className="text-6xl">🌈</span>
                    <h3 className="font-bold text-primary mt-2 text-xl">Assalamu Alaikum!</h3>
                    <p className="text-sm text-gray-600 mt-1">Welcome to Kids Corner!</p>
                  </div>
                </div>

                {/* Kids Menu */}
                {kidsSubTab === 'menu' && (
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => { playClickSound(); setKidsSubTab('nasheeds') }}
                      className="card bg-blue-50 hover:bg-blue-100 text-center py-6 transition-all hover:scale-105"
                    >
                      <span className="text-3xl block mb-2">🎵</span>
                      <span className="font-medium">Nasheeds</span>
                      <p className="text-xs text-gray-500 mt-1">Islamic songs</p>
                    </button>
                    <button 
                      onClick={() => { playClickSound(); setKidsSubTab('stories') }}
                      className="card bg-green-50 hover:bg-green-100 text-center py-6 transition-all hover:scale-105"
                    >
                      <span className="text-3xl block mb-2">📖</span>
                      <span className="font-medium">Sahaba Stories</span>
                      <p className="text-xs text-gray-500 mt-1">Amazing stories</p>
                    </button>
                    <button 
                      onClick={() => { playClickSound(); setKidsSubTab('games') }}
                      className="card bg-purple-50 hover:bg-purple-100 text-center py-6 transition-all hover:scale-105"
                    >
                      <span className="text-3xl block mb-2">🎮</span>
                      <span className="font-medium">Islamic Games</span>
                      <p className="text-xs text-gray-500 mt-1">Fun quizzes</p>
                    </button>
                    <button 
                      onClick={() => { playClickSound(); setKidsSubTab('arabic') }}
                      className="card bg-orange-50 hover:bg-orange-100 text-center py-6 transition-all hover:scale-105"
                    >
                      <span className="text-3xl block mb-2">🔤</span>
                      <span className="font-medium">Learn Arabic</span>
                      <p className="text-xs text-gray-500 mt-1">ABC in Arabic</p>
                    </button>
                  </div>
                )}

                {/* Nasheeds */}
                {kidsSubTab === 'nasheeds' && (
                  <div className="space-y-4">
                    <button 
                      onClick={() => setKidsSubTab('menu')}
                      className="flex items-center gap-2 text-primary font-medium"
                    >
                      ← Back to Kids Menu
                    </button>
                    <div className="card bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200">
                      <h4 className="font-bold text-primary text-lg flex items-center gap-2">
                        🎵 Islamic Nasheeds
                      </h4>
                      <p className="text-sm text-gray-600">Beautiful songs for kids</p>
                    </div>
                    <div className="space-y-3">
                      {kidsNasheeds.map((nasheed) => (
                        <div key={nasheed.id} className="card border-2 border-blue-100">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-3xl">🎤</span>
                            <div>
                              <h5 className="font-bold text-primary">{nasheed.title}</h5>
                              <p className="text-sm arabic-text">{nasheed.titleAr}</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{nasheed.description}</p>
                          <div className="aspect-video rounded-lg overflow-hidden bg-black">
                            <iframe
                              src={nasheed.videoUrl}
                              title={nasheed.title}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="w-full h-full"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sahaba Stories */}
                {kidsSubTab === 'stories' && (
                  <div className="space-y-4">
                    <button 
                      onClick={() => { setSelectedStory(null); setKidsSubTab('menu') }}
                      className="flex items-center gap-2 text-primary font-medium"
                    >
                      ← Back to Kids Menu
                    </button>
                    <div className="card bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200">
                      <h4 className="font-bold text-primary text-lg flex items-center gap-2">
                        📖 Sahaba Stories
                      </h4>
                      <p className="text-sm text-gray-600">Learn from our heroes</p>
                    </div>
                    
                    {!selectedStory ? (
                      <div className="grid grid-cols-2 gap-3">
                        {kidsStories.map((story) => (
                          <button
                            key={story.id}
                            onClick={() => { playClickSound(); setSelectedStory(story) }}
                            className="card bg-white border-2 border-green-100 hover:border-green-300 text-center py-4 transition-all hover:scale-105"
                          >
                            <span className="text-3xl block mb-2">📚</span>
                            <p className="font-medium text-sm">{story.title}</p>
                            <p className="text-xs text-gray-500 arabic-text">{story.titleAr}</p>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="card">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-4xl">📖</span>
                          <div>
                            <h5 className="font-bold text-lg text-primary">{selectedStory.title}</h5>
                            <p className="arabic-text">{selectedStory.titleAr}</p>
                            <p className="text-sm text-gray-500">{selectedStory.description}</p>
                          </div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4 text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                          {selectedStory.content}
                        </div>
                        <button
                          onClick={() => setSelectedStory(null)}
                          className="btn-outline w-full mt-4"
                        >
                          Read Another Story
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Islamic Games */}
                {kidsSubTab === 'games' && (
                  <div className="space-y-4">
                    <button 
                      onClick={() => { setActiveQuiz(null); setShowQuizResult(false); setKidsSubTab('menu') }}
                      className="flex items-center gap-2 text-primary font-medium"
                    >
                      ← Back to Kids Menu
                    </button>
                    <div className="card bg-gradient-to-r from-purple-50 to-purple-100 border-2 border-purple-200">
                      <h4 className="font-bold text-primary text-lg flex items-center gap-2">
                        🎮 Islamic Quizzes
                      </h4>
                      <p className="text-sm text-gray-600">Test your knowledge!</p>
                    </div>

                    {!activeQuiz ? (
                      <div className="space-y-3">
                        {kidsGames.map((game) => (
                          <button
                            key={game.id}
                            onClick={() => { playClickSound(); startQuiz(game) }}
                            className="card bg-white border-2 border-purple-100 hover:border-purple-300 text-left p-4 transition-all hover:scale-[1.02] w-full"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-3xl">🎯</span>
                              <div>
                                <h5 className="font-bold text-primary">{game.title}</h5>
                                <p className="text-sm text-gray-500">{game.description}</p>
                                <p className="text-xs text-purple-600 mt-1">{game.questions.length} questions</p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="card">
                        {showQuizResult ? (
                          <div className="text-center py-6">
                            <span className="text-6xl block mb-4">
                              {quizScore === activeQuiz.questions.length ? '🏆' : quizScore >= activeQuiz.questions.length / 2 ? '⭐' : '💪'}
                            </span>
                            <h4 className="text-2xl font-bold text-primary mb-2">
                              {quizScore === activeQuiz.questions.length ? 'Perfect!' : quizScore >= activeQuiz.questions.length / 2 ? 'Great Job!' : 'Keep Learning!'}
                            </h4>
                            <p className="text-xl text-gray-600">
                              You got {quizScore} out of {activeQuiz.questions.length} correct!
                            </p>
                            <button
                              onClick={() => { playClickSound(); startQuiz(activeQuiz) }}
                              className="btn-primary mt-6"
                            >
                              Try Again
                            </button>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-sm text-gray-500">
                                Question {currentQuestion + 1} of {activeQuiz.questions.length}
                              </span>
                              <span className="text-sm font-bold text-primary">
                                Score: {quizScore}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                              <div 
                                className="bg-purple-500 h-2 rounded-full transition-all"
                                style={{ width: `${((currentQuestion + 1) / activeQuiz.questions.length) * 100}%` }}
                              />
                            </div>
                            <h4 className="text-lg font-bold text-gray-800 mb-4">
                              {activeQuiz.questions[currentQuestion].question}
                            </h4>
                            <div className="space-y-2">
                              {activeQuiz.questions[currentQuestion].options.map((option: string, idx: number) => (
                                <button
                                  key={idx}
                                  onClick={() => handleQuizAnswer(idx)}
                                  disabled={selectedAnswer !== null}
                                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                                    selectedAnswer === null 
                                      ? 'border-gray-200 hover:border-purple-400 hover:bg-purple-50'
                                      : selectedAnswer === idx
                                        ? idx === activeQuiz.questions[currentQuestion].correct
                                          ? 'border-green-500 bg-green-50 text-green-700'
                                          : 'border-red-500 bg-red-50 text-red-700'
                                        : idx === activeQuiz.questions[currentQuestion].correct
                                          ? 'border-green-500 bg-green-50 text-green-700'
                                          : 'border-gray-200 text-gray-500'
                                  }`}
                                >
                                  <span className="font-medium">{String.fromCharCode(65 + idx)}.</span> {option}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Learn Arabic */}
                {kidsSubTab === 'arabic' && (
                  <div className="space-y-4">
                    <button 
                      onClick={() => setKidsSubTab('menu')}
                      className="flex items-center gap-2 text-primary font-medium"
                    >
                      ← Back to Kids Menu
                    </button>
                    <div className="card bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-200">
                      <h4 className="font-bold text-primary text-lg flex items-center gap-2">
                        🔤 Learn Arabic Letters
                      </h4>
                      <p className="text-sm text-gray-600">Learn the Arabic alphabet!</p>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {kidsArabic.map((letter) => (
                        <div 
                          key={letter.id}
                          className="card bg-white border-2 border-orange-100 text-center p-3 hover:border-orange-300 transition-all hover:scale-105 cursor-pointer"
                        >
                          <p className="text-4xl arabic-text text-primary">{letter.letter}</p>
                          <p className="text-xs font-medium text-gray-600 mt-1">{letter.letterName}</p>
                          <p className="text-sm arabic-text text-gray-500">{letter.word}</p>
                          <p className="text-xs text-gray-400">{letter.wordMeaning}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Janaza Guide */}
            {learnSubTab === 'janaza' && (
              <div className="space-y-4">
                <div className="card bg-gradient-to-r from-gray-100 to-gray-50 border-2 border-gray-300">
                  <div className="text-center py-4">
                    <span className="text-5xl">🤲</span>
                    <h3 className="font-bold text-primary mt-2 text-xl">Janaza Guide</h3>
                    <p className="text-sm text-gray-600 mt-1">What to do when a Muslim passes away</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { step: 1, title: 'When Death Occurs', icon: '🤲' },
                    { step: 2, title: 'Contact the Masjid', icon: '📞' },
                    { step: 3, title: 'Ghusl (Washing)', icon: '💧' },
                    { step: 4, title: 'Kafan (Shrouding)', icon: '👕' },
                    { step: 5, title: 'Salat al-Janaza', icon: '🕌' },
                    { step: 6, title: 'Burial', icon: '🪦' },
                    { step: 7, title: 'After Burial', icon: '🤲' },
                  ].map((item) => (
                    <div key={item.step} className="card flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">{item.step}</div>
                      <span className="font-medium">{item.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* COMMUNITY TAB */}
        {activeTab === 'community' && (
          <div className="space-y-4">
            {/* Sub-tabs */}
            <div className="tab-pills flex-wrap">
              {[
                { id: 'ask', label: '🤖 AI Chat' },
                { id: 'livestream', label: '🔴 Live' },
                { id: 'qurbani', label: '🐑 Qurbani' },
                { id: 'booking', label: '📅 Booking' },
                { id: 'announcements', label: '📢 News' },
              ].map((tab) => (
                <button key={tab.id} onClick={() => setCommunitySubTab(tab.id as typeof communitySubTab)} className={`tab-pill ${communitySubTab === tab.id ? 'active' : ''}`}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* AI Voice Chat */}
            {communitySubTab === 'ask' && (
              <div className="space-y-4">
                <div className="card">
                  <h3 className="font-bold text-primary mb-2">🤖 AI Islamic Assistant</h3>
                  <p className="text-xs text-gray-500 mb-3">Ask questions based on Shafi'i fiqh. Voice enabled!</p>
                  
                  <textarea className="form-textarea" placeholder="Ask any Islamic question..." value={questionText} onChange={(e) => setQuestionText(e.target.value)} rows={3} />
                  
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <button onClick={() => handleAiChat(true)} disabled={!questionText.trim() || aiLoading} className="btn-primary flex items-center justify-center gap-2 disabled:opacity-50">
                      {aiLoading ? '⏳ Thinking...' : '🤖 Ask & Listen'}
                    </button>
                    <button onClick={isRecording ? stopRecording : startRecording} className={`btn-outline flex items-center justify-center gap-2 ${isRecording ? 'bg-red-500 text-white border-red-500' : ''}`}>
                      <MicIcon /> {isRecording ? '🔴 Stop' : '🎙️ Speak'}
                    </button>
                  </div>
                  
                  <button onClick={handleSubmitQuestion} disabled={!questionText.trim()} className="btn-outline w-full mt-2 disabled:opacity-50">
                    📧 Send to Imam
                  </button>
                </div>
                
                {/* AI Response */}
                {showAiChat && aiResponse && (
                  <div className="card bg-primary/5 border border-primary/20">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">🕌</span>
                      <div>
                        <p className="font-bold text-primary">Islamic Guidance</p>
                        <p className="text-xs text-gray-500">Based on Shafi'i School</p>
                      </div>
                    </div>
                    <div className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">{aiResponse}</div>
                    {aiAudio && (
                      <audio controls className="w-full mt-3" src={`data:audio/mp3;base64,${aiAudio}`} />
                    )}
                  </div>
                )}
                
                {questionSubmitted && (
                  <div className="p-3 bg-green-50 text-green-700 rounded-lg text-center">✅ Your question has been submitted to the Imam!</div>
                )}
              </div>
            )}

            {/* Live Stream */}
            {communitySubTab === 'livestream' && (
              <div className="space-y-4">
                <div className="card bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200">
                  <h3 className="font-bold text-primary text-xl">🔴 Live Streaming</h3>
                  <p className="text-sm text-gray-600 mt-1">Watch prayers, lectures & events live</p>
                </div>

                {/* Live Stream Types */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'jumuah', label: '🕌 Jumu\'ah', desc: 'Friday Khutbah', icon: '🎤' },
                    { id: 'eid', label: '☪️ Eid Prayer', desc: 'Eid Khutbah', icon: '🌙' },
                    { id: 'bayaan', label: '📚 Bayaan', desc: 'Islamic Lecture', icon: '📖' },
                    { id: 'imam_live', label: '🏠 Imam Live', desc: 'From Imam\'s Home', icon: '📹' },
                  ].map((type) => (
                    <button key={type.id} className="card text-center hover:shadow-lg transition-all">
                      <span className="text-3xl">{type.icon}</span>
                      <p className="font-bold mt-2">{type.label}</p>
                      <p className="text-xs text-gray-500">{type.desc}</p>
                    </button>
                  ))}
                </div>

                {/* Live Now Section */}
                {liveStreams.find(s => s.isLive) ? (
                  <div className="card border-2 border-red-300">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                      <span className="font-bold text-red-600">LIVE NOW</span>
                    </div>
                    <h4 className="font-bold text-lg">{liveStreams.find(s => s.isLive)?.title}</h4>
                    <p className="text-sm text-gray-600">{liveStreams.find(s => s.isLive)?.description}</p>
                    
                    {/* Video Player Placeholder */}
                    <div className="bg-black rounded-lg aspect-video flex items-center justify-center mt-3">
                      <div className="text-white text-center">
                        <span className="text-5xl">▶️</span>
                        <p className="mt-2">Tap to watch live</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <button className="btn-primary flex-1 flex items-center justify-center gap-2">
                        <span>▶️</span> Watch Live
                      </button>
                      <button 
                        onClick={() => { playClickSound(); setShowRecordingModal(true); }}
                        className="btn-outline flex-1 flex items-center justify-center gap-2"
                      >
                        <span>💾</span> Save Recording
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="card text-center py-8">
                    <span className="text-5xl block mb-2">📺</span>
                    <p className="text-gray-500 font-medium">No live stream at the moment</p>
                    <p className="text-sm text-gray-400 mt-1">Check upcoming events below</p>
                  </div>
                )}

                {/* Upcoming Streams */}
                <div className="card">
                  <h4 className="font-bold text-primary mb-3">📅 Upcoming Events</h4>
                  <div className="space-y-3">
                    {liveStreams.filter(s => s.scheduledTime && new Date(s.scheduledTime) > new Date()).map((stream) => (
                      <div key={stream.id} className="border rounded-lg p-3 flex items-center justify-between">
                        <div>
                          <p className="font-medium">{stream.title}</p>
                          <p className="text-xs text-gray-500">{stream.event} • {new Date(stream.scheduledTime!).toLocaleString()}</p>
                        </div>
                        <button className="btn-outline text-sm">🔔 Remind Me</button>
                      </div>
                    ))}
                    {liveStreams.filter(s => s.scheduledTime && new Date(s.scheduledTime) > new Date()).length === 0 && (
                      <div className="text-center py-4">
                        <p className="text-gray-500 text-sm">No upcoming scheduled streams</p>
                        <p className="text-xs text-gray-400 mt-1">Check back later for Jumu'ah, Eid, and special events</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Saved Recordings */}
                <div className="card">
                  <h4 className="font-bold text-primary mb-3">📼 Saved Recordings</h4>
                  <div className="space-y-3">
                    {[
                      { title: 'Jumu\'ah Khutbah - March 7, 2026', duration: '45 min', type: 'Jumu\'ah' },
                      { title: 'Seerah Bayaan - Part 5', duration: '1hr 15min', type: 'Bayaan' },
                      { title: 'Eid al-Fitr Khutbah 2025', duration: '30 min', type: 'Eid' },
                    ].map((rec, idx) => (
                      <div key={idx} className="border rounded-lg p-3 flex items-center justify-between bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white">
                            ▶️
                          </div>
                          <div>
                            <p className="font-medium text-sm">{rec.title}</p>
                            <p className="text-xs text-gray-500">{rec.type} • {rec.duration}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => { playClickSound(); }} className="text-primary text-xl">▶️</button>
                          <button onClick={() => { playClickSound(); }} className="text-gray-500 text-xl">⬇️</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Go Live Button for Imam (Admin Only) */}
                <div className="card bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-primary">🎙️ Go Live (Imam Only)</h4>
                      <p className="text-sm text-gray-600">Start a live lecture from your home</p>
                    </div>
                    <button className="bg-red-500 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2">
                      🔴 Go Live
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Qurbani */}
            {communitySubTab === 'qurbani' && (
              <div className="space-y-4">
                <div className="card bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-200">
                  <h3 className="font-bold text-primary text-xl">🐑 Qurbani Contributions</h3>
                  <p className="text-sm text-gray-600 mt-1">Contribute to Qurbani for Eid al-Adha</p>
                </div>

                {/* Available Animals */}
                <div className="card">
                  <h4 className="font-bold text-primary mb-3">Available Animals</h4>
                  <div className="space-y-3">
                    {qurbaniAnimals.map((animal) => (
                      <div key={animal.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-medium flex items-center gap-2">
                              {animal.type === 'cow' && '🐄'}
                              {animal.type === 'sheep' && '🐑'}
                              {animal.type === 'goat' && '🐐'}
                              {animal.type === 'camel' && '🐪'}
                              {animal.name || `${animal.type.charAt(0).toUpperCase() + animal.type.slice(1)}`}
                            </p>
                            <p className="text-xs text-gray-500">${animal.price} total • {animal.totalShares} shares</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs ${animal.filledShares >= animal.totalShares ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                            {animal.filledShares}/{animal.totalShares} shares
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${(animal.filledShares / animal.totalShares) * 100}%` }}></div>
                        </div>
                        {animal.filledShares < animal.totalShares && (
                          <button onClick={() => setQurbaniForm({ ...qurbaniForm, animalId: animal.id })} className="btn-outline w-full mt-2 text-sm">
                            Contribute
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contribution Form */}
                {qurbaniForm.animalId && (
                  <div className="card">
                    <h4 className="font-bold text-primary mb-3">Make a Contribution</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Number of Shares</label>
                        <input type="number" min="1" max={qurbaniAnimals.find(a => a.id === qurbaniForm.animalId)?.totalShares || 1} value={qurbaniForm.shares} onChange={(e) => setQurbaniForm({ ...qurbaniForm, shares: parseInt(e.target.value) || 1 })} className="form-input w-full" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Your Name</label>
                        <input type="text" value={qurbaniForm.donorName} onChange={(e) => setQurbaniForm({ ...qurbaniForm, donorName: e.target.value })} className="form-input w-full" placeholder="Full name" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Phone Number</label>
                        <input type="tel" value={qurbaniForm.donorPhone} onChange={(e) => setQurbaniForm({ ...qurbaniForm, donorPhone: e.target.value })} className="form-input w-full" placeholder="+263..." />
                      </div>
                      <p className="text-sm text-gray-600">
                        Amount: ${(qurbaniAnimals.find(a => a.id === qurbaniForm.animalId)?.price || 0) / (qurbaniAnimals.find(a => a.id === qurbaniForm.animalId)?.totalShares || 1) * qurbaniForm.shares}
                      </p>
                      <button onClick={handleQurbaniSubmit} className="btn-primary w-full">Submit Contribution</button>
                    </div>
                  </div>
                )}

                {qurbaniSubmitted && (
                  <div className="p-3 bg-green-50 text-green-700 rounded-lg text-center">✅ Contribution submitted successfully!</div>
                )}
              </div>
            )}

            {/* Hall Booking */}
            {communitySubTab === 'booking' && (
              <div className="card">
                <h3 className="font-bold text-primary mb-4">📅 Book a Facility</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Facility</label>
                    <select className="form-select w-full" value={bookingForm.facility} onChange={(e) => setBookingForm({ ...bookingForm, facility: e.target.value })}>
                      <option value="main_hall">Main Hall</option>
                      <option value="classroom">Classroom</option>
                      <option value="kitchen">Kitchen</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Purpose</label>
                    <input type="text" className="form-input w-full" placeholder="e.g., Wedding reception" value={bookingForm.purpose} onChange={(e) => setBookingForm({ ...bookingForm, purpose: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <input type="date" className="form-input w-full" value={bookingForm.date} onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Start Time</label>
                      <input type="time" className="form-input w-full" value={bookingForm.startTime} onChange={(e) => setBookingForm({ ...bookingForm, startTime: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">End Time</label>
                      <input type="time" className="form-input w-full" value={bookingForm.endTime} onChange={(e) => setBookingForm({ ...bookingForm, endTime: e.target.value })} />
                    </div>
                  </div>
                  <button onClick={handleSubmitBooking} disabled={!bookingForm.purpose || !bookingForm.date} className="btn-primary w-full disabled:opacity-50">Submit Booking Request</button>
                </div>
                {bookingSubmitted && (
                  <div className="p-3 bg-green-50 text-green-700 rounded-lg text-center mt-4">✅ Booking request submitted!</div>
                )}
              </div>
            )}

            {/* Announcements */}
            {communitySubTab === 'announcements' && (
              <div className="space-y-4">
                <div className="card">
                  <h3 className="font-bold text-primary mb-4">📢 Announcements & News</h3>
                  <div className="space-y-4">
                    {announcements.map((ann) => (
                      <div key={ann.id} className="border rounded-xl overflow-hidden">
                        <div className="border-l-4 border-primary pl-3 py-3 bg-white">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-bold text-lg">{ann.title}</p>
                              <p className="text-sm text-gray-600 mt-1">{ann.content}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs text-gray-400">{new Date(ann.createdAt).toLocaleDateString()}</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs ${
                                  ann.category === 'emergency' ? 'bg-red-100 text-red-600' :
                                  ann.category === 'event' ? 'bg-blue-100 text-blue-600' :
                                  'bg-green-100 text-green-600'
                                }`}>{ann.category}</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Comment Section */}
                          <div className="mt-3 pt-3 border-t">
                            <button 
                              onClick={() => { 
                                playClickSound();
                                if (activeCommentAnnouncement !== ann.id) {
                                  loadComments(ann.id);
                                }
                                setActiveCommentAnnouncement(activeCommentAnnouncement === ann.id ? null : ann.id);
                              }}
                              className="text-sm text-primary font-medium flex items-center gap-1"
                            >
                              💬 Comments {(announcementComments[ann.id]?.length || 0) > 0 && `(${announcementComments[ann.id]?.length})`}
                            </button>
                            
                            {activeCommentAnnouncement === ann.id && (
                              <div className="mt-3 space-y-2">
                                {/* Loading indicator */}
                                {loadingComments === ann.id && (
                                  <div className="text-center py-4 text-gray-500 text-sm">
                                    Loading comments...
                                  </div>
                                )}
                                
                                {/* Existing Comments */}
                                {(announcementComments[ann.id] || []).map((comment) => (
                                  <div key={comment.id} className="bg-gray-50 rounded-lg p-2">
                                    <p className="text-xs font-medium text-primary">{comment.name}</p>
                                    <p className="text-sm">{comment.content}</p>
                                    <p className="text-xs text-gray-400 mt-1">{new Date(comment.createdAt).toLocaleString()}</p>
                                  </div>
                                ))}
                                
                                {/* No comments message */}
                                {(!announcementComments[ann.id] || announcementComments[ann.id].length === 0) && loadingComments !== ann.id && (
                                  <p className="text-sm text-gray-400 text-center py-2">No comments yet. Be the first to comment!</p>
                                )}
                                
                                {/* Add Comment Form */}
                                <div className="bg-blue-50 rounded-lg p-3">
                                  <input
                                    type="text"
                                    placeholder="Your name"
                                    className="form-input w-full text-sm mb-2"
                                    value={commentForm.name}
                                    onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
                                  />
                                  <textarea
                                    placeholder="Ask a question or add a comment..."
                                    className="form-textarea w-full text-sm"
                                    rows={2}
                                    value={commentForm.content}
                                    onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
                                  />
                                  <button
                                    onClick={() => handleSubmitComment(ann.id)}
                                    disabled={!commentForm.name || !commentForm.content}
                                    className="btn-primary w-full mt-2 text-sm disabled:opacity-50"
                                  >
                                    Post Comment
                                  </button>
                                  {commentSubmitted && (
                                    <p className="text-green-600 text-xs mt-1 text-center">✅ Comment posted!</p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {announcements.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <span className="text-4xl block mb-2">📢</span>
                        <p>No announcements yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MORE TAB */}
        {activeTab === 'more' && (
          <div className="space-y-4">
            {/* Sub-tabs */}
            <div className="tab-pills flex-wrap">
              {[
                { id: 'dedication', label: '🤲 Dedication' },
                { id: 'tributes', label: '💌 Tributes' },
                { id: 'photos', label: '📸 Photos' },
                { id: 'donate', label: '💰 Donate' },
                { id: 'member', label: '👤 Register' },
                { id: 'alerts', label: '🚨 Safety' },
                { id: 'about', label: 'ℹ️ About' },
              ].map((tab) => (
                <button key={tab.id} onClick={() => { playClickSound(); setMoreSubTab(tab.id as typeof moreSubTab); }} className={`tab-pill ${moreSubTab === tab.id ? 'active' : ''}`}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Dedication Tab */}
            {moreSubTab === 'dedication' && (
              <div className="dedication-card">
                <div className="dedication-image-container">
                  <img 
                    src="/images/hajji-dawood-cassim.jpg" 
                    alt="Hajji Dawood Cassim رحمة الله عليه"
                    className="dedication-image"
                  />
                  <div className="dedication-overlay" />
                </div>
                
                <div className="dedication-content">
                  <div className="text-center mb-4">
                    <h2 className="dedication-title">In Loving Memory of</h2>
                    <h3 className="dedication-name">Hajji Dawood Cassim</h3>
                    <p className="dedication-arabic">رحمة الله عليه</p>
                    <p className="dedication-arabic-translation">(May Allah have mercy on him)</p>
                  </div>

                  <div className="dedication-dua">
                    <p className="dedication-bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
                    
                    <div className="dedication-arabic-dua">
                      <p>يَا رَبِّ ارْحَمْ عَبْدَكَ دَاوُودَ</p>
                      <p>وَأَنْزِلْ عَلَى قَبْرِهِ نُورًا وَسُكُونًا</p>
                      <p>وَاجْعَلْ قَبْرَهُ رَوْضَةً مِنْ رِيَاضِ الْجَنَّةِ</p>
                      <p>وَاَكْرِمْ نُزُلَهُ وَوَسِّعْ مُدْخَلَهُ</p>
                    </div>

                    <div className="dedication-translation">
                      <p>O Allah, have mercy upon Your servant Dawood</p>
                      <p>And descend upon his grave light and tranquility</p>
                      <p>Make his grave a garden from the gardens of Paradise</p>
                      <p>And honor his resting place and widen his entrance</p>
                    </div>

                    <div className="dedication-divider" />

                    <div className="dedication-arabic-dua">
                      <p>اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَعَافِهِ وَاعْفُ عَنْهُ</p>
                      <p>وَأَكْرِمْ نُزُلَهُ وَوَسِّعْ مُدْخَلَهُ</p>
                      <p>وَاغْسِلْهُ بِالْمَاءِ وَالثَّلْجِ وَالْبَرَدِ</p>
                      <p>وَنَقِّهِ مِنَ الذُّنُوبِ وَالْخَطَايَا كَمَا نَقَّيْتَ الثَّوْبَ الْأَبْيَضَ مِنَ الدَّنَسِ</p>
                    </div>

                    <div className="dedication-translation">
                      <p>O Allah, forgive him, have mercy upon him, give him peace, and pardon him</p>
                      <p>Honor his resting place, widen his entrance</p>
                      <p>Wash him with water, snow, and hail</p>
                      <p>Purify him from sins and mistakes as a white garment is purified from dirt</p>
                    </div>
                  </div>

                  <div className="dedication-tribute">
                    <p className="dedication-tribute-text">
                      Hajji Dawood Cassim was a pillar of our community - a man of unwavering faith, boundless generosity, and dedication to the House of Allah. His legacy lives on through every soul he touched, every prayer he led, and every heart he warmed with his kindness.
                    </p>
                    <p className="dedication-tribute-text mt-3">
                      This application is dedicated as a <strong>Sadaqah Jaariyah</strong> (continuous charity) in his blessed memory. May every prayer time reminder, every verse of Quran memorized, every act of worship facilitated through this app be a source of eternal reward for him and his family.
                    </p>
                    <div className="dedication-sadaqah">
                      <p className="dedication-arabic-small">اللَّهُمَّ اجْعَلْ هَذَا الْعَمَلَ صَدَقَةً جَارِيَةً لَهُ</p>
                      <p className="dedication-translation-small">O Allah, make this work a continuous charity for him</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => setShowTributeModal(true)}
                    className="dedication-cta"
                  >
                    🤲 Share a Tribute
                  </button>
                </div>
              </div>
            )}

            {/* Tributes Tab */}
            {moreSubTab === 'tributes' && (
              <div className="space-y-4">
                <div className="card bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200">
                  <h3 className="font-bold text-primary text-xl">💌 Tributes</h3>
                  <p className="text-sm text-gray-600 mt-1">Messages of love and remembrance for Hajji Dawood Cassim رحمة الله عليه</p>
                </div>

                {tributes.length > 0 ? (
                  <div className="space-y-3">
                    {tributes.map((tribute) => (
                      <div key={tribute.id} className={`tribute-card ${tribute.isHighlighted ? 'tribute-highlighted' : ''}`}>
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {tribute.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-primary">{tribute.name}</p>
                              {tribute.isHighlighted && (
                                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">⭐ Featured</span>
                              )}
                            </div>
                            {tribute.relationship && (
                              <p className="text-xs text-gray-500">{tribute.relationship}</p>
                            )}
                            <p className="text-gray-700 mt-2 text-sm">{tribute.message}</p>
                            <p className="text-xs text-gray-400 mt-2">
                              {new Date(tribute.submittedAt).toLocaleDateString('en-GB', { 
                                day: 'numeric', 
                                month: 'long', 
                                year: 'numeric' 
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="card text-center py-8">
                    <span className="text-4xl block mb-2">🤲</span>
                    <p className="text-gray-500">No tributes yet. Be the first to share one.</p>
                    <button 
                      onClick={() => setShowTributeModal(true)}
                      className="btn-primary mt-4"
                    >
                      Share a Tribute
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Photo Album Tab */}
            {moreSubTab === 'photos' && (
              <div className="space-y-4">
                <div className="card bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-primary text-xl">📸 Photo Album</h3>
                      <p className="text-sm text-gray-600 mt-1">Share your photos of the masjid and events</p>
                    </div>
                    <button
                      onClick={() => { playClickSound(); setShowPhotoUpload(true); }}
                      className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      + Upload
                    </button>
                  </div>
                </div>

                {photos.length > 0 ? (
                  <div className="photo-grid">
                    {photos.filter(p => p.isApproved).map((photo) => (
                      <div 
                        key={photo.id} 
                        className={`photo-card ${photo.isFeatured ? 'featured' : ''}`}
                        onClick={() => { playClickSound(); setSelectedPhoto(photo); }}
                      >
                        <img src={photo.imageUrl} alt={photo.title} className="photo-image" />
                        <div className="photo-overlay">
                          <p className="photo-title">{photo.title}</p>
                          <p className="photo-category">{photo.category}</p>
                        </div>
                        {photo.isFeatured && (
                          <span className="photo-badge">⭐</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="card text-center py-8">
                    <span className="text-4xl block mb-2">📸</span>
                    <p className="text-gray-500">No photos yet. Be the first to share!</p>
                    <button 
                      onClick={() => { playClickSound(); setShowPhotoUpload(true); }}
                      className="btn-primary mt-4"
                    >
                      Upload a Photo
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Donate */}
            {moreSubTab === 'donate' && (
              <div className="card">
                <h3 className="font-bold text-primary mb-4">💰 Support the Masjid</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Amount (USD)</label>
                    <input type="number" className="form-input w-full" placeholder="Enter amount" value={donationAmount} onChange={(e) => setDonationAmount(e.target.value)} />
                  </div>
                  {/* Donation Categories */}
                  <div className="bg-green-50 rounded-xl p-4 mb-4">
                    <h4 className="font-bold text-primary mb-3">💝 Select Donation Type</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'general', label: '🏛️ General Fund', desc: 'Masjid operations' },
                        { id: 'fitra', label: '🌾 Fitra (Eid)', desc: 'Ramadan/Eid support' },
                        { id: 'sadaqah', label: '💚 Sadaqah', desc: 'Charitable giving' },
                        { id: 'zakat', label: '💰 Zakat', desc: 'Obligatory charity' },
                        { id: 'madressa', label: '📚 Madressa Fees', desc: 'Islamic education' },
                        { id: 'building', label: '🏗️ Building Fund', desc: 'Construction' },
                        { id: 'water', label: '💧 Water Well', desc: 'Sadaqah Jariyah' },
                        { id: 'orphans', label: '🤲 Orphan Support', desc: 'Help the needy' },
                        { id: 'funeral', label: '⚰️ Funeral Fund', desc: 'Janaza assistance' },
                        { id: 'iftar', label: '🍱 Iftar Meals', desc: 'Ramadan feeding' },
                        { id: 'qurbani', label: '🐑 Qurbani', desc: 'Eid al-Adha' },
                        { id: 'specific', label: '📌 Specific Cause', desc: 'Other donation' },
                      ].map((type) => (
                        <button
                          key={type.id}
                          onClick={() => { playClickSound(); setDonationType(type.id); }}
                          className={`p-3 rounded-lg text-left transition-all ${donationType === type.id ? 'bg-primary text-white' : 'bg-white border border-gray-200 hover:border-primary'}`}
                        >
                          <p className="font-medium text-sm">{type.label}</p>
                          <p className="text-xs opacity-80">{type.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Specific Cause Input */}
                  {donationType === 'specific' && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Specify Your Cause</label>
                      <input type="text" className="form-input w-full" placeholder="e.g., New carpet, Sound system, etc." />
                    </div>
                  )}
                  
                  {/* Madressa Student Selection */}
                  {donationType === 'madressa' && (
                    <div className="mb-4 bg-blue-50 p-3 rounded-lg">
                      <label className="block text-sm font-medium mb-1">Student Name (optional)</label>
                      <input type="text" className="form-input w-full" placeholder="Enter student name for fee payment" />
                      <label className="block text-sm font-medium mb-1 mt-2">Month</label>
                      <select className="form-select w-full">
                        <option>January 2026</option>
                        <option>February 2026</option>
                        <option>March 2026</option>
                        <option>April 2026</option>
                        <option>May 2026</option>
                        <option>June 2026</option>
                      </select>
                    </div>
                  )}
                  
                  {/* Fitra Calculator */}
                  {donationType === 'fitra' && (
                    <div className="mb-4 bg-amber-50 p-3 rounded-lg">
                      <p className="text-sm font-medium mb-2">🌾 Fitra Amount: $3-5 per person</p>
                      <label className="block text-sm font-medium mb-1">Number of Family Members</label>
                      <input type="number" className="form-input w-full" placeholder="e.g., 5" min="1" />
                      <p className="text-xs text-gray-500 mt-1">Fitra is obligatory before Eid prayer</p>
                    </div>
                  )}
                  
                  {/* Quick Amount Buttons */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {[5, 10, 20, 50, 100].map((amt) => (
                      <button
                        key={amt}
                        onClick={() => { playClickSound(); setDonationAmount(amt.toString()); }}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${donationAmount === amt.toString() ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                      >
                        ${amt}
                      </button>
                    ))}
                  </div>
                  
                  {/* Payment Methods */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-primary">📱 Payment Method</h4>
                    <div className="grid grid-cols-1 gap-2">
                      <button onClick={() => handleDonation('ecocash')} className="bg-green-500 text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2">
                        <span className="text-xl">📱</span> EcoCash - Pay Now
                      </button>
                      <button onClick={() => handleDonation('onemoney')} className="bg-red-500 text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2">
                        <span className="text-xl">💳</span> OneMoney - Pay Now
                      </button>
                      <button onClick={() => handleDonation('innbucks')} className="bg-orange-500 text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2">
                        <span className="text-xl">🏦</span> InnBucks - Pay Now
                      </button>
                      <button onClick={() => handleDonation('bank')} className="bg-blue-600 text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2">
                        <span className="text-xl">🏦</span> Bank Transfer
                      </button>
                      <button onClick={() => handleDonation('cash')} className="bg-gray-600 text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2">
                        <span className="text-xl">💵</span> Cash at Masjid
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Member Registration */}
            {moreSubTab === 'member' && (
              <div className="card">
                <h3 className="font-bold text-primary mb-4">👤 Member Registration</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">First Name *</label>
                      <input type="text" className="form-input w-full" value={memberForm.firstName} onChange={(e) => setMemberForm({ ...memberForm, firstName: e.target.value })} required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Last Name *</label>
                      <input type="text" className="form-input w-full" value={memberForm.lastName} onChange={(e) => setMemberForm({ ...memberForm, lastName: e.target.value })} required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input type="email" className="form-input w-full" value={memberForm.email} onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <input type="tel" className="form-input w-full" value={memberForm.phone} onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })} placeholder="+263..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">City</label>
                    <input type="text" className="form-input w-full" value={memberForm.city} onChange={(e) => setMemberForm({ ...memberForm, city: e.target.value })} />
                  </div>
                  
                  {/* Location Pin Drop */}
                  <div>
                    <label className="block text-sm font-medium mb-1">📍 Location (for welfare checks)</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" className="form-input" placeholder="Latitude" value={memberForm.latitude} onChange={(e) => setMemberForm({ ...memberForm, latitude: e.target.value })} />
                      <input type="text" className="form-input" placeholder="Longitude" value={memberForm.longitude} onChange={(e) => setMemberForm({ ...memberForm, longitude: e.target.value })} />
                    </div>
                    <button onClick={getLocation} className="btn-outline w-full mt-2 text-sm">📍 Get Current Location</button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Emergency Contact</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" className="form-input" placeholder="Name" value={memberForm.emergencyName} onChange={(e) => setMemberForm({ ...memberForm, emergencyName: e.target.value })} />
                      <input type="tel" className="form-input" placeholder="Phone" value={memberForm.emergencyContact} onChange={(e) => setMemberForm({ ...memberForm, emergencyContact: e.target.value })} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={memberForm.isVolunteer} onChange={(e) => setMemberForm({ ...memberForm, isVolunteer: e.target.checked })} className="w-4 h-4" />
                      <span className="text-sm">I want to volunteer</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={memberForm.isVulnerable} onChange={(e) => setMemberForm({ ...memberForm, isVulnerable: e.target.checked })} className="w-4 h-4" />
                      <span className="text-sm">Mark as vulnerable (elderly, ill, living alone)</span>
                    </label>
                  </div>

                  <button onClick={handleMemberSubmit} disabled={!memberForm.firstName || !memberForm.lastName} className="btn-primary w-full disabled:opacity-50">Register as Member</button>
                </div>
                {memberSubmitted && (
                  <div className="p-3 bg-green-50 text-green-700 rounded-lg text-center mt-4">✅ Registration successful! Welcome to the masjid family.</div>
                )}
              </div>
            )}

            {/* Safety/Alerts */}
            {moreSubTab === 'alerts' && (
              <div className="space-y-4">
                <div className="card bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200">
                  <h3 className="font-bold text-primary text-xl">🚨 Member Safety</h3>
                  <p className="text-sm text-gray-600 mt-1">Emergency assistance for vulnerable members</p>
                </div>

                {/* Panic Button */}
                <div className="card text-center">
                  <p className="text-sm text-gray-600 mb-4">Press the button below to send an emergency alert to volunteers and your emergency contact.</p>
                  <button onClick={handlePanic} className="w-32 h-32 rounded-full bg-red-500 text-white text-lg font-bold shadow-lg hover:bg-red-600 active:scale-95 transition-transform">
                    <AlertIcon />
                    <p className="mt-1">PANIC</p>
                  </button>
                  {alertSent && (
                    <p className="text-green-600 font-medium mt-4">✅ Alert sent! Help is on the way.</p>
                  )}
                </div>

                {/* Volunteer Status */}
                <div className="card">
                  <h4 className="font-bold text-primary mb-3">🤝 Volunteers</h4>
                  <p className="text-sm text-gray-600">Members who can be contacted for welfare checks and emergency assistance.</p>
                  <p className="text-xs text-gray-400 mt-2">Register as a volunteer to receive alerts.</p>
                </div>

                {/* Vulnerable Members */}
                <div className="card">
                  <h4 className="font-bold text-primary mb-3">💝 Vulnerable Members</h4>
                  <p className="text-sm text-gray-600">Elderly, ill, or members living alone who may need regular check-ins.</p>
                  <p className="text-xs text-gray-400 mt-2">Register yourself to receive regular welfare checks.</p>
                </div>
              </div>
            )}

            {/* About */}
            {moreSubTab === 'about' && (
              <div className="card">
                <div className="text-center mb-4">
                  <MosqueIcon />
                  <h3 className="font-bold text-primary text-xl mt-2">Zeenat-ul-Islam Masjid</h3>
                  <p className="text-sm text-gray-600">Bulawayo, Zimbabwe</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-primary">About Us</h4>
                    <p className="text-sm text-gray-600 mt-1">We are a Shafi Sunni masjid serving the Muslim community of Bulawayo. Our mission is to provide a place of worship, Islamic education, and community support.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-primary">Contact</h4>
                    <p className="text-sm text-gray-600 mt-1">📧 info@zeenatulislam.org</p>
                    <p className="text-sm text-gray-600">📞 +263 XXX XXX XXX</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-primary">Jumu&apos;ah Prayer</h4>
                    <p className="text-sm text-gray-600 mt-1">Every Friday at 1:00 PM</p>
                    <p className="text-sm text-gray-600">Khutbah begins at 12:45 PM</p>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-xs text-gray-400 text-center">Masjid Hub v1.0 • Built with ❤️ for the Ummah</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Tribute Modal */}
      {showTributeModal && (
        <div className="tribute-modal-overlay" onClick={() => setShowTributeModal(false)}>
          <div className="tribute-modal" onClick={(e) => e.stopPropagation()}>
            <div className="tribute-modal-header">
              <h3 className="text-lg font-bold text-primary">🤲 Share a Tribute</h3>
              <button 
                onClick={() => setShowTributeModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              Share your memories and tributes for Hajji Dawood Cassim رحمة الله عليه. Your tribute will be reviewed before being published.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Your Name *</label>
                <input 
                  type="text" 
                  className="form-input w-full" 
                  placeholder="Enter your name"
                  value={tributeForm.name}
                  onChange={(e) => setTributeForm({ ...tributeForm, name: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Relationship (Optional)</label>
                <input 
                  type="text" 
                  className="form-input w-full" 
                  placeholder="How did you know him?"
                  value={tributeForm.relationship}
                  onChange={(e) => setTributeForm({ ...tributeForm, relationship: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Your Tribute *</label>
                <textarea 
                  className="form-textarea w-full" 
                  rows={4}
                  placeholder="Share your memories, thoughts, or prayers..."
                  value={tributeForm.message}
                  onChange={(e) => setTributeForm({ ...tributeForm, message: e.target.value })}
                />
              </div>

              <button 
                onClick={handleTributeSubmit}
                disabled={!tributeForm.name || !tributeForm.message}
                className="btn-primary w-full disabled:opacity-50"
              >
                Submit Tribute
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Photo Upload Modal */}
      {showPhotoUpload && (
        <div className="tribute-modal-overlay" onClick={() => setShowPhotoUpload(false)}>
          <div className="tribute-modal" onClick={(e) => e.stopPropagation()}>
            <div className="tribute-modal-header">
              <h3 className="text-lg font-bold text-primary">📸 Upload Photo</h3>
              <button 
                onClick={() => setShowPhotoUpload(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              Share your photos of the masjid and events. Photos will be reviewed before being published.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Photo URL *</label>
                <input 
                  type="text" 
                  className="form-input w-full" 
                  placeholder="Enter image URL (e.g., from Google Drive, Dropbox)"
                  value={photoForm.imageUrl}
                  onChange={(e) => setPhotoForm({ ...photoForm, imageUrl: e.target.value })}
                />
                <p className="text-xs text-gray-400 mt-1">Tip: Upload to a image hosting service and paste the link here</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input 
                  type="text" 
                  className="form-input w-full" 
                  placeholder="Photo title"
                  value={photoForm.title}
                  onChange={(e) => setPhotoForm({ ...photoForm, title: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea 
                  className="form-textarea w-full" 
                  rows={2}
                  placeholder="Describe the photo..."
                  value={photoForm.description}
                  onChange={(e) => setPhotoForm({ ...photoForm, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  className="form-select w-full"
                  value={photoForm.category}
                  onChange={(e) => setPhotoForm({ ...photoForm, category: e.target.value })}
                >
                  <option value="general">General</option>
                  <option value="jumuah">Jumu'ah</option>
                  <option value="eid">Eid</option>
                  <option value="taraweeh">Taraweeh</option>
                  <option value="event">Event</option>
                </select>
              </div>

              <button 
                onClick={async () => {
                  if (!photoForm.title || !photoForm.imageUrl) return
                  playClickSound()
                  try {
                    await fetch('/api/photos', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        ...photoForm,
                        uploadedBy: currentMemberId || 'anonymous',
                        uploaderName: memberForm.firstName || 'Anonymous'
                      }),
                    })
                    setPhotoForm({ title: '', description: '', category: 'general', imageUrl: '' })
                    setPhotoUploaded(true)
                    setShowPhotoUpload(false)
                    setTimeout(() => setPhotoUploaded(false), 3000)
                    // Refresh photos
                    const updated = await fetchData<{photos: Photo[]}>('photos', 'photos')
                    setPhotos(updated.photos || [])
                  } catch (error) {
                    console.error('Error uploading photo:', error)
                  }
                }}
                disabled={!photoForm.title || !photoForm.imageUrl}
                className="btn-primary w-full disabled:opacity-50"
              >
                Submit Photo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Photo Viewer Modal */}
      {selectedPhoto && (
        <div className="tribute-modal-overlay" onClick={() => setSelectedPhoto(null)}>
          <div className="photo-viewer-modal" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full w-8 h-8 flex items-center justify-center"
            >
              ✕
            </button>
            <img src={selectedPhoto.imageUrl} alt={selectedPhoto.title} className="w-full h-auto max-h-[70vh] object-contain" />
            <div className="p-4 bg-white">
              <h3 className="font-bold text-lg">{selectedPhoto.title}</h3>
              {selectedPhoto.description && <p className="text-gray-600 mt-1">{selectedPhoto.description}</p>}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{selectedPhoto.category}</span>
                <span className="text-xs text-gray-400">
                  {new Date(selectedPhoto.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Photo Upload Success Message */}
      {photoUploaded && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          ✅ Photo submitted for review!
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        {[
          { id: 'home', label: 'Home', icon: <HomeIcon /> },
          { id: 'prayer', label: 'Prayer', icon: <PrayerIcon active={activeTab === 'prayer'} /> },
          { id: 'learn', label: 'Learn', icon: <LearnIcon /> },
          { id: 'community', label: 'Community', icon: <CommunityIcon /> },
          { id: 'more', label: 'More', icon: <MoreIcon /> },
        ].map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)} className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}>
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      <style jsx global>{`
        :root {
          --primary: #1B5E20;
          --primary-dark: #0D3A10;
          --accent: #D4AF37;
        }
        
        .content-area {
          padding-bottom: 80px;
        }
        
        .arabic-text {
          font-family: 'Amiri', serif;
          direction: rtl;
        }
        
        .transliteration {
          font-style: italic;
          color: #666;
        }
        
        .header {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          color: white;
          padding: 1rem;
          position: sticky;
          top: 0;
          z-index: 40;
        }
        
        .card {
          background: white;
          border-radius: 1rem;
          padding: 1rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        
        .prayer-card {
          background: #f8f9fa;
          border-radius: 0.75rem;
          padding: 0.75rem;
          text-align: center;
        }
        
        .prayer-card.highlight {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          color: white;
        }
        
        .guide-step {
          background: white;
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        
        .guide-step-number {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          background: var(--primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }
        
        .carousel-dots {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1rem;
        }
        
        .carousel-dot {
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 50%;
          background: #ddd;
          border: none;
          cursor: pointer;
        }
        
        .carousel-dot.active {
          background: var(--primary);
          width: 1.5rem;
          border-radius: 0.25rem;
        }
        
        .dua-card {
          background: white;
          border-radius: 1rem;
          padding: 1rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          border-left: 4px solid var(--primary);
        }
        
        .tab-pills {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          padding-bottom: 0.5rem;
        }
        
        .tab-pill {
          padding: 0.5rem 1rem;
          border-radius: 2rem;
          white-space: nowrap;
          font-size: 0.875rem;
          background: #f3f4f6;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .tab-pill.active {
          background: var(--primary);
          color: white;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(27, 94, 32, 0.3);
        }
        
        .btn-outline {
          background: transparent;
          color: var(--primary);
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 500;
          border: 2px solid var(--primary);
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .btn-accent {
          background: var(--accent);
          color: #000;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
        }
        
        .audio-btn {
          background: var(--primary);
          color: white;
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
        }
        
        .form-input, .form-select, .form-textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 0.5rem;
          font-size: 1rem;
        }
        
        .form-textarea {
          resize: none;
        }
        
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: white;
          border-top: 1px solid #eee;
          display: flex;
          justify-content: space-around;
          padding: 0.5rem 0;
          z-index: 50;
        }
        
        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          background: none;
          border: none;
          color: #666;
          font-size: 0.75rem;
          cursor: pointer;
          padding: 0.5rem;
        }
        
        .nav-item.active {
          color: var(--primary);
        }
        
        .offline-banner {
          background: #f59e0b;
          color: white;
          text-align: center;
          padding: 0.5rem;
          font-size: 0.875rem;
        }
        
        /* Dedication Card Styles */
        .dedication-card {
          background: linear-gradient(180deg, #1B5E20 0%, #0D3A10 100%);
          border-radius: 1.5rem;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(27, 94, 32, 0.3);
          border: 2px solid #D4AF37;
        }
        
        .dedication-image-container {
          position: relative;
          height: 200px;
          overflow: hidden;
        }
        
        .dedication-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }
        
        .dedication-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 60%;
          background: linear-gradient(to top, rgba(27, 94, 32, 0.95), transparent);
        }
        
        .dedication-content {
          padding: 1.5rem;
          color: white;
        }
        
        .dedication-title {
          font-size: 0.875rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #D4AF37;
          margin-bottom: 0.25rem;
        }
        
        .dedication-name {
          font-size: 1.75rem;
          font-weight: bold;
          color: white;
          margin-bottom: 0.25rem;
        }
        
        .dedication-arabic {
          font-family: 'Amiri', serif;
          font-size: 1.5rem;
          color: #D4AF37;
          margin-top: 0.5rem;
        }
        
        .dedication-arabic-translation {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.7);
          font-style: italic;
        }
        
        .dedication-dua {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 1rem;
          padding: 1.25rem;
          margin: 1.25rem 0;
          border: 1px solid rgba(212, 175, 55, 0.3);
        }
        
        .dedication-bismillah {
          font-family: 'Amiri', serif;
          font-size: 1.25rem;
          text-align: center;
          color: #D4AF37;
          margin-bottom: 1rem;
        }
        
        .dedication-arabic-dua {
          font-family: 'Amiri', serif;
          direction: rtl;
          text-align: right;
          font-size: 1.125rem;
          line-height: 2;
          color: white;
        }
        
        .dedication-arabic-dua p {
          margin: 0.25rem 0;
        }
        
        .dedication-translation {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.8);
          text-align: left;
          margin-top: 0.75rem;
          line-height: 1.6;
        }
        
        .dedication-translation p {
          margin: 0.25rem 0;
        }
        
        .dedication-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #D4AF37, transparent);
          margin: 1rem 0;
        }
        
        .dedication-tribute {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 0.75rem;
          padding: 1rem;
          margin: 1rem 0;
        }
        
        .dedication-tribute-text {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.7;
        }
        
        .dedication-sadaqah {
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(212, 175, 55, 0.1));
          border-radius: 0.75rem;
          padding: 1rem;
          margin-top: 1rem;
          text-align: center;
          border: 1px solid rgba(212, 175, 55, 0.3);
        }
        
        .dedication-arabic-small {
          font-family: 'Amiri', serif;
          font-size: 1.125rem;
          color: #D4AF37;
        }
        
        .dedication-translation-small {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.7);
          font-style: italic;
          margin-top: 0.25rem;
        }
        
        .dedication-cta {
          width: 100%;
          background: linear-gradient(135deg, #D4AF37 0%, #B8960C 100%);
          color: #1B5E20;
          font-weight: bold;
          padding: 1rem;
          border-radius: 0.75rem;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.3s ease;
          margin-top: 0.5rem;
        }
        
        .dedication-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(212, 175, 55, 0.4);
        }
        
        .dedication-success {
          background: rgba(76, 175, 80, 0.2);
          border: 1px solid rgba(76, 175, 80, 0.5);
          color: #81C784;
          padding: 0.75rem;
          border-radius: 0.5rem;
          text-align: center;
          font-size: 0.875rem;
          margin-top: 1rem;
        }
        
        /* Tribute Card Styles */
        .tribute-card {
          background: white;
          border-radius: 1rem;
          padding: 1rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          border-left: 4px solid var(--primary);
        }
        
        .tribute-highlighted {
          border: 2px solid #D4AF37;
          border-left: 4px solid #D4AF37;
          background: linear-gradient(to right, rgba(212, 175, 55, 0.05), white);
        }
        
        /* Tribute Modal Styles */
        .tribute-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 1rem;
        }
        
        .tribute-modal {
          background: white;
          border-radius: 1.5rem;
          padding: 1.5rem;
          width: 100%;
          max-width: 400px;
          max-height: 90vh;
          overflow-y: auto;
          animation: modalSlideIn 0.3s ease;
        }
        
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .tribute-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #eee;
        }
        
        .max-h-96 {
          max-height: 24rem;
        }
        
        .overflow-y-auto {
          overflow-y: auto;
        }

        /* Language Modal Styles */
        .language-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 200;
          padding: 1rem;
        }
        
        .language-modal {
          background: white;
          border-radius: 1.5rem;
          padding: 2rem;
          width: 100%;
          max-width: 350px;
          animation: modalSlideIn 0.3s ease;
        }
        
        .language-option {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border: 2px solid #eee;
          border-radius: 1rem;
          width: 100%;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .language-option:hover {
          border-color: var(--primary);
          background: rgba(27, 94, 32, 0.05);
        }
        
        .language-option.active {
          border-color: var(--primary);
          background: rgba(27, 94, 32, 0.1);
        }

        /* Daily Content Styles */
        .daily-content-section {
          display: grid;
          gap: 1rem;
        }
        
        .daily-content-card {
          background: white;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        }
        
        .daily-content-card.hadith {
          border-left: 4px solid #D4AF37;
        }
        
        .daily-content-card.verse {
          border-left: 4px solid var(--primary);
        }
        
        .daily-content-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: linear-gradient(to right, rgba(27, 94, 32, 0.05), transparent);
        }
        
        .daily-content-icon {
          font-size: 1.25rem;
        }
        
        .daily-content-header h3 {
          font-size: 0.875rem;
          font-weight: bold;
          color: var(--primary);
        }
        
        .daily-content-body {
          padding: 1rem;
        }
        
        .daily-content-arabic {
          font-family: 'Amiri', serif;
          direction: rtl;
          text-align: right;
          font-size: 1.25rem;
          color: var(--primary);
          margin-bottom: 0.75rem;
          line-height: 1.8;
        }
        
        .daily-content-translation {
          color: #555;
          font-size: 0.95rem;
          line-height: 1.6;
        }
        
        .daily-content-source {
          margin-top: 0.75rem;
          font-size: 0.75rem;
          color: #999;
          font-style: italic;
        }

        /* Photo Album Styles */
        .photo-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }
        
        .photo-card {
          position: relative;
          aspect-ratio: 1;
          border-radius: 0.75rem;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.2s;
        }
        
        .photo-card:hover {
          transform: scale(1.02);
        }
        
        .photo-card.featured {
          grid-column: span 2;
          aspect-ratio: 16/9;
        }
        
        .photo-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .photo-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 0.75rem;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
          color: white;
        }
        
        .photo-title {
          font-weight: 600;
          font-size: 0.875rem;
        }
        
        .photo-category {
          font-size: 0.7rem;
          opacity: 0.8;
          text-transform: capitalize;
        }
        
        .photo-badge {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: rgba(212, 175, 55, 0.9);
          color: white;
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
        }

        /* Photo Viewer Modal */
        .photo-viewer-modal {
          background: rgba(0, 0, 0, 0.95);
          border-radius: 1rem;
          overflow: hidden;
          width: 100%;
          max-width: 500px;
          position: relative;
          animation: modalSlideIn 0.3s ease;
        }

        /* Dedication Quran Section */
        .dedication-quran-section {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 0.75rem;
          padding: 0.75rem;
          margin: 1rem 0;
          border: 1px solid rgba(212, 175, 55, 0.3);
        }
        
        .quran-play-btn {
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(212, 175, 55, 0.4);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        }
        
        .quran-play-btn:hover {
          background: rgba(212, 175, 55, 0.3);
        }
        
        .quran-play-btn.playing {
          background: #D4AF37;
          color: #1B5E20;
        }

        /* Dedication Badge */
        .dedication-badge {
          position: absolute;
          bottom: 1rem;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(212, 175, 55, 0.9);
          color: #1B5E20;
          padding: 0.25rem 1rem;
          border-radius: 2rem;
          font-family: 'Amiri', serif;
          font-size: 1rem;
          z-index: 10;
        }

        /* Form Styles */
        .form-input {
          padding: 0.75rem;
          border: 2px solid #e0e0e0;
          border-radius: 0.5rem;
          font-size: 1rem;
          transition: border-color 0.2s;
        }
        
        .form-input:focus {
          outline: none;
          border-color: var(--primary);
        }
        
        .form-select {
          padding: 0.75rem;
          border: 2px solid #e0e0e0;
          border-radius: 0.5rem;
          font-size: 1rem;
          background: white;
          cursor: pointer;
        }
        
        .form-textarea {
          padding: 0.75rem;
          border: 2px solid #e0e0e0;
          border-radius: 0.5rem;
          font-size: 1rem;
          resize: vertical;
          min-height: 80px;
        }
        
        .form-textarea:focus {
          outline: none;
          border-color: var(--primary);
        }
      `}</style>
    </div>
  )
}
