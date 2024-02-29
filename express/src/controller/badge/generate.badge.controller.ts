// controllers/badgeController.ts
import { Request, Response } from 'express';
import puppeteer from 'puppeteer';
import QRCode from 'qrcode';
import fs, { realpathSync } from "fs"
import path from "path"

// helper.js
async function GeneratePdf(html: string, filename: string): Promise<string>{
  try {
      const browser = await puppeteer.launch({
        headless: "new", // Opt-in to the new headless mode
        args: ['--no-sandbox', '--disable-setuid-sandbox'] // Add these arguments to disable the Chrome sandbox
    });
    const page = await browser.newPage();
    await page.setViewport({
      width: 264,
      height: 396,
      deviceScaleFactor: 1,
    });
    await page.setContent(html);
    const generatedName = new Date().toLocaleString("en-us", {
      year: "numeric",
      month: "long",
      day: "numeric",
      second: "numeric",
    });
    const folder_path = `./export`;
    const fileName = filename + ".pdf";
    // check if the folder exist
    if (!fs.existsSync(folder_path)) {
      fs.mkdirSync(folder_path, { recursive: true });
    }
    // Save the HTML content as a PDF file.
    await page.pdf({
      path: folder_path + "/" + fileName,
      width: 264,
      height: 396,
    });
    await browser.close();
    return folder_path + "/" + fileName;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}

export const generateBadge = async (req: Request, res: Response): Promise<void> => {
  const badgeData = req.body

  console.log("badegData", badgeData)
  const qrCodeData = JSON.stringify(badgeData);
  const qrCodeImage = await QRCode.toDataURL(qrCodeData);
  const filename = badgeData.fullName.replaceAll("/","");
  console.log("filename", filename)
  const html = `<!DOCTYPE html>
  <html>
  
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
      rel="stylesheet" />
  </head>
  
  <body style="font-family: 'Montserrat', sans-serif"
    class="w-full h-full flex flex-col justify-between items-center gap-[260px] font-['Montserrat', sans-serif] ">
    <div class="flex flex-col h-[349px]  py-[16px] justify-between items-center">
      <img class="w-[74px] h-[53px]" src="https://afca.coffee/wp-content/uploads/2015/06/AFCA-logo-trans.png"
        alt="Placeholder Image" />
      <div class="flex flex-col h-full justify-between py-2 items-center gap-1  ">
        <h1 class="text-center uppercase mx-auto text-[black] ${badgeData.fullName.length < 20 ? " text-[24px] leading-[26px] " : badgeData.fullName.length < 40 ? " text-[20px]  leading-[22px] " : badgeData.fullName.length < 70 ? " text-[16px]  leading-[18px] " : " text-[13px]  leading-[15px] "} max-w-[240px] font-bold">${badgeData.fullName}</h1>
        <h1 class="uppercase text-center mx-auto text-[black] font-semibold text-[18px] leading-[20px] ">${badgeData.country}</h1>
        <h2 class="uppercase text-center mx-auto max-w-[240px] text-[black] ${badgeData.companyName.length < 40 ? " text-[17px]  leading-[19px] " : badgeData.companyName.length < 60 ? " text-[15px]  leading-[17px] " : badgeData.companyName.length < 80 ? " text-[13px]  leading-[15px] " : 
  " text-[11px]  leading-[13px] "}   ">${badgeData.companyName}</h2>
        <img class="w-[130px] aspect-square"
          src="${qrCodeImage}"
          alt="Placeholder Image" />
      </div>
    </div>
    <div class="absolute bottom-0 w-full h-[47px] flex justify-center items-center">
      <div class="relative w-full h-full flex items-center justify-center">
        <img class="absolute top-0 left-0 w-full h-full" src="https://ligurdic.sirv.com/Group%201000004143.png"
          alt="Placeholder Image" />
  
        <p class="text-center text-[black] text-[16px] leading-[18px] font-bold uppercase z-[200]">
          ${badgeData.badgeType}
        </p>
      </div>
    </div>
  </body>
  
  </html>`;
  
  const createdFilePath = await GeneratePdf(html, filename);
  const realpath = "../../../." + createdFilePath
  // const realpath = "../../." + createdFilePath

  const filePath = path.join(__dirname, realpath);

  
  res.sendFile(filePath, (err) => {
      if (err) {
        // Handle any errors that occurred during sending the file
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {
        console.log('File sent successfully');
      }
    });
}

























// async function GeneratePdf(html) {
//   // Launch the browser.
//   // const browser = await puppeteer.launch();
//   const browser = await puppeteer.launch({
//     headless: "new",
//     executablePath: '/usr/bin/chromium-browser'
//   })
//   // Create a new page.
//   const page = await browser.newPage();
//   await page.setViewport({
//     width: 189,
//     height: 264,
//     deviceScaleFactor: 1,
//   });
//   await page.setContent(html);

//   const generatedName = new Date().toLocaleString("en-us", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//     second: "numeric",
//   });
//   const folder_path = `./export/${generatedName}`;
//   const fileName = `report.pdf`;

//   // check if the folder exist
//   if (!fs.existsSync(folder_path)) {
//     fs.mkdirSync(folder_path, { recursive: true });
//   }

//   // Save the HTML content as a PDF file.
//   await page.pdf({
//     path: folder_path + "/" + fileName,
//     width: "189",
//     height: "264",
//   });

//   // Close the browser.
//   await browser.close();

//   return folder_path + "/" + fileName;
// }



// export const generateBadge = async (req: Request, res: Response): Promise<void> => {
//   // Data for the badge
//   const badgeData = req.body;

//   // Generate QR code
//   const qrCodeData = JSON.stringify(badgeData);
//   const qrCodeImage = await QRCode.toDataURL(qrCodeData);

//   // Create a browser instance
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.setViewport({
//     width: 298,
//     height: 476,
//     deviceScaleFactor: 1,
//   });
//   // Set the content of the page
//   const html = `
//   <!doctype html>
// <html>

// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <script src="https://cdn.tailwindcss.com"></script>
//   <link rel="preconnect" href="https://fonts.googleapis.com">
// <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
// <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">
// </head>

// <body style="font-family: 'Montserrat', sans-serif;" class="w-full h-full flex flex-col justify-between items-center gap-[260px] font-['Montserrat', sans-serif]  pt-[16px]">
//   <div class="flex flex-col h-full justify-center items-center ">
//     <img class="w-[100px] h-[55px]" src="https://afca.coffee/wp-content/uploads/2015/06/AFCA-logo-trans.png"
//       alt="Placeholder Image">
//     <div class="flex flex-col justify-start items-start mt-2 ">
//       <div class="  text-center mx-auto text-[black] text-[36px] leading-[36px]  font-bold  ">${badgeData.fullName}</div>
//       <div class=" uppercase text-center mx-auto text-[black] font-semibold text-[20px] leading-[20px] mt-2  ">${badgeData.country}</div>
//       <div class=" uppercase text-center mx-auto text-[black] text-[20px] mt-4 leading-[20px] max-w-[1200px]  ">${badgeData.companyName}</div>
//     </div>
//     <img class="w-[160px] aspect-square"
//       src="${qrCodeImage}"
//       alt="Placeholder Image">
//   </div>
//   <div class="absolute bottom-0 w-full h-16   flex justify-center items-center">
//     <div class="relative w-full h-full flex items-center justify-center ">
//       <img class="absolute top-0 left-0 w-full h-full" src="https://ligurdic.sirv.com/Group%201000004143.png"
//         alt="Placeholder Image">

//       <p class="text-center text-[black] text-[24px] leading-[26.25px] font-bold uppercase  z-[200]">
//         Delegate</p>
//     </div>
//   </div>
// </body>

// </html`;


//   const response = await GeneratePdf(html)
//   const filePath = path.join(__dirname, '../../../export/February 2, 2024 at 22/report.pdf');
  
//   res.sendFile(filePath, (err) => {
//     if (err) {
//       // Handle any errors that occurred during sending the file
//       console.error(err);
//       res.status(500).send('Internal Server Error');
//     } else {
//       console.log('File sent successfully');
//     }
//   });

//   // Send the PDF as a response
//   // res.setHeader('Content-Type', 'application/pdf');
//   // res.setHeader('Content-Disposition', 'attachment; filename=badge.pdf');
//   // res.send(response);
// };






