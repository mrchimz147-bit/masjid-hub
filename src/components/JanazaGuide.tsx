'use client'

import { useState } from 'react'

export default function JanazaGuide() {
  const [expandedStep, setExpandedStep] = useState<number | null>(null)

  const steps = [
    {
      number: 1,
      title: 'When Death Occurs',
      icon: '🤲',
      content: `When a Muslim passes away, immediately:
      
1. Close the eyes of the deceased
2. Straighten the limbs and bind the jaw
3. Cover the body with a clean sheet
4. Recite: "Inna lillahi wa inna ilayhi raji'un" (Verily we belong to Allah, and verily to Him do we return)
5. Inform family members and the masjid
6. Contact the masjid janaza coordinator`,
      arabic: 'إِنَّا لِلّهِ وَإِنَّـا إِلَيْهِ رَاجِعونَ',
      transliteration: 'Inna lillahi wa inna ilayhi raji\'un'
    },
    {
      number: 2,
      title: 'Contact the Masjid',
      icon: '📞',
      content: `Contact Zeenat-ul-Islam Masjid immediately:

📞 Emergency Contact: [To be updated by admin]
📞 Imam: [To be updated by admin]
📞 Janaza Coordinator: [To be updated by admin]

The masjid will:
- Arrange for ghusl (washing)
- Prepare the kafan (shroud)
- Coordinate burial arrangements
- Announce funeral prayers`,
      contact: true
    },
    {
      number: 3,
      title: 'Ghusl (Washing the Body)',
      icon: '💧',
      content: `The deceased should be washed by same-gender Muslims:

For Males:
- Close male relatives or experienced persons
- Masjid has a designated ghusl area

For Females:
- Close female relatives or experienced persons
- Private area for ghusl

The Process:
1. Perform wudu on the deceased
2. Wash the body with water and sidr (lotus) leaves or soap
3. Wash odd number of times (3, 5, or 7)
4. Use camphor or perfume in final wash
5. Dry the body gently`,
      important: 'Only experienced persons should perform ghusl. The masjid can arrange trained volunteers.'
    },
    {
      number: 4,
      title: 'Kafan (Shrouding)',
      icon: '👕',
      content: `The deceased is wrapped in simple white cloth:

For Males (3 pieces):
1. Izaar (lower garment)
2. Qamis (upper garment)  
3. Lifafa (large sheet)

For Females (5 pieces):
1. Izaar
2. Qamis
3. Khimar (head covering)
4. Sinna-band (chest wrap)
5. Lifafa

Cost: The masjid can provide kafan or family may purchase. Approximate cost: $20-50.`,
      note: 'Simple white cloth is Sunnah. Expensive shrouds are discouraged.'
    },
    {
      number: 5,
      title: 'Salat al-Janaza (Funeral Prayer)',
      icon: '🕌',
      content: `The funeral prayer is Fard Kifayah (communal obligation):

How to Perform:
1. Stand in rows facing the Qibla
2. Body placed in front of imam
3. Intention (Niyyah) for janaza prayer
4. Say Allahu Akbar 4 times (no ruku or sujud)

Takbir 1: Recite Al-Fatiha
Takbir 2: Send salawat on Prophet (PBUH)
Takbir 3: Make dua for deceased
Takbir 4: Make dua for all Muslims

End with Salam to right and left.`,
      arabic: 'اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ',
      transliteration: 'Allahummaghfir lahu warhamhu',
      translation: 'O Allah, forgive him/her and have mercy on him/her'
    },
    {
      number: 6,
      title: 'Burial',
      icon: ' gravesite.',
      content: `The burial should be as soon as possible:

Grave Preparation:
- Depth: At least chest height
- Lahad (niche) on Qibla side preferred
- Body placed on right side facing Qibla

Burial Process:
1. Men carry the body to gravesite
2. Lower body gently, feet first
3. Place body on right side, face towards Qibla
4. Uncover the face
5. Recite: "Bismillahi wa 'ala millati Rasulillah"
6. Fill grave with soil
7. Recite Quran and make dua

Women do not typically go to the gravesite during burial.`,
      important: 'Bulawayo Cemetery: [Location to be added by admin]'
    },
    {
      number: 7,
      title: 'After Burial',
      icon: '🤲',
      content: `What to do after burial:

For Family:
- Observe Iddah (for widows - 4 months 10 days)
- Allow time for grief
- Accept condolences briefly

For Community:
- Send food to family for 3 days
- Make dua for deceased regularly
- Visit family to offer support
- Avoid excessive wailing

Recommended Actions:
- Give Sadaqah on behalf of deceased
- Recite Quran and send reward
- Pay any outstanding debts of deceased
- Fulfill any bequests (wasiyyah)`,
      hadith: 'The Prophet (PBUH) said: "When a person dies, all their deeds end except three: Sadaqah Jariyah, beneficial knowledge, or a righteous child who prays for them."'
    }
  ]

  const faqs = [
    {
      q: 'Can non-Muslims attend the funeral?',
      a: 'Yes, non-Muslims may attend out of respect but should observe respectfully and not participate in the prayer.'
    },
    {
      q: 'What if death occurs at night?',
      a: 'Contact the masjid emergency number. The body can be kept at home or a morgue until morning for ghusl.'
    },
    {
      q: 'Can a woman perform ghusl for her husband?',
      a: 'Yes, a wife can perform ghusl for her husband. Similarly, a husband can perform ghusl for his wife.'
    },
    {
      q: 'What about organ donation?',
      a: 'Many scholars permit organ donation if it saves a life. Consult the Imam for specific guidance.'
    },
    {
      q: 'Is cremation allowed?',
      a: 'No, cremation is strictly forbidden in Islam. The body must be buried.'
    },
    {
      q: 'What if family cannot afford burial costs?',
      a: 'The masjid has a burial fund to assist those in need. No Muslim should be denied a proper Islamic burial due to financial constraints.'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary text-white p-6 text-center">
        <span className="text-4xl">🤲</span>
        <h1 className="text-2xl font-bold mt-2">Janaza Guide</h1>
        <p className="text-sm opacity-80 mt-1">What to do when a Muslim passes away</p>
      </div>

      {/* Emergency Contact */}
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mx-4 mt-4 rounded-r-lg">
        <p className="font-bold text-red-800">🚨 Emergency Contacts</p>
        <p className="text-sm text-red-700 mt-1">
          Masjid Emergency: <span className="font-medium">[Update in Admin Panel]</span>
        </p>
        <p className="text-sm text-red-700">
          Imam Contact: <span className="font-medium">[Update in Admin Panel]</span>
        </p>
      </div>

      {/* Steps */}
      <div className="p-4 space-y-3">
        <h2 className="font-bold text-lg text-primary mb-3">Step-by-Step Guide</h2>
        
        {steps.map((step) => (
          <div key={step.number} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => setExpandedStep(expandedStep === step.number ? null : step.number)}
              className="w-full p-4 flex items-center gap-3 text-left"
            >
              <span className="text-2xl">{step.icon}</span>
              <div className="flex-1">
                <span className="text-xs text-primary font-medium">Step {step.number}</span>
                <p className="font-bold text-gray-800">{step.title}</p>
              </div>
              <span className={`text-primary transition-transform ${expandedStep === step.number ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            
            {expandedStep === step.number && (
              <div className="px-4 pb-4 border-t">
                <p className="text-gray-700 text-sm whitespace-pre-line mt-3">{step.content}</p>
                
                {step.arabic && (
                  <div className="bg-primary/5 rounded-lg p-3 mt-3">
                    <p className="arabic-text text-xl text-center">{step.arabic}</p>
                    {step.transliteration && (
                      <p className="text-center text-sm italic text-gray-600 mt-1">{step.transliteration}</p>
                    )}
                    {step.translation && (
                      <p className="text-center text-xs text-gray-500 mt-1">{step.translation}</p>
                    )}
                  </div>
                )}
                
                {step.important && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mt-3 rounded-r">
                    <p className="text-sm text-yellow-800">⚠️ {step.important}</p>
                  </div>
                )}
                
                {step.note && (
                  <p className="text-xs text-gray-500 italic mt-3">💡 {step.note}</p>
                )}
                
                {step.hadith && (
                  <div className="bg-green-50 border-l-4 border-green-500 p-3 mt-3 rounded-r">
                    <p className="text-sm text-green-800">📖 {step.hadith}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* FAQs */}
      <div className="p-4">
        <h2 className="font-bold text-lg text-primary mb-3">Frequently Asked Questions</h2>
        
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-xl p-4 shadow-sm">
              <p className="font-medium text-gray-800">❓ {faq.q}</p>
              <p className="text-sm text-gray-600 mt-2">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Important Note */}
      <div className="p-4 pb-8">
        <div className="bg-primary/10 rounded-xl p-4 text-center">
          <p className="text-sm text-gray-700">
            For any questions or emergencies, please contact the masjid directly.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            This guide is for educational purposes. Always consult the Imam for specific situations.
          </p>
        </div>
      </div>
    </div>
  )
}
