// PDF generation for notices, report cards and sample study material.
// jsPDF is loaded on demand so it doesn't slow down the first page load.
import { school, SUBJECTS, GRADE_KEY } from '../data/site'
import { fmtDate } from './store'

const BRAND = [242, 92, 38]
const INK = [31, 37, 71]
const MUTED = [100, 110, 135]

// jsPDF's built-in fonts can't draw some Unicode characters (₹, smart quotes, en dash).
const clean = (s = '') =>
  String(s).replace(/[–—]/g, '-').replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/₹/g, 'Rs.').replace(/[^\x00-\xFF]/g, '')

async function newDoc() {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const W = doc.internal.pageSize.getWidth()

  doc.setFillColor(...BRAND)
  doc.rect(0, 0, W, 34, 'F')
  doc.setFillColor(255, 209, 102)
  doc.circle(W - 22, 12, 6, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.text(clean(school.name), 16, 16)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text(clean(school.address), 16, 23)
  doc.text(clean(`${school.phone}  |  ${school.email}`), 16, 28)
  return { doc, W }
}

function footer(doc, W) {
  const H = doc.internal.pageSize.getHeight()
  doc.setDrawColor(230, 230, 236)
  doc.line(16, H - 18, W - 16, H - 18)
  doc.setFontSize(8)
  doc.setTextColor(...MUTED)
  doc.text(clean(`Generated from the ${school.short} website on ${fmtDate(new Date().toISOString())}`), 16, H - 12)
}

function paragraphs(doc, text, x, y, width, lineH = 6) {
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.setTextColor(...INK)
  for (const para of clean(text).split(/\n+/)) {
    for (const line of doc.splitTextToSize(para, width)) {
      doc.text(line, x, y)
      y += lineH
    }
    y += 3
  }
  return y
}

export async function noticePdf(n) {
  const { doc, W } = await newDoc()
  doc.setTextColor(...BRAND)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text('NOTICE', 16, 50)
  doc.setTextColor(...MUTED)
  doc.setFont('helvetica', 'normal')
  doc.text(clean(`${fmtDate(n.date, { day: 'numeric', month: 'long', year: 'numeric' })}  |  ${n.category || 'General'}`), W - 16, 50, { align: 'right' })
  doc.setTextColor(...INK)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  const titleLines = doc.splitTextToSize(clean(n.title), W - 32)
  doc.text(titleLines, 16, 62)
  let y = 62 + titleLines.length * 8 + 4
  y = paragraphs(doc, n.body, 16, y, W - 32)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text('Principal', 16, y + 14)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...MUTED)
  doc.text(clean(school.name), 16, y + 20)
  footer(doc, W)
  doc.save(`Notice - ${clean(n.title).slice(0, 50)}.pdf`)
}

export async function reportCardPdf(r) {
  const { doc, W } = await newDoc()
  doc.setTextColor(...INK)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text('PROGRESS REPORT', W / 2, 48, { align: 'center' })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(...MUTED)
  doc.text(clean(r.term || ''), W / 2, 54, { align: 'center' })

  // Student details box
  doc.setFillColor(255, 244, 239)
  doc.roundedRect(16, 60, W - 32, 30, 3, 3, 'F')
  const info = [
    ['Student', r.name], ['Roll No.', r.roll],
    ['Class', r.className], ['Date of birth', fmtDate(r.dob)],
    ['Attendance', r.attendance || '-'], ['Session', school.session],
  ]
  info.forEach(([k, v], i) => {
    const x = 22 + (i % 2) * ((W - 32) / 2)
    const y = 69 + Math.floor(i / 2) * 8
    doc.setFont('helvetica', 'normal'); doc.setTextColor(...MUTED); doc.setFontSize(9)
    doc.text(k, x, y)
    doc.setFont('helvetica', 'bold'); doc.setTextColor(...INK); doc.setFontSize(10.5)
    doc.text(clean(v), x + 28, y)
  })

  // Grades table
  let y = 102
  doc.setFillColor(...BRAND)
  doc.rect(16, y, W - 32, 9, 'F')
  doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(10)
  doc.text('Area of development', 20, y + 6)
  doc.text('Grade', W - 70, y + 6)
  doc.text('Description', W - 50, y + 6)
  y += 9
  const subjects = Object.keys(r.grades || {}).length ? Object.keys(r.grades) : SUBJECTS
  subjects.forEach((s, i) => {
    if (i % 2) { doc.setFillColor(248, 248, 252); doc.rect(16, y, W - 32, 9, 'F') }
    const g = r.grades?.[s] || '-'
    doc.setTextColor(...INK); doc.setFont('helvetica', 'normal')
    doc.text(clean(s), 20, y + 6)
    doc.setFont('helvetica', 'bold')
    doc.text(g, W - 70, y + 6)
    doc.setFont('helvetica', 'normal'); doc.setTextColor(...MUTED)
    doc.text(GRADE_KEY[g] || '', W - 50, y + 6)
    y += 9
  })
  doc.setDrawColor(230, 230, 236)
  doc.rect(16, 102, W - 32, y - 102)

  y += 12
  doc.setTextColor(...INK); doc.setFont('helvetica', 'bold'); doc.setFontSize(11)
  doc.text("Teacher's remarks", 16, y)
  y = paragraphs(doc, r.remarks || '-', 16, y + 7, W - 32)

  y = Math.max(y + 18, 250)
  doc.setDrawColor(...MUTED)
  ;[['Class Teacher', 16], ['Principal', W / 2 - 20], ['Parent', W - 56]].forEach(([label, x]) => {
    doc.line(x, y, x + 40, y)
    doc.setFontSize(9); doc.setTextColor(...MUTED); doc.setFont('helvetica', 'normal')
    doc.text(label, x + 20, y + 5, { align: 'center' })
  })
  doc.setFontSize(8)
  doc.text(clean('Grade key: ' + Object.entries(GRADE_KEY).map(([g, d]) => `${g} ${d}`).join('  |  ')), 16, y + 16)
  footer(doc, W)
  doc.save(`Report Card - ${clean(r.name)} - ${clean(r.term || '').replace(/[()]/g, '')}.pdf`)
}

// For demo downloads that don't have a real uploaded file yet.
export async function samplePdf(item) {
  const { doc, W } = await newDoc()
  doc.setTextColor(...BRAND); doc.setFont('helvetica', 'bold'); doc.setFontSize(11)
  doc.text(clean(`${item.className}  |  ${item.category}`.toUpperCase()), 16, 50)
  doc.setTextColor(...INK); doc.setFontSize(18)
  doc.text(doc.splitTextToSize(clean(item.title), W - 32), 16, 62)
  doc.setFillColor(255, 244, 199)
  doc.roundedRect(16, 76, W - 32, 22, 3, 3, 'F')
  doc.setFontSize(10); doc.setTextColor(140, 90, 0)
  doc.text('SAMPLE FILE: placeholder content for the website demo.', 22, 85)
  doc.setFont('helvetica', 'normal')
  doc.text('The school will upload the real PDF from the Admin Panel.', 22, 91)
  // Ruled practice lines so the sample looks like a worksheet
  doc.setDrawColor(220, 224, 235)
  for (let y = 112; y < 260; y += 12) {
    doc.line(16, y, W - 16, y)
    doc.setDrawColor(240, 242, 248); doc.line(16, y - 6, W - 16, y - 6); doc.setDrawColor(220, 224, 235)
  }
  footer(doc, W)
  doc.save(`${clean(item.title)}.pdf`)
}
