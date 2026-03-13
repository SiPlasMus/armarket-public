import type { NewsItem } from '@/types';

// Legacy types kept locally since Product/Category were removed from @/types
type Product = { id: string; name: string; nameRu: string; price: number; image?: string; categoryId: string; badge?: string; description?: string; descriptionRu?: string; inStock: boolean; rating?: number; reviewCount?: number; createdAt: string };
type Category = { id: string; name: string; nameRu: string; icon: string; productCount?: number };

// ─────────────────────────────────────────────
// Categories
// ─────────────────────────────────────────────

export const DEMO_CATEGORIES: Category[] = [
  { id: 'electronics', name: 'Elektronika', nameRu: 'Электроника', icon: 'Cpu', productCount: 47 },
  { id: 'office', name: 'Ofis jihozlari', nameRu: 'Офисные товары', icon: 'Briefcase', productCount: 83 },
  { id: 'furniture', name: 'Mebel', nameRu: 'Мебель', icon: 'Armchair', productCount: 29 },
  { id: 'household', name: 'Maishiy tovarlar', nameRu: 'Хозяйственные товары', icon: 'Home', productCount: 61 },
  { id: 'industrial', name: 'Sanoat', nameRu: 'Промышленное', icon: 'Wrench', productCount: 34 },
];

// ─────────────────────────────────────────────
// Products
// ─────────────────────────────────────────────

export const DEMO_PRODUCTS: Product[] = [
  {
    id: 'p001',
    name: 'Noutbuk Lenovo IdeaPad 3',
    nameRu: 'Ноутбук Lenovo IdeaPad 3',
    price: 8_500_000,
    categoryId: 'electronics',
    badge: 'popular',
    description: 'Intel Core i5, 8GB RAM, 512GB SSD, 15.6" FHD',
    descriptionRu: 'Intel Core i5, 8 ГБ ОЗУ, 512 ГБ SSD, 15.6" FHD',
    inStock: true,
    rating: 4.7,
    reviewCount: 128,
    createdAt: '2025-11-01',
  },
  {
    id: 'p002',
    name: 'Printer HP LaserJet Pro M404n',
    nameRu: 'Принтер HP LaserJet Pro M404n',
    price: 3_200_000,
    categoryId: 'electronics',
    badge: 'popular',
    description: 'Monoxrom lazer printer, A4, 38 ppm',
    descriptionRu: 'Монохромный лазерный принтер, A4, 38 стр/мин',
    inStock: true,
    rating: 4.5,
    reviewCount: 64,
    createdAt: '2025-10-15',
  },
  {
    id: 'p003',
    name: "A4 Qog'oz (500 varaq)",
    nameRu: 'Бумага A4 (500 листов)',
    price: 48_000,
    categoryId: 'office',
    description: "80 g/m², oq rangli, ofis uchun",
    descriptionRu: '80 г/м², белая, для офиса',
    inStock: true,
    rating: 4.9,
    reviewCount: 312,
    createdAt: '2025-09-01',
  },
  {
    id: 'p004',
    name: 'Ofis Kreslo Comfort Pro',
    nameRu: 'Офисное кресло Comfort Pro',
    price: 1_850_000,
    categoryId: 'furniture',
    badge: 'new',
    description: "Ergonomik, bel qo'llab-quvvatlash, to'q moviy",
    descriptionRu: 'Эргономичное, поясничная поддержка, тёмно-синее',
    inStock: true,
    rating: 4.6,
    reviewCount: 47,
    createdAt: '2025-12-01',
  },
  {
    id: 'p005',
    name: 'Monitor Samsung 24" FHD',
    nameRu: 'Монитор Samsung 24" FHD',
    price: 2_100_000,
    categoryId: 'electronics',
    description: 'IPS, 75Hz, HDMI, DisplayPort',
    descriptionRu: 'IPS, 75 Гц, HDMI, DisplayPort',
    inStock: true,
    rating: 4.4,
    reviewCount: 89,
    createdAt: '2025-10-20',
  },
  {
    id: 'p006',
    name: "Klaviatura + Sichqoncha To'plami",
    nameRu: 'Комплект клавиатура + мышь',
    price: 320_000,
    categoryId: 'electronics',
    description: "Simsiz, Logitech MK235, 2.4GHz",
    descriptionRu: 'Беспроводной, Logitech MK235, 2.4 ГГц',
    inStock: true,
    rating: 4.3,
    reviewCount: 156,
    createdAt: '2025-09-10',
  },
  {
    id: 'p007',
    name: 'USB-C Hub 7-in-1',
    nameRu: 'USB-C Хаб 7-в-1',
    price: 185_000,
    categoryId: 'electronics',
    badge: 'new',
    description: 'HDMI 4K, USB 3.0 x3, SD Card, PD 100W',
    descriptionRu: 'HDMI 4K, USB 3.0 x3, SD Card, PD 100W',
    inStock: true,
    rating: 4.5,
    reviewCount: 73,
    createdAt: '2025-12-10',
  },
  {
    id: 'p008',
    name: "Qog'oz Papka (50 dona)",
    nameRu: 'Папки для бумаг (50 шт)',
    price: 38_000,
    categoryId: 'office',
    description: 'A4, assorted ranglar, plastik',
    descriptionRu: 'A4, разных цветов, пластиковые',
    inStock: true,
    rating: 4.2,
    reviewCount: 201,
    createdAt: '2025-08-01',
  },
  {
    id: 'p009',
    name: 'Whiteboard 90×120 sm',
    nameRu: 'Маркерная доска 90×120 см',
    price: 680_000,
    categoryId: 'office',
    description: "Magnit, markerli, o'chiruvchi bilan",
    descriptionRu: 'Магнитная, в комплекте маркеры и губка',
    inStock: true,
    rating: 4.6,
    reviewCount: 38,
    createdAt: '2025-10-05',
  },
  {
    id: 'p010',
    name: 'Suv Dispenseri Hot&Cold',
    nameRu: 'Кулер для воды Hot&Cold',
    price: 750_000,
    categoryId: 'household',
    description: 'Issiq va sovuq suv, 19L idish uchun',
    descriptionRu: 'Горячая и холодная вода, для бутылей 19 л',
    inStock: true,
    rating: 4.4,
    reviewCount: 95,
    createdAt: '2025-09-20',
  },
  {
    id: 'p011',
    name: 'Elektr Choynak 1.7L',
    nameRu: 'Электрочайник 1.7 л',
    price: 285_000,
    categoryId: 'household',
    description: '2200W, zanglamaydigan po\'lat, avtomatik o\'chadi',
    descriptionRu: '2200 Вт, нержавеющая сталь, автовыключение',
    inStock: true,
    rating: 4.5,
    reviewCount: 143,
    createdAt: '2025-08-15',
  },
  {
    id: 'p012',
    name: 'Xavfsizlik Kamera 4MP',
    nameRu: 'Камера безопасности 4MP',
    price: 890_000,
    categoryId: 'electronics',
    description: 'IP66, gechelik rejim, Wi-Fi, Hikvision',
    descriptionRu: 'IP66, ночное видение, Wi-Fi, Hikvision',
    inStock: true,
    rating: 4.7,
    reviewCount: 52,
    createdAt: '2025-11-20',
  },
  {
    id: 'p013',
    name: "Stol uchun LED Lampa",
    nameRu: 'Настольная LED лампа',
    price: 195_000,
    categoryId: 'electronics',
    description: "3 yorugʻlik rejimi, USB zaryadlovchi, bukladigan",
    descriptionRu: '3 режима освещения, USB зарядка, складная',
    inStock: true,
    rating: 4.3,
    reviewCount: 87,
    createdAt: '2025-10-01',
  },
  {
    id: 'p014',
    name: 'Proyektor Xiaomi Mi 2 Pro',
    nameRu: 'Проектор Xiaomi Mi 2 Pro',
    price: 4_500_000,
    categoryId: 'electronics',
    badge: 'popular',
    description: '1080p FHD, 1300 ANSI, Android, HDMI',
    descriptionRu: '1080p FHD, 1300 ANSI, Android, HDMI',
    inStock: true,
    rating: 4.6,
    reviewCount: 29,
    createdAt: '2025-11-10',
  },
  {
    id: 'p015',
    name: 'Smartfon Samsung Galaxy A55',
    nameRu: 'Смартфон Samsung Galaxy A55',
    price: 5_200_000,
    categoryId: 'electronics',
    badge: 'new',
    description: '6.6", 8/256GB, 50MP, 5000mAh',
    descriptionRu: '6.6", 8/256 ГБ, 50 МП, 5000 мАч',
    inStock: true,
    rating: 4.8,
    reviewCount: 214,
    createdAt: '2025-12-05',
  },
  {
    id: 'p016',
    name: 'Sanitayzer Dispenser 1L',
    nameRu: 'Диспенсер санитайзера 1 л',
    price: 35_000,
    categoryId: 'household',
    description: 'Avtomatik sensor, 70% etanol',
    descriptionRu: 'Автоматический сенсор, 70% этанол',
    inStock: true,
    rating: 4.1,
    reviewCount: 178,
    createdAt: '2025-07-01',
  },
  {
    id: 'p017',
    name: "To'rli Saqlash Shelf 5 qavatli",
    nameRu: 'Стеллаж металлический 5-ярусный',
    price: 1_100_000,
    categoryId: 'furniture',
    description: "Metal, 180×90×35sm, 150kg yuk ko'taradi",
    descriptionRu: 'Металлический, 180×90×35 см, нагрузка 150 кг',
    inStock: false,
    rating: 4.5,
    reviewCount: 41,
    createdAt: '2025-09-05',
  },
  {
    id: 'p018',
    name: 'Gaz Gazlamasi (50m)',
    nameRu: 'Пузырчатая плёнка (50 м)',
    price: 95_000,
    categoryId: 'industrial',
    description: "Qadoqlash uchun, 1.2m kenglik",
    descriptionRu: 'Упаковочная, ширина 1.2 м',
    inStock: true,
    rating: 4.0,
    reviewCount: 67,
    createdAt: '2025-08-20',
  },
  {
    id: 'p019',
    name: "Mehribon Skotch (36 dona)",
    nameRu: 'Скотч прозрачный (36 шт)',
    price: 65_000,
    categoryId: 'office',
    badge: 'sale',
    description: '48mm×50m, ofis va qadoqlash uchun',
    descriptionRu: '48 мм × 50 м, для офиса и упаковки',
    inStock: true,
    rating: 4.2,
    reviewCount: 289,
    createdAt: '2025-07-15',
  },
  {
    id: 'p020',
    name: 'Wi-Fi Router TP-Link Archer C80',
    nameRu: 'Wi-Fi Роутер TP-Link Archer C80',
    price: 420_000,
    categoryId: 'electronics',
    description: 'AC1900, Dual Band, MU-MIMO, 4 antenna',
    descriptionRu: 'AC1900, двухдиапазонный, MU-MIMO, 4 антенны',
    inStock: true,
    rating: 4.6,
    reviewCount: 103,
    createdAt: '2025-10-25',
  },
];

// ─────────────────────────────────────────────
// News
// ─────────────────────────────────────────────

export const DEMO_NEWS: NewsItem[] = [
  {
    id: 'n001',
    slug: 'ar-market-yangi-versiya',
    title: "AR Market platformasi yangilandi — v2.0",
    titleRu: 'Платформа AR Market обновилась — v2.0',
    summary: "Yangi interfeys, tezroq qidiruv va ko'proq mahsulot. Biz siz uchun yanada yaxshiroq platformani taqdim etamiz.",
    summaryRu: 'Новый интерфейс, более быстрый поиск и больше товаров. Мы представляем улучшенную платформу для вас.',
    content: "AR Market 2.0 — bu faqat yangi dizayn emas, balki butunlay yangi tajriba. Biz so'nggi bir yil davomida platformamizni qayta qurdik: tezroq yuklanish, intuitiv interfeys va yangi filtrlash tizimi.\n\nYangilanishlar orasida eng muhimi — qidiruv tizimining sezilarli yaxshilanishi. Endi mahsulotlarni nom, kategoriya yoki narx bo'yicha millisekundlar ichida topish mumkin.\n\nMobil versiya ham to'liq qayta ishlandi. Har qanday qurilmadan qulay xarid qilishingiz mumkin. Bizning jamoamiz foydalanuvchilarning fikr-mulohazalarini hisobga olib, eng ko'p so'ralgan funksiyalarni qo'shdi.\n\nBundan tashqari, yangi to'lov usullari, yetkazib berish kuzatuvi va shaxsiy kabinet yangilandi. AR Market 2.0 bilan xarid qilish yanada oson va qulayroq!",
    contentRu: "AR Market 2.0 — это не просто новый дизайн, а совершенно новый опыт. Мы перестраивали платформу последний год: более быстрая загрузка, интуитивный интерфейс и новая система фильтрации.\n\nСреди обновлений главное — заметное улучшение системы поиска. Теперь товары можно найти по названию, категории или цене за миллисекунды.\n\nМобильная версия также полностью переработана. Удобные покупки с любого устройства. Наша команда учла отзывы пользователей и добавила наиболее запрашиваемые функции.\n\nКроме того, обновлены способы оплаты, отслеживание доставки и личный кабинет. С AR Market 2.0 покупать стало ещё проще и удобнее!",
    image: undefined,
    date: '2025-12-15',
    category: 'update',
    featured: true,
  },
  {
    id: 'n002',
    slug: 'ofis-jihozlari-chegirma',
    title: "Ofis jihozlariga 20% chegirma — yanvar aksiyasi",
    titleRu: 'Скидка 20% на офисные товары — январская акция',
    summary: "Yanvarning oxirigacha barcha ofis jihozlariga 20% chegirma. Juda ko'p mahsulotlar aksiyaga tushdi.",
    summaryRu: 'До конца января скидка 20% на все офисные товары. Воспользуйтесь выгодным предложением.',
    content: "Yanvar oyida AR Market barcha ofis jihozlariga 20% chegirma e'lon qilmoqda. Bu aksiya yanvarning 31-kunigacha davom etadi.\n\nAksiyaga kiruvchi mahsulotlar: stullar, stollar, shkaflar, printer va skanerlar, qog'oz va yozuv buyumlari, kompyuter va aksessuarlar.\n\nBugungi kun narxlari bilan kerakli jihozlarni xarid qiling va korxonangiz byudjetini tejang. Katta hajmdagi buyurtmalar uchun qo'shimcha chegirmalar mavjud.\n\nBatafsil ma'lumot uchun bizning menedjerlarimiz bilan bog'laning yoki platformada filtrni \"Aksiya\" holatiga o'rnating.",
    contentRu: "В январе AR Market объявляет скидку 20% на все офисные товары. Акция действует до 31 января.\n\nТовары, участвующие в акции: кресла, столы, шкафы, принтеры и сканеры, бумага и канцелярия, компьютеры и аксессуары.\n\nПокупайте необходимое оборудование по сегодняшним ценам и экономьте бюджет вашей компании. Для крупных заказов предусмотрены дополнительные скидки.\n\nДля подробной информации свяжитесь с нашими менеджерами или установите фильтр «Акция» на платформе.",
    image: undefined,
    date: '2025-12-10',
    category: 'promo',
    featured: false,
  },
  {
    id: 'n003',
    slug: 'yangi-sheriklik-bitimi',
    title: "AR Market va Samsung O'zbekiston sheriklik bitimi",
    titleRu: 'AR Market и Samsung Узбекистан заключили партнёрское соглашение',
    summary: "Endi Samsung mahsulotlarini AR Market orqali eng qulay narxda sotib olishingiz mumkin.",
    summaryRu: 'Теперь вы можете приобретать продукцию Samsung через AR Market по лучшим ценам.',
    content: "AR Market va Samsung O'zbekiston o'rtasida rasmiy sheriklik bitimi imzolandi. Bu bitim mijozlarimizga Samsung mahsulotlarini eng qulay va ishonchli tarzda sotib olish imkoniyatini beradi.\n\nEndi platformamizda Samsung-ning to'liq assortimentini topishingiz mumkin: smartfonlar, planshetlar, televizorlar, maishiy texnika va biznes uchun mo'ljallangan mahsulotlar.\n\nSheriklik doirasida mijozlarimiz qo'shimcha kafolat va texnik xizmat ko'rsatish imkoniyatiga ega bo'ladilar. Samsung-ning rasmiy vakili sifatida biz to'liq hujjatlarni taqdim etamiz.\n\nBu hamkorlik AR Market-ning O'zbekiston bozorida ishonchli va katta platforma sifatida o'rnini mustahkamlashga yordam beradi.",
    contentRu: "Между AR Market и Samsung Узбекистан подписано официальное партнёрское соглашение. Оно даёт нашим клиентам возможность покупать продукцию Samsung максимально удобно и надёжно.\n\nТеперь на нашей платформе вы найдёте полный ассортимент Samsung: смартфоны, планшеты, телевизоры, бытовую технику и продукцию для бизнеса.\n\nВ рамках партнёрства клиенты получают расширенную гарантию и техническое обслуживание. Как официальный представитель Samsung, мы предоставляем полный пакет документов.\n\nЭто сотрудничество укрепляет позиции AR Market как надёжной и крупной платформы на рынке Узбекистана.",
    image: undefined,
    date: '2025-11-28',
    category: 'news',
    featured: false,
  },
  {
    id: 'n004',
    slug: '100000-mahsulot-milestone',
    title: "100,000 mahsulot — AR Market katalogida yangi rekord",
    titleRu: '100 000 товаров — новый рекорд в каталоге AR Market',
    summary: "Katalogimizda 100,000 dan ortiq mahsulot mavjud. Kerak bo'lgan hamma narsani bizdan toping.",
    summaryRu: 'В нашем каталоге уже более 100 000 товаров. Найдите всё необходимое у нас.',
    content: "AR Market katalogi yangi rekordga erishdi — 100,000 dan ortiq mahsulot! Bu ko'rsatkich bizning jamoamizning ikki yillik mehnati natijasidir.\n\nKatalogimizda elektronika, ofis jihozlari, mebel, maishiy tovarlar, sanoat mahsulotlari va boshqa ko'plab kategoriyalar mavjud. Har kuni yangi mahsulotlar qo'shilmoqda.\n\nBu muvaffaqiyat bizning etkazib beruvchilarimiz va mijozlarimiz bilan hamkorligimiz tufayli mumkin bo'ldi. 500 dan ortiq ishonchli etkazib beruvchi bilan ishlayapmiz.\n\nKelgusi yilda yana 50,000 yangi mahsulot qo'shishni va yangi kategoriyalarni ochishni rejalashtirmoqdamiz. Kuzatib boring!",
    contentRu: "Каталог AR Market достиг нового рекорда — более 100 000 товаров! Этот показатель — результат двухлетней работы нашей команды.\n\nВ каталоге представлены электроника, офисные товары, мебель, хозяйственные товары, промышленная продукция и многое другое. Каждый день добавляются новые товары.\n\nЭтот успех стал возможным благодаря партнёрству с нашими поставщиками и клиентами. Мы работаем с более чем 500 надёжными поставщиками.\n\nВ следующем году планируем добавить ещё 50 000 новых товаров и открыть новые категории. Следите за обновлениями!",
    image: undefined,
    date: '2025-11-15',
    category: 'news',
    featured: false,
  },
  {
    id: 'n005',
    slug: 'navruz-aksiyasi',
    title: "Navro'z aksiyasi — 21 martgacha katta chegirmalar",
    titleRu: 'Акция к Навруз — большие скидки до 21 марта',
    summary: "Navro'z bayrami munosabati bilan yuzlab mahsulotlarga katta chegirmalar. Qulay xarid qiling!",
    summaryRu: 'В честь праздника Навруз скидки на сотни товаров. Делайте покупки выгодно!',
    content: "Navro'z bayrami munosabati bilan AR Market katta aksiyani e'lon qilmoqda! 21 martgacha yuzlab mahsulotlarga 10% dan 40% gacha chegirmalar.\n\nAksiya kategoriyalari:\n- Maishiy texnika: 25% gacha chegirma\n- Ofis jihozlari: 30% gacha chegirma\n- Elektronika: 20% gacha chegirma\n- Mebel: 15% gacha chegirma\n\nBundan tashqari, 1,000,000 so'mdan ortiq buyurtmalar uchun bepul yetkazib berish xizmati taklif etilmoqda. Aksiya mahsulotlarini «Aksiya» belgisi bilan topishingiz mumkin.\n\nNavro'z muborak! Yaqinlaringizga mos sovg'alarni AR Market dan toping.",
    contentRu: "В честь праздника Навруз AR Market объявляет большую акцию! До 21 марта скидки от 10% до 40% на сотни товаров.\n\nКатегории акции:\n- Бытовая техника: скидки до 25%\n- Офисные товары: скидки до 30%\n- Электроника: скидки до 20%\n- Мебель: скидки до 15%\n\nКроме того, для заказов свыше 1 000 000 сум предлагается бесплатная доставка. Товары акции можно найти по значку «Акция».\n\nС праздником Навруз! Найдите подходящие подарки для близких в AR Market.",
    image: undefined,
    date: '2025-11-01',
    category: 'promo',
    featured: false,
  },
  {
    id: 'n006',
    slug: 'yangi-tolov-usullari',
    title: "Yangi to'lov usullari: Click va Payme qo'shildi",
    titleRu: "Новые способы оплаты: добавлены Click и Payme",
    summary: "Endi AR Market orqali Click va Payme to'lov tizimlari orqali qulay to'lov qilishingiz mumkin.",
    summaryRu: 'Теперь через AR Market можно оплачивать через платёжные системы Click и Payme.',
    content: "AR Market to'lov tizimini kengaytirdi. Endi mijozlarimiz Click va Payme orqali qulay to'lov qilish imkoniyatiga ega.\n\nMavjud to'lov usullari:\n- Naqd pul\n- Bank kartasi (Uzcard, Humo)\n- Click (mobil to'lov)\n- Payme (mobil to'lov)\n- Bank o'tkazma (korporativ mijozlar uchun)\n\nMobil to'lov tizimlari orqali to'lash juda oddiy: savatga qo'shing, to'lov usulini tanlang va tasdiqlang. Barcha to'lovlar xavfsiz va himoyalangan.\n\nKelgusida boshqa to'lov usullarini ham qo'shishni rejalashtirmoqdamiz. Sizning quLayligingiz bizning ustuvorligimiz!",
    contentRu: "AR Market расширил платёжную систему. Теперь наши клиенты могут удобно оплачивать через Click и Payme.\n\nДоступные способы оплаты:\n- Наличные\n- Банковская карта (Uzcard, Humo)\n- Click (мобильная оплата)\n- Payme (мобильная оплата)\n- Банковский перевод (для корпоративных клиентов)\n\nОплата через мобильные платёжные системы очень проста: добавьте в корзину, выберите способ оплаты и подтвердите. Все платежи безопасны и защищены.\n\nВ будущем планируем добавить и другие способы оплаты. Ваше удобство — наш приоритет!",
    image: undefined,
    date: '2025-10-20',
    category: 'update',
    featured: false,
  },
];

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

export function getProductsByPeriod(
  period: 'today' | 'week' | 'month',
  limit = 8
): Product[] {
  // Demo: shuffle slightly per period so tabs feel different
  const seed = period === 'today' ? 0 : period === 'week' ? 3 : 6;
  return [...DEMO_PRODUCTS]
    .sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
    .slice(seed, seed + limit);
}

export function getProductsByCategory(categoryId: string, limit = 8): Product[] {
  return DEMO_PRODUCTS.filter((p) => p.categoryId === categoryId).slice(0, limit);
}

export function getProductById(id: string): Product | undefined {
  return DEMO_PRODUCTS.find((p) => p.id === id);
}

export function getNewsBySlug(slug: string): NewsItem | undefined {
  return DEMO_NEWS.find((n) => n.slug === slug);
}

export function getFeaturedNews(): NewsItem | undefined {
  return DEMO_NEWS.find((n) => n.featured);
}

export function getRelatedNews(current: NewsItem, limit = 3): NewsItem[] {
  return DEMO_NEWS.filter(
    (n) => n.category === current.category && n.id !== current.id,
  ).slice(0, limit);
}
