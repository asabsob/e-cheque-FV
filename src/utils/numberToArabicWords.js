const ones = ["", "واحد", "اثنان", "ثلاثة", "أربعة", "خمسة", "ستة", "سبعة", "ثمانية", "تسعة"];
const tens = ["", "عشرة", "عشرون", "ثلاثون", "أربعون", "خمسون", "ستون", "سبعون", "ثمانون", "تسعون"];
const teens = ["عشرة", "أحد عشر", "اثنا عشر", "ثلاثة عشر", "أربعة عشر", "خمسة عشر", "ستة عشر", "سبعة عشر", "ثمانية عشر", "تسعة عشر"];
const hundreds = ["", "مائة", "مئتان", "ثلاثمائة", "أربعمائة", "خمسمائة", "ستمائة", "سبعمائة", "ثمانمائة", "تسعمائة"];

const segmentToWords = (num) => {
  let words = [];
  const h = Math.floor(num / 100);
  const rem = num % 100;

  if (h > 0) words.push(hundreds[h]);

  if (rem > 0) {
    if (rem < 10) words.push(ones[rem]);
    else if (rem < 20) words.push(teens[rem - 10]);
    else {
      const t = Math.floor(rem / 10);
      const u = rem % 10;
      if (u > 0) words.push(`${ones[u]} و ${tens[t]}`);
      else words.push(tens[t]);
    }
  }

  return words.join(" و ");
};

const getUnitName = (n, singular, dual, plural) => {
  if (n === 1) return singular;
  if (n === 2) return dual;
  if (n >= 3 && n <= 10) return plural;
  return plural;
};

export default function numberToArabicWords(amount) {
  const jd = Math.floor(amount);
  const fils = Math.round((amount - jd) * 100);

  const millions = Math.floor(jd / 1_000_000);
  const thousands = Math.floor((jd % 1_000_000) / 1000);
  const rest = jd % 1000;

  let resultParts = [];

  if (millions > 0) {
    const words = segmentToWords(millions);
    if (words) resultParts.push(words + " " + getUnitName(millions, "مليون", "مليونان", "ملايين"));
  }

  if (thousands > 0) {
    const words = segmentToWords(thousands);
    if (words) resultParts.push(words + " " + getUnitName(thousands, "ألف", "ألفان", "آلاف"));
  }

  if (rest > 0) {
    resultParts.push(segmentToWords(rest));
  }

  let result = resultParts.join(" و ") + " دينار";

  if (fils > 0) {
    result += " و " + segmentToWords(fils) + " قرشاً";
  }

  return result;
}
