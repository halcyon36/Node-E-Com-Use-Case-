import crypto from 'crypto'
function generateVerificationCode(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const codeArray = new Array(length);
    const characterCount = characters.length;
  
    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(0, characterCount);
      codeArray[i] = characters.charAt(randomIndex);
    }
  
    return codeArray.join('');
  }
export default generateVerificationCode