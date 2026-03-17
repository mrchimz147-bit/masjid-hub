import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Language } from './i18n'

export type TabId = 'home' | 'prayer' | 'learn' | 'community' | 'more'

interface PrayerTime {
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

interface Announcement {
  id: string
  title: string
  content: string
  category: string
  priority: number
  createdAt: string
}

interface CachedData {
  prayerTimes: PrayerTime[]
  guides: GuideStep[]
  duas: Dua[]
  announcements: Announcement[]
  lastSync: string | null
}

interface HifzStats {
  total: number
  memorized: number
  memorizing: number
  needsRevision: number
  notStarted: number
}

interface AppState {
  // Language preference
  language: Language
  setLanguage: (lang: Language) => void
  languageSelected: boolean
  setLanguageSelected: (selected: boolean) => void

  // Navigation
  activeTab: TabId
  setActiveTab: (tab: TabId) => void

  // Offline status
  isOffline: boolean
  setOffline: (status: boolean) => void

  // Cached data for offline use
  cachedData: CachedData
  setCachedData: (data: Partial<CachedData>) => void

  // Learn section state
  learnSubTab: 'wudu' | 'salah' | 'duas' | 'arabic' | 'tajweed' | 'hifz' | 'kids' | 'janaza' | 'quiz'
  setLearnSubTab: (tab: 'wudu' | 'salah' | 'duas' | 'arabic' | 'tajweed' | 'hifz' | 'kids' | 'janaza' | 'quiz') => void

  // Community section state
  communitySubTab: 'ask' | 'faq' | 'booking' | 'announcements' | 'livestream' | 'qurbani'
  setCommunitySubTab: (tab: 'ask' | 'faq' | 'booking' | 'announcements' | 'livestream' | 'qurbani') => void

  // More section state
  moreSubTab: 'donate' | 'member' | 'settings' | 'about' | 'alerts' | 'tributes' | 'dedication' | 'photos' | 'marriage'
  setMoreSubTab: (tab: 'donate' | 'member' | 'settings' | 'about' | 'alerts' | 'tributes' | 'dedication' | 'photos' | 'marriage') => void

  // Audio settings
  backgroundAudioEnabled: boolean
  setBackgroundAudioEnabled: (enabled: boolean) => void
  clickSoundEnabled: boolean
  setClickSoundEnabled: (enabled: boolean) => void

  // Member Authentication
  memberToken: string | null
  setMemberToken: (token: string | null) => void
  currentMember: {
    id: string
    firstName: string
    lastName: string
    email: string | null
    phone: string | null
    city: string | null
  } | null
  setCurrentMember: (member: {
    id: string
    firstName: string
    lastName: string
    email: string | null
    phone: string | null
    city: string | null
  } | null) => void

  // Hifz tracking
  hifzStats: HifzStats
  setHifzStats: (stats: HifzStats) => void

  // Current member
  currentMemberId: string | null
  setCurrentMemberId: (id: string | null) => void

  // UI states
  showInstallPrompt: boolean
  setShowInstallPrompt: (show: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Language
      language: 'en',
      setLanguage: (lang) => set({ language: lang, languageSelected: true }),
      languageSelected: false,
      setLanguageSelected: (selected) => set({ languageSelected: selected }),

      // Navigation
      activeTab: 'home',
      setActiveTab: (tab) => set({ activeTab: tab }),

      // Offline status
      isOffline: false,
      setOffline: (status) => set({ isOffline: status }),

      // Cached data
      cachedData: {
        prayerTimes: [],
        guides: [],
        duas: [],
        announcements: [],
        lastSync: null,
      },
      setCachedData: (data) =>
        set((state) => ({
          cachedData: { ...state.cachedData, ...data, lastSync: new Date().toISOString() },
        })),

      // Learn sub-tab
      learnSubTab: 'wudu',
      setLearnSubTab: (tab) => set({ learnSubTab: tab }),

      // Community sub-tab
      communitySubTab: 'ask',
      setCommunitySubTab: (tab) => set({ communitySubTab: tab }),

      // More sub-tab
      moreSubTab: 'donate',
      setMoreSubTab: (tab) => set({ moreSubTab: tab }),

      // Audio settings
      backgroundAudioEnabled: true,
      setBackgroundAudioEnabled: (enabled) => set({ backgroundAudioEnabled: enabled }),
      clickSoundEnabled: true,
      setClickSoundEnabled: (enabled) => set({ clickSoundEnabled: enabled }),

      // Member Authentication
      memberToken: null,
      setMemberToken: (token) => set({ memberToken: token }),
      currentMember: null,
      setCurrentMember: (member) => set({ currentMember: member }),

      // Hifz stats
      hifzStats: {
        total: 114,
        memorized: 0,
        memorizing: 0,
        needsRevision: 0,
        notStarted: 114,
      },
      setHifzStats: (stats) => set({ hifzStats: stats }),

      // Current member
      currentMemberId: null,
      setCurrentMemberId: (id) => set({ currentMemberId: id }),

      // Install prompt
      showInstallPrompt: false,
      setShowInstallPrompt: (show) => set({ showInstallPrompt: show }),
    }),
    {
      name: 'masjid-hub-storage',
      partialize: (state) => ({
        cachedData: state.cachedData,
        language: state.language,
        languageSelected: state.languageSelected,
        hifzStats: state.hifzStats,
        currentMemberId: state.currentMemberId,
        backgroundAudioEnabled: state.backgroundAudioEnabled,
        clickSoundEnabled: state.clickSoundEnabled,
        memberToken: state.memberToken,
        currentMember: state.currentMember,
      }),
    }
  )
)
