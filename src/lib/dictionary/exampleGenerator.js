export const generateSmartExample = (word, translation, partOfSpeech) => {
  const cleanWord = word.toLowerCase().trim();
  const cleanTranslation = translation.toLowerCase().trim();
  
  // Smart example templates based on part of speech
  const templates = {
    noun: [
      { en: `I saw a ${cleanWord} in the garden.`, tr: `Bahçede bir ${cleanTranslation} gördüm.` },
      { en: `The ${cleanWord} is very beautiful.`, tr: `${translation} çok güzel.` },
      { en: `She bought a new ${cleanWord}.`, tr: `Yeni bir ${cleanTranslation} aldı.` },
      { en: `This ${cleanWord} belongs to me.`, tr: `Bu ${cleanTranslation} bana ait.` },
      { en: `The old ${cleanWord} was broken.`, tr: `Eski ${cleanTranslation} bozuktu.` }
    ],
    
    verb: [
      { en: `I ${cleanWord} every day.`, tr: `Her gün ${cleanTranslation}ım.` },
      { en: `She likes to ${cleanWord}.`, tr: `${translation}mayı sever.` },
      { en: `We should ${cleanWord} together.`, tr: `Birlikte ${cleanTranslation}malıyız.` },
      { en: `They ${cleanWord} very well.`, tr: `Çok iyi ${cleanTranslation}lar.` },
      { en: `Can you ${cleanWord} this?`, tr: `Bunu ${cleanTranslation}bilir misin?` }
    ],
    
    adjective: [
      { en: `The weather is ${cleanWord} today.`, tr: `Bugün hava ${cleanTranslation}.` },
      { en: `She looks very ${cleanWord}.`, tr: `Çok ${cleanTranslation} görünüyor.` },
      { en: `This is a ${cleanWord} book.`, tr: `Bu ${cleanTranslation} bir kitap.` },
      { en: `I feel ${cleanWord} about this.`, tr: `Bu konuda ${cleanTranslation} hissediyorum.` },
      { en: `The ${cleanWord} house is for sale.`, tr: `${translation} ev satılık.` }
    ],
    
    adverb: [
      { en: `She speaks ${cleanWord}.`, tr: `${translation} konuşur.` },
      { en: `He walked ${cleanWord} to school.`, tr: `Okula ${cleanTranslation} yürüdü.` },
      { en: `They work ${cleanWord} together.`, tr: `${translation} birlikte çalışırlar.` },
      { en: `I ${cleanWord} understand this.`, tr: `Bunu ${cleanTranslation} anlıyorum.` },
      { en: `The car moved ${cleanWord}.`, tr: `Araba ${cleanTranslation} hareket etti.` }
    ],
    
    preposition: [
      { en: `The book is ${cleanWord} the table.`, tr: `Kitap masanın ${cleanTranslation}da.` },
      { en: `We met ${cleanWord} the park.`, tr: `Parkta ${cleanTranslation} buluştuk.` },
      { en: `She lives ${cleanWord} London.`, tr: `Londra'da ${cleanTranslation} yaşıyor.` },
      { en: `The cat jumped ${cleanWord} the chair.`, tr: `Kedi sandalyenin ${cleanTranslation}na atladı.` },
      { en: `I'll see you ${cleanWord} tomorrow.`, tr: `Yarın ${cleanTranslation} görüşürüz.` }
    ],
    
    pronoun: [
      { en: `${cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1)} is my friend.`, tr: `${translation} benim arkadaşım.` },
      { en: `I know ${cleanWord} very well.`, tr: `${translation} çok iyi tanırım.` },
      { en: `${cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1)} came to visit.`, tr: `${translation} ziyarete geldi.` },
      { en: `Can you help ${cleanWord}?`, tr: `${translation} yardım edebilir misin?` },
      { en: `${cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1)} lives nearby.`, tr: `${translation} yakınlarda yaşıyor.` }
    ],
    
    conjunction: [
      { en: `I like tea ${cleanWord} coffee.`, tr: `Çay ${cleanTranslation} kahve severim.` },
      { en: `She is smart ${cleanWord} kind.`, tr: `Akıllı ${cleanTranslation} nazik.` },
      { en: `We can walk ${cleanWord} take the bus.`, tr: `Yürüyebiliriz ${cleanTranslation} otobüse binebiliriz.` },
      { en: `He studied hard ${cleanWord} passed.`, tr: `Sıkı çalıştı ${cleanTranslation} geçti.` },
      { en: `It's cold ${cleanWord} sunny.`, tr: `Soğuk ${cleanTranslation} güneşli.` }
    ],
    
    article: [
      { en: `${cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1)} cat is sleeping.`, tr: `Kedi uyuyor.` },
      { en: `I need ${cleanWord} pen.`, tr: `Bir kaleme ihtiyacım var.` },
      { en: `${cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1)} book is interesting.`, tr: `Kitap ilginç.` },
      { en: `She has ${cleanWord} dog.`, tr: `Bir köpeği var.` },
      { en: `${cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1)} weather is nice.`, tr: `Hava güzel.` }
    ],
    
    'modal verb': [
      { en: `I ${cleanWord} speak English.`, tr: `İngilizce konuş${cleanTranslation}ım.` },
      { en: `You ${cleanWord} come with us.`, tr: `Bizimle gel${cleanTranslation}sin.` },
      { en: `She ${cleanWord} help you.`, tr: `Sana yardım ed${cleanTranslation}.` },
      { en: `We ${cleanWord} finish this today.`, tr: `Bunu bugün bitirebiliriz.` },
      { en: `They ${cleanWord} arrive soon.`, tr: `Yakında varabilirler.` }
    ],
    
    'auxiliary verb': [
      { en: `I ${cleanWord} going to school.`, tr: `Okula gidiyorum.` },
      { en: `She ${cleanWord} a teacher.`, tr: `O bir öğretmen.` },
      { en: `We ${cleanWord} happy today.`, tr: `Bugün mutluyuz.` },
      { en: `They ${cleanWord} working hard.`, tr: `Sıkı çalışıyorlar.` },
      { en: `He ${cleanWord} my brother.`, tr: `O benim kardeşim.` }
    ],
    
    number: [
      { en: `I have ${cleanWord} books.`, tr: `${translation} kitabım var.` },
      { en: `She is ${cleanWord} years old.`, tr: `${translation} yaşında.` },
      { en: `We need ${cleanWord} chairs.`, tr: `${translation} sandalyeye ihtiyacımız var.` },
      { en: `There are ${cleanWord} people here.`, tr: `Burada ${cleanTranslation} kişi var.` },
      { en: `The ${cleanWord} students passed.`, tr: `${translation} öğrenci geçti.` }
    ],
    
    'possessive adjective': [
      { en: `This is ${cleanWord} house.`, tr: `Bu ${cleanTranslation} ev.` },
      { en: `${cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1)} car is red.`, tr: `${translation} araba kırmızı.` },
      { en: `I like ${cleanWord} style.`, tr: `${translation} tarzını beğeniyorum.` },
      { en: `${cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1)} family is nice.`, tr: `${translation} aile güzel.` },
      { en: `Where is ${cleanWord} book?`, tr: `${translation} kitap nerede?` }
    ],
    
    'interrogative pronoun': [
      { en: `${cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1)} is your name?`, tr: `${translation} adın?` },
      { en: `${cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1)} do you want?`, tr: `${translation} istiyorsun?` },
      { en: `${cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1)} is that person?`, tr: `O kişi ${cleanTranslation}?` },
      { en: `${cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1)} are you doing?`, tr: `${translation} yapıyorsun?` },
      { en: `${cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1)} did you see?`, tr: `${translation} gördün?` }
    ],
    
    'interrogative adverb': [
      { en: `${cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1)} are you going?`, tr: `${translation} gidiyorsun?` },
      { en: `${cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1)} did this happen?`, tr: `Bu ${cleanTranslation} oldu?` },
      { en: `${cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1)} do you live?`, tr: `${translation} yaşıyorsun?` },
      { en: `${cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1)} are you feeling?`, tr: `${translation} hissediyorsun?` },
      { en: `${cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1)} will you come?`, tr: `${translation} geleceksin?` }
    ],
    
    'compound phrase': [
      { en: `${cleanWord} is very useful.`, tr: `${translation} çok faydalı.` },
      { en: `I learned about ${cleanWord}.`, tr: `${translation} hakkında öğrendim.` },
      { en: `${cleanWord} is important.`, tr: `${translation} önemli.` },
      { en: `We use ${cleanWord} often.`, tr: `${translation} sık kullanırız.` },
      { en: `${cleanWord} helps us.`, tr: `${translation} bize yardım eder.` }
    ]
  };
  
  // Get appropriate template based on part of speech
  const templateSet = templates[partOfSpeech] || templates['compound phrase'];
  
  // Select a random template
  const randomIndex = Math.floor(Math.random() * templateSet.length);
  const selectedTemplate = templateSet[randomIndex];
  
  // Handle special cases for better grammar
  let englishExample = selectedTemplate.en;
  let turkishExample = selectedTemplate.tr;
  
  // Fix grammar for specific cases
  if (partOfSpeech === 'verb') {
    // Handle verb conjugation
    if (cleanWord.endsWith('e')) {
      englishExample = englishExample.replace(`to ${cleanWord}`, `to ${cleanWord}`);
    } else if (cleanWord.endsWith('y')) {
      englishExample = englishExample.replace(`${cleanWord}`, cleanWord);
    }
  }
  
  // Ensure proper capitalization
  englishExample = englishExample.charAt(0).toUpperCase() + englishExample.slice(1);
  turkishExample = turkishExample.charAt(0).toUpperCase() + turkishExample.slice(1);
  
  return {
    en: englishExample,
    tr: turkishExample
  };
};