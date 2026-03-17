const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, 
        Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType, 
        ShadingType, VerticalAlign, PageNumber, LevelFormat } = require('docx');
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
      { reference: "numbered-list-1", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbered-list-2", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbered-list-3", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullet-list", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }
    ]
  },
  sections: [{
    properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
    headers: {
      default: new Header({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Masjid Hub - App Store Publishing Guide", size: 20, color: colors.primary, italics: true })] })] })
    },
    footers: {
      default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Page ", size: 20 }), new TextRun({ children: [PageNumber.CURRENT], size: 20 }), new TextRun({ text: " of ", size: 20 }), new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 20 })] })] })
    },
    children: [
      // Header
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 120 }, children: [new TextRun({ text: "ZEENAT-UL-ISLAM MASJID", size: 36, bold: true, color: colors.primary })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 360 }, children: [new TextRun({ text: "Bulawayo, Zimbabwe", size: 22, color: colors.subtitle })] }),
      
      // Title
      new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun({ text: "MASJID HUB", size: 48, bold: true, color: colors.title })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 480 }, children: [new TextRun({ text: "App Store Publishing Guide", size: 28, color: colors.primary })] }),
      
      // Introduction
      new Paragraph({ spacing: { after: 240 }, children: [new TextRun("This guide provides step-by-step instructions for publishing the Masjid Hub app to Google Play Store (Android) and Apple App Store (iOS). The app has been configured with Capacitor for native app conversion.")] }),
      
      // Section 1
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("1. Google Play Store (Android)")] }),
      new Paragraph({ spacing: { after: 180 }, children: [new TextRun("Follow these steps to publish to Google Play Store:")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Prerequisites")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Google Play Developer Account ($25 one-time fee)")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Android Studio installed on a computer")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Java JDK 17 or higher")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, spacing: { after: 240 }, children: [new TextRun("Access to the project code on GitHub")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Step 1: Build the Android APK")] }),
      new Paragraph({ numbering: { reference: "numbered-list-1", level: 0 }, children: [new TextRun("Clone the project from GitHub")] }),
      new Paragraph({ numbering: { reference: "numbered-list-1", level: 0 }, children: [new TextRun("Open terminal in the project folder")] }),
      new Paragraph({ numbering: { reference: "numbered-list-1", level: 0 }, children: [new TextRun("Run: npm install")] }),
      new Paragraph({ numbering: { reference: "numbered-list-1", level: 0 }, children: [new TextRun("Run: npx cap sync android")] }),
      new Paragraph({ numbering: { reference: "numbered-list-1", level: 0 }, children: [new TextRun("Run: npx cap open android")] }),
      new Paragraph({ numbering: { reference: "numbered-list-1", level: 0 }, spacing: { after: 180 }, children: [new TextRun("Android Studio will open with the project")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Step 2: Generate Signed APK/AAB")] }),
      new Paragraph({ numbering: { reference: "numbered-list-2", level: 0 }, children: [new TextRun("In Android Studio, go to Build > Generate Signed Bundle/APK")] }),
      new Paragraph({ numbering: { reference: "numbered-list-2", level: 0 }, children: [new TextRun("Select 'Android App Bundle' for Play Store")] }),
      new Paragraph({ numbering: { reference: "numbered-list-2", level: 0 }, children: [new TextRun("Create new keystore (save this securely!)")] }),
      new Paragraph({ numbering: { reference: "numbered-list-2", level: 0 }, children: [new TextRun("Select 'release' build variant")] }),
      new Paragraph({ numbering: { reference: "numbered-list-2", level: 0 }, spacing: { after: 180 }, children: [new TextRun("The AAB file will be generated in android/app/release/")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Step 3: Upload to Google Play")] }),
      new Paragraph({ numbering: { reference: "numbered-list-3", level: 0 }, children: [new TextRun("Go to play.google.com/console")] }),
      new Paragraph({ numbering: { reference: "numbered-list-3", level: 0 }, children: [new TextRun("Create a new app")] }),
      new Paragraph({ numbering: { reference: "numbered-list-3", level: 0 }, children: [new TextRun("Fill in store listing details (name, description, screenshots)")] }),
      new Paragraph({ numbering: { reference: "numbered-list-3", level: 0 }, children: [new TextRun("Upload the AAB file")] }),
      new Paragraph({ numbering: { reference: "numbered-list-3", level: 0 }, children: [new TextRun("Complete content rating questionnaire")] }),
      new Paragraph({ numbering: { reference: "numbered-list-3", level: 0 }, children: [new TextRun("Set pricing (Free)")] }),
      new Paragraph({ numbering: { reference: "numbered-list-3", level: 0 }, spacing: { after: 360 }, children: [new TextRun("Submit for review (usually 1-3 days)")] }),
      
      // Section 2
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("2. Apple App Store (iOS)")] }),
      new Paragraph({ spacing: { after: 180 }, children: [new TextRun("Follow these steps to publish to Apple App Store:")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Prerequisites")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Apple Developer Account ($99/year)")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Mac computer with Xcode installed")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Xcode 15 or higher")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, spacing: { after: 240 }, children: [new TextRun("Valid Apple ID with two-factor authentication")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Step 1: Build the iOS App")] }),
      new Paragraph({ numbering: { reference: "numbered-list-1", level: 0 }, children: [new TextRun("Clone the project on a Mac")] }),
      new Paragraph({ numbering: { reference: "numbered-list-1", level: 0 }, children: [new TextRun("Run: npm install")] }),
      new Paragraph({ numbering: { reference: "numbered-list-1", level: 0 }, children: [new TextRun("Run: npx cap sync ios")] }),
      new Paragraph({ numbering: { reference: "numbered-list-1", level: 0 }, children: [new TextRun("Run: npx cap open ios")] }),
      new Paragraph({ numbering: { reference: "numbered-list-1", level: 0 }, spacing: { after: 180 }, children: [new TextRun("Xcode will open with the project")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Step 2: Configure in Xcode")] }),
      new Paragraph({ numbering: { reference: "numbered-list-2", level: 0 }, children: [new TextRun("Select the App target in Xcode")] }),
      new Paragraph({ numbering: { reference: "numbered-list-2", level: 0 }, children: [new TextRun("Set Signing & Capabilities with your Apple Developer Team")] }),
      new Paragraph({ numbering: { reference: "numbered-list-2", level: 0 }, children: [new TextRun("Update Bundle Identifier to match your App ID")] }),
      new Paragraph({ numbering: { reference: "numbered-list-2", level: 0 }, spacing: { after: 180 }, children: [new TextRun("Set version number and build number")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Step 3: Upload to App Store")] }),
      new Paragraph({ numbering: { reference: "numbered-list-3", level: 0 }, children: [new TextRun("In Xcode: Product > Archive")] }),
      new Paragraph({ numbering: { reference: "numbered-list-3", level: 0 }, children: [new TextRun("Once archive completes, click 'Distribute App'")] }),
      new Paragraph({ numbering: { reference: "numbered-list-3", level: 0 }, children: [new TextRun("Select 'App Store Connect'")] }),
      new Paragraph({ numbering: { reference: "numbered-list-3", level: 0 }, children: [new TextRun("Follow prompts to upload")] }),
      new Paragraph({ numbering: { reference: "numbered-list-3", level: 0 }, children: [new TextRun("Go to appstoreconnect.apple.com")] }),
      new Paragraph({ numbering: { reference: "numbered-list-3", level: 0 }, children: [new TextRun("Fill in store listing details")] }),
      new Paragraph({ numbering: { reference: "numbered-list-3", level: 0 }, children: [new TextRun("Submit for review (usually 1-7 days)")] }),
      new Paragraph({ numbering: { reference: "numbered-list-3", level: 0 }, spacing: { after: 360 }, children: [new TextRun("Note: Apple has stricter review guidelines")] }),
      
      // Section 3
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("3. App Store Assets Needed")] }),
      new Paragraph({ spacing: { after: 180 }, children: [new TextRun("Prepare these assets before submitting:")] }),
      
      new Table({
        columnWidths: [3120, 6240],
        margins: { top: 100, bottom: 100, left: 180, right: 180 },
        rows: [
          new TableRow({
            tableHeader: true,
            children: [
              new TableCell({ borders: cellBorders, width: { size: 3120, type: WidthType.DXA }, shading: { fill: "1B5E20", type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Asset", bold: true, color: "FFFFFF", size: 22 })] })] }),
              new TableCell({ borders: cellBorders, width: { size: 6240, type: WidthType.DXA }, shading: { fill: "1B5E20", type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Requirements", bold: true, color: "FFFFFF", size: 22 })] })] })
            ]
          }),
          ...([
            ["App Icon", "512x512 PNG (high resolution)"],
            ["Screenshots", "Phone: 1080x1920, Tablet: 1200x2000"],
            ["Feature Graphic", "1024x500 PNG (Play Store only)"],
            ["App Description", "Short (80 chars) and Full (4000 chars)"],
            ["Privacy Policy URL", "Required - can use GitHub Pages"],
            ["Category", "Lifestyle / Education"],
            ["Content Rating", "Everyone (no mature content)"]
          ]).map((row, idx) => new TableRow({
            children: [
              new TableCell({ borders: cellBorders, width: { size: 3120, type: WidthType.DXA }, shading: { fill: idx % 2 === 0 ? "F8FAF7" : "FFFFFF", type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: row[0], bold: true, size: 22 })] })] }),
              new TableCell({ borders: cellBorders, width: { size: 6240, type: WidthType.DXA }, shading: { fill: idx % 2 === 0 ? "F8FAF7" : "FFFFFF", type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: AlignmentType.LEFT, indent: { left: 120 }, children: [new TextRun({ text: row[1], size: 22 })] })] })
            ]
          }))
        ]
      }),
      
      // Section 4
      new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 480 }, children: [new TextRun("4. Alternative: PWABuilder (Easier)")] }),
      new Paragraph({ spacing: { after: 180 }, children: [new TextRun("For a simpler process, use PWABuilder to generate store packages:")] }),
      new Paragraph({ numbering: { reference: "numbered-list-1", level: 0 }, children: [new TextRun("Go to pwabuilder.com")] }),
      new Paragraph({ numbering: { reference: "numbered-list-1", level: 0 }, children: [new TextRun("Enter the app URL: https://masjid-hub-jb9p.vercel.app/")] }),
      new Paragraph({ numbering: { reference: "numbered-list-1", level: 0 }, children: [new TextRun("Click 'Start' to analyze the PWA")] }),
      new Paragraph({ numbering: { reference: "numbered-list-1", level: 0 }, children: [new TextRun('Click "Package for Stores"')] }),
      new Paragraph({ numbering: { reference: "numbered-list-1", level: 0 }, children: [new TextRun("Download Android (.apk) and Windows packages")] }),
      new Paragraph({ numbering: { reference: "numbered-list-1", level: 0 }, children: [new TextRun("Sign the APK with your keystore")] }),
      new Paragraph({ numbering: { reference: "numbered-list-1", level: 0 }, spacing: { after: 360 }, children: [new TextRun("Upload to Play Store as normal")] }),
      
      // Section 5
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("5. App Information")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("App Details")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "App Name: ", bold: true }), new TextRun("Masjid Hub")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "Package ID: ", bold: true }), new TextRun("org.zeenatulislam.masjidhub")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "Version: ", bold: true }), new TextRun("1.0.0")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, spacing: { after: 240 }, children: [new TextRun({ text: "Category: ", bold: true }), new TextRun("Lifestyle, Education")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Short Description (80 characters)")] }),
      new Paragraph({
        shading: { fill: "F8FAF7", type: ShadingType.CLEAR },
        spacing: { after: 240 },
        children: [new TextRun({ text: "Islamic community app for prayer times, Quran learning, and masjid services.", italics: true })]
      }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Full Description")] }),
      new Paragraph({
        shading: { fill: "F8FAF7", type: ShadingType.CLEAR },
        spacing: { after: 360 },
        children: [new TextRun("Masjid Hub is your comprehensive Islamic companion app for Zeenat-ul-Islam Masjid in Bulawayo, Zimbabwe. Features include accurate prayer times with Adhan notifications, Quran memorization tracker, step-by-step Wudu and Salah guides, daily duas, Islamic learning for kids, live streaming of prayers and lectures, donation management, community announcements, and more. The app works offline and supports English, Shona, and Ndebele languages. Dedicated as Sadaqah Jaariyah in memory of Hajji Dawood Cassim.")]
      }),
      
      // Section 6
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("6. Support")] }),
      new Paragraph({ spacing: { after: 180 }, children: [new TextRun("For technical assistance with app store publishing:")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "Email: ", bold: true }), new TextRun("tech@zeenatulislam.org")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "GitHub: ", bold: true }), new TextRun("github.com/mrchimz147-bit/masjid-hub")] }),
      
      new Paragraph({
        spacing: { before: 360, after: 120 },
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "May Allah accept this effort. Ameen.", italics: true, color: colors.primary })]
      })
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/home/z/my-project/download/Masjid_Hub_App_Store_Guide.docx", buffer);
  console.log("App Store guide created successfully!");
}).catch(err => {
  console.error("Error creating document:", err);
});
