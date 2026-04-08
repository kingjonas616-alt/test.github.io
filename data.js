const CARS = [
  {
    id: 1, make: "تویۆتا", model: "لاندکروزەر", year: 2022, price: 85000,
    condition: "used", mileage: 35000, color: "سپی", fuel: "بەنزین",
    trans: "ئۆتۆماتیک", featured: true,
    desc: "تویۆتا لاندکروزەری ٢٠٢٢، دۆخی زۆر باش، یەک خاوەن، سێرڤیسی تەواوکراو. تایبەتمەندییە ئەکسترا زۆرن.",
    img: "photos/car-1.png"
  },
  {
    id: 2, make: "BMW", model: "X5", year: 2021, price: 72000,
    condition: "used", mileage: 42000, color: "مەشکی", fuel: "بەنزین",
    trans: "ئۆتۆماتیک", featured: true,
    desc: "BMW X5 ی ٢٠٢١، دۆخی عەالی، تەواوی تایبەتمەندیەکانی ئەکسترا. دیزاینی ڵوکسی زۆر.",
    img: "photos/car-2.png"
  },
  {
    id: 3, make: "مەرسیدیس", model: "E200", year: 2023, price: 95000,
    condition: "new", mileage: 0, color: "زەڕد", fuel: "بەنزین",
    trans: "ئۆتۆماتیک", featured: true,
    desc: "مەرسیدیس E200 ی نوێ، سەرەکیەوە هاتووە، گەرەنتیای فابریکا. تەکنەلۆجیای دوایینى.",
    img: "photos/car-3.png"
  },
  {
    id: 4, make: "هیوندای", model: "توسان", year: 2020, price: 28000,
    condition: "used", mileage: 65000, color: "شین", fuel: "بەنزین",
    trans: "ئۆتۆماتیک", featured: false,
    desc: "هیوندای توسانی ٢٠٢٠، دۆخی باش، پاک و ئامادە. ئیکۆنۆمیکی زۆر و سووتمەنیی کەمترە.",
    img: "photos/car-4.png"
  },
  {
    id: 5, make: "کیا", model: "سپۆرتیج", year: 2021, price: 32000,
    condition: "used", mileage: 48000, color: "خۆشک", fuel: "دیزل",
    trans: "ئۆتۆماتیک", featured: false,
    desc: "کیا سپۆرتیجی ٢٠٢١، کارەبایی باش، ئیکۆنۆمیک. کابین فراواند و تایبەتمەندیی زۆرە.",
    img: "photos/car-5.png"
  },
  {
    id: 6, make: "نیسان", model: "پاترۆل", year: 2019, price: 45000,
    condition: "used", mileage: 88000, color: "سپی", fuel: "بەنزین",
    trans: "ئۆتۆماتیک", featured: false,
    desc: "نیسان پاترۆلی ٢٠١٩، گۆشتدار و بەهێز، مناسبی ئەرزی و مێشخۆر.",
    img: "photos/car-6.png"
  },
  {
    id: 7, make: "هوندا", model: "CR-V", year: 2022, price: 38000,
    condition: "used", mileage: 22000, color: "قاوە", fuel: "بەنزین",
    trans: "ئۆتۆماتیک", featured: false,
    desc: "هوندا CR-V ی ٢٠٢٢، دۆخی نیمە نوێ، تایبەتمەندیی زۆر. کابینی فراوان و ئامانگدار.",
    img: "photos/car-7.png"
  },
  {
    id: 8, make: "فۆلکسڤاگن", model: "پاسات", year: 2020, price: 22000,
    condition: "used", mileage: 71000, color: "سلێمانی", fuel: "بەنزین",
    trans: "ئۆتۆماتیک", featured: false,
    desc: "فۆلکسڤاگن پاساتی ٢٠٢٠، ئێکۆنۆمیک و ئامانگ، مناسبی مناوەڵەی ڕۆژانە.",
    img: "photos/car-8.png"
  },
  {
    id: 9, make: "جیپ", model: "رانگلەر", year: 2023, price: 62000,
    condition: "new", mileage: 0, color: "شین", fuel: "بەنزین",
    trans: "ئۆتۆماتیک", featured: true,
    desc: "جیپ رانگلەری ٢٠٢٣، نوێ و ئامادە، مناسبی چیا و خشتە. سیستەمی 4WD تەواو.",
    img: "photos/car-9.png"
  },
  {
    id: 10, make: "لێکسەس", model: "RX350", year: 2021, price: 58000,
    condition: "used", mileage: 31000, color: "مەشکی", fuel: "بەنزین",
    trans: "ئۆتۆماتیک", featured: false,
    desc: "لێکسەس RX350 ی ٢٠٢١، ڵوکس و ئامانگ، دۆخی زۆر باش. خاوەندارانی یەک و مینیمالیستی.",
    img: "photos/car-10.png"
  },
  {
    id: 11, make: "تویۆتا", model: "کامری", year: 2022, price: 31000,
    condition: "used", mileage: 28000, color: "سیلڤەر", fuel: "هایبرید",
    trans: "ئۆتۆماتیک", featured: false,
    desc: "تویۆتا کامری هایبریدی ٢٠٢٢، سووتمەنی زۆر کەم، کابینی فراوان و ئامانگ.",
    img: "photos/car-11.png"
  },
  {
    id: 12, make: "ئاودی", model: "Q7", year: 2020, price: 67000,
    condition: "used", mileage: 55000, color: "مەشکی", fuel: "دیزل",
    trans: "ئۆتۆماتیک", featured: true,
    desc: "ئاودی Q7 ی ٢٠٢٠، SUV ی ڵوکس، ٧ کورسی، سیستەمی ئایهێڵ نوێ.",
    img: "photos/car-12.png"
    
  }
];



const TESTIMONIALS = [
  {
    name: "کاروان ئەحمەد", city: "هەولێر", stars: 5, avatar: "👨",
    text: "«خزمەتگوزاریی پیشانگای یونس واقعاً عالی بوو. ئوتومبێلەکەم لە باشترین دۆخدا بوو و نرخیشی زۆر گونجاو بوو. دەتانڕۆمێنم بۆ هەموو کەسێک.»"
  },
  {
    name: "شەهلا ئیبراهیم", city: "سلێمانی", stars: 5, avatar: "👩",
    text: "«پرۆسەکە زۆر ئاسان و خێرا بوو. ئوتومبێلەکەم لای ئەوان فرۆشتم و لە نزیکترین کاتدا پارەکەمیان دایەم. سوپاس!»"
  },
  {
    name: "دیلاور رەزا", city: "دهۆک", stars: 5, avatar: "👨",
    text: "«BMW ی خۆم لێرەوە کڕیم. گەرەنتی تەواویان دا و دواشیان دەربارەی هەموو توندوتیژیەک باسم پێکردن. متمانە تەواومن پێیان.»"
  }
];
