import { detectPartOfSpeech, getPartOfSpeechLabel } from '@/lib/dictionary/partOfSpeechDetector.js';

const specificGrammarRules = {
  'the': { 
    type: 'Belirli Artikel', 
    explanation: '"The" belirli bir nesne veya kişiden bahsederken kullanılır. Hem sayılabilen hem de sayılamayan isimlerle kullanılabilir. Cümlede isimden hemen önce gelir ve belirli bir şeyi işaret eder. İngilizcede en sık kullanılan kelimedir.' 
  },
  'a': { 
    type: 'Belirsiz Artikel', 
    explanation: '"A" belirsiz tekil isimleri tanımlar. Sadece sayılabilen tekil isimlerle kullanılır. Sesli harfle başlayan kelimelerden önce "an" olur. Cümlede isimden hemen önce yer alır ve genel bir şeyden bahsederken kullanılır.' 
  },
  'an': { 
    type: 'Belirsiz Artikel', 
    explanation: '"An" sesli harfle başlayan belirsiz tekil isimleri tanımlar. "A" artikelinin sesli harf öncesi halidir. "An apple", "an hour" gibi örneklerde kullanılır. Cümlede isimden hemen önce yer alır.' 
  },
  'in': { 
    type: 'Edat', 
    explanation: '"In" yer ve zaman belirten bir edattır. Kapalı alanlar (in the house), şehirler (in London), aylar (in January) ile kullanılır. "Live in", "work in", "believe in" gibi fiillerle sık görülür.' 
  },
  'on': { 
    type: 'Edat', 
    explanation: '"On" yüzey ve zaman gösteren bir edattır. Yüzeyler (on the table), günler (on Monday), ulaşım (on the bus) ile kullanılır. "Put on", "turn on", "depend on" gibi phrasal verb\'lerde sık görülür.' 
  },
  'at': { 
    type: 'Edat', 
    explanation: '"At" nokta ve zaman belirten bir edattır. Belirli yerler (at home), saatler (at 3 o\'clock), etkinlikler (at the party) ile kullanılır. "Look at", "good at", "arrive at" gibi yapılarda sık görülür.' 
  },
  'and': { 
    type: 'Bağlaç', 
    explanation: '"And" benzer şeyleri birleştiren bir bağlaçtır. Kelimeler, kelime grupları veya cümleler arasında bağlantı kurar. İngilizcede en temel ve sık kullanılan bağlaçtır.' 
  },
  'but': { 
    type: 'Bağlaç', 
    explanation: '"But" zıt fikirleri bağlayan bir karşıtlık bağlacıdır. İki farklı veya beklenmedik durumu birbirine bağlamak için kullanılır. Konuşmada vurgu yapmak için sık kullanılır.' 
  },
  'or': { 
    type: 'Bağlaç', 
    explanation: '"Or" seçenekleri belirten bir bağlaçtır. Alternatifler arasında seçim yapılması gerektiğinde kullanılır. "Either...or" yapısında da görülür.' 
  },
  'is': { 
    type: 'Yardımcı Fiil', 
    explanation: '"Is" "be" fiilinin 3. tekil şahıs (he, she, it) için şimdiki zaman halidir. Durum, özellik veya kimlik belirtir. "Good at", "interested in" gibi sıfat+edat yapılarında kullanılır.' 
  },
  'are': { 
    type: 'Yardımcı Fiil', 
    explanation: '"Are" "be" fiilinin çoğul şahıslar (you, we, they) için şimdiki zaman halidir. Durum, özellik veya kimlik belirtir. Soru ve olumsuz cümlelerde yardımcı fiil olarak kullanılır.' 
  },
  'was': { 
    type: 'Yardımcı Fiil', 
    explanation: '"Was" "be" fiilinin tekil şahıslar (I, he, she, it) için geçmiş zaman halidir. Geçmişteki durum veya özellik belirtir. "Born in", "made of" gibi yapılarda sık görülür.' 
  },
  'were': { 
    type: 'Yardımcı Fiil', 
    explanation: '"Were" "be" fiilinin çoğul şahıslar (you, we, they) için geçmiş zaman halidir. Geçmişteki durum veya özellik belirtir. Varsayımsal durumlar için de kullanılır.' 
  },
  'have': { 
    type: 'Ana/Yardımcı Fiil', 
    explanation: '"Have" hem sahiplik belirten ana fiil hem de perfect tense oluşturan yardımcı fiildir. "Have a look", "have trouble with" gibi yapılarda sık kullanılır.' 
  },
  'has': { 
    type: 'Ana/Yardımcı Fiil', 
    explanation: '"Has" "have" fiilinin 3. tekil şahıs (he, she, it) halidir. Sahiplik veya perfect tense için kullanılır. "Has been", "has a problem" gibi yapılarda görülür.' 
  },
  'had': { 
    type: 'Ana/Yardımcı Fiil', 
    explanation: '"Had" "have" fiilinin geçmiş zaman halidir. Geçmişteki sahiplik veya past perfect tense için kullanılır. "Had been", "had a good time" gibi yapılarda görülür.' 
  },
  'can': { 
    type: 'Modal Fiil', 
    explanation: '"Can" yetenek, olasılık veya izin belirten modal fiildir. Sonrasında her zaman yalın fiil (infinitive without to) gelir. "I can swim" gibi yetenek cümlelerinde kullanılır.' 
  },
  'will': { 
    type: 'Modal Fiil', 
    explanation: '"Will" gelecek zaman, niyet veya anlık karar belirten modal fiildir. Sonrasında yalın fiil gelir. "I will call you tomorrow" gibi gelecek zaman cümlelerinde kullanılır.' 
  },
  'would': { 
    type: 'Modal Fiil', 
    explanation: '"Would" kibarlık, varsayım veya geçmiş alışkanlık belirten modal fiildir. "Would like", "would rather" gibi yapılarda sık kullanılır. Kibar isteklerde tercih edilir.' 
  },
  'could': { 
    type: 'Modal Fiil', 
    explanation: '"Could" geçmiş yetenek, kibarlık veya olasılık belirten modal fiildir. "Can" fiilinin geçmiş hali veya daha kibar versiyonudur. Sonrasında yalın fiil gelir.' 
  },
  'should': { 
    type: 'Modal Fiil', 
    explanation: '"Should" tavsiye, gereklilik veya beklenti belirten modal fiildir. "You should study" gibi tavsiye cümlelerinde kullanılır. Sonrasında yalın fiil gelir.' 
  },
  'must': { 
    type: 'Modal Fiil', 
    explanation: '"Must" zorunluluk, kesinlik veya güçlü tavsiye belirten modal fiildir. "You must be careful" gibi zorunluluk cümlelerinde kullanılır. Sonrasında yalın fiil gelir.' 
  },
  'may': { 
    type: 'Modal Fiil', 
    explanation: '"May" olasılık, izin veya kibarlık belirten modal fiildir. "It may rain" gibi olasılık cümlelerinde kullanılır. Formal izin isteme durumlarında tercih edilir.' 
  },
  'might': { 
    type: 'Modal Fiil', 
    explanation: '"Might" düşük olasılık veya kibarlık belirten modal fiildir. "May" fiilinin daha az kesin versiyonudur. "I might go" gibi belirsizlik ifadelerinde kullanılır.' 
  },
  'do': { 
    type: 'Ana/Yardımcı Fiil', 
    explanation: '"Do" hem "yapmak" anlamında ana fiil hem de soru/olumsuz cümlelerde yardımcı fiildir. "Do homework", "do you know" gibi yapılarda kullanılır.' 
  },
  'does': { 
    type: 'Ana/Yardımcı Fiil', 
    explanation: '"Does" "do" fiilinin 3. tekil şahıs halidir. Soru ve olumsuz cümlelerde yardımcı fiil olarak kullanılır. "Does she know?" gibi sorularda görülür.' 
  },
  'did': { 
    type: 'Ana/Yardımcı Fiil', 
    explanation: '"Did" "do" fiilinin geçmiş zaman halidir. Geçmiş zaman soru ve olumsuz cümlelerde yardımcı fiil olarak kullanılır. "Did you see?" gibi sorularda görülür.' 
  },
  'this': { 
    type: 'İşaret Sıfatı', 
    explanation: '"This" yakın şeyleri gösteren işaret sıfatıdır. Sadece sayılabilen tekil isimlerle kullanılır. "This book", "this house" gibi örneklerde görülür.' 
  },
  'that': { 
    type: 'İşaret Sıfatı/Zamir', 
    explanation: '"That" uzak şeyleri gösteren işaret sıfatı/zamiridir. Hem sıfat hem zamir olarak kullanılabilir. "That car", "I know that" gibi örneklerde görülür.' 
  },
  'these': { 
    type: 'İşaret Sıfatı', 
    explanation: '"These" yakın çoğul şeyleri gösteren işaret sıfatıdır. Sadece sayılabilen çoğul isimlerle kullanılır. "These books", "these people" gibi örneklerde görülür.' 
  },
  'those': { 
    type: 'İşaret Sıfatı', 
    explanation: '"Those" uzak çoğul şeyleri gösteren işaret sıfatıdır. Sadece sayılabilen çoğul isimlerle kullanılır. "Those cars", "those days" gibi örneklerde görülür.' 
  },
  'my': { 
    type: 'İyelik Sıfatı', 
    explanation: '"My" sahiplik gösteren iyelik sıfatıdır. Sayılabilir ve sayılamayan tüm isimlerle kullanılır. "My house", "my water" gibi örneklerde görülür.' 
  },
  'your': { 
    type: 'İyelik Sıfatı', 
    explanation: '"Your" karşıdakinin sahipliğini gösteren iyelik sıfatıdır. Sayılabilir ve sayılamayan tüm isimlerle kullanılır. "Your book", "your time" gibi örneklerde görülür.' 
  },
  'his': { 
    type: 'İyelik Sıfatı', 
    explanation: '"His" erkeğin sahipliğini gösteren iyelik sıfatıdır. Sayılabilir ve sayılamayan tüm isimlerle kullanılır. "His car", "his money" gibi örneklerde görülür.' 
  },
  'her': { 
    type: 'İyelik Sıfatı', 
    explanation: '"Her" kadının sahipliğini gösteren iyelik sıfatıdır. Sayılabilir ve sayılamayan tüm isimlerle kullanılır. "Her dress", "her time" gibi örneklerde görülür.' 
  },
  'our': { 
    type: 'İyelik Sıfatı', 
    explanation: '"Our" bizim sahipliğimizi gösteren iyelik sıfatıdır. Sayılabilir ve sayılamayan tüm isimlerle kullanılır. "Our house", "our water" gibi örneklerde görülür.' 
  },
  'their': { 
    type: 'İyelik Sıfatı', 
    explanation: '"Their" onların sahipliğini gösteren iyelik sıfatıdır. Sayılabilir ve sayılamayan tüm isimlerle kullanılır. "Their car", "their money" gibi örneklerde görülür.' 
  },
  'what': { 
    type: 'Soru Zamiri', 
    explanation: '"What" "ne" anlamında soru zamiridir. Nesne veya durum hakkında soru sorarken kullanılır. "What is your name?", "What do you want?" gibi sorularda görülür.' 
  },
  'who': { 
    type: 'Soru Zamiri', 
    explanation: '"Who" "kim" anlamında soru zamiridir. Kişi hakkında soru sorarken kullanılır. "Who is that?", "Who are you?" gibi sorularda görülür.' 
  },
  'where': { 
    type: 'Soru Zarfı', 
    explanation: '"Where" "nerede" anlamında soru zarfıdır. Yer hakkında soru sorarken kullanılır. "Where are you?", "Where do you live?" gibi sorularda görülür.' 
  },
  'when': { 
    type: 'Soru Zarfı', 
    explanation: '"When" "ne zaman" anlamında soru zarfıdır. Zaman hakkında soru sorarken kullanılır. "When did you arrive?", "When will you come?" gibi sorularda görülür.' 
  },
  'why': { 
    type: 'Soru Zarfı', 
    explanation: '"Why" "neden" anlamında soru zarfıdır. Sebep hakkında soru sorarken kullanılır. "Why are you sad?", "Why did you do that?" gibi sorularda görülür.' 
  },
  'how': { 
    type: 'Soru Zarfı', 
    explanation: '"How" "nasıl" anlamında soru zarfıdır. Yöntem veya durum hakkında soru sorarken kullanılır. "How are you?", "How do you do this?" gibi sorularda görülür.' 
  },
  'not': { 
    type: 'Olumsuzluk Zarfı', 
    explanation: '"Not" olumsuzluk belirten zarftır. Cümleyi olumsuz yapmak için kullanılır. Yardımcı fiillerden sonra gelir. "I am not", "do not", "will not" gibi yapılarda görülür.' 
  },
  'very': { 
    type: 'Yoğunluk Zarfı', 
    explanation: '"Very" yoğunluk belirten zarftır. Sıfat ve zarfları güçlendirmek için kullanılır. "Very good", "very quickly" gibi örneklerde görülür.' 
  },
  'good': { 
    type: 'Sıfat', 
    explanation: '"Good" olumlu özellik belirten sıfattır. "Good at", "good with", "good for" gibi edatlarla sık kullanılır. "A good book", "be good at" gibi örneklerde görülür.' 
  },
  'bad': { 
    type: 'Sıfat', 
    explanation: '"Bad" olumsuz özellik belirten sıfattır. "Bad at", "bad for" gibi edatlarla kullanılır. "A bad day", "bad at math" gibi örneklerde görülür.' 
  },
  'big': { 
    type: 'Sıfat', 
    explanation: '"Big" boyut belirten sıfattır. Sadece sayılabilen isimlerle kullanılır. "A big house", "big problem" gibi örneklerde görülür.' 
  },
  'small': { 
    type: 'Sıfat', 
    explanation: '"Small" küçük boyut belirten sıfattır. Sadece sayılabilen isimlerle kullanılır. "A small car", "small room" gibi örneklerde görülür.' 
  },
  'new': { 
    type: 'Sıfat', 
    explanation: '"New" yenilik belirten sıfattır. "New to" edatıyla sık kullanılır. "A new car", "new to this job" gibi örneklerde görülür.' 
  },
  'old': { 
    type: 'Sıfat', 
    explanation: '"Old" yaş veya eskilik belirten sıfattır. Hem kişiler hem nesneler için kullanılır. "An old man", "old building" gibi örneklerde görülür.' 
  }
};

const getGenericGrammarTip = (partOfSpeech) => {
  const genericTips = {
    noun: { 
      type: 'İsim', 
      explanation: 'İsimler kişi, yer, nesne veya kavramları adlandırır. Cümlede özne veya nesne olarak kullanılır. Sayılabilen isimler çoğul yapılabilir, sayılamayan isimler tek halde kullanılır.' 
    },
    verb: { 
      type: 'Fiil', 
      explanation: 'Fiiller eylem, durum veya oluşu belirtir. Cümlenin yüklemini oluşturur. Zamanlara göre çekimlenir ve özneye göre değişir.' 
    },
    adjective: { 
      type: 'Sıfat', 
      explanation: 'Sıfatlar isimleri niteler ve onların özelliklerini belirtir. Genellikle isimden önce gelir veya "be" fiilinden sonra kullanılır.' 
    },
    adverb: { 
      type: 'Zarf', 
      explanation: 'Zarflar fiilleri, sıfatları veya diğer zarfları niteler. Nasıl, ne zaman, nerede, ne kadar sorularını yanıtlar.' 
    },
    preposition: { 
      type: 'Edat', 
      explanation: 'Edatlar kelimeler arasında yer, zaman, yön veya ilişki kurar. Genellikle isimlerden önce gelir ve phrasal verb\'lerde sık kullanılır.' 
    },
    conjunction: { 
      type: 'Bağlaç', 
      explanation: 'Bağlaçlar kelimeleri, kelime gruplarını veya cümleleri birbirine bağlar. Koordine edici (and, but, or) ve subordine edici (because, if, when) olmak üzere ikiye ayrılır.' 
    },
    pronoun: { 
      type: 'Zamir', 
      explanation: 'Zamirler isimlerin yerini tutar ve tekrarı önler. Kişi zamirleri (I, you, he), işaret zamirleri (this, that) ve soru zamirleri (who, what) gibi türleri vardır.' 
    },
    article: { 
      type: 'Artikel', 
      explanation: 'Artikeller isimlerin belirli mi yoksa belirsiz mi olduğunu gösterir. "The" belirli artikel, "a/an" belirsiz artikeldir.' 
    },
    'modal verb': { 
      type: 'Modal Fiil', 
      explanation: 'Modal fiiller yetenek, olasılık, izin, zorunluluk belirtir. Sonrasında her zaman yalın fiil gelir ve özneye göre değişmez.' 
    },
    'auxiliary verb': { 
      type: 'Yardımcı Fiil', 
      explanation: 'Yardımcı fiiller soru, olumsuz cümle ve zaman yapıları oluşturmak için kullanılır. Ana fiille birlikte çalışır.' 
    },
    'phrasal verb': { 
      type: 'Phrasal Verb', 
      explanation: 'Phrasal verb\'ler fiil + edat/zarf birleşimidir. Genellikle bütün olarak öğrenilmeli, çünkü anlamları parçalarının toplamından farklıdır.' 
    },
    'possessive adjective': { 
      type: 'İyelik Sıfatı', 
      explanation: 'İyelik sıfatları sahiplik gösterir ve isimden önce gelir. Özneye göre değişir (my, your, his, her, our, their).' 
    },
    'interrogative pronoun': { 
      type: 'Soru Zamiri', 
      explanation: 'Soru zamirleri soru cümlelerinde kullanılır ve bilinmeyen kişi veya nesneyi temsil eder (who, what, which).' 
    },
    'interrogative adverb': { 
      type: 'Soru Zarfı', 
      explanation: 'Soru zarfları zaman, yer, sebep veya yöntem hakkında soru sorar (when, where, why, how).' 
    },
    number: { 
      type: 'Sayı', 
      explanation: 'Sayılar miktar veya sıra belirtir. Kardinal sayılar (one, two, three) ve ordinal sayılar (first, second, third) olmak üzere ikiye ayrılır.' 
    },
    'compound phrase': { 
      type: 'Birleşik İfade', 
      explanation: 'Birleşik ifadeler birden fazla kelimenin bir araya gelerek tek bir anlam oluşturduğu yapılardır. Genellikle bütün olarak öğrenilmelidir.' 
    },
    determiner: { 
      type: 'Belirteç', 
      explanation: 'Belirteçler isimlerin miktarını, sahipliğini veya belirlilik derecesini gösterir (some, any, many, much, few, little).' 
    },
    gerund: { 
      type: 'Zarf-fiil', 
      explanation: 'Gerund\'lar fiillerin -ing halidir ve isim gibi kullanılır. Özne, nesne veya edat sonrası olarak cümlede yer alabilir.' 
    },
    'past participle': { 
      type: 'Geçmiş Ortaç', 
      explanation: 'Geçmiş ortaçlar perfect tense\'lerde ve passive voice\'ta kullanılır. Düzenli fiillerde -ed eki alır.' 
    },
    'present participle': { 
      type: 'Şimdiki Ortaç', 
      explanation: 'Şimdiki ortaçlar continuous tense\'lerde kullanılır ve -ing eki alır. Aynı zamanda sıfat olarak da kullanılabilir.' 
    },
    'proper noun': { 
      type: 'Özel İsim', 
      explanation: 'Özel isimler belirli kişi, yer veya kurumların adlarıdır. Her zaman büyük harfle başlar ve genellikle artikel almaz.' 
    },
    interjection: { 
      type: 'Ünlem', 
      explanation: 'Ünlemler ani duygu veya tepkileri ifade eder. Genellikle cümleden bağımsızdır ve ünlem işareti ile kullanılır.' 
    }
  };
  
  return genericTips[partOfSpeech] || { 
    type: 'Kelime', 
    explanation: 'Bu kelime için özel dil bilgisi açıklaması mevcut değil. Kelimenin anlamını ve cümledeki kullanımını inceleyerek öğrenebilirsiniz.' 
  };
};

export const getGrammarTip = (word, translationInfo) => {
  if (!word) return null;
  
  const lowerWord = word.toLowerCase();
  
  // Check for specific grammar rules first
  if (specificGrammarRules[lowerWord]) {
    return specificGrammarRules[lowerWord];
  }
  
  // If we have translation info with part of speech, use it
  if (translationInfo?.partOfSpeech && translationInfo.partOfSpeech !== 'unknown') {
    return getGenericGrammarTip(translationInfo.partOfSpeech);
  }
  
  // If no part of speech info, detect it
  const detectedPartOfSpeech = detectPartOfSpeech(lowerWord, translationInfo?.translation);
  return getGenericGrammarTip(detectedPartOfSpeech);
};