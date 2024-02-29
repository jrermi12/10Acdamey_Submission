// controllers/badgeController.ts
import { Request, Response } from 'express';
import puppeteer from 'puppeteer';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import BadgeModel from '../../model/badge.model';
import attendtModel from '../../model/attendant.model';
import associatedexhibitorsmodel from '../../model/associatedexhibitors.model';
import exhibitorModel from '../../model/exhibitor.model';

// Constants and Configurations
const PDF_FOLDER_PATH = './exportbulk';
const PDF_WIDTH = 264;
const PDF_HEIGHT = 396;

async function GeneratePdf(html: string, filename: string): Promise<string> {
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setViewport({
      width: 264,
      height: 396,
      deviceScaleFactor: 1,
    });
    await page.setContent(html);
    const generatedName = new Date().toLocaleString('en-us', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      second: 'numeric',
    });
    const folder_Path = './export';
    const fileName = filename + '.pdf'

    if (!fs.existsSync(folder_Path)) {
      fs.mkdirSync(folder_Path, { recursive: true });
    }

    await page.pdf({
      path: folder_Path + '/' + fileName,
      width: 264,
      height: 396,
    });

    await browser.close();
    return folder_Path + "/" + fileName;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}

export const generateBadgee = async (req: Request, res: Response): Promise<void> => {

  const { badgeIds } = req.body
  try {
    console.log("badgeIDslenght", badgeIds)
    const badges = await BadgeModel.find({ _id: { $in: badgeIds } });;
    // const usernames: string[] = [];
    console.log("badges.length", badges.length)
    let count = 0
    for (const badge of badges) {
      const attendant = await attendtModel.findOne({ _id: badge.attendantInformation });
      const associated = await associatedexhibitorsmodel.findOne({ _id: badge.associatedInformation });

      let badgeData;

      if (attendant) {
        badgeData = {
          fullName: attendant.attendeeInformation.fullName,
          country: attendant.companyInformation.country,
          companyName: attendant.companyInformation.companyName,
          badgeType: badge.badgeType,
          badgeId: badge._id,
        };
      } else {
        const exhibitors = await exhibitorModel.find();
        const exhibitor = exhibitors.find(
          (exhibitor) => exhibitor.companyInformation.companyName === associated.companyName
        );
        badgeData = {
          fullName: associated.attendeeInformation.fullName,
          country: associated.country,
          companyName: associated.companyName,
          badgeType: badge.badgeType,
          badgeId: badge._id,
        };
      }


      // console.log("badgeData", badgeData)
      const pdfFilePath = path.join(process.cwd(), './export', `${badgeData?.fullName}.pdf`);

      // const pdfFilePath = path.join(__dirname, './exportbulk', `${badgeData?.fullName}.pdf`);
      console.log("pdfFilePath", pdfFilePath)
      console.log(fs.existsSync(pdfFilePath))
      if (fs.existsSync(pdfFilePath)) {
        console.log("File exists. Skipping...");
        count++;
        console.log("count", count)
        continue;
      }

      console.log("eze gebechalhu 2")
      const qrCodeData = JSON.stringify(badgeData);
      const qrCodeImage = await QRCode.toDataURL(qrCodeData);
      const filename = badgeData.fullName.replaceAll("/", "");
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

      console.log('badgeData', badgeData);
      const createdFilePath = await GeneratePdf(html, filename);
      console.log('createdFilePath', createdFilePath);
      const realpath = '../../../.' + createdFilePath;
      console.log('realpath', realpath);
      const filePath = path.join(__dirname, realpath);
      console.log('filePath', filePath);
    }


    res.status(200).json({ message: 'All badges generated successfully' });
  } catch (error) {
    console.log(error)
  }
}


// const html = `
//         <!DOCTYPE html>
//         <html>

//         <head>
//           <meta charset="UTF-8" />
//           <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//           <script src="https://cdn.tailwindcss.com"></script>
//           <link rel="preconnect" href="https://fonts.googleapis.com" />
//           <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
//           <link
//             href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
//             rel="stylesheet" />
//         </head>

//         <body style="font-family: 'Montserrat', sans-serif"
//           class="w-full h-full flex flex-col justify-between items-center gap-[260px] font-['Montserrat', sans-serif] ">
//           <div class="flex flex-col h-[429px]  py-[16px] justify-between items-center">
//             <img class="w-[74px] h-[53px]" src="https://afca.coffee/wp-content/uploads/2015/06/AFCA-logo-trans.png"
//               alt="Placeholder Image" />
//             <div class="flex flex-col h-full justify-between py-2 items-center gap-3  ">
//             <h1 class="text-center uppercase mx-auto text-[black] ${ badgedata.fullName.length<20 ? " text-[32px] leading-[34px] " : badgedata.fullName.length<40 ? " text-[26px]  leading-[28px] "  :
//               badgedata.fullName.length<70 ?  " text-[20px]  leading-[22px] " : " text-[16px]  leading-[18px] "} max-w-[250px] font-bold">${badgedata.fullName}</h1>
//               <h1 class="uppercase text-center mx-auto text-[black] font-semibold text-[24px] leading-[26px] ">${badgedata.country}</h1>
//               <h2 class="uppercase text-center mx-auto max-w-[270px] text-[black] ${badgedata.companyName.length<40 ? " text-[22px]  leading-[24px] " : badgedata.companyName.length<60 ? " text-[20px]  leading-[22px] "  : badgedata.companyName.length<80 ?  " text-[18px]  leading-[20px] " : " text-[14px]  leading-[16px] "}  ">${badgedata.companyName}</h2>
//               <img class="w-[140px] aspect-square"
//               src="${qrCodeImage}"
//                 alt="Placeholder Image" />
//             </div>
//           </div>
//           <div class="absolute bottom-0 w-full h-[47px] flex justify-center items-center">
//             <div class="relative w-full h-full flex items-center justify-center">
//               <img class="absolute top-0 left-0 w-full h-full" src="https://ligurdic.sirv.com/Group%201000004143.png"
//                 alt="Placeholder Image" />

//               <p class="text-center text-[black] text-[16px] leading-[18px] font-bold uppercase z-[200]">
//               ${badgedata.badgeType}
//               </p>
//             </div>
//           </div>
//         </body>

//         </html>`;