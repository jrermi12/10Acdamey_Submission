// import * as randomWordsModule from 'random-words';
// const randomWords: any = randomWordsModule;


// // export function generateRandom4DigitString() {
// //   const random4DigitNumber = Math.floor(1000 + Math.random() * 9000);
// //   return String(random4DigitNumber);
// // }

// export function generateRandomNumber(length: number) {
//   let result = '';
//   for (let i = 0; i < length; i++) {
//     result += Math.floor(Math.random() * 10); // generates a random digit (0-9)
//   }
//   return result;
// }



// export function generateHumanMemorizableId(length = 5, includeNumbers = true) {
//   const words = randomWords({ exactly: length, join: ' ' });
//   let id = words.replace(/\s/g, '').toLowerCase();

//   if (includeNumbers) {
//     const randomNumbers = Math.floor(Math.random() * 1000);
//     id += randomNumbers;
//   }
//   return id;
// }

// import crypto from 'crypto';
export const today = () => {
  const today = new Date();
  return today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
}

export function generateRandom4DigitString() {
  const random4DigitNumber = Math.floor(1000 + Math.random() * 9000);
  return String(random4DigitNumber);
}


// function generateSecretKey() {
//   // Generate a random string to be used as the secret key
//   const randomString = crypto.randomBytes(32).toString('hex');

//   // Create an HMAC using SHA256
//   const hmac = crypto.createHmac('sha256', randomString);

//   // Generate the final secret key by digesting the HMAC
//   const secretKey = hmac.digest('hex');

//   return secretKey;
// }


// export function generateRandom8DigitString() {
//     const random8DigitNumber = Math.floor(10000000 + Math.random() * 90000000);
//     return String(random8DigitNumber);
// }

export function generateRandom8DigitString() {
  const random8DigitNumber = Math.floor(10000000 + Math.random() * 90000000);
  return String(random8DigitNumber);
}



