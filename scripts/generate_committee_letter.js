const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, 
        Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType, 
        ShadingType, VerticalAlign, PageNumber, LevelFormat } = require('docx');
const fs = require('fs');

// Color scheme - Green/Gold Islamic theme
const colors = {
  primary: "#1B5E20",
  accent: "#D4AF37",
  title: "#1B5E20",
  body: "#2D3329",
  subtitle: "#4A5548",
  tableBg: "#F8FAF7",
  tableBorder: "#D4AF37"
};

// Get today's date formatted
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
        children: [new TextRun({ text: "Zeenat-ul-Islam Masjid - Masjid Hub Administration", size: 20, color: colors.primary, italics: true })]
      })] })
    },
    footers: {
      default: new Footer({ children: [new Paragraph({ 
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Page ", size: 20 }), new TextRun({ children: [PageNumber.CURRENT], size: 20 }), new TextRun({ text: " of ", size: 20 }), new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 20 })]
      })] })
    },
    children: [
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
      new Paragraph({
        heading: HeadingLevel.TITLE,
        children: [new TextRun({ text: "MASJID HUB", size: 48, bold: true, color: colors.title })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 480 },
        children: [new TextRun({ text: "Administration & User Guide", size: 28, color: colors.primary })]
      }),
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { after: 240 },
        children: [new TextRun({ text: "Date: " + dateStr, size: 22, color: colors.subtitle })]
      }),
      new Paragraph({
        spacing: { after: 240 },
        children: [new TextRun({ text: "Assalamu Alaikum Wa Rahmatullahi Wa Barakatuh", size: 24, bold: true, color: colors.primary })]
      }),
      new Paragraph({
        spacing: { after: 240 },
        children: [new TextRun({ text: "Respected Committee Members, Imam Sahib, and Staff," })]
      }),
      new Paragraph({
        spacing: { after: 240 },
        children: [new TextRun("We are pleased to present the Masjid Hub mobile application - a comprehensive digital platform designed to serve our community. This document provides complete instructions for accessing and managing the application.")]
      }),
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("1. Accessing the Masjid Hub App")] }),
      new Paragraph({
        spacing: { after: 180 },
        children: [new TextRun("The Masjid Hub app is a Progressive Web Application (PWA) that can be accessed from any smartphone, tablet, or computer with an internet connection.")]
      }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("App URL")] }),
      new Paragraph({
        spacing: { after: 180 },
        children: [new TextRun({ text: "https://masjid-hub-jb9p.vercel.app/", bold: true, color: colors.primary })]
      }),
      new Paragraph({
        spacing: { after: 240 },
        children: [new TextRun("Simply open this link in your web browser (Chrome, Safari, Samsung Internet, etc.) to access the app.")]
      }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Installing the App on Your Phone")] }),
      new Paragraph({ numbering: { reference: "numbered-list-1", level: 0 }, children: [new TextRun("Open your phone's web browser")] }),
      new Paragraph({ numbering: { reference: "numbered-list-1", level: 0 }, children: [new TextRun("Go to the app URL above")] }),
      new Paragraph({ numbering: { reference: "numbered-list-1", level: 0 }, children: [new TextRun("Wait for the page to fully load")] }),
      new Paragraph({ numbering: { reference: "numbered-list-1", level: 0 }, children: [new TextRun("Tap the browser menu (three dots in top right)")] }),
      new Paragraph({ numbering: { reference: "numbered-list-1", level: 0 }, children: [new TextRun('Select "Add to Home Screen" or "Install App"')] }),
      new Paragraph({ numbering: { reference: "numbered-list-1", level: 0 }, spacing: { after: 360 }, children: [new TextRun('Name it "Masjid Hub" and tap "Add"')] }),
      new Paragraph({
        spacing: { after: 360 },
        children: [new TextRun("The app icon will now appear on your home screen like any other app!")]
      }),
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("2. Admin Panel Access")] }),
      new Paragraph({
        spacing: { after: 180 },
        children: [new TextRun("The Admin Panel allows authorized users to manage content, announcements, prayer times, and more.")]
      }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("How to Login")] }),
      new Paragraph({ numbering: { reference: "numbered-list-2", level: 0 }, children: [new TextRun("Open the Masjid Hub app")] }),
      new Paragraph({ numbering: { reference: "numbered-list-2", level: 0 }, children: [new TextRun('Go to the URL and add "/admin" to the end:')] }),
      new Paragraph({
        indent: { left: 720 },
        spacing: { after: 180 },
        children: [new TextRun({ text: "https://masjid-hub-jb9p.vercel.app/admin", bold: true })]
      }),
      new Paragraph({ numbering: { reference: "numbered-list-2", level: 0 }, children: [new TextRun("Enter your email and password")] }),
      new Paragraph({ numbering: { reference: "numbered-list-2", level: 0 }, spacing: { after: 360 }, children: [new TextRun('Click "Sign In"')] }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Admin Login Credentials")] }),
      new Paragraph({
        spacing: { after: 180 },
        children: [new TextRun({ text: "IMPORTANT: Please keep these credentials confidential.", italics: true, color: colors.primary })]
      }),
      new Table({
        columnWidths: [2340, 3510, 2340],
        margins: { top: 100, bottom: 100, left: 180, right: 180 },
        rows: [
          new TableRow({
            tableHeader: true,
            children: [
              new TableCell({ borders: cellBorders, width: { size: 2340, type: WidthType.DXA }, shading: { fill: "1B5E20", type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER,
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Role", bold: true, color: "FFFFFF", size: 22 })] })] }),
              new TableCell({ borders: cellBorders, width: { size: 3510, type: WidthType.DXA }, shading: { fill: "1B5E20", type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER,
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Email", bold: true, color: "FFFFFF", size: 22 })] })] }),
              new TableCell({ borders: cellBorders, width: { size: 2340, type: WidthType.DXA }, shading: { fill: "1B5E20", type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER,
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Password", bold: true, color: "FFFFFF", size: 22 })] })] })
            ]
          }),
          ...([
            ["Imam", "imam@zeenatulislam.org", "imam2024"],
            ["Chairman", "chairman@zeenatulislam.org", "chairman2024"],
            ["Treasurer", "treasurer@zeenatulislam.org", "treasurer2024"],
            ["Secretary", "secretary@zeenatulislam.org", "secretary2024"],
            ["Tech Support", "tech@zeenatulislam.org", "tech2024"]
          ]).map((row, idx) => new TableRow({
            children: [
              new TableCell({ borders: cellBorders, width: { size: 2340, type: WidthType.DXA }, shading: { fill: idx % 2 === 0 ? "F8FAF7" : "FFFFFF", type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER,
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: row[0], size: 22 })] })] }),
              new TableCell({ borders: cellBorders, width: { size: 3510, type: WidthType.DXA }, shading: { fill: idx % 2 === 0 ? "F8FAF7" : "FFFFFF", type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER,
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: row[1], size: 22 })] })] }),
              new TableCell({ borders: cellBorders, width: { size: 2340, type: WidthType.DXA }, shading: { fill: idx % 2 === 0 ? "F8FAF7" : "FFFFFF", type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER,
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: row[2], size: 22 })] })] })
            ]
          }))
        ]
      }),
      new Paragraph({
        spacing: { before: 180, after: 360 },
        children: [new TextRun({ text: "Security Note: ", bold: true }), new TextRun("Please change these default passwords after your first login for security purposes. Contact Tech Support for assistance with password changes.")]
      }),
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("3. Managing Content in the Admin Panel")] }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Updating Announcements")] }),
      new Paragraph({ numbering: { reference: "numbered-list-3", level: 0 }, children: [new TextRun("Login to the Admin Panel")] }),
      new Paragraph({ numbering: { reference: "numbered-list-3", level: 0 }, children: [new TextRun('Click on the "Announcements" tab')] }),
      new Paragraph({ numbering: { reference: "numbered-list-3", level: 0 }, children: [new TextRun('Click "+ Add New" to create a new announcement')] }),
      new Paragraph({ numbering: { reference: "numbered-list-3", level: 0 }, children: [new TextRun("Fill in the title and content")] }),
      new Paragraph({ numbering: { reference: "numbered-list-3", level: 0 }, children: [new TextRun('Select category (General, Event, Fundraiser, Emergency, Madressa)')] }),
      new Paragraph({ numbering: { reference: "numbered-list-3", level: 0 }, children: [new TextRun("Set priority level (Normal, High, Urgent)")] }),
      new Paragraph({ numbering: { reference: "numbered-list-3", level: 0 }, spacing: { after: 240 }, children: [new TextRun('Click "Save Changes"')] }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Updating Prayer Times")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Go to the Prayer Times tab")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Enter the correct times for each prayer (Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha)")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, spacing: { after: 240 }, children: [new TextRun("Click Save Changes to update")] }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Managing Notice Board")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Go to the Notice Board tab")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Add notices with title, content, and type")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun('Check "Pin to Top" for important notices')] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, spacing: { after: 360 }, children: [new TextRun("Save your changes")] }),
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("4. PayNow Payment Integration Setup")] }),
      new Paragraph({
        spacing: { after: 240 },
        children: [new TextRun("The Masjid Hub app includes a donation section that supports multiple payment methods including EcoCash, OneMoney, InnBucks, Bank Transfer, and Cash. To set up PayNow integration for automated payments:")]
      }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Step 1: Register with PayNow")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Visit www.paynow.co.zw")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun('Click "Sign Up" to create a merchant account')] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Complete the registration with masjid details")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, spacing: { after: 240 }, children: [new TextRun("Submit required documents (registration certificate, ID)")] }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Step 2: Get API Credentials")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("After approval, login to PayNow dashboard")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun('Go to "Settings" > "API Integration"')] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Generate your Integration ID and Integration Key")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, spacing: { after: 240 }, children: [new TextRun("Save these credentials securely")] }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Step 3: Contact Tech Support")] }),
      new Paragraph({
        spacing: { after: 360 },
        children: [new TextRun("Provide the Integration ID and Key to Tech Support (tech@zeenatulislam.org) to complete the setup. The technical team will integrate PayNow into the donation system.")]
      }),
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("5. App Features Overview")] }),
      new Paragraph({
        spacing: { after: 180 },
        children: [new TextRun("The Masjid Hub app includes the following features for our community:")]
      }),
      new Table({
        columnWidths: [3120, 6240],
        margins: { top: 100, bottom: 100, left: 180, right: 180 },
        rows: [
          new TableRow({
            tableHeader: true,
            children: [
              new TableCell({ borders: cellBorders, width: { size: 3120, type: WidthType.DXA }, shading: { fill: "1B5E20", type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER,
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Feature", bold: true, color: "FFFFFF", size: 22 })] })] }),
              new TableCell({ borders: cellBorders, width: { size: 6240, type: WidthType.DXA }, shading: { fill: "1B5E20", type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER,
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Description", bold: true, color: "FFFFFF", size: 22 })] })] })
            ]
          }),
          ...([
            ["Prayer Times", "Daily salah times for Bulawayo with Adhan notifications"],
            ["Jumu'ah Countdown", "Countdown to Friday prayer with khutbah times"],
            ["Qibla Finder", "Compass pointing towards Makkah"],
            ["Wudu & Salah Guide", "Step-by-step guides with Arabic text"],
            ["Daily Duas", "Collection of morning, evening, and daily duas"],
            ["Hifz Tracker", "Track Quran memorization progress"],
            ["Tajweed Lessons", "Learn proper Quran recitation rules"],
            ["Kids Section", "Nasheeds, stories, games, and Arabic learning"],
            ["Announcements", "News, events, and emergency alerts"],
            ["Donations", "Multiple payment options for sadaqah and donations"],
            ["Live Streaming", "Watch Jumu'ah, Eid, and lectures live"],
            ["Marriage Board", "Halal matrimonial service for members"],
            ["GPS Directions", "Navigate to the masjid from anywhere"]
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
      new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 480 }, children: [new TextRun("6. Technical Support")] }),
      new Paragraph({
        spacing: { after: 180 },
        children: [new TextRun("For any technical issues, questions, or assistance, please contact:")]
      }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "Email: ", bold: true }), new TextRun("tech@zeenatulislam.org")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, spacing: { after: 360 }, children: [new TextRun({ text: "Phone: ", bold: true }), new TextRun("Contact masjid for tech support number")] }),
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("7. Dedication")] }),
      new Paragraph({
        spacing: { after: 180 },
        children: [new TextRun("This application is dedicated as a "), new TextRun({ text: "Sadaqah Jaariyah", bold: true }), new TextRun(" (continuous charity) in memory of "), new TextRun({ text: "Hajji Dawood Cassim", bold: true, color: colors.primary }), new TextRun(" - a pillar of our community. May Allah grant him Jannatul Firdaus and accept this effort as a means of ongoing reward for him and his family.")]
      }),
      new Paragraph({
        spacing: { before: 480, after: 240 },
        children: [new TextRun("JazakAllah Khairan for your cooperation in implementing this beneficial tool for our community.")]
      }),
      new Paragraph({
        spacing: { before: 360, after: 120 },
        children: [new TextRun("Wassalamu Alaikum Wa Rahmatullahi Wa Barakatuh")]
      }),
      new Paragraph({
        spacing: { before: 360, after: 120 },
        children: [new TextRun({ text: "Masjid Hub Development Team", bold: true })]
      }),
      new Paragraph({
        children: [new TextRun("Zeenat-ul-Islam Masjid, Bulawayo")]
      })
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/home/z/my-project/download/Masjid_Hub_Administration_Guide.docx", buffer);
  console.log("Document created successfully!");
}).catch(err => {
  console.error("Error creating document:", err);
});
