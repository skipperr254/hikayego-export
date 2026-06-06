export const basicWords = {
  // Articles
  'a': { 
    translation: 'bir', 
    type: 'Belirsiz Artikel',
    partOfSpeech: 'article',
    example: 'I saw a dog.', 
    example_tr: 'Bir köpek gördüm.' 
  },
  'the': { 
    translation: '(belirli artikel)', 
    type: 'Belirli Artikel',
    partOfSpeech: 'article',
    example: 'The sun is shining.', 
    example_tr: 'Güneş parlıyor.' 
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

  // Basic verbs
  'am': { 
    translation: '-im, -ım', 
    type: 'Yardımcı Fiil',
    partOfSpeech: 'auxiliary verb',
    example: 'I am happy.', 
    example_tr: 'Mutluyum.'
  },
  'is': { 
    translation: 'olduğunu', 
    type: 'Yardımcı Fiil',
    partOfSpeech: 'auxiliary verb',
    example: 'The weather is nice today.', 
    example_tr: 'Bugün hava güzel.' 
  },
  'are': { 
    translation: 'olduğunu', 
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
    translation: 'idi', 
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
    translation: 'sahip olmak', 
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
    translation: 'yapmak', 
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

  // Modal verbs
  'can': { 
    translation: '-ebilmek', 
    type: 'Modal Fiil',
    partOfSpeech: 'modal verb',
    example: 'I can swim.', 
    example_tr: 'Yüzebilirim.'
  },
  'could': { 
    translation: '-ebilirdi', 
    type: 'Modal Fiil',
    partOfSpeech: 'modal verb',
    example: 'I could help you.', 
    example_tr: 'Sana yardım edebilirim.'
  },
  'will': { 
    translation: 'gelecek zaman', 
    type: 'Modal Fiil',
    partOfSpeech: 'modal verb',
    example: 'I will come tomorrow.', 
    example_tr: 'Yarın geleceğim.'
  },
  'would': { 
    translation: 'gelecek zaman (geçmiş)', 
    type: 'Modal Fiil',
    partOfSpeech: 'modal verb',
    example: 'I would like some tea.', 
    example_tr: 'Biraz çay istiyorum.'
  },
  'should': { 
    translation: 'yapmalı', 
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

  // Basic prepositions
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
    translation: '-e/-a (yönelme)', 
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
    translation: 'nın/nin', 
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

  // Basic conjunctions
  'and': { 
    translation: 've', 
    type: 'Bağlaç',
    partOfSpeech: 'conjunction',
    example: 'We need bread and butter.', 
    example_tr: 'Ekmek ve tereyağına ihtiyacımız var.' 
  },
  'but': { 
    translation: 'ama', 
    type: 'Bağlaç',
    partOfSpeech: 'conjunction',
    example: 'I want to go, but I am tired.', 
    example_tr: 'Gitmek istiyorum ama yorgunum.'
  },
  'or': { 
    translation: 'veya', 
    type: 'Bağlaç',
    partOfSpeech: 'conjunction',
    example: 'Tea or coffee?', 
    example_tr: 'Çay mı kahve mi?'
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

  // Basic adverbs
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
    translation: 'çok (fazla)', 
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

  // Basic determiners
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
  'some': { 
    translation: 'bazı', 
    type: 'Belirteç',
    partOfSpeech: 'determiner',
    example: 'I need some help.', 
    example_tr: 'Biraz yardıma ihtiyacım var.'
  },
  'any': { 
    translation: 'herhangi', 
    type: 'Belirteç',
    partOfSpeech: 'determiner',
    example: 'Do you have any questions?', 
    example_tr: 'Herhangi bir sorun var mı?'
  },
  'all': { 
    translation: 'tüm', 
    type: 'Belirteç',
    partOfSpeech: 'determiner',
    example: 'All students passed.', 
    example_tr: 'Tüm öğrenciler geçti.'
  },
  'many': { 
    translation: 'birçok', 
    type: 'Belirteç',
    partOfSpeech: 'determiner',
    example: 'There are many books.', 
    example_tr: 'Birçok kitap var.'
  },
  'much': { 
    translation: 'çok', 
    type: 'Belirteç',
    partOfSpeech: 'determiner',
    example: 'How much does it cost?', 
    example_tr: 'Ne kadar tutuyor?'
  },
  'few': { 
    translation: 'az', 
    type: 'Belirteç',
    partOfSpeech: 'determiner',
    example: 'I have few friends.', 
    example_tr: 'Az arkadaşım var.'
  },
  'little': { 
    translation: 'az', 
    type: 'Belirteç/Sıfat',
    partOfSpeech: 'determiner/adjective',
    example: 'I have little time.', 
    example_tr: 'Az zamanım var.'
  },
  'each': { 
    translation: 'her biri', 
    type: 'Belirteç/Zamir',
    partOfSpeech: 'determiner/pronoun',
    example: 'Each student received a book.', 
    example_tr: 'Her öğrenci bir kitap aldı.' 
  },
  'every': { 
    translation: 'her', 
    type: 'Belirteç',
    partOfSpeech: 'determiner',
    example: 'Every day is a new beginning.', 
    example_tr: 'Her gün yeni bir başlangıçtır.'
  },
  'other': { 
    translation: 'diğer', 
    type: 'Sıfat/Zamir',
    partOfSpeech: 'adjective/pronoun',
    example: 'I want the other one.', 
    example_tr: 'Diğerini istiyorum.' 
  },
  'another': { 
    translation: 'başka bir', 
    type: 'Belirteç',
    partOfSpeech: 'determiner',
    example: 'Can I have another cup of tea?', 
    example_tr: 'Bir fincan daha çay alabilir miyim?'
  }
};