'use client'

import { useState, useEffect, useCallback } from 'react'

// Quiz question types
interface QuizQuestion {
  id: string
  question: string
  arabicText?: string
  options: string[]
  correctAnswer: number
  explanation?: string
  difficulty: 'easy' | 'medium' | 'hard' | 'holymoly'
  category: string
  actionRequired?: string // For recitation questions
}

interface LeaderboardEntry {
  name: string
  score: number
  totalQuestions: number
  difficulty: string
  date: string
}

// Hardcoded quiz questions - comprehensive Islamic knowledge
const QUIZ_QUESTIONS: QuizQuestion[] = [
  // EASY QUESTIONS
  {
    id: 'e1',
    question: 'How many pillars of Islam are there?',
    options: ['3', '5', '6', '7'],
    correctAnswer: 1,
    explanation: 'There are 5 pillars of Islam: Shahadah, Salah, Zakat, Sawm, and Hajj.',
    difficulty: 'easy',
    category: 'basics'
  },
  {
    id: 'e2',
    question: 'What is the first pillar of Islam?',
    options: ['Salah', 'Shahadah', 'Zakat', 'Hajj'],
    correctAnswer: 1,
    explanation: 'The Shahadah (declaration of faith) is the first pillar of Islam.',
    difficulty: 'easy',
    category: 'basics'
  },
  {
    id: 'e3',
    question: 'How many daily prayers are obligatory for Muslims?',
    options: ['3', '4', '5', '6'],
    correctAnswer: 2,
    explanation: 'There are 5 obligatory daily prayers: Fajr, Dhuhr, Asr, Maghrib, and Isha.',
    difficulty: 'easy',
    category: 'salah'
  },
  {
    id: 'e4',
    question: 'What is the name of the Islamic holy book?',
    options: ['Torah', 'Gospel', 'Quran', 'Psalms'],
    correctAnswer: 2,
    explanation: 'The Quran is the holy book revealed to Prophet Muhammad (ﷺ).',
    difficulty: 'easy',
    category: 'quran'
  },
  {
    id: 'e5',
    question: 'What is the name of the last Prophet?',
    options: ['Ibrahim (AS)', 'Musa (AS)', 'Isa (AS)', 'Muhammad (ﷺ)'],
    correctAnswer: 3,
    explanation: 'Prophet Muhammad (ﷺ) is the final messenger of Allah.',
    difficulty: 'easy',
    category: 'prophets'
  },
  {
    id: 'e6',
    question: 'Which month do Muslims fast in?',
    options: ['Shaban', 'Ramadan', 'Muharram', 'Rajab'],
    correctAnswer: 1,
    explanation: 'Muslims fast during the blessed month of Ramadan.',
    difficulty: 'easy',
    category: 'fasting'
  },
  {
    id: 'e7',
    question: 'What do we say before eating?',
    options: ['Alhamdulillah', 'Bismillah', 'MashAllah', 'SubhanAllah'],
    correctAnswer: 1,
    explanation: 'We say "Bismillah" (In the name of Allah) before eating.',
    difficulty: 'easy',
    category: 'daily'
  },
  {
    id: 'e8',
    question: 'What is the Islamic greeting?',
    options: ['Hello', 'Good morning', 'Assalamu Alaikum', 'Salam'],
    correctAnswer: 2,
    explanation: '"Assalamu Alaikum" means "Peace be upon you".',
    difficulty: 'easy',
    category: 'daily'
  },
  {
    id: 'e9',
    question: 'How many surahs are in the Quran?',
    options: ['100', '114', '120', '30'],
    correctAnswer: 1,
    explanation: 'The Quran contains 114 surahs (chapters).',
    difficulty: 'easy',
    category: 'quran'
  },
  {
    id: 'e10',
    question: 'What is the first surah of the Quran?',
    options: ['Al-Baqarah', 'Al-Fatihah', 'Al-Ikhlas', 'An-Nas'],
    correctAnswer: 1,
    explanation: 'Surah Al-Fatihah (The Opening) is the first surah of the Quran.',
    difficulty: 'easy',
    category: 'quran'
  },

  // MEDIUM QUESTIONS
  {
    id: 'm1',
    question: 'What is the Islamic term for the obligatory charity?',
    options: ['Sadaqah', 'Zakat', 'Khums', 'Fidyah'],
    correctAnswer: 1,
    explanation: 'Zakat is the obligatory charity (2.5% of wealth) that Muslims must pay annually.',
    difficulty: 'medium',
    category: 'basics'
  },
  {
    id: 'm2',
    question: 'Who was the first Caliph after Prophet Muhammad (ﷺ)?',
    options: ['Umar (RA)', 'Uthman (RA)', 'Abu Bakr (RA)', 'Ali (RA)'],
    correctAnswer: 2,
    explanation: 'Abu Bakr As-Siddiq (RA) was the first Caliph of Islam.',
    difficulty: 'medium',
    category: 'history'
  },
  {
    id: 'm3',
    question: 'Which angel brought revelation to Prophet Muhammad (ﷺ)?',
    options: ['Mikail', 'Israfil', 'Jibril', 'Malik'],
    correctAnswer: 2,
    explanation: 'Angel Jibril (Gabriel) brought the Quran to Prophet Muhammad (ﷺ).',
    difficulty: 'medium',
    category: 'angels'
  },
  {
    id: 'm4',
    question: 'What is the name of Prophet Muhammad\'s (ﷺ) first wife?',
    options: ['Aisha (RA)', 'Khadijah (RA)', 'Fatimah (RA)', 'Hafsa (RA)'],
    correctAnswer: 1,
    explanation: 'Khadijah bint Khuwaylid (RA) was the first wife and first believer.',
    difficulty: 'medium',
    category: 'history'
  },
  {
    id: 'm5',
    question: 'In which cave did Prophet Muhammad (ﷺ) receive the first revelation?',
    options: ['Cave of Thawr', 'Cave of Hira', 'Cave of the Seven Sleepers', 'Cave of Machpelah'],
    correctAnswer: 1,
    explanation: 'The first revelation came in the Cave of Hira on the Night of Power.',
    difficulty: 'medium',
    category: 'history'
  },
  {
    id: 'm6',
    question: 'What is Wudu?',
    options: ['Dry ablution', 'Ablution with water', 'Funeral prayer', 'Optional prayer'],
    correctAnswer: 1,
    explanation: 'Wudu is the ritual washing with water before prayer.',
    difficulty: 'medium',
    category: 'salah'
  },
  {
    id: 'm7',
    question: 'What is the night prayer called in Ramadan?',
    options: ['Fajr', 'Taraweeh', 'Janaza', 'Jumu\'ah'],
    correctAnswer: 1,
    explanation: 'Taraweeh is the special night prayer performed during Ramadan.',
    difficulty: 'medium',
    category: 'fasting'
  },
  {
    id: 'm8',
    question: 'Which surah has no Bismillah at the beginning?',
    options: ['Surah Al-Baqarah', 'Surah At-Tawbah', 'Surah Ya-Sin', 'Surah Al-Fatihah'],
    correctAnswer: 1,
    explanation: 'Surah At-Tawbah (Repentance) is the only surah without Bismillah.',
    difficulty: 'medium',
    category: 'quran'
  },
  {
    id: 'm9',
    question: 'What is the direction Muslims face during prayer?',
    options: ['North', 'Jerusalem', 'Makkah (Qibla)', 'Medina'],
    correctAnswer: 2,
    explanation: 'Muslims face the Kaaba in Makkah (Qibla direction) during prayer.',
    difficulty: 'medium',
    category: 'salah'
  },
  {
    id: 'm10',
    question: 'Who was known as "Saifullah" (Sword of Allah)?',
    options: ['Ali (RA)', 'Khalid ibn al-Walid (RA)', 'Umar (RA)', 'Hamzah (RA)'],
    correctAnswer: 1,
    explanation: 'Khalid ibn al-Walid (RA) was given the title "Saifullah" by the Prophet (ﷺ).',
    difficulty: 'medium',
    category: 'history'
  },

  // HARD QUESTIONS
  {
    id: 'h1',
    question: 'What is the name of Prophet Muhammad\'s (ﷺ) nursing mother (wet nurse)?',
    options: ['Aminah', 'Halimah', 'Khadijah', 'Fatimah'],
    correctAnswer: 1,
    explanation: 'Halimah As-Sa\'diyah was the Prophet\'s (ﷺ) nursing mother who cared for him in the desert.',
    difficulty: 'hard',
    category: 'seerah'
  },
  {
    id: 'h2',
    question: 'Which of Prophet Muhammad\'s (ﷺ) uncles rejected Islam until death?',
    options: ['Hamzah', 'Abbas', 'Abu Talib', 'Abu Lahab'],
    correctAnswer: 2,
    explanation: 'Abu Talib, despite protecting the Prophet (ﷺ), never accepted Islam. Abu Lahab was an enemy of Islam.',
    difficulty: 'hard',
    category: 'seerah'
  },
  {
    id: 'h3',
    question: 'How many prophets are mentioned by name in the Quran?',
    options: ['25', '50', '124,000', '99'],
    correctAnswer: 0,
    explanation: '25 prophets are mentioned by name in the Quran, though traditions say there were 124,000 prophets.',
    difficulty: 'hard',
    category: 'prophets'
  },
  {
    id: 'h4',
    question: 'What is the only surah that does not begin with Bismillah and also contains a Bismillah within it?',
    options: ['Surah An-Naml', 'Surah At-Tawbah', 'Surah Al-Fatihah', 'Surah Ya-Sin'],
    correctAnswer: 0,
    explanation: 'Surah An-Naml contains the Bismillah of Prophet Sulaiman\'s (AS) letter to the Queen of Sheba.',
    difficulty: 'hard',
    category: 'quran'
  },
  {
    id: 'h5',
    question: 'Which companion was the first to compile the Quran into a complete book?',
    options: ['Abu Bakr (RA)', 'Umar (RA)', 'Uthman (RA)', 'Ali (RA)'],
    correctAnswer: 2,
    explanation: 'Uthman (RA) commissioned the standardization of the Quran into one text.',
    difficulty: 'hard',
    category: 'history'
  },
  {
    id: 'h6',
    question: 'What was the name of the bird that Allah sent to teach Qabil (Cain) how to bury his brother?',
    options: ['Crow', 'Eagle', 'Dove', 'Raven'],
    correctAnswer: 0,
    explanation: 'Allah sent a crow (raven) to scratch the ground to show Qabil how to bury his brother Habil.',
    difficulty: 'hard',
    category: 'quran'
  },
  {
    id: 'h7',
    question: 'What is the longest surah in the Quran?',
    options: ['Surah Al-Imran', 'Surah An-Nisa', 'Surah Al-Baqarah', 'Surah Al-Maidah'],
    correctAnswer: 2,
    explanation: 'Surah Al-Baqarah (The Cow) is the longest surah with 286 ayahs.',
    difficulty: 'hard',
    category: 'quran'
  },
  {
    id: 'h8',
    question: 'What year did the Hijrah (migration to Medina) take place?',
    options: ['610 CE', '620 CE', '622 CE', '632 CE'],
    correctAnswer: 2,
    explanation: 'The Hijrah took place in 622 CE, marking the start of the Islamic calendar.',
    difficulty: 'hard',
    category: 'history'
  },
  {
    id: 'h9',
    question: 'Which prophet could speak to animals?',
    options: ['Prophet Dawud (AS)', 'Prophet Sulaiman (AS)', 'Prophet Isa (AS)', 'Prophet Muhammad (ﷺ)'],
    correctAnswer: 1,
    explanation: 'Allah blessed Prophet Sulaiman (AS) with the ability to understand and speak with animals and jinn.',
    difficulty: 'hard',
    category: 'prophets'
  },
  {
    id: 'h10',
    question: 'What is the name of the gate of Jannah reserved for those who fast often?',
    options: ['Bab As-Salam', 'Bab Ar-Rayyan', 'Bab Al-Hamd', 'Bab At-Tawbah'],
    correctAnswer: 1,
    explanation: 'Bab Ar-Rayyan is the gate of Jannah exclusively for those who fast.',
    difficulty: 'hard',
    category: 'fasting'
  },

  // HOLY MOLY QUESTIONS (Expert Level)
  {
    id: 'hm1',
    question: 'What is the exact number of ayahs in Surah Al-Baqarah?',
    options: ['280', '285', '286', '290'],
    correctAnswer: 2,
    explanation: 'Surah Al-Baqarah contains exactly 286 ayahs.',
    difficulty: 'holymoly',
    category: 'quran'
  },
  {
    id: 'hm2',
    question: 'Which Sahabi\'s recitation was described by the Prophet (ﷺ) as "the Quran recited as it was revealed"?',
    options: ['Abu Bakr (RA)', 'Umar (RA)', 'Abdullah ibn Mas\'ud (RA)', 'Uthman (RA)'],
    correctAnswer: 2,
    explanation: 'The Prophet (ﷺ) said about Ibn Mas\'ud: "Whoever wants to hear the Quran fresh as it was revealed, let him hear it from Ibn Mas\'ud."',
    difficulty: 'holymoly',
    category: 'quran'
  },
  {
    id: 'hm3',
    question: 'What is the total number of sujud (prostrations) in the Quran (ayat as-sajdah)?',
    options: ['10', '14', '15', '11'],
    correctAnswer: 2,
    explanation: 'There are 15 verses of prostration (ayat as-sajdah) in the Quran.',
    difficulty: 'holymoly',
    category: 'quran'
  },
  {
    id: 'hm4',
    question: 'What year did the Year of Sorrow (Aam al-Huzn) occur?',
    options: ['5th year of Prophethood', '7th year of Prophethood', '10th year of Prophethood', '12th year of Prophethood'],
    correctAnswer: 2,
    explanation: 'The Year of Sorrow (10th year) was when Khadijah (RA) and Abu Talib both passed away.',
    difficulty: 'holymoly',
    category: 'seerah'
  },
  {
    id: 'hm5',
    question: 'What is the longest word in the Quran (by letter count)?',
    options: ['كتابيكم', 'فأسقيناكموه', 'أنلزمكموها', 'فكهين'],
    correctAnswer: 1,
    explanation: '"فأسقيناكموه" (So We gave you drink from it) has 11 letters and appears in Surah Al-Hijr 15:22.',
    difficulty: 'holymoly',
    category: 'quran'
  },
  {
    id: 'hm6',
    question: 'How many times is the word "Muhammad" mentioned in the Quran?',
    options: ['2 times', '3 times', '4 times', '5 times'],
    correctAnswer: 2,
    explanation: 'The name "Muhammad" appears 4 times in the Quran (3:144, 33:40, 47:2, 48:29).',
    difficulty: 'holymoly',
    category: 'quran'
  },
  {
    id: 'hm7',
    question: 'Which companion led the prayer during the Prophet\'s (ﷺ) final illness?',
    options: ['Abu Bakr (RA)', 'Umar (RA)', 'Ali (RA)', 'Bilal (RA)'],
    correctAnswer: 0,
    explanation: 'Abu Bakr (RA) led the prayers during the Prophet\'s (ﷺ) final days.',
    difficulty: 'holymoly',
    category: 'seerah'
  },
  {
    id: 'hm8',
    question: 'What was the last surah revealed to the Prophet (ﷺ)?',
    options: ['Surah Al-Ma\'idah', 'Surah An-Nasr', 'Surah Al-Ikhlas', 'Surah At-Tawbah'],
    correctAnswer: 1,
    explanation: 'Most scholars consider Surah An-Nasr (110) to be the last complete surah revealed.',
    difficulty: 'holymoly',
    category: 'quran'
  },
  {
    id: 'hm9',
    question: 'How many daughters did Prophet Muhammad (ﷺ) have?',
    options: ['2', '3', '4', '5'],
    correctAnswer: 2,
    explanation: 'The Prophet (ﷺ) had 4 daughters: Zainab, Ruqayyah, Umm Kulthum, and Fatimah (RA).',
    difficulty: 'holymoly',
    category: 'seerah'
  },
  {
    id: 'hm10',
    question: 'Which prophet is mentioned the most in the Quran?',
    options: ['Prophet Muhammad (ﷺ)', 'Prophet Musa (AS)', 'Prophet Ibrahim (AS)', 'Prophet Isa (AS)'],
    correctAnswer: 1,
    explanation: 'Prophet Musa (Moses) AS is mentioned 136 times, the most of any prophet in the Quran.',
    difficulty: 'holymoly',
    category: 'prophets'
  },
]

// Recitation challenges
const RECITATION_CHALLENGES = [
  {
    id: 'r1',
    question: 'Recite Surah Al-Kauthar',
    arabicText: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ ۝ فَصَلِّ لِرَبِّكَ وَانْحَرْ ۝ إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ',
    instruction: 'Read Surah Al-Kauthar (108) - The smallest complete surah',
    options: ['I have read it', 'I need to practice', 'Help me learn it'],
    correctAnswer: 0,
    explanation: 'Surah Al-Kauthar has 3 ayahs and was revealed to console the Prophet (ﷺ).',
    difficulty: 'easy',
    category: 'recitation'
  },
  {
    id: 'r2',
    question: 'Recite Ayat al-Kursi (2:255)',
    arabicText: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...',
    instruction: 'Read the Verse of the Throne - greatest verse in the Quran',
    options: ['I have read it', 'I know parts of it', 'I need to learn it'],
    correctAnswer: 0,
    explanation: 'Ayat al-Kursi is the greatest verse in the Quran and protects the reciter.',
    difficulty: 'medium',
    category: 'recitation'
  },
  {
    id: 'r3',
    question: 'Recite Dua Qunoot',
    arabicText: 'اللَّهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ...',
    instruction: 'Read the Qunoot supplication said in Witr prayer',
    options: ['I have read it', 'I know parts of it', 'I need to learn it'],
    correctAnswer: 0,
    explanation: 'Dua Qunoot is recited in the last rak\'ah of Witr prayer.',
    difficulty: 'hard',
    category: 'recitation'
  },
]

const STORAGE_KEY = 'masjid-quiz-leaderboard'
const RULES_KEY = 'masjid-quiz-rules-accepted'

export default function IslamicQuizGame() {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'holymoly' | null>(null)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [quizEnded, setQuizEnded] = useState(false)
  // Load leaderboard from localStorage - using lazy initialization pattern
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    if (typeof window === 'undefined') return []
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  })
  const [showLeaderboardInput, setShowLeaderboardInput] = useState(false)
  const [playerName, setPlayerName] = useState('')
  const [rulesAccepted, setRulesAccepted] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(RULES_KEY) === 'true'
  })
  const [showRules, setShowRules] = useState(() => {
    if (typeof window === 'undefined') return true
    return localStorage.getItem(RULES_KEY) !== 'true'
  })
  const [timeLeft, setTimeLeft] = useState(30)
  const [timerActive, setTimerActive] = useState(false)

  // Timer effect - using interval for smoother countdown
  useEffect(() => {
    if (!timerActive || showExplanation || quizEnded) return
    
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          // Handle timeout after state update
          setTimeout(() => {
            setSelectedAnswer(-1)
            setShowExplanation(true)
            setTimeout(() => {
              if (currentQuestion >= questions.length - 1) {
                setQuizEnded(true)
                setShowResult(true)
                setShowLeaderboardInput(true)
                setTimerActive(false)
              } else {
                setCurrentQuestion(c => c + 1)
                setSelectedAnswer(null)
                setShowExplanation(false)
                setTimeLeft(difficulty === 'holymoly' ? 15 : difficulty === 'hard' ? 20 : 30)
                setTimerActive(true)
              }
            }, 3000)
          }, 0)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timerActive, showExplanation, quizEnded, currentQuestion, questions.length, difficulty])

  const acceptRules = () => {
    setRulesAccepted(true)
    setShowRules(false)
    localStorage.setItem(RULES_KEY, 'true')
  }

  const startQuiz = (diff: 'easy' | 'medium' | 'hard' | 'holymoly') => {
    setDifficulty(diff)
    const difficultyQuestions = QUIZ_QUESTIONS.filter(q => q.difficulty === diff)
    const shuffled = [...difficultyQuestions].sort(() => Math.random() - 0.5).slice(0, 10)
    
    // Add recitation challenge for medium and above
    if (diff !== 'easy') {
      const recitation = RECITATION_CHALLENGES[Math.floor(Math.random() * RECITATION_CHALLENGES.length)]
      shuffled.push(recitation)
    }
    
    setQuestions(shuffled)
    setCurrentQuestion(0)
    setScore(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setShowExplanation(false)
    setQuizEnded(false)
    setShowLeaderboardInput(false)
    setTimeLeft(diff === 'holymoly' ? 15 : diff === 'hard' ? 20 : 30)
    setTimerActive(true)
  }

  const handleAnswer = (answerIndex: number) => {
    if (showExplanation) return
    
    setSelectedAnswer(answerIndex)
    setTimerActive(false)
    
    const correct = answerIndex === questions[currentQuestion].correctAnswer
    if (correct) {
      const points = difficulty === 'holymoly' ? 3 : difficulty === 'hard' ? 2 : 1
      const timeBonus = Math.floor(timeLeft / 10)
      setScore(s => s + points + timeBonus)
    }
    
    setShowExplanation(true)
    setTimeout(() => nextQuestion(), 3000)
  }

  const nextQuestion = () => {
    if (currentQuestion >= questions.length - 1) {
      setQuizEnded(true)
      setShowResult(true)
      setShowLeaderboardInput(true)
      setTimerActive(false)
    } else {
      setCurrentQuestion(c => c + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
      setTimeLeft(difficulty === 'holymoly' ? 15 : difficulty === 'hard' ? 20 : 30)
      setTimerActive(true)
    }
  }

  const saveToLeaderboard = () => {
    if (!playerName.trim()) return
    
    const entry: LeaderboardEntry = {
      name: playerName.trim(),
      score,
      totalQuestions: questions.length,
      difficulty: difficulty || 'easy',
      date: new Date().toLocaleDateString()
    }
    
    const newLeaderboard = [...leaderboard, entry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
    
    setLeaderboard(newLeaderboard)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newLeaderboard))
    setShowLeaderboardInput(false)
  }

  const resetQuiz = () => {
    setDifficulty(null)
    setQuestions([])
    setCurrentQuestion(0)
    setScore(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setShowExplanation(false)
    setQuizEnded(false)
    setShowLeaderboardInput(false)
    setTimeLeft(30)
    setTimerActive(false)
  }

  // Get current question
  const currentQ = questions[currentQuestion]

  // Show rules screen first
  if (showRules && !rulesAccepted) {
    return (
      <div className="space-y-4">
        <div className="card bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200">
          <div className="text-center py-4">
            <span className="text-5xl">⚠️</span>
            <h3 className="font-bold text-primary mt-2 text-xl">Islamic Quiz Rules</h3>
          </div>
        </div>
        
        <div className="card bg-white border-2 border-primary/20">
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-bold text-yellow-800 mb-2">🚫 Strict Rules - Allah is Watching!</h4>
              <ul className="text-sm text-yellow-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-red-500">❌</span>
                  <span><strong>No devices</strong> - No phones, tablets, or computers for looking up answers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">❌</span>
                  <span><strong>No Google</strong> - No searching on the internet</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">❌</span>
                  <span><strong>No AI assistance</strong> - No ChatGPT, Siri, or any AI help</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">❌</span>
                  <span><strong>No asking others</strong> - Answer on your own knowledge only</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-bold text-green-800 mb-2">✅ What You CAN Do:</h4>
              <ul className="text-sm text-green-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Use your own knowledge from Quran, Hadith, and Islamic studies</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Recite from memory for recitation challenges</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Answer with sincerity and intention to learn</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p className="text-sm text-blue-700">
                <strong>Remember:</strong> The purpose is to learn and test YOUR knowledge. 
                Cheating defeats the purpose and is not pleasing to Allah.
              </p>
              <p className="text-lg font-bold text-primary mt-2">اللّٰهُ يَرَى (Allah is Watching)</p>
            </div>
            
            <button 
              onClick={acceptRules}
              className="btn-primary w-full py-4 text-lg font-bold"
            >
              ✅ I Accept These Rules - Let Me Play!
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Show difficulty selection
  if (!difficulty) {
    return (
      <div className="space-y-4">
        <div className="card bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
          <div className="text-center py-4">
            <span className="text-5xl">🎯</span>
            <h3 className="font-bold text-primary mt-2 text-xl">Islamic Quiz Challenge</h3>
            <p className="text-sm text-gray-600 mt-1">Test your Islamic knowledge!</p>
          </div>
        </div>

        {/* Leaderboard */}
        {leaderboard.length > 0 && (
          <div className="card bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200">
            <h4 className="font-bold text-primary mb-3 text-center">🏆 Top Scores</h4>
            <div className="space-y-2">
              {leaderboard.slice(0, 3).map((entry, idx) => (
                <div key={idx} className={`flex items-center gap-3 p-2 rounded-lg ${
                  idx === 0 ? 'bg-yellow-100' : idx === 1 ? 'bg-gray-100' : 'bg-orange-100'
                }`}>
                  <span className="text-2xl">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}</span>
                  <div className="flex-1">
                    <p className="font-medium">{entry.name}</p>
                    <p className="text-xs text-gray-500">{entry.difficulty} • {entry.date}</p>
                  </div>
                  <span className="font-bold text-primary">{entry.score} pts</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <h4 className="font-bold text-primary">Select Difficulty:</h4>
          
          <button 
            onClick={() => startQuiz('easy')}
            className="card w-full text-left bg-green-50 hover:bg-green-100 border-2 border-green-200 hover:border-green-400 transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">🌱</span>
              <div>
                <p className="font-bold text-green-700">Easy</p>
                <p className="text-sm text-gray-600">Basic Islamic knowledge • 30 sec/question • 1 pt each</p>
              </div>
            </div>
          </button>
          
          <button 
            onClick={() => startQuiz('medium')}
            className="card w-full text-left bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 hover:border-blue-400 transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">📖</span>
              <div>
                <p className="font-bold text-blue-700">Medium</p>
                <p className="text-sm text-gray-600">Islamic history & practices • 30 sec/question • 1-2 pts + bonus</p>
              </div>
            </div>
          </button>
          
          <button 
            onClick={() => startQuiz('hard')}
            className="card w-full text-left bg-orange-50 hover:bg-orange-100 border-2 border-orange-200 hover:border-orange-400 transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">🔥</span>
              <div>
                <p className="font-bold text-orange-700">Hard</p>
                <p className="text-sm text-gray-600">Seerah & Quran details • 20 sec/question • 2 pts + time bonus</p>
              </div>
            </div>
          </button>
          
          <button 
            onClick={() => startQuiz('holymoly')}
            className="card w-full text-left bg-red-50 hover:bg-red-100 border-2 border-red-200 hover:border-red-400 transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">⚡</span>
              <div>
                <p className="font-bold text-red-700">Holy Moly!</p>
                <p className="text-sm text-gray-600">Expert level • 15 sec/question • 3 pts + time bonus</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    )
  }

  // Show quiz ended screen with leaderboard input
  if (quizEnded && showLeaderboardInput) {
    return (
      <div className="space-y-4">
        <div className="card bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 text-center">
          <span className="text-6xl">🎉</span>
          <h3 className="font-bold text-primary mt-2 text-xl">Quiz Complete!</h3>
          <p className="text-4xl font-bold text-primary mt-4">{score} points</p>
          <p className="text-sm text-gray-600 mt-1">
            {currentQuestion + 1} questions • {difficulty} difficulty
          </p>
        </div>
        
        <div className="card">
          <h4 className="font-bold text-primary mb-3">Save Your Score</h4>
          <input
            type="text"
            placeholder="Enter your name..."
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="form-input w-full mb-3"
            maxLength={20}
          />
          <button 
            onClick={saveToLeaderboard}
            disabled={!playerName.trim()}
            className="btn-primary w-full disabled:opacity-50"
          >
            Save to Leaderboard
          </button>
        </div>
        
        <button 
          onClick={resetQuiz}
          className="btn-outline w-full"
        >
          Play Again
        </button>
      </div>
    )
  }

  // Show result after quiz ended
  if (showResult) {
    return (
      <div className="space-y-4">
        <div className="card bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 text-center">
          <span className="text-6xl">
            {score >= questions.length * 2 ? '🏆' : score >= questions.length ? '⭐' : '💪'}
          </span>
          <h3 className="font-bold text-primary mt-2 text-xl">
            {score >= questions.length * 2 ? 'MashAllah! Excellent!' : score >= questions.length ? 'Great Job!' : 'Keep Learning!'}
          </h3>
          <p className="text-4xl font-bold text-primary mt-4">{score} points</p>
          <p className="text-sm text-gray-600 mt-1">
            {questions.length} questions • {difficulty} difficulty
          </p>
        </div>
        
        {/* Leaderboard */}
        {leaderboard.length > 0 && (
          <div className="card bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200">
            <h4 className="font-bold text-primary mb-3 text-center">🏆 Leaderboard</h4>
            <div className="space-y-2">
              {leaderboard.slice(0, 5).map((entry, idx) => (
                <div key={idx} className={`flex items-center gap-3 p-2 rounded-lg ${
                  idx === 0 ? 'bg-yellow-100' : idx === 1 ? 'bg-gray-100' : idx === 2 ? 'bg-orange-100' : 'bg-white'
                }`}>
                  <span className="text-xl w-6 text-center">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}.`}</span>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{entry.name}</p>
                    <p className="text-xs text-gray-500">{entry.difficulty}</p>
                  </div>
                  <span className="font-bold text-primary text-sm">{entry.score} pts</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <button 
          onClick={resetQuiz}
          className="btn-primary w-full"
        >
          Play Again
        </button>
      </div>
    )
  }

  // Show quiz question
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="card bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-80">Question {currentQuestion + 1} of {questions.length}</p>
            <p className="text-2xl font-bold">{score} pts</p>
          </div>
          <div className="text-right">
            <p className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-200 animate-pulse' : ''}`}>
              ⏱️ {timeLeft}s
            </p>
            <p className="text-xs opacity-80 capitalize">{difficulty}</p>
          </div>
        </div>
        <div className="mt-2 w-full bg-white/20 rounded-full h-2">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Timer bar */}
      <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ${
            timeLeft <= 10 ? 'bg-red-500' : timeLeft <= 20 ? 'bg-yellow-500' : 'bg-green-500'
          }`}
          style={{ width: `${(timeLeft / (difficulty === 'holymoly' ? 15 : difficulty === 'hard' ? 20 : 30)) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="card border-2 border-primary/20">
        <h4 className="font-bold text-primary text-lg mb-2">{currentQ?.question}</h4>
        
        {/* Arabic text for recitation questions */}
        {currentQ?.arabicText && (
          <div className="bg-gradient-to-r from-primary/5 to-emerald-50 rounded-lg p-4 mb-4 text-center border border-primary/10">
            <p className="arabic-text text-2xl leading-relaxed" dir="rtl">{currentQ.arabicText}</p>
            {currentQ.instruction && (
              <p className="text-sm text-gray-500 mt-2">{currentQ.instruction}</p>
            )}
          </div>
        )}
        
        {/* Options */}
        <div className="space-y-2">
          {currentQ?.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              disabled={showExplanation}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                showExplanation
                  ? selectedAnswer === idx
                    ? idx === currentQ.correctAnswer
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-red-500 bg-red-50 text-red-700'
                    : idx === currentQ.correctAnswer
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 text-gray-500'
                  : 'border-gray-200 hover:border-primary hover:bg-primary/5'
              }`}
            >
              <span className="font-medium">{String.fromCharCode(65 + idx)}.</span> {option}
            </button>
          ))}
        </div>
      </div>

      {/* Explanation */}
      {showExplanation && currentQ?.explanation && (
        <div className="card bg-blue-50 border-2 border-blue-200">
          <h4 className="font-bold text-blue-700 mb-2">📚 Explanation</h4>
          <p className="text-sm text-blue-600">{currentQ.explanation}</p>
        </div>
      )}
    </div>
  )
}
