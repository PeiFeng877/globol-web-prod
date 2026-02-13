/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 2026-02-09 全面支持 15 语种（含 Bio 与 Feed 动态）；恢复所有用户的多条动态；变更时更新此头部，然后检查 GEMINI.md
 *
 * INPUT: Static profile records with 15-language support for all fields.
 * OUTPUT: profiles + view models + detail mocks + helper selectors.
 * POS: Data Layer
 * CONTRACT: Exports curated international dating profile data and detail mocks for UI rendering.
 * 职责: 维护国际交友展示数据（含 15 国语言翻译与多条动态）与类型契约。
 */

export interface LocalizedText {
  en: string; zh: string; de: string; es: string; fr: string; hi: string; id: string; it: string; ja: string; ko: string; nl: string; pt: string; ru: string; th: string; vi: string;
}

export interface UserProfile {
  id: string; name: string; age: number; gender: 'man' | 'woman'; country: string; countryDisplay: LocalizedText; city: LocalizedText; seeking: LocalizedText; bio: LocalizedText; avatar: string; isOnline: boolean; isNew: boolean;
}

export interface UserProfileView {
  id: string; name: string; age: number; gender: 'man' | 'woman'; country: string; countryDisplay: string; city: string; seeking: string; bio: string; avatar: string; isOnline: boolean; isNew: boolean;
}

export interface ProfileFact { label: LocalizedText; value: LocalizedText; }
export interface ProfileStat { label: LocalizedText; value: string; }
export type ProfileFeedTone = 'sunrise' | 'ocean' | 'citrus' | 'dusk';

export interface ProfileFeedItem {
  id: string; tone: ProfileFeedTone; title: LocalizedText; caption: LocalizedText; timestamp: string; location?: LocalizedText; image?: string; likes: number; comments: number; type: 'photo' | 'note' | 'checkin';
}

export interface UserProfileDetail {
  id: string; headline: LocalizedText; about: LocalizedText; traits: LocalizedText[]; interests: LocalizedText[]; languages: LocalizedText[]; occupation: LocalizedText; communicationStyle: LocalizedText; facts: ProfileFact[]; stats: ProfileStat[]; highlights: ProfileFact[]; feed: ProfileFeedItem[];
}

export interface UserProfileDetailView {
  id: string; headline: string; about: string; traits: string[]; interests: string[]; languages: string[]; occupation: string; communicationStyle: string; facts: Array<{ label: string; value: string }>; stats: Array<{ label: string; value: string }>; highlights: Array<{ label: string; value: string }>; feed: Array<{ id: string; tone: ProfileFeedTone; title: string; caption: string; timestamp: string; location: string; image?: string; likes: number; comments: number; type: 'photo' | 'note' | 'checkin'; }>;
}

// -----------------------------------------------------------------------------
// CORE PROFILES DATA (15 LANGUAGES)
// -----------------------------------------------------------------------------

export const profiles: UserProfile[] = [
  {
    "id": "user_0001_us_ny_emma", "name": "Emma", "age": 26, "gender": "woman", "country": "usa",
    "countryDisplay": { "en": "USA", "zh": "美国", "de": "USA", "es": "EE. UU.", "fr": "États-Unis", "hi": "अमेरिका", "id": "AS", "it": "USA", "ja": "アメリカ", "ko": "미국", "nl": "VS", "pt": "EUA", "ru": "США", "th": "สหรัฐอเมริกา", "vi": "Hoa Kỳ" },
    "city": { "en": "New York", "zh": "纽约", "de": "New York", "es": "Nueva York", "fr": "New York", "hi": "न्यूयॉर्क", "id": "New York", "it": "New York", "ja": "ニューヨーク", "ko": "뉴욕", "nl": "New York", "pt": "Nova York", "ru": "Нью-Йорк", "th": "นิวยอร์ก", "vi": "New York" },
    "seeking": { "en": "Male 18-40", "zh": "男士 18-40岁", "de": "Mann 18-40", "es": "Hombre 18-40", "fr": "Homme 18-40", "hi": "पुरुष 18-40", "id": "Pria 18-40", "it": "Uomo 18-40", "ja": "男性 18-40歳", "ko": "남성 18-40세", "nl": "Man 18-40", "pt": "Homem 18-40", "ru": "Мужчина 18-40", "th": "ชาย 18-40", "vi": "Nam 18-40" },
    "bio": {
      "en": "Curating chaos in NYC 🍸 Art & words.", "zh": "在纽约策划混乱 🍸 艺术与文字。", "de": "Chaos in NYC kuratieren 🍸 Kunst & Worte.", "es": "Curando el caos en NYC 🍸 arte y palabras.", "fr": "Organisatrice du chaos à NYC 🍸 art & mots.", "hi": "NYC में अराजकता को संजोना 🍸 कला और शब्द।", "id": "Mengurasi kekacauan di NYC 🍸 seni & kata.", "it": "Curando il caos a NYC 🍸 arte e parole.", "ja": "NYCでカオスをキュレーション中 🍸 アートと言葉。", "ko": "NYC에서 혼돈을 큐레이팅 중 🍸 예술 & 글。", "nl": "Chaos cureren in NYC 🍸 kunst & woorden。", "pt": "Curando o caos em NYC 🍸 arte e palavras。", "ru": "Курирую хаос в Нью-Йорке 🍸 искусство и слова。", "th": "จัดการความวุ่นวายใน NYC 🍸 ศิลปะและคำพูด", "vi": "Sắp xếp sự hỗn loạn ở NYC 🍸 nghệ thuật & ngôn từ。"
    },
    "avatar": "/avatars/generated/user_0001_us_ny_emma/avatar.webp", "isOnline": false, "isNew": false
  },
  {
    "id": "user_0002_jp_tokyo_haru", "name": "Haru", "age": 24, "gender": "man", "country": "japan",
    "countryDisplay": { "en": "Japan", "zh": "日本", "de": "Japan", "es": "Japón", "fr": "Japon", "hi": "जापान", "id": "Jepang", "it": "Giappone", "ja": "日本", "ko": "일본", "nl": "Japan", "pt": "Japão", "ru": "Япония", "th": "ญี่ปุ่น", "vi": "Nhật Bản" },
    "city": { "en": "Tokyo", "zh": "东京", "de": "Tokio", "es": "Tokio", "fr": "Tokyo", "hi": "टोक्यो", "id": "Tokyo", "it": "Tokyo", "ja": "東京", "ko": "도쿄", "nl": "Tokio", "pt": "Tóquio", "ru": "Токио", "th": "โตเกียว", "vi": "Tokyo" },
    "seeking": { "en": "Female 18-35", "zh": "女士 18-35岁", "de": "Frau 18-35", "es": "Mujer 18-35", "fr": "Femme 18-35", "hi": "महिला 18-35", "id": "Wanita 18-35", "it": "Donna 18-35", "ja": "女性 18-35歳", "ko": "여성 18-35세", "nl": "Vrouw 18-35", "pt": "Mulher 18-35", "ru": "Женщина 18-35", "th": "หญิง 18-35", "vi": "Nữ 18-35" },
    "bio": {
      "en": "Tokyo 📷 Film & design. Collecting light.", "zh": "东京 📷 胶片与设计。收集光影。", "de": "Tokio 📷 Film & Design. Licht sammeln.", "es": "Tokio 📷 cine y diseño. Coleccionando luz.", "fr": "Tokyo 📷 film & design. Collectionneur de lumière.", "hi": "टोक्यो 📷 फिल्म और डिज़ाइन। प्रकाश का संग्रह।", "id": "Tokyo 📷 film & desain. Mengumpulkan cahaya.", "it": "Tokyo 📷 film e design. Colleziono luce.", "ja": "東京 📷 film & design. 光を集めています。", "ko": "도쿄 📷 필름 & 디자인. 빛을 수집합니다。", "nl": "Tokio 📷 film & design. Licht verzamelen。", "pt": "Tóquio 📷 filme e design. Colecionando luz。", "ru": "Токио 📷 пленка и дизайн. Коллекционирую свет。", "th": "โตเกียว 📷 ฟิล์มและดีไซน์ สะสมแสงสว่าง", "vi": "Tokyo 📷 phim & thiết kế。Sưu tầm ánh sáng。"
    },
    "avatar": "/avatars/generated/user_0002_jp_tokyo_haru/avatar.webp", "isOnline": false, "isNew": false
  },
  {
    "id": "user_0003_br_rio_lucas", "name": "Lucas", "age": 27, "gender": "man", "country": "brazil",
    "countryDisplay": { "en": "Brazil", "zh": "巴西", "de": "Brasilien", "es": "Brasil", "fr": "Brésil", "hi": "ब्राजील", "id": "Brasil", "it": "Brasile", "ja": "ブラジル", "ko": "브라질", "nl": "Brazilië", "pt": "Brasil", "ru": "Бразилия", "th": "บราซิล", "vi": "Brazil" },
    "city": { "en": "Rio", "zh": "里约", "de": "Rio", "es": "Río", "fr": "Rio", "hi": "रियो", "id": "Rio", "it": "Rio", "ja": "リオ", "ko": "리우", "nl": "Rio", "pt": "Rio", "ru": "Рио", "th": "ริโอ", "vi": "Rio" },
    "seeking": { "en": "Female 18-35", "zh": "女士 18-35岁", "de": "Frau 18-35", "es": "Mujer 18-35", "fr": "Femme 18-35", "hi": "महिला 18-35", "id": "Wanita 18-35", "it": "Donna 18-35", "ja": "女性 18-35歳", "ko": "여성 18-35세", "nl": "Vrouw 18-35", "pt": "Mulher 18-35", "ru": "Женщина 18-35", "th": "หญิง 18-35", "vi": "Nữ 18-35" },
    "bio": {
      "en": "RIO DE JANEIRO 🇧🇷 Surf instructor & life lover 🌊", "zh": "里约热内卢 🇧🇷 冲浪教练 & 热爱生活 🌊", "de": "RIO DE JANEIRO 🇧🇷 Surflehre.", "es": "RIO DE JANEIRO 🇧🇷 Instructor de surf.", "fr": "RIO DE JANEIRO 🇧🇷 Moniteur de surf.", "hi": "रियो डी जनेरियो 🇧🇷 सर्फ इंस्ट्रक्टर।", "id": "RIO DE JANEIRO 🇧🇷 Instruktur selancar.", "it": "RIO DE JANEIRO 🇧🇷 Istruttore di surf.", "ja": "リオデジャネイロ 🇧🇷 サーフインストラクター。", "ko": "리우데자네이루 🇧🇷 서핑 강사。", "nl": "RIO DE JANEIRO 🇧🇷 Surfinstructeur。", "pt": "RIO DE JANEIRO 🇧🇷 Instrutor de surf。", "ru": "РИО-ДЕ-ЖАНЕЙРО 🇧🇷 Инструктор по серфингу。", "th": "ริโอ เด จาเนโร 🇧🇷 ครูสอนเซิร์ฟ", "vi": "RIO DE JANEIRO 🇧🇷 Huấn luyện viên lướt sóng。"
    },
    "avatar": "/avatars/generated/user_0003_br_rio_lucas/avatar.webp", "isOnline": false, "isNew": false
  },
  {
    "id": "user_0004_jp_tokyo_mina", "name": "Mina", "age": 25, "gender": "woman", "country": "japan",
    "countryDisplay": { "en": "Japan", "zh": "日本", "de": "Japan", "es": "Japón", "fr": "Japon", "hi": "जापान", "id": "Jepang", "it": "Giappone", "ja": "日本", "ko": "일본", "nl": "Japan", "pt": "Japão", "ru": "Япония", "th": "ญี่ปุ่น", "vi": "Nhật Bản" },
    "city": { "en": "Tokyo", "zh": "东京", "de": "Tokio", "es": "Tokio", "fr": "Tokyo", "hi": "टोक्यो", "id": "Tokyo", "it": "Tokyo", "ja": "東京", "ko": "도쿄", "nl": "Tokio", "pt": "Tóquio", "ru": "Токио", "th": "โตเกียว", "vi": "Tokyo" },
    "seeking": { "en": "Male 18-40", "zh": "男士 18-40岁", "de": "Mann 18-40", "es": "Hombre 18-40", "fr": "Homme 18-40", "hi": "पुरुष 18-40", "id": "Pria 18-40", "it": "Uomo 18-40", "ja": "男性 18-40歳", "ko": "남성 18-40세", "nl": "Man 18-40", "pt": "Homem 18-40", "ru": "Мужчина 18-40", "th": "ชาย 18-40", "vi": "Nam 18-40" },
    "bio": {
      "en": "Kindergarten teacher in Tokyo 📛 Love sweets! 🥞✨", "zh": "在东京做幼儿园老师📛 超爱甜点！🥞✨", "de": "Kindergärtnerin in Tokio 📛", "es": "Maestra de jardín en Tokio 📛", "fr": "Institutrice à Tokyo 📛", "hi": "टोक्यो में किंडरगार्टन शिक्षिका 📛", "id": "Guru TK di Tokyo 📛", "it": "Maestra d'asilo a Tokyo 📛", "ja": "都内で保育士やってます📛", "ko": "도쿄의 유치원 교사입니다 📛", "nl": "Kleuterleidster in Tokio 📛", "pt": "Professora de jardim em Tóquio 📛", "ru": "Воспитатель сада в Токио 📛", "th": "ครูอนุบาลในโตเกียว 📛", "vi": "Giáo viên mầm non ở Tokyo 📛"
    },
    "avatar": "/avatars/generated/user_0004_jp_tokyo_mina/avatar.webp", "isOnline": false, "isNew": false
  },
  {
    "id": "user_0006_th_bangkok_som", "name": "Som", "age": 21, "gender": "woman", "country": "thailand",
    "countryDisplay": { "en": "Thailand", "zh": "泰国", "de": "Thailand", "es": "Tailandia", "fr": "Thaïlande", "hi": "थाईलैंड", "id": "Thailand", "it": "Thailandia", "ja": "タイ", "ko": "태국", "nl": "Thailand", "pt": "Tailândia", "ru": "Таиланд", "th": "ประเทศไทย", "vi": "Thái Lan" },
    "city": { "en": "Bangkok", "zh": "曼谷", "de": "Bangkok", "es": "Bangkok", "fr": "Bangkok", "hi": "बैंकॉक", "id": "Bangkok", "it": "Bangkok", "ja": "バンコク", "ko": "방콕", "nl": "Bangkok", "pt": "Bangkok", "ru": "Бангкок", "th": "กรุงเทพฯ", "vi": "Bangkok" },
    "seeking": { "en": "Male 18-40", "zh": "男士 18-40岁", "de": "Mann 18-40", "es": "Hombre 18-40", "fr": "Homme 18-40", "hi": "पुरुष 18-40", "id": "Pria 18-40", "it": "Uomo 18-40", "ja": "男性 18-40歳", "ko": "남성 18-40세", "nl": "Man 18-40", "pt": "Homem 18-40", "ru": "Мужчина 18-40", "th": "ชาย 18-40", "vi": "Nam 18-40" },
    "bio": {
      "en": "BKK 🇹🇭 Spicy food & messy vibes ✨ cat mom 🐈", "zh": "曼谷 🇹🇭 辛辣食物 & 随性氛围 ✨ 猫妈 🐈", "de": "BKK 🇹🇭 scharfes Essen ✨", "es": "BKK 🇹🇭 comida picante ✨", "fr": "BKK 🇹🇭 nourriture épicée ✨", "hi": "BKK 🇹🇭 मसालेदार खाना ✨", "id": "BKK 🇹🇭 makanan pedas ✨", "it": "BKK 🇹🇭 cibo piccante ✨", "ja": "バンコク 🇹🇭 辛い食べ物 ✨", "ko": "방콕 🇹🇭 매운 음식 ✨", "nl": "BKK 🇹🇭 pittig eten ✨", "pt": "BKK 🇹🇭 comida picante ✨", "ru": "Бангкок 🇹🇭 острая еда ✨", "th": "กรุงเทพฯ 🇹🇭 อาหารเผ็ด ✨", "vi": "BKK 🇹🇭 đồ ăn cay ✨"
    },
    "avatar": "/avatars/generated/user_0006_th_bangkok_som/avatar.webp", "isOnline": false, "isNew": false
  },
  {
    "id": "user_0007_ng_lagos_amara", "name": "Amara", "age": 28, "gender": "woman", "country": "nigeria",
    "countryDisplay": { "en": "Nigeria", "zh": "尼日利亚", "de": "Nigeria", "es": "Nigeria", "fr": "Nigéria", "hi": "नाइजीरिया", "id": "Nigeria", "it": "Nigeria", "ja": "ナイジェリア", "ko": "나이지리아", "nl": "Nigeria", "pt": "Nigéria", "ru": "Нигерия", "th": "ไนจีเรีย", "vi": "Nigeria" },
    "city": { "en": "Lagos", "zh": "拉各斯", "de": "Lagos", "es": "Lagos", "fr": "Lagos", "hi": "लागोस", "id": "Lagos", "it": "Lagos", "ja": "ラゴス", "ko": "라고스", "nl": "Lagos", "pt": "Lagos", "ru": "Лагос", "th": "ลากอส", "vi": "Lagos" },
    "seeking": { "en": "Male 18-40", "zh": "男士 18-40岁", "de": "Mann 18-40", "es": "Hombre 18-40", "fr": "Homme 18-40", "hi": "पुरुष 18-40", "id": "Pria 18-40", "it": "Uomo 18-40", "ja": "男性 18-40歳", "ko": "남성 18-40세", "nl": "Man 18-40", "pt": "Homem 18-40", "ru": "Мужчина 18-40", "th": "ชาย 18-40", "vi": "Nam 18-40" },
    "bio": {
      "en": "Lagos living. 🇳🇬 Designing stories through fabric.", "zh": "拉各斯生活。🇳🇬 通过面料设计故事。", "de": "Leben in Lagos. 🇳🇬", "es": "Viviendo en Lagos. 🇳🇬", "fr": "La vie à Lagos. 🇳🇬", "hi": "लागोस का जीवन। 🇳🇬", "id": "Hidup di Lagos. 🇳🇬", "it": "Vita a Lagos. 🇳🇬", "ja": "ラゴス暮らし。🇳🇬", "ko": "라고스 라이프. 🇳🇬", "nl": "Leven in Lagos. 🇳🇬", "pt": "Vivendo em Lagos. 🇳🇬", "ru": "Жизнь в Лагосе. 🇳🇬", "th": "ชีวิตในลากอส 🇳🇬", "vi": "Cuộc sống Lagos. 🇳🇬"
    },
    "avatar": "/avatars/generated/user_0007_ng_lagos_amara/avatar.webp", "isOnline": false, "isNew": false
  },
  {
    "id": "user_0008_kr_seoul_jioon", "name": "Ji-oon", "age": 29, "gender": "man", "country": "south-korea",
    "countryDisplay": { "en": "South Korea", "zh": "韩国", "de": "Südkorea", "es": "Corea del Sur", "fr": "Corée du Sud", "hi": "दक्षिण कोरिया", "id": "Korea Selatan", "it": "Corea del Sud", "ja": "韓国", "ko": "대한민국", "nl": "Zuid-Korea", "pt": "Coreia do Sul", "ru": "Южная Корея", "th": "เกาหลีใต้", "vi": "Hàn Quốc" },
    "city": { "en": "Seoul", "zh": "首尔", "de": "Seoul", "es": "Seúl", "fr": "Séoul", "hi": "सियोल", "id": "Seoul", "it": "Seul", "ja": "ソウル", "ko": "서울", "nl": "Seoul", "pt": "Seul", "ru": "Сеул", "th": "โซล", "vi": "Seoul" },
    "seeking": { "en": "Female 18-35", "zh": "女士 18-35岁", "de": "Frau 18-35", "es": "Mujer 18-35", "fr": "Femme 18-35", "hi": "महिला 18-35", "id": "Wanita 18-35", "it": "Donna 18-35", "ja": "女性 18-35歳", "ko": "여성 18-35세", "nl": "Vrouw 18-35", "pt": "Mulher 18-35", "ru": "Женщина 18-35", "th": "หญิง 18-35", "vi": "Nữ 18-35" },
    "bio": {
      "en": "Seoul night walker. 🇰🇷 Working late, again.", "zh": "首尔夜行者。🇰🇷 又要加班了。", "de": "Seoul Nachtschwärmer. 🇰🇷", "es": "Caminante nocturno de Seúl. 🇰🇷", "fr": "Promeneur nocturne de Séoul. 🇰🇷", "hi": "सियोल नाइट वॉकर। 🇰🇷", "id": "Pejalan malam Seoul. 🇰🇷", "it": "Camminatore notturno di Seul. 🇰🇷", "ja": "ソウルのナイトウォーカー。🇰🇷", "ko": "서울의 밤 산책자. 🇰🇷", "nl": "Nachtwandelaar in Seoul. 🇰🇷", "pt": "Caminhante noturno de Seul. 🇰🇷", "ru": "Ночной гуляка Сеула. 🇰🇷", "th": "คนเดินกลางคืนในโซล 🇰🇷", "vi": "Người đi bộ đêm Seoul. 🇰🇷"
    },
    "avatar": "/avatars/generated/user_0008_kr_seoul_jioon/avatar.webp", "isOnline": false, "isNew": false
  },
  {
    "id": "user_0009_fr_paris_elara", "name": "Elara", "age": 27, "gender": "woman", "country": "france",
    "countryDisplay": { "en": "France", "zh": "法国", "de": "Frankreich", "es": "Francia", "fr": "France", "hi": "फ्रांस", "id": "Prancis", "it": "Francia", "ja": "フランス", "ko": "프랑스", "nl": "Frankrijk", "pt": "França", "ru": "Франция", "th": "ฝรั่งเศส", "vi": "Pháp" },
    "city": { "en": "Paris", "zh": "巴黎", "de": "Paris", "es": "París", "fr": "Paris", "hi": "पेरिस", "id": "Paris", "it": "Parigi", "ja": "パリ", "ko": "파리", "nl": "Parijs", "pt": "Paris", "ru": "Париж", "th": "ปารีส", "vi": "Paris" },
    "seeking": { "en": "Male 18-40", "zh": "男士 18-40岁", "de": "Mann 18-40", "es": "Hombre 18-40", "fr": "Homme 18-40", "hi": "पुरुष 18-40", "id": "Pria 18-40", "it": "Uomo 18-40", "ja": "男性 18-40歳", "ko": "남성 18-40세", "nl": "Man 18-40", "pt": "Homem 18-40", "ru": "Мужчина 18-40", "th": "ชาย 18-40", "vi": "Nam 18-40" },
    "bio": {
      "en": "Art is a way of survival. 🎨 Paris based. Wine.", "zh": "艺术是生存的一种方式。🎨 居于巴黎。红酒。", "de": "Kunst ist eine Art zu überleben. 🎨", "es": "El arte es una forma de supervivencia. 🎨", "fr": "L'art est un moyen de survie. 🎨", "hi": "कला जीवित रहने का एक तरीका है। 🎨", "id": "Seni adalah cara bertahan hidup. 🎨", "it": "L'arte è un modo per sopravvivere. 🎨", "ja": "アートは生き残るための手段。🎨", "ko": "예술은 생존의 방식이다. 🎨", "nl": "Kunst is een manier om te overleven. 🎨", "pt": "A arte é uma forma de sobrevivência. 🎨", "ru": "Искусство — это способ выживания. 🎨", "th": "ศิลปะคือหนทางแห่งการอยู่รอด 🎨", "vi": "Nghệ thuật là một cách sinh tồn. 🎨"
    },
    "avatar": "/avatars/generated/user_0009_fr_paris_elara/avatar.webp", "isOnline": false, "isNew": false
  }
];

const defaultProfileDetail: UserProfileDetail = {
  id: 'default',
  headline: { en: 'Dating profile', zh: '个人资料', de: 'Profil', es: 'Perfil', fr: 'Profil', hi: 'प्रोफाइल', id: 'Profil', it: 'Profilo', ja: 'プロフィール', ko: '프로필', nl: 'Profiel', pt: 'Perfil', ru: 'Профиль', th: 'โปรไฟล์', vi: 'Hồ sơ' },
  about: { en: 'Intro', zh: '个人简介', de: 'Intro', es: 'Intro', fr: 'Intro', hi: 'परिचय', id: 'Intro', it: 'Intro', ja: '紹介', ko: '소개', nl: 'Intro', pt: 'Intro', ru: 'О себе', th: 'แนะนำ', vi: 'Giới thiệu' },
  traits: [ { en: 'Warm', zh: '温暖', de: 'Warm', es: 'Cálida', fr: 'Chaleureuse', hi: 'गर्म', id: 'Hangat', it: 'Calorosa', ja: '温厚', ko: '따뜻함', nl: 'Warm', pt: 'Calorosa', ru: 'Теплая', th: 'อบอุ่น', vi: 'Ấm áp' } ],
  interests: [], languages: [], occupation: { en: 'Not Specified', zh: '未指定', de: 'N/A', es: 'N/A', fr: 'N/A', hi: 'N/A', id: 'N/A', it: 'N/A', ja: '未指定', ko: '미지정', nl: 'N/A', pt: 'N/A', ru: 'N/A', th: 'N/A', vi: 'N/A' },
  communicationStyle: { en: 'Casual', zh: '随性', de: 'Locker', es: 'Casual', fr: 'Décontracté', hi: 'अनौपचारिक', id: 'Santai', it: 'Casuale', ja: 'カジュアル', ko: '편안함', nl: 'Casual', pt: 'Casual', ru: 'Повседневный', th: 'สบายๆ', vi: 'Thoải mái' },
  facts: [], stats: [], highlights: [], feed: []
};

const profileDetailOverrides: Record<string, Partial<UserProfileDetail>> = {
  "user_0001_us_ny_emma": {
    "headline": { en: "@em_visuals", zh: "@em_visuals", de: "@em_visuals", es: "@em_visuals", fr: "@em_visuals", hi: "@em_visuals", id: "@em_visuals", it: "@em_visuals", ja: "@em_visuals", ko: "@em_visuals", nl: "@em_visuals", pt: "@em_visuals", ru: "@em_visuals", th: "@em_visuals", vi: "@em_visuals" },
    "feed": [
      {
        "id": "user_0001_moment-1", "tone": "sunrise",
        "title": { en: "Gallery Night", zh: "画廊之夜", de: "Galerienacht", es: "Noche de galería", fr: "Soirée galerie", hi: "गैलरी नाइट", id: "Malam Galeri", it: "Notte in galleria", ja: "ギャラリーナイト", ko: "갤러리 나이트", nl: "Galerienacht", pt: "Noite na galeria", ru: "Ночь в галерее", th: "คืนแห่งแกลเลอรี", vi: "Đêm triển lãm" },
        "caption": { en: "Opening night was a blur. 🍷", zh: "开幕之夜恍如隔世。🍷", de: "Die Eröffnungsnacht war berauschend. 🍷", es: "La noche de apertura fue un torbellino. 🍷", fr: "La soirée d'ouverture était magique. 🍷", hi: "ओपनिंग नाइट धुंधली थी। 🍷", id: "Malam pembukaan yang luar biasa. 🍷", it: "La serata di apertura è stata un turbine. 🍷", ja: "オープニングナイトはあっという間でした。🍷", ko: "오프닝 나이트는 정말 순식간이었어요. 🍷", nl: "De openingsnacht was een roes. 🍷", pt: "A noite de abertura foi intensa. 🍷", ru: "Ночь открытия пролетела незаметно. 🍷", th: "คืนเปิดตัวงานช่างน่าประทับใจ 🍷", vi: "Đêm khai mạc thật choáng ngợp. 🍷" },
        "timestamp": "2026-02-05T22:05:09.589Z", "image": "/avatars/generated/user_0001_us_ny_emma/post-1.webp", "likes": 160, "comments": 18, "type": "photo"
      },
      {
        "id": "user_0001_moment-2", "tone": "ocean",
        "title": { en: "Morning Bagel", zh: "早上的贝果", de: "Morgen Bagel", es: "Bagel matutino", fr: "Bagel du matin", hi: "सुबह का बैगल", id: "Bagel Pagi", it: "Bagel del mattino", ja: "朝のベーグル", ko: "모닝 베이글", nl: "Ochtend bagel", pt: "Bagel matinal", ru: "Утренний бейгл", th: "เบเกิลยามเช้า", vi: "Bánh Bagel buổi sáng" },
        "caption": { en: "Survival kit for Sunday. 🥯☕️", zh: "周日的生存装备。🥯☕️", de: "Überlebenskit für Sonntag. 🥯☕️", es: "Kit de supervivencia para el domingo. 🥯☕️", fr: "Kit de survie pour dimanche. 🥯☕️", hi: "रविवार के लिए सर्वाइवल किट। 🥯☕️", id: "Kit bertahan hidup untuk hari Minggu. 🥯☕️", it: "Kit di sopravvivenza per domenica. 🥯☕️", ja: "日曜日の必需品。🥯☕️", ko: "일요일의 필수 아이템. 🥯☕️", nl: "Overlevingskit voor zondag. 🥯☕️", pt: "Kit de sobrevivência para domingo. 🥯☕️", ru: "Набор для выживания в воскресенье. 🥯☕️", th: "ชุดยังชีพสำหรับวันอาทิตย์ 🥯☕️", vi: "Bộ dụng cụ sinh tồn cho Chủ nhật. 🥯☕️" },
        "timestamp": "2026-02-08T07:10:06.729Z", "image": "/avatars/generated/user_0001_us_ny_emma/post-2.webp", "likes": 203, "comments": 27, "type": "photo"
      }
    ]
  },
  "user_0002_jp_tokyo_haru": {
    "headline": { en: "@haru_film_", zh: "@haru_film_", de: "@haru_film_", es: "@haru_film_", fr: "@haru_film_", hi: "@haru_film_", id: "@haru_film_", it: "@haru_film_", ja: "@haru_film_", ko: "@haru_film_", nl: "@haru_film_", pt: "@haru_film_", ru: "@haru_film_", th: "@haru_film_", vi: "@haru_film_" },
    "feed": [
      {
        "id": "user_0002_moment-1", "tone": "ocean",
        "title": { en: "Vinyl Digging", zh: "淘黑胶", de: "Vinyl-Suche", es: "Buscando vinilos", fr: "Chasse aux vinyles", hi: "विनाइल डिगिंग", id: "Berburu Vinyl", it: "Ricerca di vinili", ja: "レコード探し", ko: "바이닐 디깅", nl: "Vinyl zoeken", pt: "Garimpando vinis", ru: "Поиск винила", th: "ตามหาแผ่นเสียง", vi: "Săn đĩa than" },
        "caption": { en: "Found a gem in Shimokitazawa. 🎧", zh: "在下北泽淘到了宝贝。🎧", de: "Ein Juwel in Shimokitazawa gefunden. 🎧", es: "Encontré una joya en Shimokitazawa. 🎧", fr: "J'ai trouvé une pépite à Shimokitazawa. 🎧", hi: "Shimokitazawa में एक रत्न मिला। 🎧", id: "Menemukan permata di Shimokitazawa. 🎧", it: "Trovata una gemma a Shimokitazawa. 🎧", ja: "下北沢でいいの見つけた。🎧", ko: "시모키타자와에서 보물을 발견했어요. 🎧", nl: "Een pareltje gevonden in Shimokitazawa. 🎧", pt: "Encontrei uma raridade em Shimokitazawa. 🎧", ru: "Нашел сокровище в Симокитадзаве. 🎧", th: "เจอของดีที่ชิโมคิตะซาวะ 🎧", vi: "Tìm thấy một báu vật ở Shimokitazawa. 🎧" },
        "timestamp": "2026-02-04T02:34:35.480Z", "image": "/avatars/generated/user_0002_jp_tokyo_haru/post-1.webp", "likes": 160, "comments": 18, "type": "photo"
      },
      {
        "id": "user_0002_moment-2", "tone": "sunrise",
        "title": { en: "Late Night Ramen", zh: "深夜拉面", de: "Spätnachts Ramen", es: "Ramen nocturno", fr: "Ramen de minuit", hi: "देर रात रामेन", id: "Ramen Tengah Malam", it: "Ramen a tarda notte", ja: "深夜ラーメン", ko: "심야 라멘", nl: "Laat op de avond ramen", pt: "Ramen tarde da noite", ru: "Ночной рамен", th: "ราเมงรอบดึก", vi: "Mì Ramen đêm khuya" },
        "caption": { en: "Best way to end the day. 🍜", zh: "结束一天的最好方式。🍜", de: "Beste Art, den Tag zu beenden. 🍜", es: "La mejor manera de terminar el día. 🍜", fr: "Meilleure façon de finir la journée. 🍜", hi: "दिन खत्म करने का सबसे अच्छा तरीका। 🍜", id: "Cara terbaik untuk mengakhiri hari. 🍜", it: "Il modo migliore per concludere la giornata. 🍜", ja: "一日の終わりに最高の一杯。🍜", ko: "하루를 마무리하는 최고의 방법. 🍜", nl: "Beste manier om de dag af te sluiten. 🍜", pt: "Melhor maneira de terminar o dia. 🍜", ru: "Лучший способ завершить день. 🍜", th: "วิธีจบวันที่ดีที่สุด 🍜", vi: "Cách tốt nhất để kết thúc một ngày. 🍜" },
        "timestamp": "2026-02-05T10:33:38.977Z", "image": "/avatars/generated/user_0002_jp_tokyo_haru/post-2.webp", "likes": 203, "comments": 27, "type": "photo"
      }
    ]
  },
  "user_0003_br_rio_lucas": {
    "headline": { en: "@lucas_rio_vibes", zh: "@lucas_rio_vibes", de: "@lucas_rio_vibes", es: "@lucas_rio_vibes", fr: "@lucas_rio_vibes", hi: "@lucas_rio_vibes", id: "@lucas_rio_vibes", it: "@lucas_rio_vibes", ja: "@lucas_rio_vibes", ko: "@lucas_rio_vibes", nl: "@lucas_rio_vibes", pt: "@lucas_rio_vibes", ru: "@lucas_rio_vibes", th: "@lucas_rio_vibes", vi: "@lucas_rio_vibes" },
    "feed": [
      {
        "id": "user_0003_moment-1", "tone": "sunrise",
        "title": { en: "Post Surf Glow", zh: "冲浪后的光芒", de: "Surf-Glow", es: "Brillo post surf", fr: "Éclat après surf", hi: "सर्फिंग के बाद की चमक", id: "Cahaya Setelah Berselancar", it: "Splendore post surf", ja: "サーフィン後の爽快感", ko: "서핑 후의 상쾌함", nl: "Surf-glow", pt: "Brilho pós-surf", ru: "Сияние после серфинга", th: "ความสุขหลังเล่นเซิร์ฟ", vi: "Rạng rỡ sau khi lướt sóng" },
        "caption": { en: "Morning motivation. 🤙☀️", zh: "早上的动力。🤙☀️", de: "Morgendliche Motivation. 🤙☀️", es: "Motivación mañanera. 🤙☀️", fr: "Motivation matinale. 🤙☀️", hi: "सुबह की प्रेरणा। 🤙☀️", id: "Motivasi pagi. 🤙☀️", it: "Motivazione mattutina. 🤙☀️", ja: "朝のモチベーション。🤙☀️", ko: "아침의 동기부여. 🤙☀️", nl: "Ochtendmotivatie. 🤙☀️", pt: "Motivação matinal. 🤙☀️", ru: "Утренняя мотивация. 🤙☀️", th: "แรงบันดาลใจยามเช้า 🤙☀️", vi: "Động lực buổi sáng. 🤙☀️" },
        "timestamp": "2026-02-06T04:30:50.176Z", "image": "/avatars/generated/user_0003_br_rio_lucas/post-1.webp", "likes": 160, "comments": 18, "type": "photo"
      },
      {
        "id": "user_0003_moment-2", "tone": "ocean",
        "title": { en: "Sunset Volleyball", zh: "日落排球", de: "Sonnenuntergang Volleyball", es: "Voleibol al atardecer", fr: "Volley au coucher du soleil", hi: "सूर्यास्त वॉलीबॉल", id: "Voli Saat Matahari Terbenam", it: "Pallavolo al tramonto", ja: "夕暮れのバレーボール", ko: "선셋 배구", nl: "Zonsondergang volleybal", pt: "Vôlei ao pôr do sol", ru: "Волейбол на закате", th: "วอลเลย์บอลยามพระอาทิตย์ตก", vi: "Bóng chuyền hoàng hôn" },
        "caption": { en: "Classic Ipanema sunset. 🏐🌅", zh: "经典的伊帕内玛日落。🏐🌅", de: "Klassischer Ipanema Sonnenuntergang. 🏐🌅", es: "Clásico atardecer en Ipanema. 🏐🌅", fr: "Coucher de soleil classique à Ipanema. 🏐🌅", hi: "क्लासिक इपेनेमा सूर्यास्त। 🏐🌅", id: "Matahari terbenam klasik Ipanema. 🏐🌅", it: "Classico tramonto a Ipanema. 🏐🌅", ja: "イパネマの美しい夕日。🏐🌅", ko: "클래식한 이파네마 일몰. 🏐🌅", nl: "Klassieke Ipanema zonsondergang. 🏐🌅", pt: "Pôr do sol clássico em Ipanema. 🏐🌅", ru: "Классический закат в Ипанеме. 🏐🌅", th: "พระอาทิตย์ตกที่อิปาเนมา 🏐🌅", vi: "Hoàng hôn Ipanema cổ điển. 🏐🌅" },
        "timestamp": "2026-02-05T07:48:26.056Z", "image": "/avatars/generated/user_0003_br_rio_lucas/post-2.webp", "likes": 203, "comments": 27, "type": "photo"
      }
    ]
  },
  "user_0004_jp_tokyo_mina": {
    "headline": { en: "@mina_cake_life", zh: "@mina_cake_life", de: "@mina_cake_life", es: "@mina_cake_life", fr: "@mina_cake_life", hi: "@mina_cake_life", id: "@mina_cake_life", it: "@mina_cake_life", ja: "@mina_cake_life", ko: "@mina_cake_life", nl: "@mina_cake_life", pt: "@mina_cake_life", ru: "@mina_cake_life", th: "@mina_cake_life", vi: "@mina_cake_life" },
    "feed": [
      {
        "id": "user_0004_moment-1", "tone": "sunrise",
        "title": { en: "Weekend Cafe", zh: "周末探店", de: "Wochenend-Café", es: "Café de fin de semana", fr: "Café du week-end", hi: "वीकेंड कैफे", id: "Kafe Akhir Pekan", it: "Caffè del weekend", ja: "週末カフェ", ko: "주말 카페", nl: "Weekendcafé", pt: "Café de fim de semana", ru: "Кафе на выходных", th: "คาเฟ่วันหยุด", vi: "Quán cà phê cuối tuần" },
        "caption": { en: "Best pancakes in town! 🥞✨", zh: "城里最好的松饼！🥞✨", de: "Die besten Pfannkuchen der Stadt! 🥞✨", es: "¡Los mejores panqueques de la ciudad! 🥞✨", fr: "Les meilleurs pancakes de la ville ! 🥞✨", hi: "शहर के सबसे अच्छे पैनकेक! 🥞✨", id: "Pancake terbaik di kota! 🥞✨", it: "I migliori pancake in città! 🥞✨", ja: "街で一番のパンケーキ！🥞✨", ko: "우리 동네 최고의 팬케이크! 🥞✨", nl: "Beste pannenkoeken van de stad! 🥞✨", pt: "As melhores panquecas da cidade! 🥞✨", ru: "Лучшие блинчики в городе! 🥞✨", th: "แพนเค้กที่อร่อยที่สุดในเมือง! 🥞✨", vi: "Bánh kếp ngon nhất thành phố! 🥞✨" },
        "timestamp": "2026-02-04T20:53:16.641Z", "image": "/avatars/generated/user_0004_jp_tokyo_mina/post-1.webp", "likes": 160, "comments": 18, "type": "photo"
      },
      {
        "id": "user_0004_moment-2", "tone": "ocean",
        "title": { en: "After Work Sweet", zh: "下班后的甜点", de: "Nach der Arbeit Süßes", es: "Dulce después del trabajo", fr: "Douceur après le travail", hi: "काम के बाद मीठा", id: "Camilan Manis Setelah Kerja", it: "Dolce dopo il lavoro", ja: "仕事終わりの甘いもの", ko: "퇴근 후 달콤한 시간", nl: "Zoetigheid na het werk", pt: "Doce pós-trabalho", ru: "Сладкое после работы", th: "ของหวานหลังเลิกงาน", vi: "Đồ ngọt sau giờ làm" },
        "caption": { en: "Well deserved treat. 🍦", zh: "当之无愧的奖励。🍦", de: "Wohlverdiente Belohnung. 🍦", es: "Un regalo bien merecido. 🍦", fr: "Petit plaisir bien mérité. 🍦", hi: "अच्छी तरह से योग्य इनाम। 🍦", id: "Hadiah yang pantas didapat. 🍦", it: "Premio meritato. 🍦", ja: "一日頑張った自分へのご褒美。🍦", ko: "고생한 나를 위한 보상. 🍦", nl: "Welverdiende traktatie. 🍦", pt: "Mimo bem merecido. 🍦", ru: "Заслуженная награда. 🍦", th: "รางวัลสำหรับตัวเอง 🍦", vi: "Phần thưởng xứng đáng. 🍦" },
        "timestamp": "2026-02-08T00:51:50.448Z", "image": "/avatars/generated/user_0004_jp_tokyo_mina/post-2.webp", "likes": 203, "comments": 27, "type": "photo"
      }
    ]
  },
  "user_0006_th_bangkok_som": {
    "headline": { en: "@som_spicy", zh: "@som_spicy", de: "@som_spicy", es: "@som_spicy", fr: "@som_spicy", hi: "@som_spicy", id: "@som_spicy", it: "@som_spicy", ja: "@som_spicy", ko: "@som_spicy", nl: "@som_spicy", pt: "@som_spicy", ru: "@som_spicy", th: "@som_spicy", vi: "@som_spicy" },
    "feed": [
      {
        "id": "user_0006_moment-1", "tone": "sunrise",
        "title": { en: "Street Cat", zh: "街头小猫", de: "Straßenkatze", es: "Gato callejero", fr: "Chat de rue", hi: "स्ट्रीट कैट", id: "Kucing Jalanan", it: "Gatto di strada", ja: "街の猫", ko: "길고양이", nl: "Straatkat", pt: "Gato de rua", ru: "Уличный кот", th: "แมวจร", vi: "Mèo hoang" },
        "caption": { en: "Found a new friend today. 🥺🐈", zh: "今天交到了新朋友。🥺🐈", de: "Heute einen neuen Freund gefunden. 🥺🐈", es: "Encontré un nuevo amigo hoy. 🥺🐈", fr: "J'ai trouvé un nouvel ami aujourd'hui. 🥺🐈", hi: "आज एक नया दोस्त मिला। 🥺🐈", id: "Menemukan teman baru hari ini. 🥺🐈", it: "Trovato un nuovo amico oggi. 🥺🐈", ja: "今日新しい友達ができました。🥺🐈", ko: "오늘 새로운 친구를 사귀었어요. 🥺🐈", nl: "Vandaag een nieuw vriendje gevonden. 🥺🐈", pt: "Encontrei um novo amigo hoje. 🥺🐈", ru: "Нашла сегодня нового друга. 🥺🐈", th: "วันนี้เจอเพื่อนใหม่ด้วยนะ 🥺🐈", vi: "Tìm thấy một người bạn mới hôm nay. 🥺🐈" },
        "timestamp": "2026-02-04T16:44:07.351Z", "image": "/avatars/generated/user_0006_th_bangkok_som/post-1.webp", "likes": 160, "comments": 18, "type": "photo"
      },
      {
        "id": "user_0006_moment-2", "tone": "ocean",
        "title": { en: "Pad Kra Pao", zh: "打抛猪", de: "Pad Kra Pao", es: "Pad Kra Pao", fr: "Pad Kra Pao", hi: "पड क्रा पाओ", id: "Pad Kra Pao", it: "Pad Kra Pao", ja: "ガパオライス", ko: "팟카프라오", nl: "Pad Kra Pao", pt: "Pad Kra Pao", ru: "Пад Кра Пао", th: "ผัดกะเพรา", vi: "Pad Kra Pao" },
        "caption": { en: "Spicy level: Death. 🌶️🌶️🌶️", zh: "辛辣等级：地狱。🌶️🌶️🌶️", de: "Schärfegrad: Tödlich. 🌶️🌶️🌶️", es: "Nivel de picante: Muerte. 🌶️🌶️🌶️", fr: "Niveau de piment : Mortel. 🌶️🌶️🌶️", hi: "मसालेदार स्तर: मृत्यु। 🌶️🌶️🌶️", id: "Tingkat pedas: Mati. 🌶️🌶️🌶️", it: "Livello piccante: Mortale. 🌶️🌶️🌶️", ja: "辛さレベル：デス。🌶️🌶️🌶️", ko: "맵기 강도: 지옥. 🌶️🌶️🌶️", nl: "Pittig niveau: Dodelijk. 🌶️🌶️🌶️", pt: "Nível de pimenta: Mortal. 🌶️🌶️🌶️", ru: "Уровень остроты: Смертельный. 🌶️🌶️🌶️", th: "ระดับความเผ็ด: ตายไปเลย 🌶️🌶️🌶️", vi: "Mức độ cay: Hủy diệt. 🌶️🌶️🌶️" },
        "timestamp": "2026-02-06T07:48:50.941Z", "image": "/avatars/generated/user_0006_th_bangkok_som/post-2.webp", "likes": 203, "comments": 27, "type": "photo"
      }
    ]
  },
  "user_0007_ng_lagos_amara": {
    "headline": { en: "@amara_threads", zh: "@amara_threads", de: "@amara_threads", es: "@amara_threads", fr: "@amara_threads", hi: "@amara_threads", id: "@amara_threads", it: "@amara_threads", ja: "@amara_threads", ko: "@amara_threads", nl: "@amara_threads", pt: "@amara_threads", ru: "@amara_threads", th: "@amara_threads", vi: "@amara_threads" },
    "feed": [
      {
        "id": "user_0007_moment-1", "tone": "sunrise",
        "title": { en: "Studio Details", zh: "工作室细节", de: "Studio-Details", es: "Detalles del estudio", fr: "Détails du studio", hi: "स्टूडियो विवरण", id: "Detail Studio", it: "Dettagli dello studio", ja: "スタジオの様子", ko: "스튜디오 디테일", nl: "Studiodetails", pt: "Detalhes do estúdio", ru: "Детали студии", th: "บรรยากาศในสตูดิโอ", vi: "Chi tiết tại xưởng" },
        "caption": { en: "Texture talk. 🧵 Organic linen is everything.", zh: "面料对话。🧵 有机亚麻是一切。", de: "Struktur-Talk. 🧵 Bio-Leinen ist alles.", es: "Hablemos de texturas. 🧵 El lino orgánico lo es todo.", fr: "Parlons textures. 🧵 Le lin bio, c'est la vie.", hi: "टेक्सचर टॉक। 🧵 ऑर्गेनिक लिनन ही सब कुछ है।", id: "Bicara tekstur. 🧵 Linen organik adalah segalanya.", it: "Parliamo di tessuti. 🧵 Il lino organico è tutto.", ja: "テクスチャーへのこだわり。🧵 オーガニックリネンが最高。", ko: "텍스처 이야기. 🧵 오가닉 린넨이 최고예요.", nl: "Textuur-talk. 🧵 Biologisch linnen is alles.", pt: "Falando de texturas. 🧵 Linho orgânico é tudo.", ru: "О текстурах. 🧵 Органический лен — это всё.", th: "คุยเรื่องเนื้อผ้า 🧵 ผ้าลินินออร์แกนิกคือที่สุด", vi: "Chuyện về chất liệu. 🧵 Vải lanh hữu cơ là tuyệt nhất." },
        "timestamp": "2026-02-08T07:04:07.854Z", "image": "/avatars/generated/user_0007_ng_lagos_amara/post-1.webp", "likes": 160, "comments": 18, "type": "photo"
      }
    ]
  },
  "user_0008_kr_seoul_jioon": {
    "headline": { en: "@ji_oon_seoul", zh: "@ji_oon_seoul", de: "@ji_oon_seoul", es: "@ji_oon_seoul", fr: "@ji_oon_seoul", hi: "@ji_oon_seoul", id: "@ji_oon_seoul", it: "@ji_oon_seoul", ja: "@ji_oon_seoul", ko: "@ji_oon_seoul", nl: "@ji_oon_seoul", pt: "@ji_oon_seoul", ru: "@ji_oon_seoul", th: "@ji_oon_seoul", vi: "@ji_oon_seoul" },
    "feed": [
      {
        "id": "user_0008_moment-1", "tone": "sunrise",
        "title": { en: "Convenience Store Zen", zh: "便利店禅意", de: "Convenience Store Zen", es: "Zen de tienda de conveniencia", fr: "Zen au supermarché", hi: "सुविधा स्टोर ज़ेन", id: "Ketenangan di Toko Kelontong", it: "Zen da minimarket", ja: "コンビニの静寂", ko: "편의점의 고요함", nl: "Gemakswinkel Zen", pt: "Zen de loja de conveniência", ru: "Дзен в магазине", th: "ความสงบในร้านสะดวกซื้อ", vi: "Sự tĩnh lặng tại cửa hàng tiện lợi" },
        "caption": { en: "My favorite color at 1 AM. 🧊☕️", zh: "凌晨1点我最喜欢的颜色。🧊☕️", de: "Meine Lieblingsfarbe um 1 Uhr morgens. 🧊☕️", es: "Mi color favorito a la 1 AM. 🧊☕️", fr: "Ma couleur préférée à 1h du matin. 🧊☕️", hi: "रात 1 बजे मेरा पसंदीदा रंग। 🧊☕️", id: "Warna favoritku jam 1 pagi. 🧊☕️", it: "Il mio colore preferito all'una di notte. 🧊☕️", ja: "深夜1時のお気に入りの景色。🧊☕️", ko: "새벽 1시, 내가 가장 좋아하는 색. 🧊☕️", nl: "Mijn favoriete kleur om 1 uur 's nachts. 🧊☕️", pt: "Minha cor favorita à 1h da manhã. 🧊☕️", ru: "Мой любимый цвет в час ночи. 🧊☕️", th: "สีโปรดตอนตี 1 🧊☕️", vi: "Màu sắc yêu thích của tôi lúc 1 giờ sáng. 🧊☕️" },
        "timestamp": "2026-02-04T04:51:43.621Z", "image": "/avatars/generated/user_0008_kr_seoul_jioon/post-1.webp", "likes": 160, "comments": 18, "type": "photo"
      },
      {
        "id": "user_0008_moment-2", "tone": "ocean",
        "title": { en: "Last Train Home", zh: "末班车", de: "Letzter Zug nach Hause", es: "Último tren a casa", fr: "Dernier train", hi: "घर के लिए आखिरी ट्रेन", id: "Kereta Terakhir Pulang", it: "L'ultimo treno per casa", ja: "終電の風景", ko: "집으로 가는 마지막 열차", nl: "Laatste trein naar huis", pt: "Último trem para casa", ru: "Последний поезд домой", th: "รถไฟเที่ยวสุดท้าย", vi: "Chuyến tàu cuối cùng về nhà" },
        "caption": { en: "00:42. Finally quiet. 🚄", zh: "00:42。终于清静了。🚄", de: "00:42. Endlich ruhig. 🚄", es: "00:42. Finalmente tranquilo. 🚄", fr: "00:42. Enfin le calme. 🚄", hi: "00:42. आखिरकार शांति। 🚄", id: "00:42. Akhirnya tenang. 🚄", it: "00:42. Finalmente silenzio. 🚄", ja: "00:42。ようやく静かになった。🚄", ko: "00:42. 드디어 조용해졌네요. 🚄", nl: "00:42. Eindelijk stil. 🚄", pt: "00:42. Finalmente quieto. 🚄", ru: "00:42. Наконец-то тишина. 🚄", th: "00:42. ในที่สุดก็เงียบสงบ 🚄", vi: "00:42. Cuối cùng cũng yên tĩnh. 🚄" },
        "timestamp": "2026-02-07T08:33:01.613Z", "image": "/avatars/generated/user_0008_kr_seoul_jioon/post-2.webp", "likes": 203, "comments": 27, "type": "photo"
      }
    ]
  },
  "user_0009_fr_paris_elara": {
    "headline": { en: "@elara_paints", zh: "@elara_paints", de: "@elara_paints", es: "@elara_paints", fr: "@elara_paints", hi: "@elara_paints", id: "@elara_paints", it: "@elara_paints", ja: "@elara_paints", ko: "@elara_paints", nl: "@elara_paints", pt: "@elara_paints", ru: "@elara_paints", th: "@elara_paints", vi: "@elara_paints" },
    "feed": [
      {
        "id": "user_0009_moment-1", "tone": "sunrise",
        "title": { en: "Studio Mess", zh: "工作室的乱", de: "Studio-Chaos", es: "Desorden del estudio", fr: "Désordre créatif", hi: "स्टूडियो मेस", id: "Kekacauan Studio", it: "Disordine in studio", ja: "アトリエの風景", ko: "스튜디오의 혼돈", nl: "Studio-chaos", pt: "Desordem no estúdio", ru: "Хаос в студии", th: "ความวุ่นวายในสตูดิโอ", vi: "Sự lộn xộn tại xưởng" },
        "caption": { en: "My favorite kind of mess. 🎨✨", zh: "我最喜欢的一片狼藉。🎨✨", de: "Mein liebstes Chaos. 🎨✨", es: "Mi tipo favorito de desorden. 🎨✨", fr: "Mon désordre préféré. 🎨✨", hi: "मेरा पसंदीदा मेस। 🎨✨", id: "Kekacauan favoritku. 🎨✨", it: "Il mio disordine preferito. 🎨✨", ja: "この空間が一番落ち着く。🎨✨", ko: "내가 가장 좋아하는 공간. 🎨✨", nl: "Mijn favoriete soort chaos. 🎨✨", pt: "Meu tipo favorito de bagunça. 🎨✨", ru: "Мой любимый беспорядок. 🎨✨", th: "มุมโปรดที่แสนวุ่นวาย 🎨✨", vi: "Góc nhỏ lộn xộn yêu thích của tôi. 🎨✨" },
        "timestamp": "2026-02-08T03:42:51.307Z", "image": "/avatars/generated/user_0009_fr_paris_elara/post-1.webp", "likes": 160, "comments": 18, "type": "photo"
      },
      {
        "id": "user_0009_moment-2", "tone": "ocean",
        "title": { en: "Sunday by the Seine", zh: "塞纳河畔的周日", de: "Sonntag an der Seine", es: "Domingo junto al Sena", fr: "Dimanche au bord de la Seine", hi: "सीन के किनारे रविवार", id: "Minggu di Tepi Sungai Seine", it: "Domenica sulla Senna", ja: "セーヌ河畔の日曜日", ko: "센 강변의 일요일", nl: "Zondag aan de Seine", pt: "Domingo no Sena", ru: "Воскресенье у Сены", th: "วันอาทิตย์ริมแม่น้ำแซน", vi: "Chủ nhật bên bờ sông Seine" },
        "caption": { en: "The simple things. 🍷🥖", zh: "简单的小事。🍷🥖", de: "Die einfachen Dinge. 🍷🥖", es: "Las cosas sencillas. 🍷🥖", fr: "Les choses simples. 🍷🥖", hi: "साधारण चीजें। 🍷🥖", id: "Hal-hal sederhana. 🍷🥖", it: "Le cose semplici. 🍷🥖", ja: "シンプルな幸せ。🍷🥖", ko: "단순한 행복. 🍷🥖", nl: "De simpele dingen. 🍷🥖", pt: "As coisas simples. 🍷🥖", ru: "Простые радости. 🍷🥖", th: "ความสุขธรรมดา 🍷🥖", vi: "Những điều đơn giản. 🍷🥖" },
        "timestamp": "2026-02-08T05:30:35.583Z", "image": "/avatars/generated/user_0009_fr_paris_elara/post-2.webp", "likes": 203, "comments": 27, "type": "photo"
      }
    ]
  }
};

export const getCountries = (): string[] => { return Array.from(new Set(profiles.map(p => p.country))); };

export const getProfileDetailView = (profile: UserProfile, locale: keyof LocalizedText): UserProfileDetailView => {
  const overrides = profileDetailOverrides[profile.id] || {};
  const getLoc = (obj: any): string => { if (!obj) return ''; if (typeof obj === 'string') return obj; return obj[locale] || obj['en'] || ''; };
  const mapLocArray = (arr?: any[]): string[] => { if (!arr) return []; return arr.map(item => getLoc(item)); };
  const mapFacts = (facts?: ProfileFact[]): Array<{label: string, value: string}> => { if (!facts) return []; return facts.map(f => ({ label: getLoc(f.label), value: getLoc(f.value) })); };
  const mapStats = (stats?: ProfileStat[]): Array<{label: string, value: string}> => { if (!stats) return []; return stats.map(s => ({ label: getLoc(s.label), value: s.value })); };
  const mapFeed = (feed?: ProfileFeedItem[]): UserProfileDetailView['feed'] => { if (!feed) return []; return feed.map(item => ({ ...item, title: getLoc(item.title), caption: getLoc(item.caption), location: getLoc(item.location || '') })); };
  const detail = { ...defaultProfileDetail, ...overrides };
  return { id: profile.id, headline: getLoc(detail.headline), about: getLoc(detail.about), traits: mapLocArray(detail.traits), interests: mapLocArray(detail.interests), languages: mapLocArray(detail.languages), occupation: getLoc(detail.occupation), communicationStyle: getLoc(detail.communicationStyle), facts: mapFacts(detail.facts), stats: mapStats(detail.stats), highlights: mapFacts(detail.highlights), feed: mapFeed(detail.feed) };
};

export const toProfileView = (profile: UserProfile, locale: keyof LocalizedText): UserProfileView => {
  return { ...profile, countryDisplay: profile.countryDisplay[locale] || profile.countryDisplay['en'], city: profile.city[locale] || profile.city['en'], seeking: profile.seeking[locale] || profile.seeking['en'], bio: profile.bio[locale] || profile.bio['en'] };
};
