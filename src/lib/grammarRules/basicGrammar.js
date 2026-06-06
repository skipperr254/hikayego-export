export const basicGrammarRules = {
  // Enhanced grammar rules with natural, student-friendly explanations
  'the': {
    type: 'Belirli Artikel',
    explanation: '"The" bir isim (noun) türüdür ve belirli şeyleri gösterir. "In", "on", "at" gibi edatlarla sık kullanılır. Sayılabilir ve sayılamayan tüm isimlerle kullanılabilir. Cümlede isimden hemen önce gelir ve her zaman küçük harfle yazılır (cümle başı hariç). İngilizcede en sık kullanılan kelimedir ve günlük konuşmada sürekli duyarsınız.'
  },

  'a': {
    type: 'Belirsiz Artikel',
    explanation: '"A" bir artikel türüdür ve belirsiz tekil isimleri tanımlar. Sadece sayılabilen tekil isimlerle kullanılır (çoğul veya sayılamayan isimlerle asla). Sesli harfle başlayan kelimelerden önce "an" olur. "Have a car", "be a teacher" gibi yapılarda sık görülür. Cümlede isimden hemen önce yer alır.'
  },

  'an': {
    type: 'Belirsiz Artikel',
    explanation: '"An" bir artikel türüdür ve sesli harfle başlayan belirsiz tekil isimleri tanımlar. Sadece sayılabilen tekil isimlerle kullanılır. "An apple", "an hour", "an honest person" gibi örneklerde görülür. Cümlede isimden hemen önce yer alır.'
  },

  'in': {
    type: 'Edat',
    explanation: '"In" bir preposition (edat) türüdür ve yer/zaman belirtir. "Live in", "work in", "believe in" gibi fiillerle sık kullanılır. Kapalı alanlar (in the house), şehirler (in London), aylar (in January) ile gelir. Cümlede genellikle fiilden sonra, isimden önce yer alır. Günlük konuşmada çok sık duyarsınız.'
  },

  'on': {
    type: 'Edat',
    explanation: '"On" bir preposition (edat) türüdür ve yüzey/zaman gösterir. "Put on", "turn on", "depend on" gibi phrasal verb\'lerde sık kullanılır. Yüzeyler (on the table), günler (on Monday), ulaşım (on the bus) ile gelir. Cümlede fiilden sonra veya isimden önce yer alır.'
  },

  'at': {
    type: 'Edat',
    explanation: '"At" bir preposition (edat) türüdür ve nokta/zaman belirtir. "Look at", "good at", "arrive at" gibi yapılarda sık görülür. Belirli yerler (at home), saatler (at 3 o\'clock), etkinlikler (at the party) ile kullanılır. Cümlede fiil veya sıfattan sonra gelir.'
  },

  'and': {
    type: 'Bağlaç',
    explanation: '"And" bir conjunction (bağlaç) türüdür ve benzer şeyleri birleştirir. Hiçbir edat veya fiille özel kullanımı yoktur. Sayılabilir ve sayılamayan her türlü kelimeyi bağlayabilir. Cümlede bağladığı öğeler arasında yer alır. İngilizcede en temel ve sık kullanılan bağlaçtır.'
  },

  'but': {
    type: 'Bağlaç',
    explanation: '"But" bir conjunction (bağlaç) türüdür ve zıt fikirleri bağlar. Hiçbir edat veya fiille özel kullanımı yoktur. Sayılabilir/sayılamayan ayrımı yapmaz. Cümlede karşıt cümleler arasında yer alır. Konuşmada vurgu yapmak için sık kullanılır.'
  },

  'or': {
    type: 'Bağlaç',
    explanation: '"Or" bir conjunction (bağlaç) türüdür ve seçenekleri belirtir. Hiçbir edat veya fiille özel kullanımı yoktur. Sayılabilir/sayılamayan ayrımı yapmaz. Cümlede alternatifler arasında yer alır. "Either...or" yapısında da kullanılır.'
  },

  'so': {
    type: 'Bağlaç/Zarf',
    explanation: '"So" hem conjunction (bağlaç) hem adverb (zarf) türüdür. Sonuç belirtir veya yoğunluk gösterir. "So that", "so much" gibi yapılarda sık kullanılır. Cümlede sebep-sonuç ilişkisi kurar veya sıfat/zarfları güçlendirir.'
  },

  'because': {
    type: 'Bağlaç',
    explanation: '"Because" bir conjunction (bağlaç) türüdür ve sebep belirtir. "Because of" yapısıyla da kullanılır. Sayılabilir/sayılamayan ayrımı yapmaz. Cümlede sebep cümlesini başlatır. Günlük konuşmada çok sık kullanılan sebep bağlacıdır.'
  }
};