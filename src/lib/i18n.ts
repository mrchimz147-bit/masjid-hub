// Internationalization for Masjid Hub
// Languages: English (en), Shona (sn), Ndebele (nd)

export type Language = 'en' | 'sn' | 'nd'

export const translations = {
  en: {
    // Navigation
    home: 'Home',
    prayer: 'Prayer',
    learn: 'Learn',
    community: 'Community',
    more: 'More',
    
    // Home
    todaysPrayerTimes: "Today's Prayer Times",
    prayerTimesUnavailable: 'Prayer times unavailable',
    jumuah: "Jumu'ah (Friday Prayer)",
    days: 'Days',
    hours: 'Hours',
    minutes: 'Minutes',
    today: 'Today!',
    until: 'Until',
    khutbah: 'Khutbah',
    nextPrayer: 'Next Prayer',
    enableNotifications: 'Enable Notifications',
    notificationsOn: 'Notifications On',
    playAdhan: 'Play Adhan',
    playing: 'Playing...',
    stop: 'Stop',
    directionsToMasjid: 'Directions to Masjid',
    getDirections: 'Get Directions',
    detectMyLocation: 'Detect My Location',
    kmAway: 'km away',
    liveNow: 'LIVE NOW',
    watch: 'Watch',
    hifzTracker: 'Hifz Tracker',
    tajweed: 'Tajweed',
    learnArabic: 'Learn Arabic',
    qurbani: 'Qurbani',
    supportYourMasjid: 'Support Your Masjid',
    donationDesc: 'Donations for operations & charity',
    donate: 'Donate',
    latestAnnouncements: 'Latest Announcements',
    
    // Prayer names
    fajr: 'Fajr',
    sunrise: 'Sunrise',
    dhuhr: 'Dhuhr',
    asr: 'Asr',
    maghrib: 'Maghrib',
    isha: 'Isha',
    
    // Learn
    wudu: 'Wudu',
    salah: 'Salah',
    duas: 'Duas',
    hifz: 'Hifz',
    arabic: 'Arabic',
    kids: 'Kids',
    janaza: 'Janaza',
    
    // Hifz
    hifzProgress: 'Hifz Progress Tracker',
    memorized: 'Memorized',
    inProgress: 'In Progress',
    needsRevision: 'Needs Revision',
    notStarted: 'Not Started',
    ofSurahsMemorized: 'of 114 surahs memorized',
    juzAmma: 'Juz Amma (Juz 30)',
    allSurahs: 'All Surahs',
    status: 'Status',
    learning: 'Learning',
    revision: 'Revision',
    
    // Tajweed
    tajweedLessons: 'Tajweed Lessons',
    tajweedDesc: 'Master the art of Quran recitation',
    makharij: 'Makharij (Pronunciation Points)',
    sifaat: 'Sifaat (Letter Attributes)',
    nunSakinah: 'Nun Sakinah Rules',
    meemSakinah: 'Meem Sakinah Rules',
    madd: 'Madd (Prolongation)',
    waqf: 'Waqf (Stopping Rules)',
    view: 'View',
    
    // Arabic
    learnArabicTitle: 'Learn Arabic',
    learnArabicDesc: 'Master the Arabic language',
    arabicAlphabet: 'Arabic Alphabet',
    commonVocabulary: 'Common Vocabulary',
    commonPhrases: 'Common Phrases',
    
    // Community
    askSheikh: 'Ask Sheikh',
    askQuestionDesc: 'Submit your Islamic questions to the Imam',
    yourQuestion: 'Your Question',
    enterQuestion: 'Enter your question...',
    submit: 'Submit',
    questionSubmitted: 'Question submitted successfully!',
    aiChat: 'AI Islamic Assistant',
    aiChatDesc: 'Get instant answers based on Shafi fiqh',
    ask: 'Ask',
    loading: 'Loading...',
    
    // Member Registration
    memberRegistration: 'Member Registration',
    memberDesc: 'Join our masjid community',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    city: 'City',
    province: 'Province',
    country: 'Country',
    getLocation: 'Get Location',
    volunteer: 'I can volunteer',
    vulnerable: 'I need regular check-ins',
    emergencyContact: 'Emergency Contact',
    emergencyName: 'Emergency Contact Name',
    register: 'Register',
    registrationSuccess: 'Registration successful!',
    
    // Qurbani
    qurbaniTitle: 'Qurbani Contributions',
    qurbaniDesc: 'Contribute to Qurbani for Eid al-Adha',
    selectAnimal: 'Select Animal',
    shares: 'Shares',
    yourName: 'Your Name',
    donorPhone: 'Phone Number',
    contribute: 'Contribute',
    filled: 'filled',
    full: 'Full',
    
    // Live Stream
    liveStream: 'Live Stream',
    liveStreamDesc: 'Watch live programs from the masjid',
    upcomingStreams: 'Upcoming Streams',
    noLiveStreams: 'No live streams at the moment',
    
    // Alerts
    emergencyAlert: 'Emergency Alert',
    emergencyDesc: 'For vulnerable members - send alert to volunteers',
    sendAlert: 'Send Alert',
    alertSent: 'Alert sent! Help is on the way.',
    volunteers: 'Volunteers',
    volunteersDesc: 'Members who can be contacted for welfare checks and emergency assistance.',
    vulnerableMembers: 'Vulnerable Members',
    vulnerableDesc: 'Elderly, ill, or members living alone who may need regular check-ins.',
    
    // Photo Album
    photoAlbum: 'Photo Album',
    uploadPhoto: 'Upload Photo',
    photoTitle: 'Photo Title',
    photoDescription: 'Description',
    selectCategory: 'Category',
    general: 'General',
    event: 'Event',
    photoSubmitted: 'Photo submitted for review!',
    
    // Tributes
    tributes: 'Tributes',
    shareTribute: 'Share a Tribute',
    name: 'Name',
    relationship: 'Relationship (How did you know him?)',
    yourMessage: 'Your Message',
    submitTribute: 'Submit Tribute',
    tributeSubmitted: 'JazakAllah Khair! Your tribute has been submitted for review.',
    
    // Dedication
    inLovingMemory: 'In Loving Memory of',
    mayAllahHaveMercy: '(May Allah have mercy on him)',
    sadaqahJaariyah: 'Sadaqah Jaariyah',
    dedicationTribute: 'Hajji Dawood Cassim was a pillar of our community - a man of unwavering faith, boundless generosity, and dedication to the House of Allah. His legacy lives on through every soul he touched, every prayer he led, and every heart he warmed with his kindness.',
    dedicationApp: 'This application is dedicated as a Sadaqah Jaariyah (continuous charity) in his blessed memory. May every prayer time reminder, every verse of Quran memorized, every act of worship facilitated through this app be a source of eternal reward for him and his family.',
    dedicationDua: 'O Allah, make this work a continuous charity for him',
    reciteQuranForSoul: 'Recite Quran for His Soul',
    
    // Instructions
    instructions: 'All Instructions Apply Here',
    
    // Daily Content
    hadithOfTheDay: 'Hadith of the Day',
    quranVerseOfTheDay: 'Quran Verse of the Day',
    
    // Settings
    settings: 'Settings',
    language: 'Language',
    english: 'English',
    shona: 'Shona',
    ndebele: 'Ndebele',
    about: 'About',
    contact: 'Contact',
    
    // Offline
    offline: 'Offline',
    offlineMessage: 'You are offline. Some features may be limited.',
    
    // Qibla
    qiblaDirection: 'Qibla Direction',
    fromBulawayo: 'From Bulawayo, face approximately 20° North-East',
    
    // Guide
    previous: '← Previous',
    next: 'Next →',
    
    // Dua
    all: 'All',
    morning: 'Morning',
    evening: 'Evening',
    eating: 'Eating',
    sleeping: 'Sleeping',
    travel: 'Travel',
    mosque: 'Mosque',
    daily: 'Daily',
    
    // Misc
    loadingMasjid: 'Loading Masjid Hub...',
    previewApp: 'Preview App',
    saveAll: 'Save All',
    saving: 'Saving...',
    saved: 'Saved!',
    delete: 'Delete',
    approve: 'Approve',
    feature: 'Feature',
    unfeature: 'Unfeature',
    approveAndFeature: 'Approve & Feature',
    pending: 'Pending',
    approved: 'Approved',
    featured: 'Featured',
    submitted: 'Submitted',
  },
  
  sn: {
    // Navigation
    home: 'Mumba',
    prayer: 'Namata',
    learn: 'Dzidza',
    community: 'Guttu',
    more: 'Zvimwe',
    
    // Home
    todaysPrayerTimes: 'Nguva Dzenamata Nhasi',
    prayerTimesUnavailable: 'Nguva dzenamata hadzikwanisike',
    jumuah: 'Jumu\'ah (Musi weChishanu)',
    days: 'Mazuva',
    hours: 'Maawa',
    minutes: 'Maminitsi',
    today: 'Nhasi!',
    until: 'Kusvika',
    khutbah: 'Khutbah',
    nextPrayer: 'Namata Rinote',
    enableNotifications: 'Bvumidza Zviziviso',
    notificationsOn: 'Zviziviso Panyika',
    playAdhan: 'Tamba Adhan',
    playing: 'Kutamba...',
    stop: 'Mira',
    directionsToMasjid: 'Nzira KuMasjid',
    getDirections: 'Tora Nzira',
    detectMyLocation: 'Ziva Nzvimbo Yangu',
    kmAway: 'km kure',
    liveNow: 'PAZVINO LIVE',
    watch: 'Ona',
    hifzTracker: 'Hifz Tracker',
    tajweed: 'Tajweed',
    learnArabic: 'Dzidza Chiarabhu',
    qurbani: 'Qurbani',
    supportYourMasjid: 'Tsigira Masjid Yenyu',
    donationDesc: 'Mipo yezvikumbiro neubatsiro',
    donate: 'Pa',
    latestAnnouncements: 'Zviziviso Zvinoitwa',
    
    // Prayer names
    fajr: 'Fajr',
    sunrise: 'Zuva rabuda',
    dhuhr: 'Dhuhr',
    asr: 'Asr',
    maghrib: 'Maghrib',
    isha: 'Isha',
    
    // Learn
    wudu: 'Wudu',
    salah: 'Salah',
    duas: 'MaDu\'a',
    hifz: 'Hifz',
    arabic: 'Chiarabhu',
    kids: 'Vana',
    janaza: 'Janaza',
    
    // Hifz
    hifzProgress: 'Hifz Progress Tracker',
    memorized: 'Wakangwara',
    inProgress: 'Uri Kudzidza',
    needsRevision: 'Unoda Kudzokorora',
    notStarted: 'Hauina Kutanga',
    ofSurahsMemorized: 'che 114 surah wakangwara',
    juzAmma: 'Juz Amma (Juz 30)',
    allSurahs: 'Surah Dzose',
    status: 'Mamirire',
    learning: 'Kudzidza',
    revision: 'Kudzokorora',
    
    // Tajweed
    tajweedLessons: 'Dzidzo dzeTajweed',
    tajweedDesc: 'Dzidza kunyora Quran zvakanaka',
    makharij: 'Makharij (Nzvimbo dzeKunyora)',
    sifaat: 'Sifaat (Huwandu hweMavara)',
    nunSakinah: 'Mutemo waNun Sakinah',
    meemSakinah: 'Mutemo waMeem Sakinah',
    madd: 'Madd (Kuredzesa)',
    waqf: 'Waqf (Mitemo yeKumira)',
    view: 'Ona',
    
    // Arabic
    learnArabicTitle: 'Dzidza Chiarabhu',
    learnArabicDesc: 'Dzidza mutauro weChiarabhu',
    arabicAlphabet: 'Alphabet yeChiarabhu',
    commonVocabulary: 'Mashoko Anowanzoshandiswa',
    commonPhrases: 'Mitaro Inowanzoshandiswa',
    
    // Community
    askSheikh: 'Bvunza Sheikh',
    askQuestionDesc: 'Endesa mibvunzo yako yaIslam kuna Imam',
    yourQuestion: 'Mubvunzo Wako',
    enterQuestion: 'Nyora mubvunzo wako...',
    submit: 'Endesa',
    questionSubmitted: 'Mubvunzo watumwa zvakanaka!',
    aiChat: 'AI Mubatsiri weIslam',
    aiChatDesc: 'Tora mhinduro nekukurumidza zvichibva kuShafi fiqh',
    ask: 'Bvunza',
    loading: 'Kutora...',
    
    // Member Registration
    memberRegistration: 'Kunyoreswa KweNhengo',
    memberDesc: 'Joiinha guttu reMasjid',
    firstName: 'Zita Rekutanga',
    lastName: 'Zita Rekumagumo',
    email: 'Email',
    phone: 'Runhare',
    address: 'Kero',
    city: 'Guta',
    province: 'Dunhu',
    country: 'Nyika',
    getLocation: 'Tora Nzvimbo',
    volunteer: 'Ndingashande',
    vulnerable: 'Ndida kutorwa mazano',
    emergencyContact: 'Runhare Rwokunodaidzwa',
    emergencyName: 'Zita ReMunhu Anodaidzwa',
    register: 'Nyoresa',
    registrationSuccess: 'Wanyoreswa zvakanaka!',
    
    // Qurbani
    qurbaniTitle: 'Mibairo yeQurbani',
    qurbaniDesc: 'Chinjai Qurbani yeEid al-Adha',
    selectAnimal: 'Sarudza Mhuka',
    shares: 'Vashare',
    yourName: 'Zita Rako',
    donorPhone: 'Nhamba yerunhare',
    contribute: 'Chinjai',
    filled: 'yazara',
    full: 'Yazara',
    
    // Live Stream
    liveStream: 'Maonero Epfungwa',
    liveStreamDesc: 'Ona mapurogiramu ane hupenyu kubva kuMasjid',
    upcomingStreams: 'Mapurogiramu Anotevera',
    noLiveStreams: 'Hapana mapurogiramu panguva ino',
    
    // Alerts
    emergencyAlert: 'Chiziviso cheDambudziko',
    emergencyDesc: 'Kune nhengo dzinoda rubatsiro - tumira chiziviso kune vashandi',
    sendAlert: 'Tumira Chiziviso',
    alertSent: 'Chiziviso chatumirwa! Rubatsiro rwuri kuuya.',
    volunteers: 'Vashandi',
    volunteersDesc: 'Nhengo dzinogona kudaidzwa kuti dzitore mazano uye kubatsira papikisiro.',
    vulnerableMembers: 'Nhengo Dzinoda Rubatsiro',
    vulnerableDesc: 'Vakwegura, varwari, kana nhenga dzinogara dzoga dzinogona kuda kutorwa mazano.',
    
    // Photo Album
    photoAlbum: 'Chitumbu cheMifananidzo',
    uploadPhoto: 'Tumira Mufananidzo',
    photoTitle: 'Zita reMufananidzo',
    photoDescription: 'Tsatanhudzo',
    selectCategory: 'Kategari',
    general: 'Zvakajairika',
    event: 'Chiitiko',
    photoSubmitted: 'Mufananidzo watumirwa yeongororo!',
    
    // Tributes
    tributes: 'Tsamba',
    shareTribute: 'Gova Tsamba',
    name: 'Zita',
    relationship: 'Hukama (Waimuziva sei?)',
    yourMessage: 'Tsamba Yako',
    submitTribute: 'Endesa Tsamba',
    tributeSubmitted: 'JazakAllah Khair! Tsamba yako yatumwa yakanangana neongororo.',
    TRIBUTE_TITLE: 'Mukuyeuchidza Kwerudo rwa Hajji Dawood Cassim',
    
    // Dedication
    inLovingMemory: 'Mukuyeuchidza Kwerudo rwa Hajji Dawood Cassim',
    mayAllahHaveMercy: '(Allah vagomutsirira netsa)',
    sadaqahJaariyah: 'Sadaqah Jaariyah',
    dedicationTribute: 'Hajji Dawood Cassim aive mbiru yenharaunda yedu - murume aive nekutenda kusingazununguki, rupo rwakakura, uye kuzvipira kuImba yaAllah. Nhaka yake inoramba iripo kuburikidza nemweya wese waakabata, munamato wese waakatungamira, nemoyo wese waakadziisa netsitsi dzake. Iyi purogiramu yakatsaurirwa seSadaqah Jaariyah muchirangaridzo chake chakaropafadzwa.',
    dedicationApp: 'Dai chiyeuchidzo chese chenguva yemunamato, vhesi rese reQuran rinochengetwa mumusoro, uye chiito chese chekunamata chinorerutswa nepurogiramu iyi chive sosi yemubairo wekusingaperi kwaari nemhuri yake.',
    dedicationDua: 'Iwe Allah, ita kuti basa iri rive mubayiro wakataririka kwake',
    reciteQuranForSoul: 'Verenga Quran kuMweya Wake',
    
    // Instructions
    instructions: 'Mirayiridzo Yese Inoshanda Pano',
    
    // Daily Content
    hadithOfTheDay: 'Hadith Yenzhasi',
    quranVerseOfTheDay: 'Tsamba YeQuran Yenzhasi',
    
    // Settings
    settings: 'Masetings',
    language: 'Mutauro',
    english: 'Chirungu',
    shona: 'Shona',
    ndebele: 'Ndebele',
    about: 'Maererano',
    contact: 'Kubata',
    
    // Offline
    offline: 'Hapana Signal',
    offlineMessage: 'Hauina signal. Zvimwe zvinhu hazvigone kushanda.',
    
    // Qibla
    qiblaDirection: 'Nzira yeQibla',
    fromBulawayo: 'Kubva kuBulawayo, tarisa 20° Kuburikidza neMaodzanyemba',
    
    // Guide
    previous: '← Yapfuura',
    next: 'Inotevera →',
    
    // Dua
    all: 'Zvose',
    morning: 'Mangwanani',
    evening: 'Manheru',
    eating: 'Kudya',
    sleeping: 'Kurara',
    travel: 'Kufamba',
    mosque: 'Masjid',
    daily: 'Zuva rose',
    
    // Misc
    loadingMasjid: 'Kutora Masjid Hub...',
    previewApp: 'Ona App',
    saveAll: 'Seza Zvose',
    saving: 'Kuchengeta...',
    saved: 'Chakachengeteka!',
    delete: 'Dzima',
    approve: 'Bvuma',
    feature: 'Taridza',
    unfeature: 'Usataridza',
    approveAndFeature: 'Bvuma uye Taridza',
    pending: 'Yakamirira',
    approved: 'Yakabvumwa',
    featured: 'Yakataridzwa',
    submitted: 'Yatumwa',
  },
  
  nd: {
    // Navigation
    home: 'Ekhaya',
    prayer: 'Ikhule',
    learn: 'Funda',
    community: 'Umphakathi',
    more: 'Okunye',
    
    // Home
    todaysPrayerTimes: 'Izikhathi Zekhule Lamuhla',
    prayerTimesUnavailable: 'Izikhathi zekhule azitholakali',
    jumuah: 'Jumu\'ah (Ilanga lesi-5)',
    days: 'Izinsuku',
    hours: 'Amahora',
    minutes: 'Amaminithi',
    today: 'Lamuhla!',
    until: 'Kuze kube',
    khutbah: 'Khutbah',
    nextPrayer: 'Ikhule Elandelayo',
    enableNotifications: 'Vumela Izaziso',
    notificationsOn: 'Izaziso Zivulekile',
    playAdhan: 'Dlala Adhan',
    playing: 'Iyadlala...',
    stop: 'Misa',
    directionsToMasjid: 'Indlela eya eMasjid',
    getDirections: 'Thatha Indlela',
    detectMyLocation: 'Thola Indawo Yami',
    kmAway: 'km kude',
    liveNow: 'KUSEBENZAYO MANJE',
    watch: 'Buka',
    hifzTracker: 'Hifz Tracker',
    tajweed: 'Tajweed',
    learnArabic: 'Funda Isi-Arabhu',
    qurbani: 'Qurbani',
    supportYourMasjid: 'Sekela iMasjid Yakho',
    donationDesc: 'Izipho zeentengo nosizo',
    donate: 'Nika',
    latestAnnouncements: 'Izaziso Zamuva',
    
    // Prayer names
    fajr: 'Fajr',
    sunrise: 'Likhwezi liphumile',
    dhuhr: 'Dhuhr',
    asr: 'Asr',
    maghrib: 'Maghrib',
    isha: 'Isha',
    
    // Learn
    wudu: 'Wudu',
    salah: 'Salah',
    duas: 'Izicelo',
    hifz: 'Hifz',
    arabic: 'Isi-Arabhu',
    kids: 'Abantwana',
    janaza: 'Janaza',
    
    // Hifz
    hifzProgress: 'Hifz Progress Tracker',
    memorized: 'Ufunde',
    inProgress: 'Uyafunda',
    needsRevision: 'Udinga ukuphinda',
    notStarted: 'Awukqalanga',
    ofSurahsMemorized: 'kwe 114 surah ofundile',
    juzAmma: 'Juz Amma (Juz 30)',
    allSurahs: 'Wonke Amasurah',
    status: 'Isimo',
    learning: 'Ukufunda',
    revision: 'Ukuphinda',
    
    // Tajweed
    tajweedLesons: 'Izifundo zeTajweed',
    tajweedDesc: 'Funda ukufunda iQuran ngendlela efanele',
    makharij: 'Makharij (Izindawo Zokuphimisa)',
    sifaat: 'Sifaat (Izici Zonhlamvu)',
    nunSakinah: 'Imithetho yeNun Sakinah',
    meemSakinah: 'Imithetho yeMeem Sakinah',
    madd: 'Madd (Ukwandisa)',
    waqf: 'Waqf (Imithetho Yokumisa)',
    view: 'Buka',
    
    // Arabic
    learnArabicTitle: 'Funda Isi-Arabhu',
    learnArabicDesc: 'Funda ulimi lwesi-Arabhu',
    arabicAlphabet: 'Alfabethi yesi-Arabhu',
    commonVocabulary: 'Amagama Avamile',
    commonPhrases: 'Izisho Ezivamile',
    
    // Community
    askSheikh: 'Buza Sheikh',
    askQuestionDesc: 'Thumela imibuzo yakho yeSILAM kuya ku-Imam',
    yourQuestion: 'Umbuzo Wakho',
    enterQuestion: 'Faka umbuzo wakho...',
    submit: 'Thumela',
    questionSubmitted: 'Umbuzo uthunyelwe ngempumelelo!',
    aiChat: 'AI Umelusi weSILAM',
    aiChatDesc: 'Thola izimpendulo ngokushesha ngokusekelwe kuShafi fiqh',
    ask: 'Buza',
    loading: 'Iyalayisha...',
    
    // Member Registration
    memberRegistration: 'Ukubhalisa Komphakathi',
    memberDesc: 'Joyina umphakathi weMasjid',
    firstName: 'Igama lokuqala',
    lastName: 'Isibongo',
    email: 'I-imeyili',
    phone: 'Ifoni',
    address: 'Ikheli',
    city: 'IsiGodi',
    province: 'Isifunda',
    country: 'Ilizwe',
    getLocation: 'Thola Indawo',
    volunteer: 'Ngingakusiza',
    vulnerable: 'Ndinga ukupholwa',
    emergencyContact: 'Umntu ozakubizwa',
    emergencyName: 'Igama lomuntu ozakubizwa',
    register: 'Bhalisa',
    registrationSuccess: 'Ubhalisile ngempumelelo!',
    
    // Qurbani
    qurbaniTitle: 'Izabelo zeQurbani',
    qurbaniDesc: 'Yabelana ngeQurbani yeEid al-Adha',
    selectAnimal: 'Khetha Isilwane',
    shares: 'Izabelo',
    yourName: 'Igama Lakho',
    donorPhone: 'Inombolo yefoni',
    contribute: 'Yabelana',
    filled: 'kugcwele',
    full: 'Kugcwele',
    
    // Live Stream
    liveStream: 'Ukusakaza ngokuQhubekayo',
    liveStreamDesc: 'Buka izinhlelo eziphilayo eMasjid',
    upcomingStreams: 'Izinhlelo Ezizayo',
    noLiveStreams: 'Akukho nzinto esakazwayo manje',
    
    // Alerts
    emergencyAlert: 'Isexwayiso Sobuphethe',
    emergencyDesc: 'Kubalulekile abantu abadinga usizo - thumela isexwayiso kubavolontiya',
    sendAlert: 'Thumela Isexwayiso',
    alertSent: 'Isexwayiso sithunyelwe! Usizo luseduze.',
    volunteers: 'Abavolontiya',
    volunteersDesc: 'Izalwane abangabizwa ukuba basize ngokuhlola kanye nosizo lwebanga eliphuthumayo.',
    vulnerableMembers: 'Izalwane Abadinga Usizo',
    vulnerableDesc: 'Abadala, abagulayo, noma abahlala bodwa abangase badinge ukuhlolwa njalo.',
    
    // Photo Album
    photoAlbum: 'I-Albhamu Yezithombe',
    uploadPhoto: 'Layisha Isithombe',
    photoTitle: 'Isihloko Sesithombe',
    photoDescription: 'Incazelo',
    selectCategory: 'Isigaba',
    general: 'Jikelele',
    event: 'Umcedo',
    photoSubmitted: 'Isithombe sithunyelwe kuqashelwe!',
    
    // Tributes
    tributes: 'Izindaba',
    shareTribute: 'Yabelana ngezindaba',
    name: 'Igama',
    relationship: 'Ubudlelwano (Ummazi kanjani?)',
    yourMessage: 'Umyalezo Wakho',
    submitTribute: 'Thumela Umyalezo',
    tributeSubmitted: 'JazakAllah Khair! Umyalezo wakho uthunyelwe ukuze uqwalaselwe.',
    TRIBUTE_TITLE: 'Isikhumbuzo Sothando sika Hajji Dawood Cassim',
    
    // Dedication
    inLovingMemory: 'Isikhumbuzo Sothando sika Hajji Dawood Cassim',
    mayAllahHaveMercy: '(uAllah amncoe)',
    sadaqahJaariyah: 'Sadaqah Jaariyah',
    dedicationTribute: 'UHajji Dawood Cassim wayeyisihlalo somphakathi wethu - umuntu onokholo olungaziwa, ukupha okungapheli, intshiseko kwiNdlu kaAllah. Ifa lakhe lihlala ngokuphila kwempilo yamunye umuntu awathintayo, isithandathu sonke asiholayo, nenyongo yamunye umuntu ayenzayo.',
    dedicationApp: 'Le application inikezelwe njengeSadaqah Jaariyah (iphalo elihlala njalo) enkumbulweni yakhe. Ma sikhumbuzo sonke sikhumbuzo sesikhathi somthandazo, ivevesi leQuran elifundwayo, isenzo sonke sokhonzayo esivunyelwe kule app kube umthombo wokuphakade kwakhe nalokhulu.',
    dedicationDua: 'Wena Allah, yenza lo msebenzi ube umsoco wakhe',
    reciteQuranForSoul: 'Funda Quran kuMoya Wakhe',
    
    // Instructions
    instructions: 'Bonke Imiyalelo Isebenza Lapha',
    
    // Daily Content
    hadithOfTheDay: 'IHadith Yalolusuku',
    quranVerseOfTheDay: 'IVesi LeQur\'an Lalolusuku',
    
    // Settings
    settings: 'Izilungiselelo',
    language: 'Ulimi',
    english: 'IsiNgisi',
    shona: 'Shona',
    ndebele: 'Ndebele',
    about: 'Mayelana',
    contact: 'Thintana',
    
    // Offline
    offline: 'Akukho Signal',
    offlineMessage: 'Awunayo signal. Ezinye izinto azisebenzi.',
    
    // Qibla
    qiblaDirection: 'Isiqondiso seQibla',
    fromBulawayo: 'E-Bulawayo, bheka cishe u-20° Enyakatho Empumalanga',
    
    // Guide
    previous: '← Okudlule',
    next: 'Okulandelayo →',
    
    // Dua
    all: 'Konke',
    morning: 'Ekuseni',
    evening: 'Ebusuku',
    eating: 'Ukudla',
    sleeping: 'Ukulala',
    travel: 'Ukuhamba',
    mosque: 'iMasjid',
    daily: 'Nsuku zonke',
    
    // Misc
    loadingMasjid: 'Iyalayisha iMasjid Hub...',
    previewApp: 'Buka Uhlelo',
    saveAll: 'Gcina Konke',
    saving: 'Iyagcina...',
    saved: 'Kugcinwe!',
    delete: 'Susa',
    approve: 'Vumela',
    feature: 'Bonisa',
    unfeature: 'Ungaboni',
    approveAndFeature: 'Vumela futhi Bonisa',
    pending: 'Kulindile',
    approved: 'Kuvunyelwe',
    featured: 'Kubonisiwe',
    submitted: 'Kuthunyelwe',
  }
}

export function t(key: string, lang: Language): string {
  return translations[lang]?.[key as keyof typeof translations['en']] || translations['en'][key as keyof typeof translations['en']] || key
}
