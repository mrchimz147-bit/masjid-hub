const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, 
        Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType, 
        ShadingType, VerticalAlign, PageNumber, LevelFormat, ImageRun } = require('docx');
const fs = require('fs');

const colors = {
  primary: "#1B5E20",
  accent: "#D4AF37",
  title: "#1B5E20",
  body: "#2D3329",
  subtitle: "#4A5548",
  tableBg: "#F8FAF7",
  tableBorder: "#D4AF37"
};

const today = new Date();
const dateStr = today.toLocaleDateString('en-GB', { 
  weekday: 'long', 
  day: 'numeric', 
  month: 'long', 
  year: 'numeric' 
});

const tableBorder = { style: BorderStyle.SINGLE, size: 12, color: colors.tableBorder };
const cellBorders = { top: tableBorder, bottom: tableBorder, left: tableBorder, right: tableBorder };

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Times New Roman", size: 24 } } },
    paragraphStyles: [
      { id: "Title", name: "Title", basedOn: "Normal",
        run: { size: 48, bold: true, color: colors.title, font: "Times New Roman" },
        paragraph: { spacing: { before: 0, after: 240 }, alignment: AlignmentType.CENTER } },
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, color: colors.primary, font: "Times New Roman" },
        paragraph: { spacing: { before: 360, after: 180 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, color: colors.primary, font: "Times New Roman" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 } },
      { id: "Normal", name: "Normal",
        run: { size: 24, color: colors.body, font: "Times New Roman" },
        paragraph: { spacing: { after: 120, line: 312 } } }
    ]
  },
  numbering: {
    config: [
      { reference: "numbered-list-1",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbered-list-2",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbered-list-3",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullet-list",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }
    ]
  },
  sections: [{
    properties: {
      page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
    },
    headers: {
      default: new Header({ children: [new Paragraph({ 
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Masjid Hub - Zeenat-ul-Islam, Bulawayo", size: 20, color: colors.primary, italics: true })]
      })] })
    },
    footers: {
      default: new Footer({ children: [new Paragraph({ 
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Page ", size: 20 }), new TextRun({ children: [PageNumber.CURRENT], size: 20 }), new TextRun({ text: " of ", size: 20 }), new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 20 })]
      })] })
    },
    children: [
      // Header
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [new TextRun({ text: "ZEENAT-UL-ISLAM MASJID", size: 36, bold: true, color: colors.primary })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 360 },
        children: [new TextRun({ text: "Bulawayo, Zimbabwe", size: 22, color: colors.subtitle })]
      }),
      
      // Title
      new Paragraph({
        heading: HeadingLevel.TITLE,
        children: [new TextRun({ text: "MASJID HUB", size: 48, bold: true, color: colors.title })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 240 },
        children: [new TextRun({ text: "Community App User Guide", size: 28, color: colors.primary })]
      }),
      
      // App URL Box
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 240, after: 120 },
        children: [new TextRun({ text: "📱 DOWNLOAD THE APP:", size: 26, bold: true, color: colors.primary })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        shading: { fill: "F8FAF7", type: ShadingType.CLEAR },
        spacing: { after: 360 },
        children: [new TextRun({ text: "https://masjid-hub-jb9p.vercel.app/", size: 28, bold: true, color: colors.accent })]
      }),
      
      // Introduction
      new Paragraph({
        spacing: { after: 240 },
        children: [new TextRun("Assalamu Alaikum! The Masjid Hub app is your one-stop digital companion for all masjid activities, prayer times, Islamic learning, and community engagement. This guide will help you get started.")]
      }),
      
      // Section 1: Getting Started
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("1. Getting Started")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("How to Install on Your Phone")] }),
      new Paragraph({
        spacing: { after: 180 },
        children: [new TextRun("The Masjid Hub app works on any smartphone - Android, iPhone, or tablet. Follow these simple steps:")]
      }),
      
      // Android instructions
      new Paragraph({
        spacing: { before: 180, after: 120 },
        children: [new TextRun({ text: "For Android Phones (Samsung, Huawei, etc.):", bold: true, color: colors.primary })]
      }),
      new Paragraph({ numbering: { reference: "numbered-list-1", level: 0 }, children: [new TextRun("Open Chrome or Samsung Internet browser")] }),
      new Paragraph({ numbering: { reference: "numbered-list-1", level: 0 }, children: [new TextRun("Type the app address above and press Go")] }),
      new Paragraph({ numbering: { reference: "numbered-list-1", level: 0 }, children: [new TextRun("Wait for the app to load completely")] }),
      new Paragraph({ numbering: { reference: "numbered-list-1", level: 0 }, children: [new TextRun('Tap the THREE DOTS menu (⋮) in the top right corner')] }),
      new Paragraph({ numbering: { reference: "numbered-list-1", level: 0 }, children: [new TextRun('Tap "Add to Home Screen" or "Install App"')] }),
      new Paragraph({ numbering: { reference: "numbered-list-1", level: 0 }, spacing: { after: 240 }, children: [new TextRun('Name it "Masjid Hub" and tap "Add"')] }),
      
      // iPhone instructions
      new Paragraph({
        spacing: { before: 180, after: 120 },
        children: [new TextRun({ text: "For iPhone (iOS):", bold: true, color: colors.primary })]
      }),
      new Paragraph({ numbering: { reference: "numbered-list-2", level: 0 }, children: [new TextRun("Open Safari browser")] }),
      new Paragraph({ numbering: { reference: "numbered-list-2", level: 0 }, children: [new TextRun("Type the app address and press Go")] }),
      new Paragraph({ numbering: { reference: "numbered-list-2", level: 0 }, children: [new TextRun('Tap the SHARE button at the bottom')] }),
      new Paragraph({ numbering: { reference: "numbered-list-2", level: 0 }, children: [new TextRun('Scroll down and tap "Add to Home Screen"')] }),
      new Paragraph({ numbering: { reference: "numbered-list-2", level: 0 }, spacing: { after: 360 }, children: [new TextRun('Name it "Masjid Hub" and tap "Add"')] }),
      
      new Paragraph({
        shading: { fill: "F8FAF7", type: ShadingType.CLEAR },
        spacing: { after: 360 },
        children: [new TextRun({ text: "✓ Success! ", bold: true, color: colors.primary }), new TextRun("The Masjid Hub icon will now appear on your home screen. Tap it anytime to open the app!")]
      }),
      
      // Section 2: Main Features
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("2. Main Features Guide")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("🏠 Home Tab")] }),
      new Paragraph({
        spacing: { after: 180 },
        children: [new TextRun("The Home tab is your main screen showing the most important information at a glance:")]
      }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "Prayer Times: ", bold: true }), new TextRun("See today's Fajr, Sunrise, Dhuhr, Asr, Maghrib, and Isha times")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "Jumu'ah Countdown: ", bold: true }), new TextRun("Days, hours, and minutes until Friday prayer")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "Next Prayer Alarm: ", bold: true }), new TextRun("See which prayer is next and how long until it begins")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "Play Adhan: ", bold: true }), new TextRun("Listen to the beautiful call to prayer")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "Directions to Masjid: ", bold: true }), new TextRun("Get GPS navigation to Zeenat-ul-Islam")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, spacing: { after: 360 }, children: [new TextRun({ text: "Announcements: ", bold: true }), new TextRun("Latest news and updates from the masjid")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("🕐 Prayer Tab")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "Monthly Timetable: ", bold: true }), new TextRun("View prayer times for the entire month")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, spacing: { after: 360 }, children: [new TextRun({ text: "Qibla Compass: ", bold: true }), new TextRun("Point your phone to find the direction of Makkah for prayer")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("📚 Learn Tab")] }),
      new Paragraph({
        spacing: { after: 180 },
        children: [new TextRun("Access Islamic learning resources:")]
      }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "Wudu Guide: ", bold: true }), new TextRun("Step-by-step instructions for ablution with Arabic duas")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "Salah Guide: ", bold: true }), new TextRun("Learn how to pray with detailed step-by-step instructions")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "Daily Duas: ", bold: true }), new TextRun("Morning, evening, eating, sleeping, and daily supplications")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "Hifz Tracker: ", bold: true }), new TextRun("Track your Quran memorization progress")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "Tajweed: ", bold: true }), new TextRun("Learn proper Quran recitation rules")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "Arabic: ", bold: true }), new TextRun("Learn Arabic alphabet and vocabulary")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, spacing: { after: 360 }, children: [new TextRun({ text: "Kids Corner: ", bold: true }), new TextRun("Nasheeds, stories, games, and learning for children")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("👥 Community Tab")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "AI Islamic Assistant: ", bold: true }), new TextRun("Ask Islamic questions and get answers based on Shafi'i fiqh")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "Live Streaming: ", bold: true }), new TextRun("Watch Jumu'ah, Eid prayers, and lectures live")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "Qurbani: ", bold: true }), new TextRun("Contribute to Qurbani during Eid al-Adha")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, spacing: { after: 360 }, children: [new TextRun({ text: "Hall Booking: ", bold: true }), new TextRun("Request to book masjid facilities for events")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("📋 More Tab")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "Donations: ", bold: true }), new TextRun("Support the masjid with various donation types")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "Member Registration: ", bold: true }), new TextRun("Register as a masjid member")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "Photo Album: ", bold: true }), new TextRun("View and share masjid photos")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, spacing: { after: 360 }, children: [new TextRun({ text: "Marriage Board: ", bold: true }), new TextRun("Halal matrimonial service for serious seekers")] }),
      
      // Section 3: Donation Categories
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("3. Donation Types Available")] }),
      new Paragraph({
        spacing: { after: 180 },
        children: [new TextRun("Support Zeenat-ul-Islam Masjid through various donation categories:")]
      }),
      
      new Table({
        columnWidths: [3120, 6240],
        margins: { top: 100, bottom: 100, left: 180, right: 180 },
        rows: [
          new TableRow({
            tableHeader: true,
            children: [
              new TableCell({ borders: cellBorders, width: { size: 3120, type: WidthType.DXA }, shading: { fill: "1B5E20", type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER,
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Donation Type", bold: true, color: "FFFFFF", size: 22 })] })] }),
              new TableCell({ borders: cellBorders, width: { size: 6240, type: WidthType.DXA }, shading: { fill: "1B5E20", type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER,
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Purpose", bold: true, color: "FFFFFF", size: 22 })] })] })
            ]
          }),
          ...([
            ["General", "Day-to-day masjid operations and maintenance"],
            ["Sadaqah", "Voluntary charity for general welfare"],
            ["Zakat", "Obligatory charity for eligible recipients"],
            ["Fitra", "Ramadan Eid charity before Eid prayer"],
            ["Madressa Fees", "Islamic school fees and materials"],
            ["Building Fund", "Masjid expansion and renovations"],
            ["Water Well", "Sadaqah Jaariyah - building water wells"],
            ["Orphan Support", "Supporting orphans in the community"],
            ["Funeral Fund", "Assisting families with burial costs"],
            ["Iftar Meals", "Ramadan iftar provision"],
            ["Qurbani", "Eid al-Adha animal sacrifice"],
            ["Specific Cause", "Donate to a particular project"]
          ]).map((row, idx) => new TableRow({
            children: [
              new TableCell({ borders: cellBorders, width: { size: 3120, type: WidthType.DXA }, shading: { fill: idx % 2 === 0 ? "F8FAF7" : "FFFFFF", type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER,
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: row[0], bold: true, size: 22 })] })] }),
              new TableCell({ borders: cellBorders, width: { size: 6240, type: WidthType.DXA }, shading: { fill: idx % 2 === 0 ? "F8FAF7" : "FFFFFF", type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER,
                children: [new Paragraph({ alignment: AlignmentType.LEFT, indent: { left: 120 }, children: [new TextRun({ text: row[1], size: 22 })] })] })
            ]
          }))
        ]
      }),
      
      new Paragraph({
        spacing: { before: 240, after: 360 },
        children: [new TextRun({ text: "Payment Methods: ", bold: true }), new TextRun("EcoCash, OneMoney, InnBucks, Bank Transfer, or Cash at the masjid office.")]
      }),
      
      // Section 4: Language
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("4. Language Selection")] }),
      new Paragraph({
        spacing: { after: 180 },
        children: [new TextRun("The app supports multiple languages:")]
      }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "English ", bold: true }), new TextRun("- Default language")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "Shona ", bold: true }), new TextRun("- ChiShona translation")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, spacing: { after: 180 }, children: [new TextRun({ text: "Ndebele ", bold: true }), new TextRun("- isiNdebele translation")] }),
      new Paragraph({
        spacing: { after: 360 },
        children: [new TextRun('To change language, tap the language button (EN/SN/ND) in the top-right corner of the app.')]
      }),
      
      // Section 5: Kids Section
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("5. Kids Corner")] }),
      new Paragraph({
        spacing: { after: 180 },
        children: [new TextRun("A special section designed for children to learn about Islam in a fun way:")]
      }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "Nasheeds: ", bold: true }), new TextRun("Beautiful Islamic songs for children")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "Sahaba Stories: ", bold: true }), new TextRun("Inspiring stories of the Companions")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "Islamic Games: ", bold: true }), new TextRun("Fun quizzes about Islam")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, spacing: { after: 360 }, children: [new TextRun({ text: "Learn Arabic: ", bold: true }), new TextRun("Arabic alphabet for beginners")] }),
      
      // Section 6: Contact
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("6. Contact & Support")] }),
      new Paragraph({
        spacing: { after: 180 },
        children: [new TextRun("For questions, suggestions, or technical support:")]
      }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Visit the masjid office")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Speak to the Imam or committee members")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, spacing: { after: 360 }, children: [new TextRun("Email: tech@zeenatulislam.org")] }),
      
      // Dedication
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("7. Special Dedication")] }),
      new Paragraph({
        spacing: { after: 180 },
        children: [new TextRun("This app is dedicated as a "), new TextRun({ text: "Sadaqah Jaariyah", bold: true }), new TextRun(" (continuous charity) in loving memory of "), new TextRun({ text: "Hajji Dawood Cassim رحمة الله عليه", bold: true, color: colors.primary }), new TextRun(" - a beloved pillar of our community. May every prayer time reminder, every verse of Quran memorized, and every act of worship facilitated through this app be a source of eternal reward. Ameen.")]
      }),
      
      // Closing
      new Paragraph({
        spacing: { before: 360, after: 120 },
        children: [new TextRun({ text: "JazakAllah Khairan for using Masjid Hub!", bold: true })]
      }),
      new Paragraph({
        spacing: { after: 240 },
        children: [new TextRun("May Allah accept our efforts and unite our community in His service.")]
      }),
      
      new Paragraph({
        spacing: { before: 360 },
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Zeenat-ul-Islam Masjid", italics: true, color: colors.primary })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Bulawayo, Zimbabwe", italics: true, color: colors.subtitle })]
      })
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/home/z/my-project/download/Masjid_Hub_Public_User_Guide.docx", buffer);
  console.log("Public user guide created successfully!");
}).catch(err => {
  console.error("Error creating document:", err);
});
