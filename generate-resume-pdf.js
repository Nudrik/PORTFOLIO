import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';

async function generateResumePDF() {
    const pdfDoc = await PDFDocument.create();
    
    // Standard Letter / A4 page size
    const pageWidth = 595.28;
    const pageHeight = 841.89;
    const page = pdfDoc.addPage([pageWidth, pageHeight]);

    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

    const marginX = 36;
    let currentY = pageHeight - 36;

    const black = rgb(0, 0, 0);
    const darkGray = rgb(0.2, 0.2, 0.2);
    const primaryBlue = rgb(0.05, 0.45, 0.85);

    function drawCenterText(text, size, font, color = black) {
        const textWidth = font.widthOfTextAtSize(text, size);
        page.drawText(text, {
            x: (pageWidth - textWidth) / 2,
            y: currentY,
            size: size,
            font: font,
            color: color,
        });
        currentY -= size + 3;
    }

    function drawSectionHeading(title) {
        currentY -= 6;
        page.drawText(title, {
            x: marginX,
            y: currentY,
            size: 10.5,
            font: fontBold,
            color: black,
        });
        currentY -= 3;
        page.drawLine({
            start: { x: marginX, y: currentY },
            end: { x: pageWidth - marginX, y: currentY },
            thickness: 0.75,
            color: black,
        });
        currentY -= 9;
    }

    function wrapText(text, maxWidth, size, font) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';

        for (const word of words) {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            const width = font.widthOfTextAtSize(testLine, size);
            if (width <= maxWidth) {
                currentLine = testLine;
            } else {
                if (currentLine) lines.push(currentLine);
                currentLine = word;
            }
        }
        if (currentLine) lines.push(currentLine);
        return lines;
    }

    function drawParagraph(text, size = 8.5, font = fontRegular, color = darkGray, lineHeight = 11.5) {
        const lines = wrapText(text, pageWidth - marginX * 2, size, font);
        for (const line of lines) {
            page.drawText(line, {
                x: marginX,
                y: currentY,
                size: size,
                font: font,
                color: color,
            });
            currentY -= lineHeight;
        }
    }

    function drawBullet(text, size = 8.5, font = fontRegular, color = darkGray, lineHeight = 11.5) {
        const bulletIndent = 12;
        const textWidth = pageWidth - marginX * 2 - bulletIndent;
        const lines = wrapText(text, textWidth, size, font);
        
        page.drawText('•', {
            x: marginX + 2,
            y: currentY,
            size: size,
            font: fontBold,
            color: black,
        });

        for (let i = 0; i < lines.length; i++) {
            page.drawText(lines[i], {
                x: marginX + bulletIndent,
                y: currentY,
                size: size,
                font: font,
                color: color,
            });
            currentY -= lineHeight;
        }
    }

    // 1. HEADER
    drawCenterText('BAHATAM NUDRIK RAJU', 16, fontBold, black);
    drawCenterText('Application Developer | Python Programmer', 9.5, fontBold, darkGray);
    
    // Contact bar
    const contactText = 'GitHub (github.com/Nudrik)  |  nudrikraju396@gmail.com  |  +91 8500632073  |  LinkedIn';
    drawCenterText(contactText, 8.5, fontRegular, darkGray);
    currentY -= 4;

    // 2. PROFESSIONAL SUMMARY
    drawSectionHeading('PROFESSIONAL SUMMARY');
    drawParagraph(
        'B.Tech graduate in Computer Science (AI & ML) with hands-on Python programming experience, including a deep-learning application built with CNNs and transfer learning. Skilled in object-oriented programming, data structures and algorithms, and writing clean, efficient, maintainable code. Experienced working within Agile/Scrum teams across the full software development lifecycle, integrating REST APIs with backend services and databases (MongoDB, SQL, MySQL), and troubleshooting and debugging applications to improve performance and reliability. Strong collaborator who documents work clearly and supports team members on project tasks.',
        8.5, fontRegular, darkGray, 11
    );

    // 3. TECHNICAL SKILLS
    drawSectionHeading('TECHNICAL SKILLS');
    const skills = [
        { label: 'Programming Languages:', val: 'Python, JavaScript, Java, C, C#' },
        { label: 'Software Engineering Fundamentals:', val: 'Object-Oriented Programming (OOP), Data Structures & Algorithms, Clean Code Principles, Software Testing & Debugging' },
        { label: 'Databases:', val: 'SQL, MySQL, MongoDB' },
        { label: 'Web & API Development:', val: 'REST API Integration, Node.js, Express.js, React.js' },
        { label: 'Development Practices:', val: 'Software Development Lifecycle (SDLC), Agile/Scrum, Technical Documentation, Problem Solving' },
        { label: 'Tools:', val: 'Git, GitHub, Postman, Render' }
    ];

    for (const item of skills) {
        const fullLine = `${item.label} ${item.val}`;
        const labelWidth = fontBold.widthOfTextAtSize(item.label + ' ', 8.5);
        
        // check if fits in one line or wraps
        const lines = wrapText(item.val, pageWidth - marginX * 2 - labelWidth, 8.5, fontRegular);
        if (lines.length <= 1) {
            page.drawText(item.label, { x: marginX, y: currentY, size: 8.5, font: fontBold, color: black });
            page.drawText(item.val, { x: marginX + labelWidth, y: currentY, size: 8.5, font: fontRegular, color: darkGray });
            currentY -= 11;
        } else {
            page.drawText(item.label, { x: marginX, y: currentY, size: 8.5, font: fontBold, color: black });
            page.drawText(lines[0], { x: marginX + labelWidth, y: currentY, size: 8.5, font: fontRegular, color: darkGray });
            currentY -= 11;
            for (let k = 1; k < lines.length; k++) {
                page.drawText(lines[k], { x: marginX + 15, y: currentY, size: 8.5, font: fontRegular, color: darkGray });
                currentY -= 11;
            }
        }
    }

    // 4. PROFESSIONAL EXPERIENCE
    drawSectionHeading('PROFESSIONAL EXPERIENCE');

    // Experience 1
    page.drawText('Full Stack Developer Intern', { x: marginX, y: currentY, size: 9, font: fontBold, color: black });
    const sep1 = fontBold.widthOfTextAtSize('Full Stack Developer Intern ', 9);
    page.drawText('| Elbert Technology Pvt. Ltd.', { x: marginX + sep1, y: currentY, size: 9, font: fontRegular, color: darkGray });
    const date1 = 'Jun 2024 – May 2025';
    const date1Width = fontBold.widthOfTextAtSize(date1, 8.5);
    page.drawText(date1, { x: pageWidth - marginX - date1Width, y: currentY, size: 8.5, font: fontBold, color: darkGray });
    currentY -= 11.5;

    drawBullet('Built and maintained applications integrated with Node.js/Express.js REST APIs and a MongoDB database, working within an Agile/Scrum team through the full software development lifecycle.', 8.5, fontRegular, darkGray, 11);
    drawBullet('Wrote clean, efficient, maintainable code following SDLC and clean-code best practices, collaborating with cross-functional teammates on reusable, modular components.', 8.5, fontRegular, darkGray, 11);
    drawBullet('Conducted testing, debugging, and performance optimization; used Git/GitHub for version control and contributed to documentation supporting a maintainable, well-structured codebase.', 8.5, fontRegular, darkGray, 11);
    currentY -= 2;

    // Experience 2
    page.drawText('Web Development Intern', { x: marginX, y: currentY, size: 9, font: fontBold, color: black });
    const sep2 = fontBold.widthOfTextAtSize('Web Development Intern ', 9);
    page.drawText('| Codetech IT Solutions', { x: marginX + sep2, y: currentY, size: 9, font: fontRegular, color: darkGray });
    const date2 = 'Nov 2024';
    const date2Width = fontBold.widthOfTextAtSize(date2, 8.5);
    page.drawText(date2, { x: pageWidth - marginX - date2Width, y: currentY, size: 8.5, font: fontBold, color: darkGray });
    currentY -= 11.5;

    drawBullet('Developed application logic for a dynamic e-commerce platform, including a live product catalog and shopping cart, and a To-Do List application with full CRUD functionality and data persistence.', 8.5, fontRegular, darkGray, 11);
    drawBullet('Applied problem-solving skills to design and structure application features in a collaborative development environment.', 8.5, fontRegular, darkGray, 11);
    drawBullet('Performed application testing and debugging, identifying and resolving functional defects to improve reliability.', 8.5, fontRegular, darkGray, 11);
    currentY -= 2;

    // Experience 3
    page.drawText('Web Developer Intern', { x: marginX, y: currentY, size: 9, font: fontBold, color: black });
    const sep3 = fontBold.widthOfTextAtSize('Web Developer Intern ', 9);
    page.drawText('| Next24Tech Technology & Services LLP', { x: marginX + sep3, y: currentY, size: 9, font: fontRegular, color: darkGray });
    const date3 = 'Oct 2024';
    const date3Width = fontBold.widthOfTextAtSize(date3, 8.5);
    page.drawText(date3, { x: pageWidth - marginX - date3Width, y: currentY, size: 8.5, font: fontBold, color: darkGray });
    currentY -= 11.5;

    drawBullet('Built a full-featured e-commerce application with integrated payment gateway functionality and a portfolio application; delivered an e-learning platform with user authentication and course management.', 8.5, fontRegular, darkGray, 11);
    drawBullet('Collaborated through the full software lifecycle: design, development, testing, and deployment.', 8.5, fontRegular, darkGray, 11);
    currentY -= 3;

    // 5. PROJECTS
    drawSectionHeading('PROJECTS');

    // Project 1
    page.drawText('Skin Disease Detection & Classification using Deep Learning', { x: marginX, y: currentY, size: 9, font: fontBold, color: black });
    const p1w = fontBold.widthOfTextAtSize('Skin Disease Detection & Classification using Deep Learning ', 9);
    page.drawText('| Major Project', { x: marginX + p1w, y: currentY, size: 9, font: fontRegular, color: darkGray });
    currentY -= 11.5;

    drawBullet('Built a Python-based deep learning application using CNNs with transfer learning (MobileNetV3) to detect and classify skin diseases, training on 10,000+ medical images.', 8.5, fontRegular, darkGray, 11);
    drawBullet('Collaborated in a two-member team to design, develop, test, and optimize the model, applying problem-solving and debugging skills to improve classification reliability.', 8.5, fontRegular, darkGray, 11);
    currentY -= 2;

    // Project 2
    page.drawText('Blood Bank Management System', { x: marginX, y: currentY, size: 9, font: fontBold, color: black });
    const p2w = fontBold.widthOfTextAtSize('Blood Bank Management System ', 9);
    page.drawText('| Minor Project (Live on Render)', { x: marginX + p2w, y: currentY, size: 9, font: fontRegular, color: darkGray });
    currentY -= 11.5;

    drawBullet('Developed a full-stack application to manage donor, recipient, and blood inventory records, including registration, stock tracking, and request management, with database integration.', 8.5, fontRegular, darkGray, 11);
    drawBullet('Improved functionality through iterative testing and debugging, and documented application logic for clarity and maintainability.', 8.5, fontRegular, darkGray, 11);
    currentY -= 3;

    // 6. EDUCATION
    drawSectionHeading('EDUCATION');

    const edu1 = 'B.Tech, Computer Science & Engineering (AI & ML) — CGPA: 7.79/10 — Anurag Engineering College, JNTU';
    page.drawText(edu1, { x: marginX, y: currentY, size: 8.5, font: fontRegular, color: black });
    const dEdu1 = 'May 2026';
    page.drawText(dEdu1, { x: pageWidth - marginX - fontBold.widthOfTextAtSize(dEdu1, 8.5), y: currentY, size: 8.5, font: fontBold, color: darkGray });
    currentY -= 12;

    const edu2 = 'Diploma, Electrical & Electronics Engineering — CGPA: 7.24/10 — Anurag Polytechnic College';
    page.drawText(edu2, { x: marginX, y: currentY, size: 8.5, font: fontRegular, color: black });
    const dEdu2 = 'Mar 2023';
    page.drawText(dEdu2, { x: pageWidth - marginX - fontBold.widthOfTextAtSize(dEdu2, 8.5), y: currentY, size: 8.5, font: fontBold, color: darkGray });
    currentY -= 12;

    const edu3 = 'Secondary School Certificate — CGPA: 9.0/10 — Priya Educational Academy';
    page.drawText(edu3, { x: marginX, y: currentY, size: 8.5, font: fontRegular, color: black });
    const dEdu3 = 'Mar 2020';
    page.drawText(dEdu3, { x: pageWidth - marginX - fontBold.widthOfTextAtSize(dEdu3, 8.5), y: currentY, size: 8.5, font: fontBold, color: darkGray });
    currentY -= 3;

    // 7. CERTIFICATIONS & ADDITIONAL ACTIVITIES
    drawSectionHeading('CERTIFICATIONS & ADDITIONAL ACTIVITIES');
    drawBullet('Artificial Intelligence Fundamentals; RPA & AI; Introduction to Generative AI; Young Professional Certification (2024)', 8.5, fontRegular, darkGray, 11);
    drawBullet('One-month MERN Stack Hackathon — Elbert Technology Pvt. Ltd. / Anurag Engineering College (Aug 2025)', 8.5, fontRegular, darkGray, 11);

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync('Bahatam_Nudrik_Raju_Resume.pdf', pdfBytes);
    fs.writeFileSync('My_Resume.pdf', pdfBytes);
    console.log('Successfully created Bahatam_Nudrik_Raju_Resume.pdf and My_Resume.pdf! Size:', pdfBytes.length);
}

generateResumePDF().catch(console.error);
