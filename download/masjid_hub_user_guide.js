const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, Header, Footer, 
        AlignmentType, LevelFormat, HeadingLevel, BorderStyle, WidthType, ShadingType, 
        VerticalAlign, PageNumber, PageBreak } = require('docx');
const fs = require('fs');

// Colors
const colors = {
  primary: "1B5E20",
  title: "0B1220",
  body: "0F172A",
  accent: "2E7D32",
  tableBg: "E8F5E9",
  lightBg: "F1F5F9"
};

const tableBorder = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const cellBorders = { top: tableBorder, bottom: tableBorder, left: tableBorder, right: tableBorder };

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Times New Roman", size: 24 } } },
    paragraphStyles: [
      { id: "Title", name: "Title", basedOn: "Normal",
        run: { size: 56, bold: true, color: colors.primary, font: "Times New Roman" },
        paragraph: { spacing: { before: 240, after: 120 }, alignment: AlignmentType.CENTER } },
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, color: colors.primary, font: "Times New Roman" },
        paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, color: colors.accent, font: "Times New Roman" },
        paragraph: { spacing: { before: 300, after: 150 }, outlineLevel: 1 } },
    ]
  },
  numbering: {
    config: [
      { reference: "bullet-list",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "install-steps",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "features-list",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },
  sections: [
    // Cover Page
    {
      properties: {
        page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
      },
      children: [
        new Paragraph({ spacing: { before: 2000 } }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "🕌", size: 120 })]
        }),
        new Paragraph({ spacing: { before: 400 } }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "MASJID HUB", size: 72, bold: true, color: colors.primary })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 200 },
          children: [new TextRun({ text: "Zeenat-ul-Islam Masjid", size: 36, color: colors.accent })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 100 },
          children: [new TextRun({ text: "Bulawayo, Zimbabwe", size: 28, color: colors.body })]
        }),
        new Paragraph({ spacing: { before: 600 } }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "User Guide & Installation Instructions", size: 32, bold: true })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 200 },
          children: [new TextRun({ text: "TEST PHASE - Beta Version", size: 28, color: "FF6600", bold: true })]
        }),
        new Paragraph({ spacing: { before: 1000 } }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Dedicated to Hajji Dawood Cassim", size: 24, italics: true })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "رحمة الله عليه", size: 28, color: colors.primary })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 100 },
          children: [new TextRun({ text: "A Sadaqah Jaariyah", size: 22, italics: true })]
        }),
        new Paragraph({ children: [new PageBreak()] })
      ]
    },
    // Main Content
    {
      properties: {
        page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: "Masjid Hub - User Guide", color: colors.accent, size: 20 })]
          })]
        })
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "Page ", size: 20 }),
              new TextRun({ children: [PageNumber.CURRENT], size: 20 }),
              new TextRun({ text: " of ", size: 20 }),
              new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 20 })
            ]
          })]
        })
      },
      children: [
        // App URL Section
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("App Link")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "The Masjid Hub app is available at the following URL:", size: 24 })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 200, after: 200 },
          shading: { fill: colors.tableBg, type: ShadingType.CLEAR },
          children: [new TextRun({ text: "https://masjid-cdlt6otee-mrchimz147-9476s-projects.vercel.app/", size: 26, bold: true, color: colors.primary })]
        }),
        new Paragraph({
          spacing: { after: 300 },
          children: [new TextRun({ text: "Save this link to your bookmarks for easy access.", size: 24 })]
        }),

        // Login Credentials Section
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Admin & Staff Login Credentials")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "Use these credentials to access the admin panel. Go to the app URL, scroll to the bottom, and tap \"Admin Login\".", size: 24 })]
        }),
        
        // Login Table
        new Table({
          columnWidths: [2500, 3500, 2500],
          margins: { top: 100, bottom: 100, left: 180, right: 180 },
          rows: [
            new TableRow({
              tableHeader: true,
              children: [
                new TableCell({
                  borders: cellBorders,
                  shading: { fill: colors.primary, type: ShadingType.CLEAR },
                  verticalAlign: VerticalAlign.CENTER,
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Role", bold: true, color: "FFFFFF", size: 22 })] })]
                }),
                new TableCell({
                  borders: cellBorders,
                  shading: { fill: colors.primary, type: ShadingType.CLEAR },
                  verticalAlign: VerticalAlign.CENTER,
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Email", bold: true, color: "FFFFFF", size: 22 })] })]
                }),
                new TableCell({
                  borders: cellBorders,
                  shading: { fill: colors.primary, type: ShadingType.CLEAR },
                  verticalAlign: VerticalAlign.CENTER,
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Password", bold: true, color: "FFFFFF", size: 22 })] })]
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Imam", size: 22 })] })] }),
                new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "imam@zeenatulislam.org", size: 22 })] })] }),
                new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "imam2024", size: 22 })] })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ borders: cellBorders, shading: { fill: colors.lightBg, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Chairman", size: 22 })] })] }),
                new TableCell({ borders: cellBorders, shading: { fill: colors.lightBg, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "chairman@zeenatulislam.org", size: 22 })] })] }),
                new TableCell({ borders: cellBorders, shading: { fill: colors.lightBg, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "chairman2024", size: 22 })] })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Treasurer", size: 22 })] })] }),
                new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "treasurer@zeenatulislam.org", size: 22 })] })] }),
                new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "treasurer2024", size: 22 })] })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ borders: cellBorders, shading: { fill: colors.lightBg, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Secretary", size: 22 })] })] }),
                new TableCell({ borders: cellBorders, shading: { fill: colors.lightBg, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "secretary@zeenatulislam.org", size: 22 })] })] }),
                new TableCell({ borders: cellBorders, shading: { fill: colors.lightBg, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "secretary2024", size: 22 })] })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Tech Support", size: 22 })] })] }),
                new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "tech@zeenatulislam.org", size: 22 })] })] }),
                new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "tech2024", size: 22 })] })] })
              ]
            })
          ]
        }),
        new Paragraph({ spacing: { after: 300 } }),

        // Install Instructions
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("How to Install the App on Your Phone")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "The app is a Progressive Web App (PWA) which means you can install it directly to your home screen like a regular app. Follow these simple steps:", size: 24 })]
        }),

        // Android Instructions
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("For Android (Samsung, Huawei, etc.)")] }),
        new Paragraph({ numbering: { reference: "install-steps", level: 0 }, children: [new TextRun({ text: "Open Chrome or Samsung Internet browser", size: 24 })] }),
        new Paragraph({ numbering: { reference: "install-steps", level: 0 }, children: [new TextRun({ text: "Go to the app URL above", size: 24 })] }),
        new Paragraph({ numbering: { reference: "install-steps", level: 0 }, children: [new TextRun({ text: "Wait for the page to fully load (you should see the green Masjid Hub screen)", size: 24 })] }),
        new Paragraph({ numbering: { reference: "install-steps", level: 0 }, children: [new TextRun({ text: "Tap the three dots menu (⋮) in the top-right corner", size: 24 })] }),
        new Paragraph({ numbering: { reference: "install-steps", level: 0 }, children: [new TextRun({ text: 'Tap "Add to Home screen" or "Install app"', size: 24 })] }),
        new Paragraph({ numbering: { reference: "install-steps", level: 0 }, children: [new TextRun({ text: 'Name it "Masjid Hub" and tap "Add"', size: 24 })] }),
        new Paragraph({ numbering: { reference: "install-steps", level: 0 }, children: [new TextRun({ text: "The app icon will now appear on your home screen!", size: 24 })] }),
        new Paragraph({ spacing: { after: 200 } }),

        // iPhone Instructions
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("For iPhone (Safari)")] }),
        new Paragraph({ numbering: { reference: "features-list", level: 0 }, children: [new TextRun({ text: "Open Safari browser", size: 24 })] }),
        new Paragraph({ numbering: { reference: "features-list", level: 0 }, children: [new TextRun({ text: "Go to the app URL above", size: 24 })] }),
        new Paragraph({ numbering: { reference: "features-list", level: 0 }, children: [new TextRun({ text: "Wait for the page to fully load", size: 24 })] }),
        new Paragraph({ numbering: { reference: "features-list", level: 0 }, children: [new TextRun({ text: 'Tap the "Share" button (square with arrow pointing up) at the bottom', size: 24 })] }),
        new Paragraph({ numbering: { reference: "features-list", level: 0 }, children: [new TextRun({ text: 'Scroll down and tap "Add to Home Screen"', size: 24 })] }),
        new Paragraph({ numbering: { reference: "features-list", level: 0 }, children: [new TextRun({ text: 'Name it "Masjid Hub" and tap "Add"', size: 24 })] }),
        new Paragraph({ numbering: { reference: "features-list", level: 0 }, children: [new TextRun({ text: "The app icon will now appear on your home screen!", size: 24 })] }),
        new Paragraph({ spacing: { after: 300 } }),

        // Features Section
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("App Features")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "Masjid Hub includes the following features for the Zeenat-ul-Islam community:", size: 24 })]
        }),

        // Features Table
        new Table({
          columnWidths: [3000, 6000],
          margins: { top: 100, bottom: 100, left: 180, right: 180 },
          rows: [
            new TableRow({
              tableHeader: true,
              children: [
                new TableCell({
                  borders: cellBorders,
                  shading: { fill: colors.primary, type: ShadingType.CLEAR },
                  verticalAlign: VerticalAlign.CENTER,
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Feature", bold: true, color: "FFFFFF", size: 22 })] })]
                }),
                new TableCell({
                  borders: cellBorders,
                  shading: { fill: colors.primary, type: ShadingType.CLEAR },
                  verticalAlign: VerticalAlign.CENTER,
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Description", bold: true, color: "FFFFFF", size: 22 })] })]
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Prayer Times", bold: true, size: 22 })] })] }),
                new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Daily salah times for Bulawayo (CAT timezone)", size: 22 })] })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ borders: cellBorders, shading: { fill: colors.lightBg, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Jumu'ah Countdown", bold: true, size: 22 })] })] }),
                new TableCell({ borders: cellBorders, shading: { fill: colors.lightBg, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Live countdown to Friday Khutbah", size: 22 })] })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Wudu & Salah Guides", bold: true, size: 22 })] })] }),
                new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Step-by-step guides with Arabic text and transliteration", size: 22 })] })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ borders: cellBorders, shading: { fill: colors.lightBg, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Daily Duas", bold: true, size: 22 })] })] }),
                new TableCell({ borders: cellBorders, shading: { fill: colors.lightBg, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "15+ daily duas for various occasions", size: 22 })] })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Donations", bold: true, size: 22 })] })] }),
                new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "12 donation types: Fitra, Sadaqah, Zakat, Madressa, Building, Water Well, Orphans, Funeral, Iftar, Qurbani, Specific causes", size: 22 })] })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ borders: cellBorders, shading: { fill: colors.lightBg, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Live Streaming", bold: true, size: 22 })] })] }),
                new TableCell({ borders: cellBorders, shading: { fill: colors.lightBg, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Jumu'ah Khutbah, Eid prayers, Bayaans, Imam Live from home", size: 22 })] })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Saved Recordings", bold: true, size: 22 })] })] }),
                new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Watch previous lectures and khutbahs", size: 22 })] })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ borders: cellBorders, shading: { fill: colors.lightBg, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Announcements", bold: true, size: 22 })] })] }),
                new TableCell({ borders: cellBorders, shading: { fill: colors.lightBg, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Community news with comment section for questions", size: 22 })] })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Hadith & Quran Verse", bold: true, size: 22 })] })] }),
                new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Daily Islamic content with translations", size: 22 })] })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ borders: cellBorders, shading: { fill: colors.lightBg, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Multi-Language", bold: true, size: 22 })] })] }),
                new TableCell({ borders: cellBorders, shading: { fill: colors.lightBg, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "English, Shona, and Ndebele support", size: 22 })] })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Hifz Tracker", bold: true, size: 22 })] })] }),
                new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Track your Quran memorization progress", size: 22 })] })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ borders: cellBorders, shading: { fill: colors.lightBg, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Photo Album", bold: true, size: 22 })] })] }),
                new TableCell({ borders: cellBorders, shading: { fill: colors.lightBg, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Community photos from events", size: 22 })] })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Marriage Board", bold: true, size: 22 })] })] }),
                new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Halal matrimonial service with Wali contact system", size: 22 })] })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ borders: cellBorders, shading: { fill: colors.lightBg, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Offline Support", bold: true, size: 22 })] })] }),
                new TableCell({ borders: cellBorders, shading: { fill: colors.lightBg, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Works offline after first visit", size: 22 })] })] })
              ]
            })
          ]
        }),
        new Paragraph({ spacing: { after: 300 } }),

        // Test Phase Notice
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Test Phase - Your Feedback Needed")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "This app is currently in the TEST PHASE. We need your feedback to improve it!", size: 24 })]
        }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: "Please test the following and report any issues:", size: 24, bold: true })]
        }),
        new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "Prayer times accuracy for Bulawayo", size: 24 })] }),
        new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "App installation on your device", size: 24 })] }),
        new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "Navigation between sections", size: 24 })] }),
        new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "Language switching (English/Shona/Ndebele)", size: 24 })] }),
        new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "Admin panel functionality", size: 24 })] }),
        new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "Any features not working as expected", size: 24 })] }),
        new Paragraph({ spacing: { after: 200 } }),
        new Paragraph({
          spacing: { after: 300 },
          children: [new TextRun({ text: "Send feedback to: tech@zeenatulislam.org", size: 24, bold: true, color: colors.accent })]
        }),

        // Payment Methods
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Supported Payment Methods")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "The app supports the following payment methods for donations:", size: 24 })]
        }),
        new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "EcoCash", size: 24 })] }),
        new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "OneMoney", size: 24 })] }),
        new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "InnBucks", size: 24 })] }),
        new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "Bank Transfer", size: 24 })] }),
        new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "Cash (at the masjid)", size: 24 })] }),
        new Paragraph({ spacing: { after: 300 } }),

        // Contact Section
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Contact & Support")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "For technical support or questions about the app:", size: 24 })]
        }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: "Email: ", size: 24 }), new TextRun({ text: "tech@zeenatulislam.org", size: 24, bold: true, color: colors.accent })]
        }),
        new Paragraph({
          spacing: { after: 400 },
          children: [new TextRun({ text: "The app is maintained as a Sadaqah Jaariyah in memory of Hajji Dawood Cassim (رحمة الله عليه).", size: 24, italics: true })]
        }),

        // Footer
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 400 },
          children: [new TextRun({ text: "مَسْجِد زِينَةُ الإِسْلَام", size: 28, color: colors.primary })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 100 },
          children: [new TextRun({ text: "Zeenat-ul-Islam Masjid - Bulawayo, Zimbabwe", size: 22, italics: true })]
        })
      ]
    }
  ]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/home/z/my-project/download/Masjid_Hub_User_Guide.docx", buffer);
  console.log("Document created: /home/z/my-project/download/Masjid_Hub_User_Guide.docx");
});
