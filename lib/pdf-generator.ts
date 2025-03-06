"use client";

import type { User, RandomUser, PdfOptions } from "@/types/user";
import jsPDF from "jspdf";

function drawGradientHeader(doc: jsPDF, options: PdfOptions) {
  const width = doc.internal.pageSize.width;
  const height = 60;

  doc.setFillColor(options.branding.primaryColor);
  doc.rect(0, 0, width, height, "F");

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(255, 255, 255);
  doc.circle(20, 20, 15, "F");
  doc.circle(width - 20, 20, 8, "F");
  doc.circle(width - 40, 40, 5, "F");

  doc.setFillColor(255, 255, 255);
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 10; j++) {
      doc.circle(width - 50 + j * 5, 20 + i * 5, 1, "F");
    }
  }
}

function drawDivider(doc: jsPDF, y: number) {
  const width = doc.internal.pageSize.width - 28;
  doc.setDrawColor(200, 200, 200);
  doc.line(14, y, width + 14, y);
}

function addSection(doc: jsPDF, title: string, y: number): number {
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(title, 14, y);
  y += 8;
  return y;
}

function addBulletPoint(doc: jsPDF, text: string, y: number): number {
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("•", 14, y);
  doc.text(text, 24, y);
  return y + 7;
}

function createSimpleTable(
  doc: jsPDF,
  data: Array<[string, string]>,
  startY: number,
  primaryColor: string
): number {
  const margin = 14;
  const cellPadding = 5;
  const lineHeight = 10;
  const colWidth = [50, 130];

  doc.setFillColor(primaryColor);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.rect(margin, startY, colWidth[0] + colWidth[1], lineHeight, "F");

  doc.text("Field", margin + cellPadding, startY + lineHeight - cellPadding);
  doc.text(
    "Value",
    margin + colWidth[0] + cellPadding,
    startY + lineHeight - cellPadding
  );

  doc.setTextColor(0, 0, 0);

  let y = startY + lineHeight;

  data.forEach((row, i) => {
    const rowHeight = lineHeight;

    if (i % 2 === 0) {
      doc.setFillColor(240, 240, 240);
      doc.rect(margin, y, colWidth[0] + colWidth[1], rowHeight, "F");
    }

    doc.setDrawColor(200, 200, 200);
    doc.rect(margin, y, colWidth[0], rowHeight);
    doc.rect(margin + colWidth[0], y, colWidth[1], rowHeight);

    doc.text(row[0], margin + cellPadding, y + rowHeight - cellPadding);

    const value = row[1];
    if (value.length > 40) {
      const lines = doc.splitTextToSize(value, colWidth[1] - 2 * cellPadding);
      doc.text(
        lines,
        margin + colWidth[0] + cellPadding,
        y + rowHeight - cellPadding
      );
    } else {
      doc.text(
        value,
        margin + colWidth[0] + cellPadding,
        y + rowHeight - cellPadding
      );
    }

    y += rowHeight;
  });

  return y;
}

export function generateJsonPlaceholderUserPdf(
  user: User,
  options: PdfOptions
): jsPDF {
  const doc = new jsPDF();
  const { template, branding } = options;

  doc.setFontSize(20);
  doc.setTextColor(branding.primaryColor);
  doc.text(branding.companyName, 105, 15, { align: "center" });

  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text("User Profile", 105, 25, { align: "center" });

  if (branding.includeWatermark) {
    doc.setFontSize(40);
    doc.setTextColor(230, 230, 230);
    doc.text(branding.companyName, 105, 150, {
      align: "center",
      angle: 45,
    });
  }

  doc.setTextColor(0, 0, 0);

  if (template === "template1") {
    const tableData: Array<[string, string]> = [
      ["Name", user.name],
      ["Username", user.username],
      ["Email", user.email],
      ["Phone", user.phone],
      ["Website", user.website],
      [
        "Address",
        `${user.address.street}, ${user.address.suite}, ${user.address.city}, ${user.address.zipcode}`,
      ],
      ["Company", user.company.name],
      ["Company Catch Phrase", user.company.catchPhrase],
      ["Business", user.company.bs],
    ];

    createSimpleTable(doc, tableData, 35, branding.primaryColor);
  } else if (template === "template2") {
    let yPos = 35;
    doc.setFontSize(14);
    doc.setTextColor(branding.primaryColor);
    doc.text("Personal Information", 14, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Name: ${user.name}`, 14, yPos);
    yPos += 7;
    doc.text(`Username: ${user.username}`, 14, yPos);
    yPos += 7;
    doc.text(`Email: ${user.email}`, 14, yPos);
    yPos += 7;
    doc.text(`Phone: ${user.phone}`, 14, yPos);
    yPos += 7;
    doc.text(`Website: ${user.website}`, 14, yPos);
    yPos += 15;

    doc.setFontSize(14);
    doc.setTextColor(branding.primaryColor);
    doc.text("Address", 14, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Street: ${user.address.street}`, 14, yPos);
    yPos += 7;
    doc.text(`Suite: ${user.address.suite}`, 14, yPos);
    yPos += 7;
    doc.text(`City: ${user.address.city}`, 14, yPos);
    yPos += 7;
    doc.text(`Zipcode: ${user.address.zipcode}`, 14, yPos);
    yPos += 15;

    doc.setFontSize(14);
    doc.setTextColor(branding.primaryColor);
    doc.text("Company", 14, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Name: ${user.company.name}`, 14, yPos);
    yPos += 7;
    doc.text(`Catch Phrase: ${user.company.catchPhrase}`, 14, yPos);
    yPos += 7;
    doc.text(`Business: ${user.company.bs}`, 14, yPos);
  } else {
    let yPos = 35;

    doc.setFontSize(12);
    doc.text(`Name: ${user.name}`, 14, yPos);
    yPos += 10;
    doc.text(`Username: ${user.username}`, 14, yPos);
    yPos += 10;
    doc.text(`Email: ${user.email}`, 14, yPos);
    yPos += 10;
    doc.text(`Phone: ${user.phone}`, 14, yPos);
    yPos += 10;
    doc.text(`Website: ${user.website}`, 14, yPos);
    yPos += 10;
    doc.text(
      `Address: ${user.address.street}, ${user.address.suite}, ${user.address.city}, ${user.address.zipcode}`,
      14,
      yPos
    );
    yPos += 10;
    doc.text(`Company: ${user.company.name}`, 14, yPos);
    yPos += 10;
    doc.text(`Company Catch Phrase: ${user.company.catchPhrase}`, 14, yPos);
    yPos += 10;
    doc.text(`Business: ${user.company.bs}`, 14, yPos);
  }

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Generated on ${new Date().toLocaleDateString()} | Page ${i} of ${pageCount}`,
      105,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    );
  }

  return doc;
}

export function generateRandomUserPdf(
  user: RandomUser,
  options: PdfOptions
): jsPDF {
  if (options.template === "modern") {
    return generateModernUserPdf(user, options);
  }

  const doc = new jsPDF();
  const { template, branding } = options;

  doc.setFontSize(20);
  doc.setTextColor(branding.primaryColor);
  doc.text(branding.companyName, 105, 15, { align: "center" });

  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text("User Profile", 105, 25, { align: "center" });

  if (branding.includeWatermark) {
    doc.setFontSize(40);
    doc.setTextColor(230, 230, 230);
    doc.text(branding.companyName, 105, 150, {
      align: "center",
      angle: 45,
    });
  }

  doc.setTextColor(0, 0, 0);

  const fullName = `${user.name.title} ${user.name.first} ${user.name.last}`;
  const fullAddress = `${user.location.street.number} ${user.location.street.name}, ${user.location.city}, ${user.location.state}, ${user.location.country}, ${user.location.postcode}`;

  if (template === "template1") {
    const tableData: Array<[string, string]> = [
      ["Name", fullName],
      ["Gender", user.gender],
      ["Email", user.email],
      ["Phone", user.phone],
      ["Cell", user.cell],
      ["Address", fullAddress],
      ["Date of Birth", new Date(user.dob.date).toLocaleDateString()],
      ["Age", user.dob.age.toString()],
      ["Nationality", user.nat],
    ];

    createSimpleTable(doc, tableData, 35, branding.primaryColor);
  } else if (template === "template2") {
    let yPos = 35;

    doc.setFontSize(14);
    doc.setTextColor(branding.primaryColor);
    doc.text("Personal Information", 14, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Name: ${fullName}`, 14, yPos);
    yPos += 7;
    doc.text(`Gender: ${user.gender}`, 14, yPos);
    yPos += 7;
    doc.text(`Email: ${user.email}`, 14, yPos);
    yPos += 7;
    doc.text(`Phone: ${user.phone}`, 14, yPos);
    yPos += 7;
    doc.text(`Cell: ${user.cell}`, 14, yPos);
    yPos += 7;
    doc.text(
      `Date of Birth: ${new Date(user.dob.date).toLocaleDateString()} (Age: ${
        user.dob.age
      })`,
      14,
      yPos
    );
    yPos += 7;
    doc.text(`Nationality: ${user.nat}`, 14, yPos);
    yPos += 15;

    doc.setFontSize(14);
    doc.setTextColor(branding.primaryColor);
    doc.text("Address", 14, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(
      `Street: ${user.location.street.number} ${user.location.street.name}`,
      14,
      yPos
    );
    yPos += 7;
    doc.text(`City: ${user.location.city}`, 14, yPos);
    yPos += 7;
    doc.text(`State: ${user.location.state}`, 14, yPos);
    yPos += 7;
    doc.text(`Country: ${user.location.country}`, 14, yPos);
    yPos += 7;
    doc.text(`Postcode: ${user.location.postcode}`, 14, yPos);
  } else {
    let yPos = 35;

    doc.setFontSize(12);
    doc.text(`Name: ${fullName}`, 14, yPos);
    yPos += 10;
    doc.text(`Gender: ${user.gender}`, 14, yPos);
    yPos += 10;
    doc.text(`Email: ${user.email}`, 14, yPos);
    yPos += 10;
    doc.text(`Phone: ${user.phone}`, 14, yPos);
    yPos += 10;
    doc.text(`Cell: ${user.cell}`, 14, yPos);
    yPos += 10;
    doc.text(`Address: ${fullAddress}`, 14, yPos);
    yPos += 10;
    doc.text(
      `Date of Birth: ${new Date(user.dob.date).toLocaleDateString()} (Age: ${
        user.dob.age
      })`,
      14,
      yPos
    );
    yPos += 10;
    doc.text(`Nationality: ${user.nat}`, 14, yPos);
  }

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Generated on ${new Date().toLocaleDateString()} | Page ${i} of ${pageCount}`,
      105,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    );
  }

  return doc;
}

function addWaterMark(doc: any, options: PdfOptions) {
  var totalPages = doc.internal.getNumberOfPages();

  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    doc.setFontSize(40);
    doc.setTextColor(150);
    doc.text(options.branding.companyName, 105, 150, {
      align: "center",
      angle: 45,
    });
  }

  return doc;
}

export function generateModernUserPdf(
  user: RandomUser,
  options: PdfOptions
): jsPDF {
  let doc = new jsPDF();
  const { branding } = options;

  drawGradientHeader(doc, options);

  let y = 40;

  doc.setFillColor(255, 255, 255);
  doc.circle(45, 35, 25, "F");

  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  const fullName = `${user.name.title} ${user.name.first} ${user.name.last}`;
  doc.text(fullName, 14, 35);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Marketing Specialist | Strategic Campaigns & Digital Marketing Expert",
    14,
    45
  );

  const location = `${user.location.city}, ${user.location.state} | ${user.email} | ${user.phone}`;

  doc.text(location, 14, 55);

  y = 80;
  const pageHeight = doc.internal.pageSize.height;

  y = addSection(doc, "About", y);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  const aboutText =
    "Marketing professional with 7+ years of experience in digital strategies, content creation, " +
    "and social media management. Proven ability to increase brand visibility, drive customer " +
    "engagement, and deliver ROI-focused campaigns.";
  const aboutLines = doc.splitTextToSize(aboutText, 180);
  doc.text(aboutLines, 14, y);
  y += aboutLines.length * 7 + 10;

  drawDivider(doc, y);
  y += 15;

  y = addSection(doc, "Experience", y);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Marketing Specialist", 14, (y += 10));

  y = addBulletPoint(
    doc,
    "Developed and led digital marketing strategies for 20+ clients.",
    (y += 10)
  );
  y = addBulletPoint(
    doc,
    "Boosted client engagement by 30% with content and SEO strategies.",
    (y += 2)
  );
  y = addBulletPoint(doc, "Increased social media followers by 25%.", (y += 2));

  drawDivider(doc, (y += 10));

  y = addSection(doc, "Skills", (y += 10));
  y = addBulletPoint(doc, "Digital Marketing", (y += 2));
  y = addBulletPoint(doc, "SEO/SEM", (y += 2));
  y = addBulletPoint(doc, "Social Media Management", (y += 2));
  y = addBulletPoint(doc, "Content Creation", (y += 2));
  y = addBulletPoint(doc, "Google Analytics", (y += 2));
  y = addBulletPoint(doc, "Copy Writer", (y += 2));

  drawDivider(doc, (y += 10));
  y += 30;

  if (y >= pageHeight) {
    doc.addPage();
    y = 15;
  }

  y = addSection(doc, "Education", y);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("B.Sc. in Marketing", 14, (y += 10));
  doc.setFont("helvetica", "normal");
  doc.text(
    "University of California, Los Angeles (UCLA) | 2010 - 2014",
    14,
    (y += 7)
  );

  doc = addWaterMark(doc, options);

  return doc;
}
