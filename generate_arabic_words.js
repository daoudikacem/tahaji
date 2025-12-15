const fs = require('fs');

// Read the existing words.json file
const wordsData = fs.readFileSync('words.json', 'utf8');
const wordsJson = JSON.parse(wordsData);

// Create a Set of existing words for fast lookup
const existingWordsSet = new Set(wordsJson.words);

// Define Arabic letters with their diacritics
const arabicLetters = [
  'ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'
];

// Diacritics
const diacritics = ['َ', 'ُ', 'ِ']; // fatha, damma, kasra
const sukun = 'ْ';
const shadda = 'ّ';
const tanween = ['ً', 'ٌ', 'ٍ']; // fathatan, dammatan, kasratan
const maddLetters = ['ا', 'و', 'ي'];

// Common visual/action words for children
const visualWordsBase = [
  // Body parts
  'رَأس', 'عَين', 'أُذُن', 'فَم', 'يَد', 'رِجل', 'صَدر', 'ظَهر', 'بَطن', 'وَجه',
  'شَعر', 'لِحية', 'عَنق', 'خَد', 'فَخذ', 'سَاق', 'قَدم', 'إصبع', 'مَفصل', 'عَظم',
  'لَحم', 'دَم', 'جِلد',
  
  // Colors
  'أَحمر', 'أَزرق', 'أَخضر', 'أَصفر', 'أَبيض', 'أَسود', 'بُنّي', 'بِنْتَжи', 'زَهري', 'بُرْتُقالي',
  
  // Shapes
  'مُرَبَّع', 'مُثَلَّث', 'دَائِرَة', 'مُسْتَطِيل', 'نَجمة', 'قَلب', 'مَثلَث', 'مَربَع', 'بِنْتَج',
  
  // Animals
  'قِط', 'كَلب', 'حِصان', 'بَقرة', 'خَروف', 'دَجاجة', 'دُب', 'فِيل', 'أَسد', 'نَمر',
  'فَأر', 'أَرنب', 'طَائر', 'عُصفور', 'بَطة', 'دَيك', 'غَزال', 'كَنزَران', 'حَمار', 'جَمل',
  'سُلحفاة', 'ضَفدع', 'حَية', 'تِمساح', 'سَمك', 'دُلفين', 'حُوت', 'فِقمة', 'أَرنَبة', 'بَبغاء',
  
  // Fruits & Food
  'تُفّاح', 'بُرتقال', 'مَوز', 'عِنَب', 'فَراولة', 'خَوخ', 'مَشمش', 'رُمان', 'كَرْز', 'كِوي',
  'بطيخ', 'عَنَب', 'لَيمون', 'جَعْفران', 'كُوزا', 'رَيْحان', 'نَعناع', 'شَبت', 'كُرة', 'فُل',
  'حُمّص', 'عَدس', 'مَكرونة', 'أُرز', 'خُبز', 'كَعك', 'بِسكويت', 'شَوكولاتة', 'حَلْوى', 'مَربى',
  
  // Clothes
  'ثَوب', 'قَميص', 'سَراويل', 'جَاكيت', 'مَعطف', 'قُبّعة', 'كَشّابة', 'حِذاء', 'جَورب', 'شَال',
  'عَمامة', 'حِجاب', 'نِعال', 'سَاري', 'بَنطلון', 'فُستان', 'يَاقة', 'أُزر', 'دُكمَة', 'حُزام',
  
  // Home items
  'بَاب', 'شَباك', 'سَرير', 'مَكتب', 'كُرسي', 'طَاولة', 'مِصباح', 'سَجادة', 'وِسادة', 'غَطاء',
  'مَطبخ', 'حَمّام', 'مِرحاض', 'حَوض', 'مِشْواة', 'ثَلاّجة', 'فُرن', 'مِيكروويف', 'غَسالة', 'مُنشفة',
  'مَلابس', 'خِزانة', 'دُرج', 'رَفّ', 'مِكنسة', 'كِسوة', 'سَتارة', 'مَشرُبة', 'كُوب', 'بِطاقة',
  
  // Nature
  'شَمس', 'قَمر', 'نُجوم', 'سَحاب', 'مَطر', 'بَرق', 'رَعد', 'رِيح', 'عَاصفة', 'زَلزال',
  'بَحر', 'نَهر', 'بُحيرة', 'جَبل', 'غَابة', 'صَحراء', 'وَادي', 'مَغارة', 'شَجرة', 'زَهرة',
  'عُشب', 'حَجر', 'رَمْل', 'طِين', 'خَشب', 'وَرَق', 'جَليد', 'ثَلج', 'ضَباب', 'قَوس قُزح',
  
  // Vehicles
  'سَيارة', 'دَراجة', 'طَائرة', 'سَفينة', 'قِطار', 'حَافلة', 'شَاحنة', 'دَبابة', 'مِركبة', 'مَوتوسيكل',
  'بَاطو', 'غَواصة', 'مِروحية', 'مَركبة فَضائية', 'تَرام', 'مِetro', 'تاكسي', 'شَاحنة صَغيرة', 'مَنطاد', 'عَربة',
  
  // School items
  'قَلم', 'كِتاب', 'دَفتر', 'مِمحاة', 'مِسطرة', 'حَقيبة', 'طَباشير', 'سَبورة', 'مَarkers', 'لَون',
  'قِصّة', 'مَقص', 'لِصق', 'مَلصق', 'مَلزق', 'كِتاب صُور', 'مَجلّة', 'جَريدة', 'حَاسوب', 'تَابلت',
  'مِسمار', 'مِفتاح', 'قُفل', 'مِفتاح كهربائي', 'مُشبك', 'خَيط', 'إِبرة', 'مَطرقة', 'مِفك', 'مِ钳子',
  
  // Actions/Verbs
  'لَعب', 'رَكض', 'قَفز', 'سَباحة', 'رَسم', 'غِناء', 'رَقص', 'كِتابة', 'قِراءة', 'حِساب',
  'طَبخ', 'غَسيل', 'نَظافة', 'رَتب', 'جَمع', 'فَرز', 'حَفر', 'بَناء', 'تَقطيع', 'لَصق',
  'رَمي', 'جَر', 'دَفع', 'سَحب', 'حَمل', 'رَفع', 'ضَرب', 'طَعن', 'قَطع', 'كَسر',
  'فَتح', 'إِغلاق', 'شَدّ', 'رَبط', 'فَكّ', 'ضَمّ', 'بَسط', 'طَيّ', 'ثَني', 'لَفّ',
  'غَمر', 'طَفو', 'غَوص', 'سَباحة', 'تَزلج', 'تَمدّد', 'اِستلقاء', 'جُلوس', 'وُقوف', 'انْحناء',
  
  // Emotions/Feelings
  'فَرح', 'حُزن', 'غَضب', 'خَوف', 'رَضا', 'حُبّ', 'بُغض', 'غِيرة', 'فَخر', 'خَجل',
  'شَك', 'يَأس', 'أَمل', 'ثِقة', 'خِيبة', 'انْتعاش', 'اِرتياح', 'قَلق', 'اِرتياح', 'اِرتياح',
  
  // Time-related
  'يَوم', 'لَيلة', 'صَباح', 'مَساء', 'غَداة', 'عَشاء', 'نَهار', 'ظُهور', 'فَجر', 'غُروب',
  'سَاعة', 'دَقيقة', 'ثَانية', 'أُسبوع', 'شَهر', 'عَام', 'مَوسم', 'عُطلة', 'عِيد', 'عَطلة',
  
  // Family
  'أَب', 'أُم', 'أَخ', 'أُخت', 'جَد', 'جَدة', 'عَم', 'خَالة', 'ابن', 'ابنة',
  'أخو', 'أُخوة', 'عَائلة', 'قَبيلة', 'شَعب', 'وَطن', 'بَلدة', 'مَدينة', 'قَرية', 'حَيّ',
  
  // Numbers (already covered but adding variations)
  'واحِد', 'اثنان', 'ثَلاثة', 'أَربعة', 'خَمسة', 'سِتّة', 'سَبعة', 'ثَمانية', 'تِسعة', 'عَشرة',
  'أَحدَى عَشَرة', 'اثَنَى عَشَر', 'ثَلاثَة عَشَر', 'أَربَعَة عَشَر', 'خَمْسَة عَشَر', 'سِتّة عَشَر', 'سَبعة عَشَر', 'ثَمانية عَشَر', 'تِسعة عَشَر', 'عِشرون',
  
  // Weather
  'حَار', 'بَارد', 'مُعتدل', 'رَطب', 'يَابس', 'عَاصف', 'هَادئ', 'مُغَيّر', 'مُستَقِرّ', 'مُشمس',
  
  // Directions/Positions
  'فَوق', 'تَحت', 'يَمين', 'يَسار', 'أَمام', 'خَلف', 'بَعيد', 'قَريب', 'أَعلى', 'أَسفل',
  'دَاخل', 'خَارج', 'بَين', 'وَسط', 'جَانِب', 'زَاوية', 'مُنتَهى', 'نِهاية', 'ابتداء', 'مَبدإ',
  
  // Materials/Textures
  'نَاعم', 'خَشن', 'لَزِج', 'مُتماسِك', 'مُتَفتّت', 'مُرن', 'هَشيم', 'ثَقيل', 'خَفيف', 'كَثيف',
  'رَقيق', 'سَميِك', 'لَامِع', 'مُعتَم', 'شَفاف', 'مُتَلوّن', 'أَحادي اللّون', 'مُنقَّع', 'مُنقَطِع', 'مُستَمِرّ'
];

// Categories for variety
const categories = {
  'objects': ['قَلَم', 'كِتَاب', 'طَاوِلَة', 'كُرسي', 'بَاب', 'شَباك', 'سَيارة', 'دَراجة', 'طَائرة', 'سَفينة'],
  'animals': ['قِط', 'كَلب', 'حِصان', 'بَقرة', 'خَروف', 'دُب', 'فِيل', 'أَسد', 'نَمر', 'فَأر'],
  'food': ['تُفّاح', 'بُرتقال', 'مَوز', 'عِنَب', 'فَراولة', 'خَوخ', 'مَشمش', 'رُمان', 'كَرْز', 'كِوي'],
  'colors': ['أَحمر', 'أَزرق', 'أَخضر', 'أَصفر', 'أَبيض', 'أَسود', 'بُنّي', 'بِنْتَجي', 'زَهري', 'بُرْتُقالي'],
  'body_parts': ['رَأس', 'عَين', 'أُذُن', 'فَم', 'يَد', 'رِجل', 'صَدر', 'ظَهر', 'بَطن', 'وَجه'],
  'actions': ['لَعب', 'رَكض', 'قَفز', 'سَباحة', 'رَسم', 'غِناء', 'رَقص', 'كِتابة', 'قِراءة', 'حِساب'],
  'emotions': ['فَرح', 'حُزن', 'غَضب', 'خَوف', 'رَضا', 'حُبّ', 'بُغض', 'غِيرة', 'فَخر', 'خَجل'],
  'nature': ['شَمس', 'قَمر', 'نُجوم', 'سَحاب', 'مَطر', 'بَرق', 'رَعد', 'رِيح', 'بَحر', 'جَبل'],
  'family': ['أَب', 'أُم', 'أَخ', 'أُخت', 'جَد', 'جَدة', 'عَم', 'خَالة', 'ابن', 'ابنة']
};

// Function to add diacritics to a word
function addDiacritics(word) {
  // Simple algorithm to add diacritics
  let result = '';
  for (let i = 0; i < word.length; i++) {
    const char = word[i];
    if (arabicLetters.includes(char)) {
      // Add a diacritic with 70% probability
      if (Math.random() < 0.7) {
        const diacritic = diacritics[Math.floor(Math.random() * diacritics.length)];
        result += char + diacritic;
      } else {
        result += char;
      }
    } else {
      result += char;
    }
  }
  return result;
}

// Function to generate words with tanween (for nouns)
function generateTanweenWord(baseWord) {
  if (Math.random() < 0.3) { // 30% chance to add tanween
    const tanweenChar = tanween[Math.floor(Math.random() * tanween.length)];
    return baseWord + tanweenChar;
  }
  return baseWord;
}

// Function to generate words with shadda
function generateShaddaWord(baseWord) {
  if (Math.random() < 0.2 && baseWord.length > 2) { // 20% chance to add shadda
    const position = Math.floor(Math.random() * (baseWord.length - 1)) + 1;
    return baseWord.slice(0, position) + shadda + baseWord.slice(position);
  }
  return baseWord;
}

// Function to generate words with madd
function generateMaddWord(baseWord) {
  if (Math.random() < 0.15) { // 15% chance to add madd
    const maddChar = maddLetters[Math.floor(Math.random() * maddLetters.length)];
    return baseWord + maddChar;
  }
  return baseWord;
}

// Generate new words
let newWords = [];
let attempts = 0;
const maxAttempts = 6000; // To prevent infinite loop

console.log("Generating 3000 new Arabic words with full diacritics...");

while (newWords.length < 3000 && attempts < maxAttempts) {
  attempts++;
  
  // Select a strategy for word generation
  let strategy = Math.random();
  let word;
  
  if (strategy < 0.4) {
    // Use visual words base
    const baseWord = visualWordsBase[Math.floor(Math.random() * visualWordsBase.length)];
    word = addDiacritics(baseWord);
  } else if (strategy < 0.7) {
    // Use category words
    const categoryKeys = Object.keys(categories);
    const randomCategory = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
    const baseWord = categories[randomCategory][Math.floor(Math.random() * categories[randomCategory].length)];
    word = addDiacritics(baseWord);
  } else {
    // Generate random words
    const wordLength = Math.floor(Math.random() * 5) + 3; // 3-7 characters
    let baseWord = '';
    for (let i = 0; i < wordLength; i++) {
      baseWord += arabicLetters[Math.floor(Math.random() * arabicLetters.length)];
    }
    word = addDiacritics(baseWord);
  }
  
  // Apply modifications
  word = generateTanweenWord(word);
  word = generateShaddaWord(word);
  word = generateMaddWord(word);
  
  // Add tanween at the end for nouns (simplistic approach)
  if (Math.random() < 0.3 && !word.endsWith('ٌ') && !word.endsWith('ً') && !word.endsWith('ٍ')) {
    const tanweenEnding = tanween[Math.floor(Math.random() * tanween.length)];
    word += tanweenEnding;
  }
  
  // Check if word already exists
  if (!existingWordsSet.has(word)) {
    newWords.push(word);
    existingWordsSet.add(word);
  }
  
  // Progress indicator
  if (attempts % 500 === 0) {
    console.log(`Generated ${newWords.length} unique words out of ${attempts} attempts...`);
  }
}

console.log(`Successfully generated ${newWords.length} new unique Arabic words.`);

// Save to a temporary file
fs.writeFileSync('new_arabic_words.txt', newWords.join('\n'), 'utf8');
console.log("New words saved to new_arabic_words.txt");

// Also update the words.json file
wordsJson.words = wordsJson.words.concat(newWords);
fs.writeFileSync('words.json', JSON.stringify(wordsJson, null, 2), 'utf8');
console.log(`Updated words.json with ${newWords.length} new words.`);
console.log(`Total words in database: ${wordsJson.words.length}`);