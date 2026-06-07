import { useMemo, useRef, useState } from 'react'
import './App.css'

const PROMPTS = [
  {
    id: 1,
    image: 'images/item1.png',
    question: 'Τι θα κάνει η μαμά;',
    infoRules: [
      { label: 'Αρκουδάκι', twoPoint: ['αρκουδάκι', 'αρκούδος', 'αρκούδι'], zeroPoint: ['αρκούδα'] }
    ],
    grammarRules: []
  },
  {
    id: 2,
    image: 'images/item2.png',
    question: 'Τι κάνει το κορίτσι;',
    infoRules: [
      { label: 'Μπότες', twoPoint: ['μπότες', 'μπότα', 'γαλότσα'], onePoint: ['παπούτσια'], zeroPoint: ['παντοφλάκια', 'πατίνια', 'πόδι'] },
      { label: 'Κορίτσι', twoPoint: ['κοριτσάκι', 'κόρη', 'κορίτσι'], onePoint: ['κοπέλα', 'παιδί'], zeroPoint: ['της', 'του', 'το'] }
    ],
    grammarRules: []
  },
  {
    id: 3,
    image: 'images/item3.png',
    question: 'Τι έπαθε ο σκύλος;',
    infoRules: [{ label: 'Ξύλο/πάσσαλος', twoPoint: ['ξύλο', 'πάσσαλος', 'κολόνα', 'κορμό'], onePoint: ['δέντρο', 'κλαδί'], zeroPoint: ['κάγκελο'] }],
    grammarRules: [{ label: 'Πρόθεση (με/σε/από)', twoPoint: ['με', 'σε', 'από'] }]
  },
  {
    id: 4,
    image: 'images/item4.png',
    question: 'Πες μας όλα όσα κάνει αυτός ο άντρας',
    infoRules: [{ label: 'Φράχτης/εμπόδιο', twoPoint: ['φράχτη', 'εμπόδιο'], onePoint: ['ξύλινη πόρτα', 'πόρτα'], zeroPoint: ['ξύλο', 'γέφυρα'] }],
    grammarRules: []
  },
  {
    id: 5,
    image: 'images/item5.png',
    question: 'Τι έκανε μόλις τώρα η γάτα;',
    infoRules: [
      { label: 'Πράξη (έπιασε)', twoPoint: ['έπιασε', 'άρπαξε', 'τσάκωσε', 'έχει πιάσει'], onePoint: ['κρατάει', 'πιάνει'], zeroPoint: ['έφαγε', 'τρώει', 'πήρε', 'πάει να φάει', 'όρμησε', 'πατάει', 'κυνηγάει', 'σκότωσε', 'θέλει να φάει', 'θέλει να πιάσει'] },
      { label: 'Δύο', twoPoint: ['δύο', '2'] },
      { label: 'Ποντίκια', twoPoint: ['ποντίκια'], onePoint: ['τροφή', 'ποντίκι'] }
    ],
    grammarRules: [
      { label: 'Συμφωνία ρήματος-υποκειμένου (η γάτα έπιασε)', twoPoint: ['γάτα', 'έπιασε'] },
      { label: 'Πληθυντικός αριθμός (ποντίκια)', twoPoint: ['ποντίκια'] }
    ]
  },
  {
    id: 6,
    image: 'images/item6.png',
    question: 'Τι έπαθε το κορίτσι;',
    infoRules: [
      { label: 'Έσπασε', twoPoint: ['έσπασε', 'έσπασαν'], zeroPoint: ['χάλασε'] },
      { label: 'Γυαλιά', twoPoint: ['γυαλιά'] }
    ],
    grammarRules: [
      { label: 'Παρελθοντικός χρόνος ρήμα 1', twoPoint: ['έπεσε', 'γλίστρησε', 'χτύπησε'] },
      { label: 'Παρελθοντικός χρόνος ρήμα 2', twoPoint: ['έσπασε', 'έσπασαν'] },
      { label: 'Συμφωνία ρήματος-υποκειμένου (το κορίτσι ...)', twoPoint: ['κορίτσι', 'έπεσε'] },
      { label: 'Συμφωνία πληθυντικού (τα γυαλιά έσπασαν)', twoPoint: ['γυαλιά', 'έσπασαν'] },
      { label: 'Οριστικό άρθρο (τα γυαλιά)', twoPoint: ['τα γυαλιά'] }
    ]
  },
  {
    id: 7,
    image: 'images/item7.png',
    question: 'Τι έχει κάνει το μεγάλο κορίτσι;',
    infoRules: [
      { label: 'Ρήμα', twoPoint: ['σηκώνει', 'παίρνει', 'πιάνει', 'έχει αγκαλιά', 'βοηθάει', 'ανέβασε', 'κρατάει'], onePoint: ['βάζει', 'αγκαλιάζει'] },
      { label: 'Μικρό αγόρι', twoPoint: ['μικρό αγόρι', 'αγοράκι', 'μωρό', 'αδελφό', 'παιδάκι', 'το μικρό'], onePoint: ['άνθρωπος', 'το'] },
      { label: 'Γράμμα', twoPoint: ['γράμμα', 'φάκελο'] }
    ],
    grammarRules: [
      { label: 'Οριστικό άρθρο (το παιδί)', twoPoint: ['το παιδί'] },
      { label: 'Αόριστο ή οριστικό άρθρο (το/ένα φάκελο)', twoPoint: ['το φάκελο', 'ένα φάκελο', 'τον φάκελο'] },
      { label: 'Δευτερεύουσα τελική πρόταση (για...)', twoPoint: ['για να'] },
      { label: 'Υποτακτική (να βάλει...)', twoPoint: ['να βάλει', 'να ρίξει', 'να στείλει'] },
      { label: 'Προθετική φράση (μέσα στο)', twoPoint: ['μέσα στο'] }
    ]
  },
  {
    id: 8,
    image: 'images/item8.png',
    question: 'Πες μας τι κάνει ο άντρας',
    infoRules: [
      { label: 'Σκεπή', twoPoint: ['σκεπή', 'κεραμίδια', 'στέγη'], zeroPoint: ['καμινάδα', 'ταράτσα'] },
      { label: 'Ρήμα', twoPoint: ['πιάσει', 'διώξει', 'κατεβάσει', 'φτάσει', 'πάρει', 'σώσει'], onePoint: ['βοηθάει', 'κυνηγάει'], zeroPoint: ['σκοτώσει', 'βάλει', 'κοιτάζει'] },
      { label: 'Γάτα', twoPoint: ['γάτα', 'γατάκι', 'ψιψίνα'] }
    ],
    grammarRules: [
      { label: 'Προθετική φράση (στη σκεπή/από τη σκεπή)', twoPoint: ['στη σκεπή', 'από τη σκεπή'] },
      { label: 'Τελική πρόταση (για... με σκοπό να...)', twoPoint: ['για να'] },
      { label: 'Υποτακτική (να πάρει...)', twoPoint: ['να πάρει', 'να κατεβάσει', 'να σώσει'] }
    ]
  },
  {
    id: 9,
    image: 'images/item9.png',
    question: 'Τι έπαθε το αγόρι;',
    infoRules: [
      { label: 'Πήρε/έκλεψε', twoPoint: ['πήρε', 'έκλεψε'], onePoint: ['έβγαλε', 'δεν του δίνει', 'έφαγε', 'τρώει', 'άρπαξε', 'έπιασε'], zeroPoint: ['δάγκωσε'] },
      { label: 'Σκύλος', twoPoint: ['σκύλος', 'σκυλάκι'] },
      { label: 'Απ αυτόν/του πήρε', twoPoint: ['απ αυτόν', 'από αυτόν', 'του πήρε'] },
      { label: 'Παντόφλα', twoPoint: ['παντόφλα'], onePoint: ['παπούτσι'], zeroPoint: ['ψωμί', 'φαγητό', 'μπριζόλα', 'γοβάκι'] }
    ],
    grammarRules: [
      { label: 'Ενεστώτας (κλαίει)', twoPoint: ['κλαίει'] },
      { label: 'Παρελθοντικός χρόνος (πήρε)', twoPoint: ['πήρε'] },
      { label: 'Συμφωνία ρήματος-υποκειμένου I (κλαίει το αγόρι)', twoPoint: ['αγόρι', 'κλαίει'] },
      { label: 'Συμφωνία ρήματος-υποκειμένου II (πήρε ο σκύλος)', twoPoint: ['σκύλος', 'πήρε'] },
      { label: 'Οριστικό άρθρο I (ο σκύλος)', twoPoint: ['ο σκύλος'] },
      { label: 'Οριστικό άρθρο II (την παντόφλα / το παπούτσι)', twoPoint: ['την παντόφλα', 'το παπούτσι'] },
      { label: 'Αιτιολογικός σύνδεσμος (γιατί/επειδή)', twoPoint: ['γιατί', 'επειδή'], onePoint: ['και'] }
    ]
  },
  {
    id: 10,
    image: 'images/item10.png',
    question: 'Κοίτα αυτή την εικόνα. Τι γίνεται εδώ;',
    infoRules: [
      { label: 'Σκίστηκε/τρύπησε', twoPoint: ['σκίστηκε', 'έχει σκιστεί', 'τρύπησε', 'είναι τρύπια', 'σκισμένη', 'τρυπημένη'], onePoint: ['έχει μια τρύπα', 'άνοιξε', 'κόπηκε'] },
      { label: 'Σακούλα', twoPoint: ['σακούλα', 'τσάντα'], onePoint: ['σάκος'] },
      { label: 'Κυρία', twoPoint: ['κυρία', 'γυναίκα'], zeroPoint: ['κοριτσάκι', 'μαμά'] },
      { label: 'Μαζεύει', twoPoint: ['μαζεύει', 'παίρνει', 'σηκώνει'], onePoint: ['πιάνει'], zeroPoint: ['κλέβει'] },
      { label: 'Αγοράκι', twoPoint: ['αγοράκι', 'παιδί', 'παιδάκι'], onePoint: ['άντρας'], zeroPoint: ['αυτός', 'εκείνος', 'άνθρωπος'] }
    ],
    grammarRules: [
      { label: 'Παρελθοντικός χρόνος I (σκίστηκε)', twoPoint: ['σκίστηκε'] },
      { label: 'Παρελθοντικός χρόνος II (έπεσαν)', twoPoint: ['έπεσαν'] },
      { label: 'Ενεστώτας (μαζεύει)', twoPoint: ['μαζεύει'] },
      { label: 'Συμφωνία ρήματος-υποκειμένου I (σκίστηκε η σακούλα)', twoPoint: ['σακούλα', 'σκίστηκε'] },
      { label: 'Συμφωνία ρήματος-υποκειμένου II (έπεσαν τα μήλα)', twoPoint: ['μήλα', 'έπεσαν'] },
      { label: 'Συμφωνία ρήματος-υποκειμένου III (μαζεύει το παιδί)', twoPoint: ['μαζεύει', 'παιδί'] },
      { label: 'Γενική κτητική (της κυρίας)', twoPoint: ['της κυρίας'], onePoint: ['από τη σακούλα'] },
      { label: 'Οριστικό άρθρο I (η σακούλα)', twoPoint: ['η σακούλα'] },
      { label: 'Οριστικό άρθρο II (το παιδί/ο κύριος)', twoPoint: ['το παιδί', 'ο κύριος'] },
      { label: 'Αντωνυμία (τα μαζεύει)', twoPoint: ['τα μαζεύει'] }
    ]
  }
]

const AGE_GROUPS = [
  { key: '4:0-4:5', minMonths: 48, maxMonths: 53 },
  { key: '4:6-5:0', minMonths: 54, maxMonths: 60 },
  { key: '5:1-6:0', minMonths: 61, maxMonths: 72 },
  { key: '6:1-7:0', minMonths: 73, maxMonths: 84 }
]

const PERCENTILE_TABLE = {
  total: {
    '4:0-4:5': { 10: 23, 20: 33, 30: 38, 40: 43, 50: 46, 60: 49, 70: 55, 80: 59, 90: 69 },
    '4:6-5:0': { 10: 29, 20: 37, 30: 43, 40: 48, 50: 52, 60: 56, 70: 62, 80: 70, 90: 77 },
    '5:1-6:0': { 10: 31, 20: 42, 30: 49, 40: 56, 50: 64, 60: 70, 70: 76, 80: 82, 90: 88 },
    '6:1-7:0': { 10: 46, 20: 55, 30: 64, 40: 69, 50: 74, 60: 80, 70: 85, 80: 90, 90: 97 }
  },
  info: {
    '4:0-4:5': { 10: 7, 20: 10, 30: 14, 40: 16, 50: 18, 60: 20, 70: 23, 80: 25, 90: 28 },
    '4:6-5:0': { 10: 9, 20: 13, 30: 16, 40: 19, 50: 20, 60: 23, 70: 25, 80: 28, 90: 32 },
    '5:1-6:0': { 10: 11, 20: 16, 30: 18, 40: 22, 50: 25, 60: 27, 70: 30, 80: 33, 90: 37 },
    '6:1-7:0': { 10: 18, 20: 23, 30: 26, 40: 28, 50: 31, 60: 34, 70: 35, 80: 37, 90: 40 }
  },
  grammar: {
    '4:0-4:5': { 10: 14, 20: 20, 30: 24, 40: 24, 50: 26, 60: 28, 70: 30, 80: 33, 90: 38 },
    '4:6-5:0': { 10: 18, 20: 23, 30: 26, 40: 28, 50: 28, 60: 32, 70: 35, 80: 40, 90: 44 },
    '5:1-6:0': { 10: 18, 20: 26, 30: 28, 40: 32, 50: 36, 60: 40, 70: 42, 80: 46, 90: 50 },
    '6:1-7:0': { 10: 26, 20: 32, 30: 34, 40: 37, 50: 40, 60: 42, 70: 47, 80: 50, 90: 53 }
  }
}

function splitWords(text) {
  return text
    .toLowerCase()
    .replace(/[.,;:!?()"']/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
}

function includesKeyword(text, keyword) {
  return text.toLowerCase().includes(keyword.toLowerCase())
}

function scoreRule(answer, rule) {
  if (rule.twoPoint && rule.twoPoint.some((keyword) => includesKeyword(answer, keyword))) {
    return 2
  }
  if (rule.onePoint && rule.onePoint.some((keyword) => includesKeyword(answer, keyword))) {
    return 1
  }
  if (rule.zeroPoint && rule.zeroPoint.some((keyword) => includesKeyword(answer, keyword))) {
    return 0
  }
  return 0
}

function scoreDomain(answer, rules) {
  const details = rules.map((rule) => {
    const points = scoreRule(answer, rule)
    return {
      label: rule.label,
      points,
      maxPoints: 2
    }
  })

  const score = details.reduce((sum, item) => sum + item.points, 0)
  const max = details.reduce((sum, item) => sum + item.maxPoints, 0)
  return { score, max, details }
}

function parseAgeToMonths(value) {
  const clean = value.trim()
  const match = clean.match(/^(\d+)\s*[:.]\s*(\d{1,2})$/)
  if (!match) {
    return null
  }

  const years = Number(match[1])
  const months = Number(match[2])
  if (Number.isNaN(years) || Number.isNaN(months) || months < 0 || months > 11) {
    return null
  }

  return years * 12 + months
}

function findAgeGroup(ageMonths) {
  if (ageMonths === null) {
    return null
  }
  return AGE_GROUPS.find((group) => ageMonths >= group.minMonths && ageMonths <= group.maxMonths) || null
}

function calculatePercentile(score, tableByDecile) {
  const deciles = [10, 20, 30, 40, 50, 60, 70, 80, 90]
  let percentile = 0
  for (const decile of deciles) {
    if (score >= tableByDecile[decile]) {
      percentile = decile
    }
  }
  return percentile === 0 ? '<10' : String(percentile)
}

function App() {
  const [answers, setAnswers] = useState(() => Object.fromEntries(PROMPTS.map((p) => [p.id, ''])))
  const [isListening, setIsListening] = useState(() => Object.fromEntries(PROMPTS.map((p) => [p.id, false])))
  const [activePrompt, setActivePrompt] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [ageInput, setAgeInput] = useState('')
  const [brokenImages, setBrokenImages] = useState({})
  const [speechSupported] = useState(() => {
    return typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
  })

  const recognitionRef = useRef(null)

  const currentPrompt = PROMPTS[currentIndex]

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    setActivePrompt(null)
    setIsListening(Object.fromEntries(PROMPTS.map((p) => [p.id, false])))
  }

  const startListening = (promptId) => {
    if (!speechSupported) {
      return
    }

    stopListening()

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.lang = 'el-GR'
    recognition.continuous = true
    recognition.interimResults = true

    recognition.onresult = (event) => {
      let transcript = ''
      for (let i = 0; i < event.results.length; i += 1) {
        transcript += event.results[i][0].transcript
      }

      setAnswers((prev) => ({
        ...prev,
        [promptId]: transcript.trim()
      }))
    }

    recognition.onerror = () => {
      stopListening()
    }

    recognition.onend = () => {
      setIsListening((prev) => ({ ...prev, [promptId]: false }))
      setActivePrompt(null)
      recognitionRef.current = null
    }

    recognition.start()
    recognitionRef.current = recognition
    setActivePrompt(promptId)
    setIsListening(Object.fromEntries(PROMPTS.map((p) => [p.id, p.id === promptId])))
  }

  const results = useMemo(() => {
    const ageMonths = parseAgeToMonths(ageInput)
    const ageGroup = findAgeGroup(ageMonths)

    const scoredPrompts = PROMPTS.map((prompt) => {
      const answer = answers[prompt.id] || ''
      const info = scoreDomain(answer, prompt.infoRules)
      const grammar = scoreDomain(answer, prompt.grammarRules)

      return {
        prompt,
        answer,
        info,
        grammar,
        total: info.score + grammar.score,
        totalMax: info.max + grammar.max
      }
    })

    const grandTotal = scoredPrompts.reduce((sum, item) => sum + item.total, 0)
    const infoTotal = scoredPrompts.reduce((sum, item) => sum + item.info.score, 0)
    const grammarTotal = scoredPrompts.reduce((sum, item) => sum + item.grammar.score, 0)
    const grandMax = scoredPrompts.reduce((sum, item) => sum + item.totalMax, 0)
    const percentage = grandMax > 0 ? Math.round((grandTotal / grandMax) * 100) : 0

    let percentileSummary = null
    if (ageGroup) {
      const key = ageGroup.key
      percentileSummary = {
        total: calculatePercentile(grandTotal, PERCENTILE_TABLE.total[key]),
        info: calculatePercentile(infoTotal, PERCENTILE_TABLE.info[key]),
        grammar: calculatePercentile(grammarTotal, PERCENTILE_TABLE.grammar[key]),
        ageKey: key
      }
    }

    return { scoredPrompts, grandTotal, infoTotal, grammarTotal, grandMax, percentage, percentileSummary }
  }, [answers, ageInput])

  const goPrev = () => {
    stopListening()
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }

  const goNext = () => {
    stopListening()
    setCurrentIndex((prev) => Math.min(prev + 1, PROMPTS.length - 1))
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <p className="hero-badge">React εφαρμογή λογοθεραπείας</p>
        <h1>Αξιολόγηση Απαντήσεων Με Ηχογράφηση</h1>
        <p>
          Οι εικόνες εμφανίζονται μία-μία. Συμπλήρωσε την ηλικία ως έτη:μήνες (πχ 4:8)
          για να δεις εκατοστημόρια με βάση τον πίνακα ηλικίας.
        </p>
        <label className="age-field" htmlFor="ageInput">
          Ηλικία παιδιού (μορφή έτη:μήνες)
          <input
            id="ageInput"
            type="text"
            value={ageInput}
            onChange={(event) => setAgeInput(event.target.value)}
            placeholder="πχ 5:2"
          />
        </label>
      </header>

      {!speechSupported && (
        <section className="warning">
          Ο browser δεν υποστηρίζει Speech Recognition API. Μπορείς να γράψεις την απάντηση στο πεδίο κειμένου.
        </section>
      )}

      <section className="single-card-wrap">
        <article className="prompt-card">
          <p className="progress-label">Εικόνα {currentPrompt.id} από {PROMPTS.length}</p>
          {!brokenImages[currentPrompt.id] ? (
            <img
              src={currentPrompt.image}
              alt={currentPrompt.question}
              className="prompt-image"
              onError={() => setBrokenImages((prev) => ({ ...prev, [currentPrompt.id]: true }))}
            />
          ) : (
            <div className="missing-image">
              Δεν βρέθηκε το αρχείο {currentPrompt.image}. Πρόσθεσέ το στον φάκελο public/images.
            </div>
          )}
          <h2>{currentPrompt.question}</h2>

          <div className="controls">
            <button
              type="button"
              className="record-btn"
              onClick={() => startListening(currentPrompt.id)}
              disabled={!speechSupported || activePrompt === currentPrompt.id}
            >
              Έναρξη ηχογράφησης
            </button>
            <button
              type="button"
              className="stop-btn"
              onClick={stopListening}
              disabled={activePrompt !== currentPrompt.id}
            >
              Τερματισμός
            </button>
          </div>

          <textarea
            value={answers[currentPrompt.id]}
            onChange={(event) =>
              setAnswers((prev) => ({
                ...prev,
                [currentPrompt.id]: event.target.value
              }))
            }
            rows={4}
            placeholder="Η απάντηση του παιδιού εμφανίζεται εδώ..."
          />

          <p className="status">
            {isListening[currentPrompt.id] ? 'Ηχογράφηση σε εξέλιξη...' : 'Δεν γίνεται ηχογράφηση'}
          </p>

          <div className="pager-controls">
            <button type="button" onClick={goPrev} disabled={currentIndex === 0}>Προηγούμενη</button>
            <button type="button" onClick={goNext} disabled={currentIndex === PROMPTS.length - 1}>Επόμενη</button>
          </div>
        </article>
      </section>

      <section className="results-card">
        <h2>Αποτελέσματα</h2>
        <p className="grand-score">
          Συνολική Βαθμολογία: <strong>{results.grandTotal}</strong> / {results.grandMax} ({results.percentage}%)
        </p>
        <p>Πληροφοριακή επάρκεια: <strong>{results.infoTotal}</strong></p>
        <p>Γραμματική επάρκεια: <strong>{results.grammarTotal}</strong></p>

        {results.percentileSummary ? (
          <div className="percentiles">
            <h3>Εκατοστημόρια (ηλικία {results.percentileSummary.ageKey})</h3>
            <p>Συνολική δοκιμασία: {results.percentileSummary.total}ο</p>
            <p>Πληροφοριακή επάρκεια: {results.percentileSummary.info}ο</p>
            <p>Γραμματική επάρκεια: {results.percentileSummary.grammar}ο</p>
          </div>
        ) : (
          <p className="hint">Δώσε ηλικία σε μορφή έτη:μήνες μεταξύ 4:0 και 7:0 για υπολογισμό εκατοστημορίων.</p>
        )}

        {results.scoredPrompts.map((item) => (
          <div className="result-block" key={item.prompt.id}>
            <h3>Εικόνα {item.prompt.id}</h3>
            <p>
              Πληροφοριακή επάρκεια: {item.info.score}/{item.info.max}
            </p>
            <ul>
              {item.info.details.map((detail) => (
                <li key={detail.label}>
                  {detail.label}: {detail.points}/{detail.maxPoints}
                </li>
              ))}
            </ul>
            <p>
              Γραμματική επάρκεια: {item.grammar.score}/{item.grammar.max}
            </p>
            <ul>
              {item.grammar.details.map((detail) => (
                <li key={detail.label}>
                  {detail.label}: {detail.points}/{detail.maxPoints}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </main>
  )
}

export default App
