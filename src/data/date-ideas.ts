export type DateBudget = 'free' | 'cheap' | 'splurge';
export type DateVibe = 'romantic' | 'fun' | 'cozy' | 'adventurous';

export interface DateIdea {
    id: string;
    budget: DateBudget;
    vibe: DateVibe;
    title: Record<'en' | 'zh', string>;
    description: Record<'en' | 'zh', string>;
}

export const DATE_IDEAS: DateIdea[] = [
    // ROMANTIC - FREE
    {
        id: 'stargazing',
        budget: 'free',
        vibe: 'romantic',
        title: { en: 'Stargazing Picnic', zh: '星空野餐' },
        description: {
            en: 'Drive away from the city lights, lay a blanket on the hood of your car, and watch the stars together.',
            zh: '开车远离城市灯光，在引擎盖上铺开毯子，依偎在一起看星星。'
        }
    },
    {
        id: 'sunset_hike',
        budget: 'free',
        vibe: 'romantic',
        title: { en: 'Sunset Hike', zh: '日落远足' },
        description: {
            en: 'Find a local trail with a great view heading west. Time your hike perfectly to watch the sunset together.',
            zh: '找一条风景优美、朝西的步道。掐好时间，一起在山顶欣赏日落。'
        }
    },
    {
        id: 'love_letter_exchange',
        budget: 'free',
        vibe: 'romantic',
        title: { en: 'Love Letter Exchange', zh: '交换情书' },
        description: {
            en: 'Spend 20 minutes writing a letter to each other about what you love most. Read them aloud in a quiet, dimly lit room.',
            zh: '花20分钟写一封信给对方，诉说最爱对方的什么。在昏暗安静的房间里面对面读出来。'
        }
    },

    // ROMANTIC - CHEAP
    {
        id: 'homemade_wine_tasting',
        budget: 'cheap',
        vibe: 'romantic',
        title: { en: 'At-Home Wine Tasting', zh: '居家品酒会' },
        description: {
            en: 'Buy two inexpensive bottles of wine and some cheese. Cover the labels with foil and guess which is which.',
            zh: '买两瓶实惠的葡萄酒和一些奶酪。用锡纸遮住酒标，一起盲品盲猜。'
        }
    },
    {
        id: 'botanical_garden',
        budget: 'cheap',
        vibe: 'romantic',
        title: { en: 'Botanical Garden Stroll', zh: '植物园漫步' },
        description: {
            en: 'Wander hand-in-hand through lush local botanical gardens or a blooming greenhouse.',
            zh: '手牵手漫步在当地郁郁葱葱的植物园或鲜花盛开的温室中。'
        }
    },
    {
        id: 'candlelight_dessert',
        budget: 'cheap',
        vibe: 'romantic',
        title: { en: 'Candlelight Dessert Date', zh: '烛光甜点约会' },
        description: {
            en: 'Skip dinner and go straight to a nice local bakery. Buy a few upscale desserts and eat them at home by candlelight.',
            zh: '跳过正餐，直接去当地高档甜品店买几份精致甜点，回家点上蜡烛一起享用。'
        }
    },
    {
        id: 'scenic_drive',
        budget: 'cheap',
        vibe: 'romantic',
        title: { en: 'Scenic Night Drive', zh: '浪漫夜车' },
        description: {
            en: 'Curate a playlist of your favorite slow songs. Get some drive-thru milkshakes and take the long, scenic route.',
            zh: '精心挑选一个慢歌播放列表。买两杯得来速奶昔，沿着风景最优美的公路慢慢开。'
        }
    },

    // ROMANTIC - SPLURGE
    {
        id: 'rooftop_dining',
        budget: 'splurge',
        vibe: 'romantic',
        title: { en: 'Rooftop Dining', zh: '露台餐厅晚餐' },
        description: {
            en: 'Book a table at a high-end rooftop restaurant. Dress up to the nines and enjoy the city skyline view.',
            zh: '预订一家高档露台餐厅。盛装打扮，在绝美的城市天际线夜景中共进晚餐。'
        }
    },
    {
        id: 'couples_massage',
        budget: 'splurge',
        vibe: 'romantic',
        title: { en: 'Couples Spa Day', zh: '双人水疗日' },
        description: {
            en: 'Treat yourselves to a luxurious couples massage and spend the afternoon relaxing in the spa facilities.',
            zh: '犒劳一下自己，享受奢华的双人按摩服务，在水疗中心度过慵懒放松的下午。'
        }
    },
    {
        id: 'weekend_getaway',
        budget: 'splurge',
        vibe: 'romantic',
        title: { en: 'B&B Weekend Getaway', zh: '周边民宿周末游' },
        description: {
            en: 'Rent a beautiful cabin or bed-and-breakfast just an hour out of the city for a romantic overnight escape.',
            zh: '在城市一小时车程外租一间美丽的木屋或精品民宿，享受浪漫的过夜逃离。'
        }
    },

    // FUN - FREE
    {
        id: 'video_game_tournament',
        budget: 'free',
        vibe: 'fun',
        title: { en: 'Retro Gaming Tournament', zh: '复古游戏锦标赛' },
        description: {
            en: 'Dust off an old console or download free two-player retro games. The loser has to cook dinner next time.',
            zh: '翻出旧游戏机或下载免费的双人复古游戏。输的人要负责下一次做晚饭。'
        }
    },
    {
        id: 'photo_scavenger_hunt',
        budget: 'free',
        vibe: 'fun',
        title: { en: 'Photo Scavenger Hunt', zh: '摄影寻宝游戏' },
        description: {
            en: 'Write a list of silly things to find in your city (e.g. "a dog in a sweater"). Walk around and snap pictures of as many as you can.',
            zh: '列出要在城市里寻找的搞笑事物清单（比如“穿毛衣的狗”）。一边散步一边拍照打卡。'
        }
    },
    {
        id: 'tiktok_dance',
        budget: 'free',
        vibe: 'fun',
        title: { en: 'Learn a Viral Dance', zh: '学跳网红舞' },
        description: {
            en: 'Spend an hour trying to perfectly execute a ridiculous viral dance or choreography. Record the hilarious fails.',
            zh: '花一个小时试着完美复现一段可笑的网红舞蹈。把搞笑的失败过程录下来。'
        }
    },

    // FUN - CHEAP
    {
        id: 'arcade_bar',
        budget: 'cheap',
        vibe: 'fun',
        title: { en: 'Arcade Bar', zh: '街机酒吧' },
        description: {
            en: 'Get $20 in quarters and challenge each other to Air Hockey, Pac-Man, and Mario Kart over a beer.',
            zh: '换20块钱的游戏币，一边喝啤酒，一边在气垫球、吃豆人和马里奥赛车上挑战对方。'
        }
    },
    {
        id: 'thrift_store_outfits',
        budget: 'cheap',
        vibe: 'fun',
        title: { en: 'Thrift Store Roulette', zh: '二手店穿搭轮盘' },
        description: {
            en: 'Give each other a $15 budget at a thrift store. You have to buy an outfit for the other person, and they MUST wear it out to coffee.',
            zh: '每人拿15刀预算在二手店给对方挑一套衣服，而且对方必须穿上这身衣服去喝咖啡。'
        }
    },
    {
        id: 'bowling',
        budget: 'cheap',
        vibe: 'fun',
        title: { en: 'Neon Bowling', zh: '霓虹保龄球' },
        description: {
            en: 'Hit up the local bowling alley on a " cosmic " or neon night. Order greasy fries and enjoy the terrible rental shoes.',
            zh: '在“宇宙”或霓虹夜去当地的保龄球馆。点一份油腻的薯条，吐槽难穿的租用保龄球鞋。'
        }
    },
    {
        id: 'diy_pizza',
        budget: 'cheap',
        vibe: 'fun',
        title: { en: 'DIY Pizza Off', zh: '披萨DIY大比拼' },
        description: {
            en: 'Buy raw and weird ingredients from the grocery store. Make personal pizzas and judge who made the better tasting creation.',
            zh: '去超市买食材和一些奇奇怪怪的配料。各自做一个专属披萨，评判谁的手艺更好。'
        }
    },

    // FUN - SPLURGE
    {
        id: 'theme_park',
        budget: 'splurge',
        vibe: 'fun',
        title: { en: 'Theme Park Adrenaline', zh: '去游乐园放肆' },
        description: {
            en: 'Spend the whole day eating cotton candy and riding the biggest rollercoasters until you lose your voice.',
            zh: '花一整天时间吃棉花糖、坐最刺激的过山车，直到嗓子都喊哑。'
        }
    },
    {
        id: 'escape_room',
        budget: 'splurge',
        vibe: 'fun',
        title: { en: 'High-Tech Escape Room', zh: '高科技密室逃脱' },
        description: {
            en: 'Test your communication skills by booking a premium, immersive escape room. Try to beat the record time.',
            zh: '预订一个高级沉浸式的密室逃脱来测试你们的沟通技巧。努力打破逃脱时间记录吧！'
        }
    },
    {
        id: 'concert',
        budget: 'splurge',
        vibe: 'fun',
        title: { en: 'Live Music or Comedy', zh: '听演唱会/脱口秀' },
        description: {
            en: 'Score tickets to a big concert or a famous stand-up comedian. Buy the overpriced merch and enjoy the show.',
            zh: '抢一张大型演唱会或著名脱口秀演员的门票。买两件周边，尽情享受演出的气氛。'
        }
    },

    // COZY - FREE
    {
        id: 'pillow_fort',
        budget: 'free',
        vibe: 'cozy',
        title: { en: 'Epic Pillow Fort', zh: '超大枕头堡垒' },
        description: {
            en: 'Move the furniture, grab every blanket you own, string up fairy lights, and watch a movie on your laptop inside it.',
            zh: '挪开家具，拿来所有的毯子和靠枕，挂上小串灯，躲在里面用笔记本电脑看个电影。'
        }
    },
    {
        id: 'podcast_puzzle',
        budget: 'free',
        vibe: 'cozy',
        title: { en: 'Puzzle & Podcast', zh: '拼图与播客' },
        description: {
            en: 'Pull out a 1000-piece puzzle, put on a fascinating true-crime or comedy podcast, and spend hours piecing it together.',
            zh: '拿出一个1000块的拼图，放一点好听的悬疑或喜剧播客，花几个小时一起拼完它。'
        }
    },

    // COZY - CHEAP
    {
        id: 'bookstore_date',
        budget: 'cheap',
        vibe: 'cozy',
        title: { en: 'Bookstore Browsing', zh: '书店寻宝' },
        description: {
            en: 'Go to a quiet indie bookstore. Pick out a book for each other under $10, then sit in the café to read the first chapter.',
            zh: '去一家安静的独立书店。给对方挑一本10块钱出头的书，然后坐在咖啡馆里读第一章。'
        }
    },
    {
        id: 'hot_chocolate_tour',
        budget: 'cheap',
        vibe: 'cozy',
        title: { en: 'Hot Chocolate Tour', zh: '热可可品鉴之旅' },
        description: {
            en: 'Bundle up tight. Walk to three different cafes in your neighborhood and split a hot chocolate at each to find the ultimate winner.',
            zh: '把自己裹得严严实实。步行去附近的三个咖啡馆，各点一杯热可可分着喝，评选出最好喝的一家。'
        }
    },

    // COZY - SPLURGE
    {
        id: 'fancy_takeout',
        budget: 'splurge',
        vibe: 'cozy',
        title: { en: 'Premium Sushi Delivery', zh: '高级寿司外卖' },
        description: {
            en: 'Order the most expensive sushi or steak delivery in town. Eat it on the floor in sweatpants while watching a really good film.',
            zh: '点城里最贵的高级寿司或牛排外卖。穿着运动裤坐在地板上大快朵颐，同时看一部好电影。'
        }
    },

    // ADVENTUROUS - FREE
    {
        id: 'geocaching',
        budget: 'free',
        vibe: 'adventurous',
        title: { en: 'Geocaching', zh: '极客寻宝 (Geocaching)' },
        description: {
            en: 'Download a geocaching app and use GPS to find hidden containers tucked away in urban infrastructure or local trails.',
            zh: '下载一个 Geocaching 应用，利用GPS去城市角落或步道上寻找隐藏的神秘小盒子。'
        }
    },

    // ADVENTUROUS - CHEAP
    {
        id: 'bouldering',
        budget: 'cheap',
        vibe: 'adventurous',
        title: { en: 'Indoor Bouldering', zh: '室内攀岩' },
        description: {
            en: 'Rent some chalk and climbing shoes. Challenge each other to complete different climbing routes and cheer each other on.',
            zh: '租两双攀岩鞋和镁粉。互相挑战不同的攀登路线，在攀爬时为对方加油打气。'
        }
    },
    {
        id: 'ghost_tour',
        budget: 'cheap',
        vibe: 'adventurous',
        title: { en: 'Local Ghost Tour', zh: '闹鬼历史游览' },
        description: {
            en: 'Find a spooky walking tour in your city. It’s a great excuse to hold hands tightly while learning weird local history.',
            zh: '在你们的城市找一个带点恐怖色彩的夜间历史步行游。这是在了解猎奇历史时紧紧牵手的好借口。'
        }
    },

    // ADVENTUROUS - SPLURGE
    {
        id: 'hot_air_balloon',
        budget: 'splurge',
        vibe: 'adventurous',
        title: { en: 'Helicopter or Balloon Ride', zh: '直升机/热气球之旅' },
        description: {
            en: 'Go big. Book a sunset hot air balloon ride or a helicopter tour over the city for an adrenaline rush you will never forget.',
            zh: '玩一把大的！预订日落热气球飞行，或乘坐直升机俯瞰城市，体验永生难忘的刺激。'
        }
    },
    {
        id: 'kayaking',
        budget: 'splurge',
        vibe: 'adventurous',
        title: { en: 'Kayaking & Picnic', zh: '皮划艇与岛上野餐' },
        description: {
            en: 'Rent a tandem kayak. Pack a gourmet lunch in a dry bag and paddle out to a secluded spot for a private date.',
            zh: '租一艘双人皮划艇，将美味午餐装进防水袋，划到人迹罕至的地方享受私密的二人狂欢。'
        }
    }
];
