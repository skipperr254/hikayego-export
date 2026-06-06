export const commonWords = {
  // Most common English words with proper Turkish translations
  'the': { 
    translation: '', 
    type: 'Belirli Artikel',
    partOfSpeech: 'article',
    example: 'The sun is shining.', 
    example_tr: 'Güneş parlıyor.' 
  },
  'a': { 
    translation: 'bir', 
    type: 'Belirsiz Artikel',
    partOfSpeech: 'article',
    example: 'I saw a dog.', 
    example_tr: 'Bir köpek gördüm.' 
  },
  'an': { 
    translation: 'bir', 
    type: 'Belirsiz Artikel',
    partOfSpeech: 'article',
    example: 'I saw an elephant.', 
    example_tr: 'Bir fil gördüm.' 
  },
  'and': { 
    translation: 've', 
    type: 'Bağlaç',
    partOfSpeech: 'conjunction',
    example: 'Bread and butter.', 
    example_tr: 'Ekmek ve tereyağı.' 
  },
  'or': { 
    translation: 'veya', 
    type: 'Bağlaç',
    partOfSpeech: 'conjunction',
    example: 'Tea or coffee?', 
    example_tr: 'Çay mı kahve mi?' 
  },
  'but': { 
    translation: 'ama', 
    type: 'Bağlaç',
    partOfSpeech: 'conjunction',
    example: 'I want to go, but I am tired.', 
    example_tr: 'Gitmek istiyorum ama yorgunum.' 
  },
  'so': { 
    translation: 'bu yüzden', 
    type: 'Bağlaç',
    partOfSpeech: 'conjunction',
    example: 'I was tired, so I went to bed.', 
    example_tr: 'Yorgundum, bu yüzden yattım.' 
  },
  'because': { 
    translation: 'çünkü', 
    type: 'Bağlaç',
    partOfSpeech: 'conjunction',
    example: 'I stayed home because it was raining.', 
    example_tr: 'Yağmur yağdığı için evde kaldım.' 
  },
  'if': { 
    translation: 'eğer', 
    type: 'Şart Bağlacı',
    partOfSpeech: 'conjunction',
    example: 'If it rains, I will stay home.', 
    example_tr: 'Eğer yağmur yağarsa, evde kalacağım.' 
  },
  'when': { 
    translation: 'ne zaman', 
    type: 'Soru Zarfı/Bağlaç',
    partOfSpeech: 'interrogative adverb/conjunction',
    example: 'When did you arrive?', 
    example_tr: 'Ne zaman geldin?' 
  },
  'where': { 
    translation: 'nerede', 
    type: 'Soru Zarfı',
    partOfSpeech: 'interrogative adverb',
    example: 'Where are you from?', 
    example_tr: 'Nerelisin?' 
  },
  'what': { 
    translation: 'ne', 
    type: 'Soru Zamiri',
    partOfSpeech: 'interrogative pronoun',
    example: 'What is your name?', 
    example_tr: 'Adın ne?' 
  },
  'who': { 
    translation: 'kim', 
    type: 'Soru Zamiri',
    partOfSpeech: 'interrogative pronoun',
    example: 'Who is that person?', 
    example_tr: 'O kişi kim?' 
  },
  'how': { 
    translation: 'nasıl', 
    type: 'Soru Zarfı',
    partOfSpeech: 'interrogative adverb',
    example: 'How are you?', 
    example_tr: 'Nasılsın?' 
  },
  'why': { 
    translation: 'neden', 
    type: 'Soru Zarfı',
    partOfSpeech: 'interrogative adverb',
    example: 'Why are you sad?', 
    example_tr: 'Neden üzgünsün?' 
  },
  'in': { 
    translation: 'içinde', 
    type: 'Edat',
    partOfSpeech: 'preposition',
    example: 'The cat is in the box.', 
    example_tr: 'Kedi kutunun içinde.' 
  },
  'on': { 
    translation: 'üzerinde', 
    type: 'Edat',
    partOfSpeech: 'preposition',
    example: 'The book is on the table.', 
    example_tr: 'Kitap masanın üzerinde.' 
  },
  'at': { 
    translation: 'de/da', 
    type: 'Edat',
    partOfSpeech: 'preposition',
    example: 'I am at home.', 
    example_tr: 'Evdeyim.' 
  },
  'to': { 
    translation: 'e/a', 
    type: 'Edat',
    partOfSpeech: 'preposition',
    example: 'I am going to the store.', 
    example_tr: 'Mağazaya gidiyorum.' 
  },
  'for': { 
    translation: 'için', 
    type: 'Edat',
    partOfSpeech: 'preposition',
    example: 'This gift is for you.', 
    example_tr: 'Bu hediye senin için.' 
  },
  'with': { 
    translation: 'ile', 
    type: 'Edat',
    partOfSpeech: 'preposition',
    example: 'I will go with you.', 
    example_tr: 'Seninle gideceğim.' 
  },
  'by': { 
    translation: 'tarafından', 
    type: 'Edat',
    partOfSpeech: 'preposition',
    example: 'The book was written by him.', 
    example_tr: 'Kitap onun tarafından yazıldı.' 
  },
  'from': { 
    translation: 'den/dan', 
    type: 'Edat',
    partOfSpeech: 'preposition',
    example: 'I am from Turkey.', 
    example_tr: 'Türkiye\'denim.' 
  },
  'of': { 
    translation: 'nin/nın', 
    type: 'Edat',
    partOfSpeech: 'preposition',
    example: 'The color of the sky is blue.', 
    example_tr: 'Gökyüzünün rengi mavidir.' 
  },
  'about': { 
    translation: 'hakkında', 
    type: 'Edat',
    partOfSpeech: 'preposition',
    example: 'Tell me about yourself.', 
    example_tr: 'Bana kendinden bahset.' 
  },
  'is': { 
    translation: 'dir/dır', 
    type: 'Yardımcı Fiil',
    partOfSpeech: 'auxiliary verb',
    example: 'The weather is nice today.', 
    example_tr: 'Bugün hava güzel.' 
  },
  'are': { 
    translation: 'siniz/sınız', 
    type: 'Yardımcı Fiil',
    partOfSpeech: 'auxiliary verb',
    example: 'You are kind.', 
    example_tr: 'Sen naziksin.' 
  },
  'was': { 
    translation: 'idi', 
    type: 'Geçmiş Zaman Fiili',
    partOfSpeech: 'auxiliary verb',
    example: 'It was a cold day.', 
    example_tr: 'Soğuk bir gündü.' 
  },
  'were': { 
    translation: 'idiler', 
    type: 'Geçmiş Zaman Fiili',
    partOfSpeech: 'auxiliary verb',
    example: 'We were happy.', 
    example_tr: 'Mutluyduk.' 
  },
  'be': { 
    translation: 'olmak', 
    type: 'Yardımcı Fiil',
    partOfSpeech: 'auxiliary verb',
    example: 'To be or not to be.', 
    example_tr: 'Olmak ya da olmamak.' 
  },
  'been': { 
    translation: 'olmuş', 
    type: 'Geçmiş Ortaç',
    partOfSpeech: 'past participle',
    example: 'I have been to Paris.', 
    example_tr: 'Paris\'te bulundum.' 
  },
  'have': { 
    translation: 'sahip olmak', 
    type: 'Yardımcı Fiil/Ana Fiil',
    partOfSpeech: 'auxiliary verb/main verb',
    example: 'I have a car.', 
    example_tr: 'Bir arabam var.' 
  },
  'has': { 
    translation: 'sahip', 
    type: 'Yardımcı Fiil/Ana Fiil',
    partOfSpeech: 'auxiliary verb/main verb',
    example: 'She has a book.', 
    example_tr: 'Onun bir kitabı var.' 
  },
  'had': { 
    translation: 'sahipti', 
    type: 'Geçmiş Zaman Fiili',
    partOfSpeech: 'auxiliary verb/main verb',
    example: 'I had a dog.', 
    example_tr: 'Bir köpeğim vardı.' 
  },
  'do': { 
    translation: 'yapmak', 
    type: 'Yardımcı Fiil/Ana Fiil',
    partOfSpeech: 'auxiliary verb/main verb',
    example: 'What do you do?', 
    example_tr: 'Ne iş yapıyorsun?' 
  },
  'does': { 
    translation: 'yapar', 
    type: 'Yardımcı Fiil/Ana Fiil',
    partOfSpeech: 'auxiliary verb/main verb',
    example: 'She does her homework.', 
    example_tr: 'Ödevini yapıyor.' 
  },
  'did': { 
    translation: 'yaptı', 
    type: 'Geçmiş Zaman Fiili',
    partOfSpeech: 'auxiliary verb/main verb',
    example: 'I did my best.', 
    example_tr: 'Elimden geleni yaptım.' 
  },
  'can': { 
    translation: 'ebilmek', 
    type: 'Modal Fiil',
    partOfSpeech: 'modal verb',
    example: 'I can swim.', 
    example_tr: 'Yüzebilirim.' 
  },
  'could': { 
    translation: 'ebilirdi', 
    type: 'Modal Fiil',
    partOfSpeech: 'modal verb',
    example: 'I could help you.', 
    example_tr: 'Sana yardım edebilirim.' 
  },
  'will': { 
    translation: 'ecek/acak', 
    type: 'Modal Fiil',
    partOfSpeech: 'modal verb',
    example: 'I will come tomorrow.', 
    example_tr: 'Yarın geleceğim.' 
  },
  'would': { 
    translation: 'ardi/erdi', 
    type: 'Modal Fiil',
    partOfSpeech: 'modal verb',
    example: 'I would like some tea.', 
    example_tr: 'Biraz çay istiyorum.' 
  },
  'should': { 
    translation: 'malı/meli', 
    type: 'Modal Fiil',
    partOfSpeech: 'modal verb',
    example: 'You should study.', 
    example_tr: 'Çalışmalısın.' 
  },
  'must': { 
    translation: 'zorunda', 
    type: 'Modal Fiil',
    partOfSpeech: 'modal verb',
    example: 'You must be careful.', 
    example_tr: 'Dikkatli olmalısın.' 
  },
  'may': { 
    translation: 'olabilir', 
    type: 'Modal Fiil',
    partOfSpeech: 'modal verb',
    example: 'It may rain today.', 
    example_tr: 'Bugün yağmur yağabilir.' 
  },
  'might': { 
    translation: 'olabilir', 
    type: 'Modal Fiil',
    partOfSpeech: 'modal verb',
    example: 'I might go to the party.', 
    example_tr: 'Partiye gidebilirim.' 
  },
  'not': { 
    translation: 'değil', 
    type: 'Olumsuzluk Zarfı',
    partOfSpeech: 'adverb',
    example: 'This is not my book.', 
    example_tr: 'Bu benim kitabım değil.' 
  },
  'very': { 
    translation: 'çok', 
    type: 'Zarf',
    partOfSpeech: 'adverb',
    example: 'She is very beautiful.', 
    example_tr: 'O çok güzel.' 
  },
  'too': { 
    translation: 'çok fazla', 
    type: 'Zarf',
    partOfSpeech: 'adverb',
    example: 'This is too expensive.', 
    example_tr: 'Bu çok pahalı.' 
  },
  'also': { 
    translation: 'ayrıca', 
    type: 'Zarf',
    partOfSpeech: 'adverb',
    example: 'I also like music.', 
    example_tr: 'Ben de müziği severim.' 
  },
  'only': { 
    translation: 'sadece', 
    type: 'Zarf',
    partOfSpeech: 'adverb',
    example: 'I only have one dollar.', 
    example_tr: 'Sadece bir dolarım var.' 
  },
  'always': { 
    translation: 'her zaman', 
    type: 'Zarf',
    partOfSpeech: 'adverb',
    example: 'He is always late for class.', 
    example_tr: 'Derse her zaman geç kalır.' 
  },
  'never': { 
    translation: 'asla', 
    type: 'Zarf',
    partOfSpeech: 'adverb',
    example: 'I never eat meat.', 
    example_tr: 'Asla et yemem.' 
  },
  'sometimes': { 
    translation: 'bazen', 
    type: 'Zarf',
    partOfSpeech: 'adverb',
    example: 'Sometimes I go to the gym.', 
    example_tr: 'Bazen spor salonuna giderim.' 
  },
  'often': { 
    translation: 'sık sık', 
    type: 'Zarf',
    partOfSpeech: 'adverb',
    example: 'I often read books.', 
    example_tr: 'Sık sık kitap okurum.' 
  },
  'usually': { 
    translation: 'genellikle', 
    type: 'Zarf',
    partOfSpeech: 'adverb',
    example: 'I usually wake up at 7 AM.', 
    example_tr: 'Genellikle sabah 7\'de uyanırım.' 
  },

  // Pronouns
  'i': { 
    translation: 'ben', 
    type: 'Kişi Zamiri',
    partOfSpeech: 'pronoun',
    example: 'I am a student.', 
    example_tr: 'Ben bir öğrenciyim.'
  },
  'you': { 
    translation: 'sen, siz', 
    type: 'Kişi Zamiri',
    partOfSpeech: 'pronoun',
    example: 'How are you?', 
    example_tr: 'Nasılsın?'
  },
  'he': { 
    translation: 'o (erkek)', 
    type: 'Kişi Zamiri',
    partOfSpeech: 'pronoun',
    example: 'He is my brother.', 
    example_tr: 'O benim kardeşim.'
  },
  'she': { 
    translation: 'o (kadın)', 
    type: 'Kişi Zamiri',
    partOfSpeech: 'pronoun',
    example: 'She is my sister.', 
    example_tr: 'O benim kız kardeşim.' 
  },
  'it': { 
    translation: 'o', 
    type: 'Zamir',
    partOfSpeech: 'pronoun',
    example: 'It is a beautiful day.', 
    example_tr: 'Güzel bir gün.' 
  },
  'we': { 
    translation: 'biz', 
    type: 'Kişi Zamiri',
    partOfSpeech: 'pronoun',
    example: 'We are friends.', 
    example_tr: 'Biz arkadaşız.'
  },
  'they': { 
    translation: 'onlar', 
    type: 'Kişi Zamiri',
    partOfSpeech: 'pronoun',
    example: 'They are my friends.', 
    example_tr: 'Onlar benim arkadaşlarım.' 
  },
  'me': { 
    translation: 'beni', 
    type: 'Nesne Zamiri',
    partOfSpeech: 'object pronoun',
    example: 'Call me later.', 
    example_tr: 'Beni sonra ara.' 
  },
  'him': { 
    translation: 'onu (erkek)', 
    type: 'Nesne Zamiri',
    partOfSpeech: 'object pronoun',
    example: 'I saw him yesterday.', 
    example_tr: 'Onu dün gördüm.' 
  },
  'her': { 
    translation: 'onu (kadın)', 
    type: 'Nesne Zamiri',
    partOfSpeech: 'object pronoun',
    example: 'I called her.', 
    example_tr: 'Onu aradım.' 
  },
  'us': { 
    translation: 'bizi', 
    type: 'Nesne Zamiri',
    partOfSpeech: 'object pronoun',
    example: 'He helped us.', 
    example_tr: 'Bize yardım etti.' 
  },
  'them': { 
    translation: 'onları', 
    type: 'Nesne Zamiri',
    partOfSpeech: 'object pronoun',
    example: 'I know them.', 
    example_tr: 'Onları tanıyorum.' 
  },

  // Possessive adjectives
  'my': { 
    translation: 'benim', 
    type: 'İyelik Sıfatı',
    partOfSpeech: 'possessive adjective',
    example: 'This is my house.', 
    example_tr: 'Bu benim evim.' 
  },
  'your': { 
    translation: 'senin', 
    type: 'İyelik Sıfatı',
    partOfSpeech: 'possessive adjective',
    example: 'What is your name?', 
    example_tr: 'Adın ne?' 
  },
  'his': { 
    translation: 'onun (erkek)', 
    type: 'İyelik Sıfatı',
    partOfSpeech: 'possessive adjective',
    example: 'This is his car.', 
    example_tr: 'Bu onun arabası.' 
  },
  'our': { 
    translation: 'bizim', 
    type: 'İyelik Sıfatı',
    partOfSpeech: 'possessive adjective',
    example: 'This is our house.', 
    example_tr: 'Bu bizim evimiz.'
  },
  'their': { 
    translation: 'onların', 
    type: 'İyelik Sıfatı',
    partOfSpeech: 'possessive adjective',
    example: 'This is their car.', 
    example_tr: 'Bu onların arabası.' 
  },

  // Demonstratives
  'this': { 
    translation: 'bu', 
    type: 'İşaret Sıfatı',
    partOfSpeech: 'determiner',
    example: 'This is my house.', 
    example_tr: 'Bu benim evim.'
  },
  'that': { 
    translation: 'şu, o', 
    type: 'İşaret Sıfatı/Zamir',
    partOfSpeech: 'determiner/pronoun',
    example: 'That is my house.', 
    example_tr: 'Şu benim evim.' 
  },
  'these': { 
    translation: 'bunlar', 
    type: 'İşaret Zamiri',
    partOfSpeech: 'determiner',
    example: 'These are my books.', 
    example_tr: 'Bunlar benim kitaplarım.'
  },
  'those': { 
    translation: 'onlar, şunlar', 
    type: 'İşaret Zamiri',
    partOfSpeech: 'demonstrative pronoun',
    example: 'Those are my books.', 
    example_tr: 'Onlar benim kitaplarım.'
  },

  // Numbers
  'one': { 
    translation: 'bir', 
    type: 'Sayı/Zamir',
    partOfSpeech: 'number/pronoun',
    example: 'I have one brother.', 
    example_tr: 'Bir erkek kardeşim var.' 
  },
  'two': { 
    translation: 'iki', 
    type: 'Sayı',
    partOfSpeech: 'number',
    example: 'I have two cats.', 
    example_tr: 'İki kedim var.' 
  },
  'three': { 
    translation: 'üç', 
    type: 'Sayı',
    partOfSpeech: 'number',
    example: 'There are three apples.', 
    example_tr: 'Üç elma var.' 
  },
  'four': { 
    translation: 'dört', 
    type: 'Sayı',
    partOfSpeech: 'number',
    example: 'I have four books.', 
    example_tr: 'Dört kitabım var.' 
  },
  'five': { 
    translation: 'beş', 
    type: 'Sayı',
    partOfSpeech: 'number',
    example: 'There are five people.', 
    example_tr: 'Beş kişi var.' 
  },
  'six': { 
    translation: 'altı', 
    type: 'Sayı',
    partOfSpeech: 'number',
    example: 'I work six days a week.', 
    example_tr: 'Haftada altı gün çalışırım.' 
  },
  'seven': { 
    translation: 'yedi', 
    type: 'Sayı',
    partOfSpeech: 'number',
    example: 'There are seven days in a week.', 
    example_tr: 'Bir haftada yedi gün var.' 
  },
  'eight': { 
    translation: 'sekiz', 
    type: 'Sayı',
    partOfSpeech: 'number',
    example: 'I sleep eight hours.', 
    example_tr: 'Sekiz saat uyurum.' 
  },
  'nine': { 
    translation: 'dokuz', 
    type: 'Sayı',
    partOfSpeech: 'number',
    example: 'School starts at nine.', 
    example_tr: 'Okul dokuzda başlar.' 
  },
  'ten': { 
    translation: 'on', 
    type: 'Sayı',
    partOfSpeech: 'number',
    example: 'I have ten fingers.', 
    example_tr: 'On parmağım var.' 
  },

  // Common verbs
  'go': { 
    translation: 'gitmek', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'I go to school every day.', 
    example_tr: 'Her gün okula giderim.' 
  },
  'come': { 
    translation: 'gelmek', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'Please come here.', 
    example_tr: 'Lütfen buraya gel.' 
  },
  'see': { 
    translation: 'görmek', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'I can see the mountain.', 
    example_tr: 'Dağı görebiliyorum.' 
  },
  'know': { 
    translation: 'bilmek', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'I know the answer.', 
    example_tr: 'Cevabı biliyorum.' 
  },
  'think': { 
    translation: 'düşünmek', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'I think you are right.', 
    example_tr: 'Bence haklısın.' 
  },
  'want': { 
    translation: 'istemek', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'I want some water.', 
    example_tr: 'Su istiyorum.' 
  },
  'like': { 
    translation: 'sevmek', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'I like chocolate.', 
    example_tr: 'Çikolatayı severim.' 
  },
  'love': { 
    translation: 'sevmek', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'I love you.', 
    example_tr: 'Seni seviyorum.' 
  },
  'help': { 
    translation: 'yardım etmek', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'Can you help me?', 
    example_tr: 'Bana yardım edebilir misin?' 
  },
  'make': { 
    translation: 'yapmak', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'I make breakfast every morning.', 
    example_tr: 'Her sabah kahvaltı yaparım.' 
  },
  'take': { 
    translation: 'almak', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'Take this book.', 
    example_tr: 'Bu kitabı al.' 
  },
  'give': { 
    translation: 'vermek', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'Give me the pen.', 
    example_tr: 'Bana kalemi ver.' 
  },
  'get': { 
    translation: 'almak', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'I need to get some milk.', 
    example_tr: 'Biraz süt almam gerekiyor.' 
  },
  'put': { 
    translation: 'koymak', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'Put the book on the table.', 
    example_tr: 'Kitabı masaya koy.' 
  },
  'find': { 
    translation: 'bulmak', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'I cannot find my keys.', 
    example_tr: 'Anahtarlarımı bulamıyorum.' 
  },
  'tell': { 
    translation: 'söylemek', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'Tell me the truth.', 
    example_tr: 'Bana gerçeği söyle.' 
  },
  'ask': { 
    translation: 'sormak', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'Can I ask you a question?', 
    example_tr: 'Sana bir soru sorabilir miyim?' 
  },
  'try': { 
    translation: 'denemek', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'Try to understand.', 
    example_tr: 'Anlamaya çalış.' 
  },
  'use': { 
    translation: 'kullanmak', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'Use this pen.', 
    example_tr: 'Bu kalemi kullan.' 
  },
  'look': { 
    translation: 'bakmak', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'Look at the sky.', 
    example_tr: 'Gökyüzüne bak.' 
  },
  'feel': { 
    translation: 'hissetmek', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'I feel happy.', 
    example_tr: 'Mutlu hissediyorum.' 
  },
  'seem': { 
    translation: 'görünmek', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'You seem tired.', 
    example_tr: 'Yorgun görünüyorsun.' 
  },
  'become': { 
    translation: 'olmak', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'He became a doctor.', 
    example_tr: 'Doktor oldu.' 
  },
  'turn': { 
    translation: 'dönmek', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'Turn left at the corner.', 
    example_tr: 'Köşede sola dön.' 
  },
  'keep': { 
    translation: 'tutmak', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'Keep the change.', 
    example_tr: 'Üstü kalsın.' 
  },
  'start': { 
    translation: 'başlamak', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'Let\'s start the meeting.', 
    example_tr: 'Toplantıyı başlatalım.' 
  },
  'stop': { 
    translation: 'durmak', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'Stop talking!', 
    example_tr: 'Konuşmayı kes!' 
  },
  'run': { 
    translation: 'koşmak', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'I run every morning.', 
    example_tr: 'Her sabah koşarım.' 
  },
  'walk': { 
    translation: 'yürümek', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'I like to walk in the park.', 
    example_tr: 'Parkta yürümeyi severim.' 
  },
  'sit': { 
    translation: 'oturmak', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'Please sit down.', 
    example_tr: 'Lütfen oturun.' 
  },
  'stand': { 
    translation: 'ayakta durmak', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'Stand up, please.', 
    example_tr: 'Lütfen ayağa kalkın.' 
  },
  'live': { 
    translation: 'yaşamak', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'I live in Istanbul.', 
    example_tr: 'İstanbul\'da yaşıyorum.' 
  },
  'die': { 
    translation: 'ölmek', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'All living things die.', 
    example_tr: 'Tüm canlılar ölür.' 
  },
  'eat': { 
    translation: 'yemek', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'I eat breakfast at 8 AM.', 
    example_tr: 'Sabah 8\'de kahvaltı yaparım.' 
  },
  'drink': { 
    translation: 'içmek', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'Drink more water.', 
    example_tr: 'Daha fazla su iç.' 
  },
  'sleep': { 
    translation: 'uyumak', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'I sleep 8 hours a night.', 
    example_tr: 'Gecede 8 saat uyurum.' 
  },
  'wake': { 
    translation: 'uyanmak', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'I wake up at 7 AM.', 
    example_tr: 'Sabah 7\'de uyanırım.' 
  },
  'open': { 
    translation: 'açmak', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'Open the door.', 
    example_tr: 'Kapıyı aç.' 
  },
  'close': { 
    translation: 'kapatmak', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'Close the window.', 
    example_tr: 'Pencereyi kapat.' 
  },
  'read': { 
    translation: 'okumak', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'I read books every day.', 
    example_tr: 'Her gün kitap okurum.' 
  },
  'write': { 
    translation: 'yazmak', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'Write your name here.', 
    example_tr: 'Adını buraya yaz.' 
  },
  'speak': { 
    translation: 'konuşmak', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'Do you speak English?', 
    example_tr: 'İngilizce konuşuyor musun?' 
  },
  'listen': { 
    translation: 'dinlemek', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'Listen to the music.', 
    example_tr: 'Müziği dinle.' 
  },
  'hear': { 
    translation: 'duymak', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'Can you hear me?', 
    example_tr: 'Beni duyabiliyor musun?' 
  },
  'watch': { 
    translation: 'izlemek', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'I watch TV in the evening.', 
    example_tr: 'Akşamları televizyon izlerim.' 
  },
  'play': { 
    translation: 'oynamak', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'Children play in the park.', 
    example_tr: 'Çocuklar parkta oynar.' 
  },
  'study': { 
    translation: 'çalışmak', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'I study English every day.', 
    example_tr: 'Her gün İngilizce çalışırım.' 
  },
  'learn': { 
    translation: 'öğrenmek', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'I want to learn Turkish.', 
    example_tr: 'Türkçe öğrenmek istiyorum.' 
  },
  'teach': { 
    translation: 'öğretmek', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'She teaches mathematics.', 
    example_tr: 'Matematik öğretiyor.' 
  },
  'buy': { 
    translation: 'satın almak', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'I need to buy milk.', 
    example_tr: 'Süt almam gerekiyor.' 
  },
  'sell': { 
    translation: 'satmak', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'They sell fresh fruit.', 
    example_tr: 'Taze meyve satıyorlar.' 
  },
  'pay': { 
    translation: 'ödemek', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'I will pay the bill.', 
    example_tr: 'Hesabı ödeyeceğim.' 
  },
  'cost': { 
    translation: 'mal olmak', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'How much does it cost?', 
    example_tr: 'Ne kadar tutuyor?' 
  },
  'spend': { 
    translation: 'harcamak', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'Don\'t spend too much money.', 
    example_tr: 'Çok para harcama.' 
  },
  'save': { 
    translation: 'biriktirmek', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'I save money every month.', 
    example_tr: 'Her ay para biriktiririm.' 
  },
  'win': { 
    translation: 'kazanmak', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'Our team won the game.', 
    example_tr: 'Takımımız oyunu kazandı.' 
  },
  'lose': { 
    translation: 'kaybetmek', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'I lost my wallet.', 
    example_tr: 'Cüzdanımı kaybettim.' 
  },
  'meet': { 
    translation: 'tanışmak', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'Nice to meet you.', 
    example_tr: 'Tanıştığımıza memnun oldum.' 
  },
  'leave': { 
    translation: 'ayrılmak', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'I have to leave now.', 
    example_tr: 'Şimdi gitmem gerekiyor.' 
  },
  'arrive': { 
    translation: 'varmak', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'The train arrives at 5 PM.', 
    example_tr: 'Tren akşam 5\'te varıyor.' 
  },
  'return': { 
    translation: 'geri dönmek', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'I will return tomorrow.', 
    example_tr: 'Yarın geri döneceğim.' 
  },
  'stay': { 
    translation: 'kalmak', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'Stay here, please.', 
    example_tr: 'Lütfen burada kal.' 
  },
  'visit': { 
    translation: 'ziyaret etmek', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'I want to visit Paris.', 
    example_tr: 'Paris\'i ziyaret etmek istiyorum.' 
  },
  'travel': { 
    translation: 'seyahat etmek', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'I love to travel.', 
    example_tr: 'Seyahat etmeyi severim.' 
  },
  'move': { 
    translation: 'hareket etmek', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'Don\'t move!', 
    example_tr: 'Hareket etme!' 
  },
  'change': { 
    translation: 'değiştirmek', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'I need to change my clothes.', 
    example_tr: 'Kıyafetlerimi değiştirmem gerekiyor.' 
  },
  'build': { 
    translation: 'inşa etmek', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'They build houses.', 
    example_tr: 'Ev inşa ediyorlar.' 
  },
  'break': { 
    translation: 'kırmak', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'Don\'t break the glass.', 
    example_tr: 'Camı kırma.' 
  },
  'fix': { 
    translation: 'tamir etmek', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'Can you fix my computer?', 
    example_tr: 'Bilgisayarımı tamir edebilir misin?' 
  },
  'clean': { 
    translation: 'temizlemek', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'Clean your room.', 
    example_tr: 'Odanı temizle.' 
  },
  'wash': { 
    translation: 'yıkamak', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'Wash your hands.', 
    example_tr: 'Ellerini yıka.' 
  },
  'cook': { 
    translation: 'pişirmek', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'I cook dinner every night.', 
    example_tr: 'Her akşam yemek pişiririm.' 
  },
  'cut': { 
    translation: 'kesmek', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'Cut the bread.', 
    example_tr: 'Ekmeği kes.' 
  },
  'draw': { 
    translation: 'çizmek', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'Draw a picture.', 
    example_tr: 'Bir resim çiz.' 
  },
  'paint': { 
    translation: 'boyamak', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'Paint the wall blue.', 
    example_tr: 'Duvarı maviye boya.' 
  },
  'sing': { 
    translation: 'şarkı söylemek', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'She sings beautifully.', 
    example_tr: 'Güzel şarkı söylüyor.' 
  },
  'dance': { 
    translation: 'dans etmek', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'Let\'s dance!', 
    example_tr: 'Hadi dans edelim!' 
  },
  'laugh': { 
    translation: 'gülmek', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'The joke made me laugh.', 
    example_tr: 'Şaka beni güldürdü.' 
  },
  'cry': { 
    translation: 'ağlamak', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'Don\'t cry, everything will be okay.', 
    example_tr: 'Ağlama, her şey yoluna girecek.' 
  },
  'smile': { 
    translation: 'gülümsemek', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'She has a beautiful smile.', 
    example_tr: 'Güzel bir gülümsemesi var.' 
  },

  // Common adjectives
  'good': { 
    translation: 'iyi', 
    type: 'Sıfat',
    partOfSpeech: 'adjective',
    example: 'This is a good book.', 
    example_tr: 'Bu iyi bir kitap.' 
  },
  'bad': { 
    translation: 'kötü', 
    type: 'Sıfat',
    partOfSpeech: 'adjective',
    example: 'The weather is bad today.', 
    example_tr: 'Bugün hava kötü.' 
  },
  'big': { 
    translation: 'büyük', 
    type: 'Sıfat',
    partOfSpeech: 'adjective',
    example: 'This is a big house.', 
    example_tr: 'Bu büyük bir ev.' 
  },
  'small': { 
    translation: 'küçük', 
    type: 'Sıfat',
    partOfSpeech: 'adjective',
    example: 'This is a small cat.', 
    example_tr: 'Bu küçük bir kedi.' 
  },
  'new': { 
    translation: 'yeni', 
    type: 'Sıfat',
    partOfSpeech: 'adjective',
    example: 'I bought a new car.', 
    example_tr: 'Yeni bir araba aldım.' 
  },
  'old': { 
    translation: 'eski', 
    type: 'Sıfat',
    partOfSpeech: 'adjective',
    example: 'This is an old building.', 
    example_tr: 'Bu eski bir bina.' 
  },
  'young': { 
    translation: 'genç', 
    type: 'Sıfat',
    partOfSpeech: 'adjective',
    example: 'She is very young.', 
    example_tr: 'O çok genç.' 
  },
  'long': { 
    translation: 'uzun', 
    type: 'Sıfat',
    partOfSpeech: 'adjective',
    example: 'This is a long road.', 
    example_tr: 'Bu uzun bir yol.' 
  },
  'short': { 
    translation: 'kısa', 
    type: 'Sıfat',
    partOfSpeech: 'adjective',
    example: 'She has short hair.', 
    example_tr: 'Kısa saçları var.' 
  },
  'high': { 
    translation: 'yüksek', 
    type: 'Sıfat',
    partOfSpeech: 'adjective',
    example: 'The mountain is very high.', 
    example_tr: 'Dağ çok yüksek.' 
  },
  'low': { 
    translation: 'alçak', 
    type: 'Sıfat',
    partOfSpeech: 'adjective',
    example: 'The table is low.', 
    example_tr: 'Masa alçak.' 
  },
  'hot': { 
    translation: 'sıcak', 
    type: 'Sıfat',
    partOfSpeech: 'adjective',
    example: 'The coffee is hot.', 
    example_tr: 'Kahve sıcak.' 
  },
  'cold': { 
    translation: 'soğuk', 
    type: 'Sıfat',
    partOfSpeech: 'adjective',
    example: 'The weather is cold.', 
    example_tr: 'Hava soğuk.' 
  },
  'warm': { 
    translation: 'ılık', 
    type: 'Sıfat',
    partOfSpeech: 'adjective',
    example: 'The water is warm.', 
    example_tr: 'Su ılık.' 
  },
  'cool': { 
    translation: 'serin', 
    type: 'Sıfat',
    partOfSpeech: 'adjective',
    example: 'The evening is cool.', 
    example_tr: 'Akşam serin.' 
  },
  'fast': { 
    translation: 'hızlı', 
    type: 'Sıfat',
    partOfSpeech: 'adjective',
    example: 'He is a fast runner.', 
    example_tr: 'O hızlı bir koşucu.' 
  },
  'slow': { 
    translation: 'yavaş', 
    type: 'Sıfat',
    partOfSpeech: 'adjective',
    example: 'The turtle is slow.', 
    example_tr: 'Kaplumbağa yavaş.' 
  },
  'easy': { 
    translation: 'kolay', 
    type: 'Sıfat',
    partOfSpeech: 'adjective',
    example: 'This test is easy.', 
    example_tr: 'Bu test kolay.' 
  },
  'hard': { 
    translation: 'zor', 
    type: 'Sıfat',
    partOfSpeech: 'adjective',
    example: 'This problem is hard.', 
    example_tr: 'Bu problem zor.' 
  },
  'happy': { 
    translation: 'mutlu', 
    type: 'Sıfat',
    partOfSpeech: 'adjective',
    example: 'I am happy today.', 
    example_tr: 'Bugün mutluyum.' 
  },
  'sad': { 
    translation: 'üzgün', 
    type: 'Sıfat',
    partOfSpeech: 'adjective',
    example: 'She looks sad.', 
    example_tr: 'Üzgün görünüyor.' 
  },
  'angry': { 
    translation: 'kızgın', 
    type: 'Sıfat',
    partOfSpeech: 'adjective',
    example: 'He is angry with me.', 
    example_tr: 'Bana kızgın.' 
  },
  'tired': { 
    translation: 'yorgun', 
    type: 'Sıfat',
    partOfSpeech: 'adjective',
    example: 'I am tired after work.', 
    example_tr: 'İşten sonra yorgunum.' 
  },
  'hungry': { 
    translation: 'aç', 
    type: 'Sıfat',
    partOfSpeech: 'adjective',
    example: 'I am hungry.', 
    example_tr: 'Acım.' 
  },
  'thirsty': { 
    translation: 'susuz', 
    type: 'Sıfat',
    partOfSpeech: 'adjective',
    example: 'I am thirsty.', 
    example_tr: 'Susadım.' 
  },
  'beautiful': { 
    translation: 'güzel', 
    type: 'Sıfat',
    partOfSpeech: 'adjective',
    example: 'She is beautiful.', 
    example_tr: 'O güzel.' 
  },
  'ugly': { 
    translation: 'çirkin', 
    type: 'Sıfat',
    partOfSpeech: 'adjective',
    example: 'That building is ugly.', 
    example_tr: 'O bina çirkin.' 
  },
  'nice': { 
    translation: 'güzel', 
    type: 'Sıfat',
    partOfSpeech: 'adjective',
    example: 'Have a nice day!', 
    example_tr: 'İyi günler!' 
  },
  'clean': { 
    translation: 'temiz', 
    type: 'Sıfat',
    partOfSpeech: 'adjective',
    example: 'The room is clean.', 
    example_tr: 'Oda temiz.' 
  },
  'dirty': { 
    translation: 'kirli', 
    type: 'Sıfat',
    partOfSpeech: 'adjective',
    example: 'My clothes are dirty.', 
    example_tr: 'Kıyafetlerim kirli.' 
  },
  'rich': { 
    translation: 'zengin', 
    type: 'Sıfat',
    partOfSpeech: 'adjective',
    example: 'He is a rich man.', 
    example_tr: 'O zengin bir adam.' 
  },
  'poor': { 
    translation: 'fakir', 
    type: 'Sıfat',
    partOfSpeech: 'adjective',
    example: 'They are poor people.', 
    example_tr: 'Onlar fakir insanlar.' 
  },
  'full': { 
    translation: 'dolu', 
    type: 'Sıfat',
    partOfSpeech: 'adjective',
    example: 'The glass is full.', 
    example_tr: 'Bardak dolu.' 
  },
  'empty': { 
    translation: 'boş', 
    type: 'Sıfat',
    partOfSpeech: 'adjective',
    example: 'The room is empty.', 
    example_tr: 'Oda boş.' 
  },
  'right': { 
    translation: 'doğru', 
    type: 'Sıfat',
    partOfSpeech: 'adjective',
    example: 'You are right.', 
    example_tr: 'Haklısın.' 
  },
  'wrong': { 
    translation: 'yanlış', 
    type: 'Sıfat',
    partOfSpeech: 'adjective',
    example: 'This answer is wrong.', 
    example_tr: 'Bu cevap yanlış.' 
  },
  'free': { 
    translation: 'ücretsiz', 
    type: 'Sıfat',
    partOfSpeech: 'adjective',
    example: 'This service is free.', 
    example_tr: 'Bu hizmet ücretsiz.' 
  },
  'busy': { 
    translation: 'meşgul', 
    type: 'Sıfat',
    partOfSpeech: 'adjective',
    example: 'I am busy today.', 
    example_tr: 'Bugün meşgulüm.' 
  },
  'ready': { 
    translation: 'hazır', 
    type: 'Sıfat',
    partOfSpeech: 'adjective',
    example: 'Are you ready?', 
    example_tr: 'Hazır mısın?' 
  },
  'sure': { 
    translation: 'emin', 
    type: 'Sıfat',
    partOfSpeech: 'adjective',
    example: 'I am sure about this.', 
    example_tr: 'Bundan eminim.' 
  },
  'important': { 
    translation: 'önemli', 
    type: 'Sıfat',
    partOfSpeech: 'adjective',
    example: 'This is important.', 
    example_tr: 'Bu önemli.' 
  },
  'different': { 
    translation: 'farklı', 
    type: 'Sıfat',
    partOfSpeech: 'adjective',
    example: 'We are different.', 
    example_tr: 'Biz farklıyız.' 
  },
  'same': { 
    translation: 'aynı', 
    type: 'Sıfat',
    partOfSpeech: 'adjective',
    example: 'We have the same car.', 
    example_tr: 'Aynı arabaya sahibiz.' 
  },
  'next': { 
    translation: 'sonraki', 
    type: 'Sıfat',
    partOfSpeech: 'adjective',
    example: 'See you next week.', 
    example_tr: 'Gelecek hafta görüşürüz.' 
  },
  'last': { 
    translation: 'son', 
    type: 'Sıfat',
    partOfSpeech: 'adjective',
    example: 'This is the last one.', 
    example_tr: 'Bu sonuncusu.' 
  },
  'first': { 
    translation: 'ilk', 
    type: 'Sıfat',
    partOfSpeech: 'adjective',
    example: 'This is my first time.', 
    example_tr: 'Bu benim ilk kez.' 
  },
  'second': { 
    translation: 'ikinci', 
    type: 'Sıfat',
    partOfSpeech: 'adjective',
    example: 'This is the second floor.', 
    example_tr: 'Bu ikinci kat.' 
  },
  'third': { 
    translation: 'üçüncü', 
    type: 'Sıfat',
    partOfSpeech: 'adjective',
    example: 'He came third in the race.', 
    example_tr: 'Yarışta üçüncü oldu.' 
  },

  // Common nouns
  'man': { 
    translation: 'adam', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'The man is tall.', 
    example_tr: 'Adam uzun boylu.' 
  },
  'woman': { 
    translation: 'kadın', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'The woman is beautiful.', 
    example_tr: 'Kadın güzel.' 
  },
  'person': { 
    translation: 'kişi', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'He is a nice person.', 
    example_tr: 'O iyi bir kişi.' 
  },
  'people': { 
    translation: 'insanlar', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'Many people live here.', 
    example_tr: 'Burada birçok insan yaşıyor.' 
  },
  'child': { 
    translation: 'çocuk', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'The child is playing.', 
    example_tr: 'Çocuk oynuyor.' 
  },
  'children': { 
    translation: 'çocuklar', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'The children are happy.', 
    example_tr: 'Çocuklar mutlu.' 
  },
  'boy': { 
    translation: 'erkek çocuk', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'The boy is playing football.', 
    example_tr: 'Erkek çocuk futbol oynuyor.' 
  },
  'girl': { 
    translation: 'kız çocuk', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'The girl is reading.', 
    example_tr: 'Kız çocuk okuyor.' 
  },
  'family': { 
    translation: 'aile', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'I love my family.', 
    example_tr: 'Ailemi seviyorum.' 
  },
  'friend': { 
    translation: 'arkadaş', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'He is my best friend.', 
    example_tr: 'O benim en iyi arkadaşım.' 
  },
  'mother': { 
    translation: 'anne', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'My mother is kind.', 
    example_tr: 'Annem nazik.' 
  },
  'father': { 
    translation: 'baba', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'My father works hard.', 
    example_tr: 'Babam sıkı çalışır.' 
  },
  'brother': { 
    translation: 'erkek kardeş', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'I have one brother.', 
    example_tr: 'Bir erkek kardeşim var.' 
  },
  'sister': { 
    translation: 'kız kardeş', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'My sister is younger.', 
    example_tr: 'Kız kardeşim daha küçük.' 
  },
  'house': { 
    translation: 'ev', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'This is my house.', 
    example_tr: 'Bu benim evim.' 
  },
  'home': { 
    translation: 'ev', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'I am going home.', 
    example_tr: 'Eve gidiyorum.' 
  },
  'room': { 
    translation: 'oda', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'This is my room.', 
    example_tr: 'Bu benim odam.' 
  },
  'door': { 
    translation: 'kapı', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'Please close the door.', 
    example_tr: 'Lütfen kapıyı kapat.' 
  },
  'window': { 
    translation: 'pencere', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'Open the window.', 
    example_tr: 'Pencereyi aç.' 
  },
  'table': { 
    translation: 'masa', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'The book is on the table.', 
    example_tr: 'Kitap masanın üzerinde.' 
  },
  'chair': { 
    translation: 'sandalye', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'Sit on the chair.', 
    example_tr: 'Sandalyeye otur.' 
  },
  'bed': { 
    translation: 'yatak', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'I sleep in my bed.', 
    example_tr: 'Yatağımda uyurum.' 
  },
  'car': { 
    translation: 'araba', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'I have a red car.', 
    example_tr: 'Kırmızı bir arabam var.' 
  },
  'bus': { 
    translation: 'otobüs', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'I take the bus to work.', 
    example_tr: 'İşe otobüsle giderim.' 
  },
  'train': { 
    translation: 'tren', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'The train is fast.', 
    example_tr: 'Tren hızlı.' 
  },
  'plane': { 
    translation: 'uçak', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'I travel by plane.', 
    example_tr: 'Uçakla seyahat ederim.' 
  },
  'book': { 
    translation: 'kitap', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'I am reading a book.', 
    example_tr: 'Bir kitap okuyorum.' 
  },
  'pen': { 
    translation: 'kalem', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'I write with a pen.', 
    example_tr: 'Kalemle yazarım.' 
  },
  'paper': { 
    translation: 'kağıt', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'I need some paper.', 
    example_tr: 'Biraz kağıda ihtiyacım var.' 
  },
  'phone': { 
    translation: 'telefon', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'My phone is ringing.', 
    example_tr: 'Telefonum çalıyor.' 
  },
  'computer': { 
    translation: 'bilgisayar', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'I work on my computer.', 
    example_tr: 'Bilgisayarımda çalışırım.' 
  },
  'television': { 
    translation: 'televizyon', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'I watch television.', 
    example_tr: 'Televizyon izlerim.' 
  },
  'tv': { 
    translation: 'televizyon', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'Turn on the TV.', 
    example_tr: 'Televizyonu aç.' 
  },
  'music': { 
    translation: 'müzik', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'I love music.', 
    example_tr: 'Müziği severim.' 
  },
  'movie': { 
    translation: 'film', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'Let\'s watch a movie.', 
    example_tr: 'Hadi bir film izleyelim.' 
  },
  'food': { 
    translation: 'yemek', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'I like Italian food.', 
    example_tr: 'İtalyan yemeğini severim.' 
  },
  'water': { 
    translation: 'su', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'I drink water.', 
    example_tr: 'Su içerim.' 
  },
  'coffee': { 
    translation: 'kahve', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'I drink coffee in the morning.', 
    example_tr: 'Sabahları kahve içerim.' 
  },
  'tea': { 
    translation: 'çay', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'Would you like some tea?', 
    example_tr: 'Biraz çay ister misin?' 
  },
  'milk': { 
    translation: 'süt', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'I drink milk every day.', 
    example_tr: 'Her gün süt içerim.' 
  },
  'bread': { 
    translation: 'ekmek', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'I eat bread for breakfast.', 
    example_tr: 'Kahvaltıda ekmek yerim.' 
  },
  'money': { 
    translation: 'para', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'I need money.', 
    example_tr: 'Paraya ihtiyacım var.' 
  },
  'work': { 
    translation: 'iş', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'I go to work every day.', 
    example_tr: 'Her gün işe giderim.' 
  },
  'job': { 
    translation: 'iş', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'I have a good job.', 
    example_tr: 'İyi bir işim var.' 
  },
  'school': { 
    translation: 'okul', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'I go to school.', 
    example_tr: 'Okula giderim.' 
  },
  'teacher': { 
    translation: 'öğretmen', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'My teacher is nice.', 
    example_tr: 'Öğretmenim nazik.' 
  },
  'student': { 
    translation: 'öğrenci', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'I am a student.', 
    example_tr: 'Ben bir öğrenciyim.' 
  },
  'doctor': { 
    translation: 'doktor', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'I need to see a doctor.', 
    example_tr: 'Bir doktor görmem gerekiyor.' 
  },
  'hospital': { 
    translation: 'hastane', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'He is in the hospital.', 
    example_tr: 'O hastanede.' 
  },
  'store': { 
    translation: 'mağaza', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'I go to the store.', 
    example_tr: 'Mağazaya giderim.' 
  },
  'shop': { 
    translation: 'dükkan', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'The shop is closed.', 
    example_tr: 'Dükkan kapalı.' 
  },
  'restaurant': { 
    translation: 'restoran', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'Let\'s go to a restaurant.', 
    example_tr: 'Bir restorana gidelim.' 
  },
  'park': { 
    translation: 'park', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'Children play in the park.', 
    example_tr: 'Çocuklar parkta oynar.' 
  },
  'street': { 
    translation: 'sokak', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'I live on this street.', 
    example_tr: 'Bu sokakta yaşarım.' 
  },
  'city': { 
    translation: 'şehir', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'Istanbul is a big city.', 
    example_tr: 'İstanbul büyük bir şehir.' 
  },
  'country': { 
    translation: 'ülke', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'Turkey is a beautiful country.', 
    example_tr: 'Türkiye güzel bir ülke.' 
  },
  'world': { 
    translation: 'dünya', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'The world is big.', 
    example_tr: 'Dünya büyük.' 
  },
  'sun': { 
    translation: 'güneş', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'The sun is shining.', 
    example_tr: 'Güneş parlıyor.' 
  },
  'moon': { 
    translation: 'ay', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'The moon is beautiful tonight.', 
    example_tr: 'Bu gece ay güzel.' 
  },
  'star': { 
    translation: 'yıldız', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'I can see the stars.', 
    example_tr: 'Yıldızları görebiliyorum.' 
  },
  'sky': { 
    translation: 'gökyüzü', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'The sky is blue.', 
    example_tr: 'Gökyüzü mavi.' 
  },
  'weather': { 
    translation: 'hava', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'The weather is nice.', 
    example_tr: 'Hava güzel.' 
  },
  'rain': { 
    translation: 'yağmur', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'I like the rain.', 
    example_tr: 'Yağmuru severim.' 
  },
  'snow': { 
    translation: 'kar', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'The snow is white.', 
    example_tr: 'Kar beyaz.' 
  },
  'wind': { 
    translation: 'rüzgar', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'The wind is strong.', 
    example_tr: 'Rüzgar güçlü.' 
  },
  'fire': { 
    translation: 'ateş', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'Fire is hot.', 
    example_tr: 'Ateş sıcak.' 
  },
  'light': { 
    translation: 'ışık', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'Turn on the light.', 
    example_tr: 'Işığı aç.' 
  },
  'dark': { 
    translation: 'karanlık', 
    type: 'İsim/Sıfat',
    partOfSpeech: 'noun/adjective',
    example: 'I am afraid of the dark.', 
    example_tr: 'Karanlıktan korkarım.' 
  },
  'color': { 
    translation: 'renk', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'What color do you like?', 
    example_tr: 'Hangi rengi seversin?' 
  },
  'red': { 
    translation: 'kırmızı', 
    type: 'Sıfat/İsim',
    partOfSpeech: 'adjective/noun',
    example: 'I have a red car.', 
    example_tr: 'Kırmızı bir arabam var.' 
  },
  'blue': { 
    translation: 'mavi', 
    type: 'Sıfat/İsim',
    partOfSpeech: 'adjective/noun',
    example: 'The sky is blue.', 
    example_tr: 'Gökyüzü mavi.' 
  },
  'green': { 
    translation: 'yeşil', 
    type: 'Sıfat/İsim',
    partOfSpeech: 'adjective/noun',
    example: 'The grass is green.', 
    example_tr: 'Çimen yeşil.' 
  },
  'yellow': { 
    translation: 'sarı', 
    type: 'Sıfat/İsim',
    partOfSpeech: 'adjective/noun',
    example: 'The sun is yellow.', 
    example_tr: 'Güneş sarı.' 
  },
  'black': { 
    translation: 'siyah', 
    type: 'Sıfat/İsim',
    partOfSpeech: 'adjective/noun',
    example: 'I wear black shoes.', 
    example_tr: 'Siyah ayakkabı giyerim.' 
  },
  'white': { 
    translation: 'beyaz', 
    type: 'Sıfat/İsim',
    partOfSpeech: 'adjective/noun',
    example: 'Snow is white.', 
    example_tr: 'Kar beyaz.' 
  },
  'time': { 
    translation: 'zaman', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'What time is it?', 
    example_tr: 'Saat kaç?' 
  },
  'day': { 
    translation: 'gün', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'Have a nice day!', 
    example_tr: 'İyi günler!' 
  },
  'week': { 
    translation: 'hafta', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'I work five days a week.', 
    example_tr: 'Haftada beş gün çalışırım.' 
  },
  'month': { 
    translation: 'ay', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'January is the first month.', 
    example_tr: 'Ocak ilk ay.' 
  },
  'year': { 
    translation: 'yıl', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'This year is 2024.', 
    example_tr: 'Bu yıl 2024.' 
  },
  'hour': { 
    translation: 'saat', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'I work eight hours a day.', 
    example_tr: 'Günde sekiz saat çalışırım.' 
  },
  'minute': { 
    translation: 'dakika', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'Wait a minute.', 
    example_tr: 'Bir dakika bekle.' 
  },
  'second': { 
    translation: 'saniye', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'Just a second.', 
    example_tr: 'Sadece bir saniye.' 
  },
  'morning': { 
    translation: 'sabah', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'Good morning!', 
    example_tr: 'Günaydın!' 
  },
  'afternoon': { 
    translation: 'öğleden sonra', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'See you this afternoon.', 
    example_tr: 'Bu öğleden sonra görüşürüz.' 
  },
  'evening': { 
    translation: 'akşam', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'Good evening!', 
    example_tr: 'İyi akşamlar!' 
  },
  'night': { 
    translation: 'gece', 
    type: 'İsim',
    partOfSpeech: 'noun',
    example: 'Good night!', 
    example_tr: 'İyi geceler!' 
  },
  'today': { 
    translation: 'bugün', 
    type: 'Zarf',
    partOfSpeech: 'adverb',
    example: 'Today is Monday.', 
    example_tr: 'Bugün pazartesi.' 
  },
  'tomorrow': { 
    translation: 'yarın', 
    type: 'Zarf',
    partOfSpeech: 'adverb',
    example: 'See you tomorrow.', 
    example_tr: 'Yarın görüşürüz.' 
  },
  'yesterday': { 
    translation: 'dün', 
    type: 'Zarf',
    partOfSpeech: 'adverb',
    example: 'I saw him yesterday.', 
    example_tr: 'Onu dün gördüm.' 
  },
  'now': { 
    translation: 'şimdi', 
    type: 'Zarf',
    partOfSpeech: 'adverb',
    example: 'I am busy now.', 
    example_tr: 'Şimdi meşgulüm.' 
  },
  'then': { 
    translation: 'sonra', 
    type: 'Zarf',
    partOfSpeech: 'adverb',
    example: 'First eat, then sleep.', 
    example_tr: 'Önce ye, sonra uyu.' 
  },
  'here': { 
    translation: 'burada', 
    type: 'Zarf',
    partOfSpeech: 'adverb',
    example: 'Come here.', 
    example_tr: 'Buraya gel.' 
  },
  'there': { 
    translation: 'orada', 
    type: 'Zarf',
    partOfSpeech: 'adverb',
    example: 'Put it there.', 
    example_tr: 'Onu oraya koy.' 
  },
  'up': { 
    translation: 'yukarı', 
    type: 'Zarf/Edat',
    partOfSpeech: 'adverb/preposition',
    example: 'Look up.', 
    example_tr: 'Yukarı bak.' 
  },
  'down': { 
    translation: 'aşağı', 
    type: 'Zarf/Edat',
    partOfSpeech: 'adverb/preposition',
    example: 'Sit down.', 
    example_tr: 'Otur.' 
  },
  'left': { 
    translation: 'sol', 
    type: 'Sıfat/İsim',
    partOfSpeech: 'adjective/noun',
    example: 'Turn left.', 
    example_tr: 'Sola dön.' 
  },
  'right': { 
    translation: 'sağ', 
    type: 'Sıfat/İsim',
    partOfSpeech: 'adjective/noun',
    example: 'Turn right.', 
    example_tr: 'Sağa dön.' 
  },
  'yes': { 
    translation: 'evet', 
    type: 'Ünlem',
    partOfSpeech: 'interjection',
    example: 'Yes, I agree.', 
    example_tr: 'Evet, katılıyorum.' 
  },
  'no': { 
    translation: 'hayır', 
    type: 'Ünlem',
    partOfSpeech: 'interjection',
    example: 'No, I don\'t want it.', 
    example_tr: 'Hayır, istemiyorum.' 
  },
  'please': { 
    translation: 'lütfen', 
    type: 'Ünlem',
    partOfSpeech: 'interjection',
    example: 'Please help me.', 
    example_tr: 'Lütfen bana yardım et.' 
  },
  'thank': { 
    translation: 'teşekkür etmek', 
    type: 'Fiil',
    partOfSpeech: 'verb',
    example: 'Thank you very much.', 
    example_tr: 'Çok teşekkür ederim.' 
  },
  'thanks': { 
    translation: 'teşekkürler', 
    type: 'Ünlem',
    partOfSpeech: 'interjection',
    example: 'Thanks for your help.', 
    example_tr: 'Yardımın için teşekkürler.' 
  },
  'sorry': { 
    translation: 'üzgünüm', 
    type: 'Ünlem/Sıfat',
    partOfSpeech: 'interjection/adjective',
    example: 'Sorry, I am late.', 
    example_tr: 'Üzgünüm, geç kaldım.' 
  },
  'excuse': { 
    translation: 'affedersiniz', 
    type: 'Fiil/İsim',
    partOfSpeech: 'verb/noun',
    example: 'Excuse me, where is the bank?', 
    example_tr: 'Affedersiniz, banka nerede?' 
  },
  'hello': { 
    translation: 'merhaba', 
    type: 'Ünlem',
    partOfSpeech: 'interjection',
    example: 'Hello, how are you?', 
    example_tr: 'Merhaba, nasılsın?' 
  },
  'goodbye': { 
    translation: 'hoşçakal', 
    type: 'Ünlem',
    partOfSpeech: 'interjection',
    example: 'Goodbye, see you later.', 
    example_tr: 'Hoşçakal, sonra görüşürüz.' 
  },
  'bye': { 
    translation: 'hoşçakal', 
    type: 'Ünlem',
    partOfSpeech: 'interjection',
    example: 'Bye! Have a nice day.', 
    example_tr: 'Hoşçakal! İyi günler.' 
  }
};