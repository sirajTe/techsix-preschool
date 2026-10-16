// ─────────────────────────────────────────────────────────────────────────────
// All editable website content lives here.
// Anything marked  PLACEHOLDER  is demo content: replace it with the school's
// real details before launch. See README.md for the full checklist.
// ─────────────────────────────────────────────────────────────────────────────

export const school = {
  name: 'TechSix Preschool & Daycare',
  short: 'TechSix',
  tagline: 'Little minds. Big beginnings.', // PLACEHOLDER: confirm tagline with the school
  session: '2026–27',
  // Address and phone from the public Schools Universe listing; confirm before launch.
  address: 'Block A, Tower B2, Suncity Avenue 76, Sector 76, Gurugram, Haryana 122004',
  addressShort: 'Suncity Avenue 76, Sector 76, Gurugram',
  phone: '+91 86986 90097',
  phoneHref: 'tel:+918698690097',
  whatsapp: '918698690097',
  email: 'admin@techsix.in',
  mapQuery: 'Suncity Avenue 76, Sector 76, Gurugram, Haryana 122004',
  hours: [
    { day: 'Preschool (Mon – Fri)', time: '9:00 AM – 12:30 PM' },
    { day: 'Daycare (Mon – Sat)', time: '8:00 AM – 7:00 PM' },
    { day: 'Office (Mon – Sat)', time: '9:00 AM – 5:00 PM' },
    { day: 'Sunday', time: 'Closed' },
  ],
  // PLACEHOLDER: replace '#' with the school's real profile links
  social: {
    instagram: '#',
    facebook: '#',
    youtube: '#',
  },
  adminPassword: 'techsix2026', // PLACEHOLDER: demo password; see README → Going live
}

export const whatsappLink = (text = `Hi ${school.short}! I'd like to know more about admissions for ${school.session}.`) =>
  `https://wa.me/${school.whatsapp}?text=${encodeURIComponent(text)}`

export const CLASSES = ['Playgroup', 'Nursery', 'LKG', 'UKG']
export const DOWNLOAD_CATEGORIES = ['Books', 'Worksheets', 'Syllabus', 'Holiday Homework']

// Tailwind classes for the pastel tones used across cards and badges.
export const TONES = {
  peach: { bg: 'bg-orange-100 dark:bg-orange-400/15', text: 'text-orange-700 dark:text-orange-300', solid: 'from-orange-200 to-rose-200 dark:from-orange-500/30 dark:to-rose-500/20' },
  mint: { bg: 'bg-emerald-100 dark:bg-emerald-400/15', text: 'text-emerald-700 dark:text-emerald-300', solid: 'from-emerald-200 to-teal-100 dark:from-emerald-500/30 dark:to-teal-500/20' },
  sky: { bg: 'bg-sky-100 dark:bg-sky-400/15', text: 'text-sky-700 dark:text-sky-300', solid: 'from-sky-200 to-indigo-100 dark:from-sky-500/30 dark:to-indigo-500/20' },
  lilac: { bg: 'bg-violet-100 dark:bg-violet-400/15', text: 'text-violet-700 dark:text-violet-300', solid: 'from-violet-200 to-fuchsia-100 dark:from-violet-500/30 dark:to-fuchsia-500/20' },
  butter: { bg: 'bg-amber-100 dark:bg-amber-400/15', text: 'text-amber-700 dark:text-amber-300', solid: 'from-amber-200 to-yellow-100 dark:from-amber-500/30 dark:to-yellow-500/20' },
  rose: { bg: 'bg-rose-100 dark:bg-rose-400/15', text: 'text-rose-700 dark:text-rose-300', solid: 'from-rose-200 to-pink-100 dark:from-rose-500/30 dark:to-pink-500/20' },
}

export const highlights = [
  { icon: '🛡️', tone: 'mint', title: 'Safe & secure campus', text: 'Gated, child-proofed spaces with guarded entry and visitor check-in.' },
  { icon: '📹', tone: 'sky', title: 'CCTV in every room', text: 'Round-the-clock CCTV monitoring across classrooms and play areas.' },
  { icon: '🚌', tone: 'butter', title: 'Safe transport', text: 'Door-to-door bus service with a trained female attendant on board.' },
  { icon: '👩‍🏫', tone: 'lilac', title: 'Trained teachers', text: 'Caring, early-childhood trained teachers with small class sizes.' },
  { icon: '🏡', tone: 'peach', title: 'Daycare till 7 PM', text: 'A home-away-from-home with meals, nap time and supervised play.' },
  { icon: '🎨', tone: 'rose', title: 'Activity-based learning', text: 'Dance, music, drama, art and sports woven into every week.' },
]

// PLACEHOLDER: replace these numbers with the school's real figures
export const stats = [
  { value: '500+', label: 'Happy families' },
  { value: '1:12', label: 'Teacher–child ratio' },
  { value: '11 hrs', label: 'Daycare every day' },
  { value: '100%', label: 'CCTV covered' },
]

export const programs = [
  {
    id: 'playgroup', name: 'Playgroup', icon: '🧸', tone: 'mint',
    age: '1.5 – 2.5 years', timing: '9:00 AM – 11:30 AM',
    summary: 'A gentle first step away from home, built around play, comfort and curiosity.',
    learn: ['Sensory & messy play', 'Rhymes, songs and movement', 'Fine & gross motor skills', 'Sharing and making friends', 'Toilet-training support'],
  },
  {
    id: 'nursery', name: 'Nursery', icon: '🌱', tone: 'sky',
    age: '2.5 – 3.5 years', timing: '9:00 AM – 12:00 PM',
    summary: 'Language blooms and little hands get busy with colours, shapes and stories.',
    learn: ['Phonics readiness & listening', 'Colours, shapes and sorting', 'Pre-writing strokes', 'Story time & show-and-tell', 'Free play & outdoor fun'],
  },
  {
    id: 'lkg', name: 'LKG', icon: '✏️', tone: 'butter',
    age: '3.5 – 4.5 years', timing: '9:00 AM – 12:30 PM',
    summary: 'Building strong foundations in reading, writing and numbers through hands-on activities.',
    learn: ['Phonics & letter formation', 'Numbers 1–50 and counting', 'Hindi varnmala introduction', 'Environmental awareness', 'Art, craft and music'],
  },
  {
    id: 'ukg', name: 'UKG', icon: '🎓', tone: 'lilac',
    age: '4.5 – 5.5 years', timing: '9:00 AM – 12:30 PM',
    summary: 'Confident, school-ready learners who read, reason and express themselves.',
    learn: ['Reading simple sentences', 'Addition, subtraction & patterns', 'Hindi matras and words', 'Science through experiments', 'Public speaking & confidence'],
  },
  {
    id: 'daycare', name: 'Daycare', icon: '🏡', tone: 'peach',
    age: '1.5 – 8 years', timing: '8:00 AM – 7:00 PM (Mon – Sat)',
    summary: 'Safe, warm and structured care for working parents, before and after school.',
    learn: ['Healthy meals & snacks', 'Nap time in a quiet room', 'Homework help for older kids', 'Indoor & outdoor play', 'Live CCTV access for parents'],
  },
]

// PLACEHOLDER: replace with real parent reviews (with their permission)
export const testimonials = [
  { name: 'Priya S.', role: 'Mother of Aarav, UKG', text: 'Aarav has become so confident. He comes home singing rhymes and telling us about his day. The teachers genuinely care.', tone: 'peach' },
  { name: 'Rahul M.', role: 'Father of Myra, Nursery', text: 'As working parents, the daycare has been a blessing. Clean, safe and the CCTV access gives us complete peace of mind.', tone: 'sky' },
  { name: 'Neha K.', role: 'Mother of Vihaan, LKG', text: 'The activity-based learning is wonderful. Vihaan learnt phonics through games and actually looks forward to school.', tone: 'mint' },
  { name: 'Amit & Pooja', role: 'Parents of Kiara, Playgroup', text: 'Kiara settled in within a week. The staff were so patient with her during the first days. Highly recommended!', tone: 'lilac' },
]

// PLACEHOLDER: About-page copy and principal's message are sample text
export const about = {
  story: [
    'TechSix Preschool & Daycare was started with a simple belief: the early years shape a lifetime. Located inside Suncity Avenue 76 in Sector 76, Gurugram, we give children a safe, joyful and stimulating space to take their very first steps in learning.',
    'Our classrooms are bright, child-proofed and full of things to touch, build and explore. Our teachers are trained in early-childhood education and treat every child as an individual, with their own pace, interests and personality.',
    'From Playgroup to UKG, and in our full-day daycare, we focus on what matters most at this age: confidence, curiosity, kindness and a love of learning.',
  ],
  vision: 'To nurture happy, confident and curious children who are ready for school and for life.',
  mission: 'To provide a safe, loving and activity-rich environment where every child learns through play, discovery and meaningful relationships.',
  values: [
    { icon: '💛', title: 'Care first', text: 'Every child feels safe, seen and loved.' },
    { icon: '🔍', title: 'Curiosity', text: 'Questions are celebrated, not hushed.' },
    { icon: '🤝', title: 'Partnership', text: 'Parents and teachers grow children together.' },
    { icon: '🌍', title: 'Values', text: 'Kindness, respect and Indian culture.' },
  ],
  principal: {
    name: '[Principal Name]', // PLACEHOLDER
    title: 'Principal & Founder',
    message: [
      'Dear Parents,',
      'Choosing a preschool is one of the most important decisions you will make for your child. At TechSix, we take that trust seriously. Every day our team works to make sure your little one feels at home, safe, happy and excited to learn.',
      'We believe children learn best when they play, explore and feel loved. Our programmes balance early literacy and numeracy with art, music, movement and plenty of fun, so that every child grows in confidence and becomes truly school-ready.',
      'I warmly invite you to visit our campus, meet our teachers, and see the joy in our classrooms for yourself.',
    ],
  },
}

// PLACEHOLDER: gallery tiles are illustrated placeholders; upload real photos from the admin panel
export const GALLERY_CATEGORIES = ['Celebrations', 'Events', 'Activities', 'Campus']

// ─── Seed data for the admin-managed sections ────────────────────────────────
// These appear until the school adds its own content via /admin.

const ymd = (d) => {
  const z = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`
}
const daysAgo = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return ymd(d) }

export const seed = {
  notices: () => [
    { id: 'n1', date: daysAgo(1), title: 'Diwali celebration & holidays', category: 'Holiday', important: true,
      body: 'We will celebrate Diwali in school with diya decoration, rangoli and a short assembly. Children may come in traditional wear. The school will remain closed for Diwali holidays as per the events calendar. Daycare will remain open on working Saturdays.' },
    { id: 'n2', date: daysAgo(3), title: 'Parent-Teacher Meeting for all classes', category: 'PTM', important: false,
      body: 'A Parent-Teacher Meeting will be held for Playgroup, Nursery, LKG and UKG. Parents are requested to collect the Term 1 progress report and meet the class teacher between 9:30 AM and 12:00 PM.' },
    { id: 'n3', date: daysAgo(9), title: 'Winter uniform from 1st November', category: 'General', important: false,
      body: 'Children are requested to come in the winter uniform from 1st November. Please label all jackets, sweaters and caps with your child\'s name and class.' },
    { id: 'n4', date: daysAgo(21), title: 'Annual Day practice begins', category: 'Event', important: false,
      body: 'Practice for our Annual Day has begun. Your child\'s class teacher will share costume details in the school diary. We look forward to a wonderful show!' },
    { id: 'n5', date: daysAgo(34), title: 'Fee reminder: Quarter 3', category: 'Fees', important: false,
      body: 'This is a gentle reminder that Quarter 3 fees are due. Kindly pay at the school office or via the payment link shared on WhatsApp to avoid late charges.' },
  ],
  downloads: () => [
    { id: 'd1', title: 'Nursery Book List 2026–27', className: 'Nursery', category: 'Books', size: 'Sample' },
    { id: 'd2', title: 'Nursery Colours & Shapes Worksheet', className: 'Nursery', category: 'Worksheets', size: 'Sample' },
    { id: 'd3', title: 'Nursery Syllabus: Term 2', className: 'Nursery', category: 'Syllabus', size: 'Sample' },
    { id: 'd4', title: 'Nursery Diwali Holiday Homework', className: 'Nursery', category: 'Holiday Homework', size: 'Sample' },
    { id: 'd5', title: 'LKG Book List 2026–27', className: 'LKG', category: 'Books', size: 'Sample' },
    { id: 'd6', title: 'LKG Phonics Worksheet: Letters A–M', className: 'LKG', category: 'Worksheets', size: 'Sample' },
    { id: 'd7', title: 'LKG Number Tracing 1–20', className: 'LKG', category: 'Worksheets', size: 'Sample' },
    { id: 'd8', title: 'LKG Syllabus: Term 2', className: 'LKG', category: 'Syllabus', size: 'Sample' },
    { id: 'd9', title: 'LKG Diwali Holiday Homework', className: 'LKG', category: 'Holiday Homework', size: 'Sample' },
    { id: 'd10', title: 'UKG Book List 2026–27', className: 'UKG', category: 'Books', size: 'Sample' },
    { id: 'd11', title: 'UKG Addition Practice Sheet', className: 'UKG', category: 'Worksheets', size: 'Sample' },
    { id: 'd12', title: 'UKG Hindi Matra Worksheet', className: 'UKG', category: 'Worksheets', size: 'Sample' },
    { id: 'd13', title: 'UKG Syllabus: Term 2', className: 'UKG', category: 'Syllabus', size: 'Sample' },
    { id: 'd14', title: 'UKG Diwali Holiday Homework', className: 'UKG', category: 'Holiday Homework', size: 'Sample' },
    { id: 'd15', title: 'Playgroup Activity Planner', className: 'Playgroup', category: 'Syllabus', size: 'Sample' },
  ],
  results: () => [
    { id: 'r1', name: 'Aarav Sharma', roll: 'TS-UKG-01', className: 'UKG', dob: '2021-05-14', term: 'Term 1 (2026–27)', attendance: '92%',
      grades: { 'English': 'A+', 'Hindi': 'A', 'Numbers': 'A+', 'EVS': 'A', 'Art & Craft': 'A+', 'Rhymes & Music': 'A', 'Physical Development': 'A+', 'Social Skills': 'A' },
      remarks: 'Aarav is a confident and enthusiastic learner. He reads simple sentences fluently and loves story time. Keep it up!' },
    { id: 'r2', name: 'Myra Gupta', roll: 'TS-NUR-07', className: 'Nursery', dob: '2023-02-03', term: 'Term 1 (2026–27)', attendance: '88%',
      grades: { 'English': 'A', 'Hindi': 'B+', 'Numbers': 'A', 'EVS': 'A', 'Art & Craft': 'A+', 'Rhymes & Music': 'A+', 'Physical Development': 'A', 'Social Skills': 'A' },
      remarks: 'Myra is cheerful and creative. She enjoys colouring and music. Encourage her to speak more in class.' },
    { id: 'r3', name: 'Vihaan Mehta', roll: 'TS-LKG-12', className: 'LKG', dob: '2022-09-21', term: 'Term 1 (2026–27)', attendance: '95%',
      grades: { 'English': 'A', 'Hindi': 'A', 'Numbers': 'A+', 'EVS': 'A+', 'Art & Craft': 'A', 'Rhymes & Music': 'B+', 'Physical Development': 'A+', 'Social Skills': 'A+' },
      remarks: 'Vihaan is curious and asks great questions. He is very good with numbers and helps his friends.' },
  ],
  // PLACEHOLDER: confirm dates with the school's academic calendar
  events: () => [
    { id: 'e1', date: '2026-10-20', title: 'Dussehra', type: 'Holiday', description: 'School closed.' },
    { id: 'e2', date: '2026-10-24', title: 'Parent-Teacher Meeting', type: 'PTM', description: 'Term 1 report collection, 9:30 AM – 12:00 PM.' },
    { id: 'e3', date: '2026-11-06', title: 'Diwali celebration in school', type: 'Celebration', description: 'Diya painting, rangoli & assembly. Traditional wear.' },
    { id: 'e4', date: '2026-11-07', endDate: '2026-11-10', title: 'Diwali holidays', type: 'Holiday', description: 'School closed. Daycare closed on 8th Nov.' },
    { id: 'e5', date: '2026-11-14', title: "Children's Day", type: 'Celebration', description: 'Fun fair, games and a surprise show by teachers!' },
    { id: 'e6', date: '2026-11-24', title: 'Guru Nanak Jayanti', type: 'Holiday', description: 'School closed.' },
    { id: 'e7', date: '2026-12-12', title: 'Annual Day: "Little Stars"', type: 'Event', description: 'Stage performances by all classes. Venue details to follow.' },
    { id: 'e8', date: '2026-12-24', title: 'Christmas celebration', type: 'Celebration', description: 'Santa visit, carols and cake.' },
    { id: 'e9', date: '2026-12-31', endDate: '2027-01-10', title: 'Winter break', type: 'Holiday', description: 'School closed. Daycare open as usual.' },
    { id: 'e10', date: '2027-01-16', title: 'Sports Day', type: 'Sports', description: 'Races, drills and medals for every little athlete.' },
    { id: 'e11', date: '2027-01-26', title: 'Republic Day', type: 'Celebration', description: 'Flag hoisting and patriotic songs.' },
    { id: 'e12', date: '2027-02-13', title: 'Parent-Teacher Meeting', type: 'PTM', description: 'Term 2 progress discussion.' },
  ],
  gallery: () => [
    { id: 'g1', title: 'Diwali celebration', category: 'Celebrations', emoji: '🪔', tone: 'butter' },
    { id: 'g2', title: 'Sports Day races', category: 'Events', emoji: '🏃', tone: 'mint' },
    { id: 'g3', title: 'Art & craft corner', category: 'Activities', emoji: '🎨', tone: 'rose' },
    { id: 'g4', title: 'Annual Day on stage', category: 'Events', emoji: '🎭', tone: 'lilac' },
    { id: 'g5', title: 'Janmashtami dress-up', category: 'Celebrations', emoji: '🦚', tone: 'sky' },
    { id: 'g6', title: 'Holi with organic colours', category: 'Celebrations', emoji: '🌈', tone: 'peach' },
    { id: 'g7', title: 'Story time', category: 'Activities', emoji: '📚', tone: 'butter' },
    { id: 'g8', title: 'Our bright classrooms', category: 'Campus', emoji: '🏫', tone: 'sky' },
    { id: 'g9', title: 'Christmas & Santa visit', category: 'Celebrations', emoji: '🎄', tone: 'mint' },
    { id: 'g10', title: 'Independence Day', category: 'Events', emoji: '🇮🇳', tone: 'peach' },
    { id: 'g11', title: 'Kids yoga', category: 'Activities', emoji: '🧘', tone: 'lilac' },
    { id: 'g12', title: 'Play area', category: 'Campus', emoji: '🛝', tone: 'rose' },
  ],
  enquiries: () => [
    { id: 'q1', createdAt: new Date(Date.now() - 864e5 * 1).toISOString(), childName: 'Ishaan Verma', age: '3 years', parentName: 'Sneha Verma', phone: '9810000001', className: 'Nursery', message: 'Want to visit the campus this Saturday.', status: 'New' },
    { id: 'q2', createdAt: new Date(Date.now() - 864e5 * 2).toISOString(), childName: 'Anaya Singh', age: '4 years', parentName: 'Rohit Singh', phone: '9810000002', className: 'LKG', message: 'Is transport available from Sector 77?', status: 'Contacted' },
    { id: 'q3', createdAt: new Date(Date.now() - 864e5 * 5).toISOString(), childName: 'Kabir Jain', age: '2 years', parentName: 'Meera Jain', phone: '9810000003', className: 'Daycare', message: 'Need full-day daycare from December.', status: 'New' },
  ],
}

export const SUBJECTS = ['English', 'Hindi', 'Numbers', 'EVS', 'Art & Craft', 'Rhymes & Music', 'Physical Development', 'Social Skills']
export const GRADES = ['A+', 'A', 'B+', 'B', 'C']
export const GRADE_KEY = { 'A+': 'Outstanding', A: 'Excellent', 'B+': 'Very good', B: 'Good', C: 'Needs support' }
export const EVENT_TYPES = ['Holiday', 'PTM', 'Celebration', 'Event', 'Sports', 'Exam']
export const NOTICE_CATEGORIES = ['General', 'Holiday', 'PTM', 'Event', 'Fees', 'Exam']
export const EVENT_TONE = { Holiday: 'rose', PTM: 'sky', Celebration: 'butter', Event: 'lilac', Sports: 'mint', Exam: 'peach' }
