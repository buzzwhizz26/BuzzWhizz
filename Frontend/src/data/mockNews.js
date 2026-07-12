const mockNewsData = [
  {
    title: "Apple Unveils Revolutionary AI Chip That Transforms Mobile Computing",
    description: "Apple's latest M-series processor features groundbreaking neural engine capabilities, promising 40% faster AI processing and unprecedented energy efficiency for next-gen devices.",
    urlToImage: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop",
    url: "https://example.com/apple-ai-chip",
    source: { name: "TechCrunch" },
    publishedAt: "2026-04-08T10:30:00Z",
    category: "technology"
  },
  {
    title: "Global Stock Markets Rally as Inflation Shows Signs of Cooling",
    description: "Major indices surged following new economic data indicating a sustained decline in inflation rates, boosting investor confidence across sectors.",
    urlToImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop",
    url: "https://example.com/stock-rally",
    source: { name: "Bloomberg" },
    publishedAt: "2026-04-08T09:15:00Z",
    category: "business"
  },
  {
    title: "Champions League Semifinals Draw Creates Dream Matchups",
    description: "Football fans worldwide are buzzing as the UEFA Champions League draw pairs historic rivals in what promises to be an unforgettable semifinal round.",
    urlToImage: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600&h=400&fit=crop",
    url: "https://example.com/champions-league",
    source: { name: "ESPN" },
    publishedAt: "2026-04-08T08:45:00Z",
    category: "sports"
  },
  {
    title: "Blockbuster Sci-Fi Film Breaks Opening Weekend Records Worldwide",
    description: "The highly anticipated space epic shattered box office records with $450M globally, becoming the biggest opening in cinema history for an original IP.",
    urlToImage: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&h=400&fit=crop",
    url: "https://example.com/box-office",
    source: { name: "Variety" },
    publishedAt: "2026-04-08T07:30:00Z",
    category: "entertainment"
  },
  {
    title: "AI Startup Raises $500M to Build Next-Generation Language Models",
    description: "A stealth-mode startup backed by top-tier VCs emerges with massive funding to compete directly with leading AI labs in building more efficient language models.",
    urlToImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop",
    url: "https://example.com/ai-startup",
    source: { name: "TechCrunch" },
    publishedAt: "2026-04-08T06:00:00Z",
    category: "startups"
  },
  {
    title: "Tesla Announces Breakthrough in Solid-State Battery Technology",
    description: "Tesla's new battery division reveals a solid-state battery prototype that could double EV range and reduce charging time to under 10 minutes.",
    urlToImage: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&h=400&fit=crop",
    url: "https://example.com/tesla-battery",
    source: { name: "The Verge" },
    publishedAt: "2026-04-07T22:00:00Z",
    category: "technology"
  },
  {
    title: "Federal Reserve Signals Potential Rate Cut in Coming Months",
    description: "Fed Chair signals a shift in monetary policy, suggesting rate cuts could begin as early as next quarter if economic indicators continue to improve.",
    urlToImage: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&h=400&fit=crop",
    url: "https://example.com/fed-rates",
    source: { name: "Reuters" },
    publishedAt: "2026-04-07T20:30:00Z",
    category: "business"
  },
  {
    title: "Olympic Committee Announces Five New Sports for 2028 Los Angeles Games",
    description: "The IOC confirms cricket, flag football, lacrosse, squash, and baseball/softball will join the program for the 2028 Summer Olympics in Los Angeles.",
    urlToImage: "https://images.unsplash.com/photo-1461896836934-bd45ba8a0120?w=600&h=400&fit=crop",
    url: "https://example.com/olympics-2028",
    source: { name: "BBC Sport" },
    publishedAt: "2026-04-07T18:00:00Z",
    category: "sports"
  },
  {
    title: "Streaming Wars Heat Up: Major Studio Launches Ad-Free Platform",
    description: "A major entertainment conglomerate disrupts the streaming landscape with a premium ad-free tier priced competitively against Netflix and Disney+.",
    urlToImage: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=600&h=400&fit=crop",
    url: "https://example.com/streaming-wars",
    source: { name: "Hollywood Reporter" },
    publishedAt: "2026-04-07T16:45:00Z",
    category: "entertainment"
  },
  {
    title: "Electric Aviation Startup Completes First Cross-Country Flight",
    description: "Making aviation history, a California startup successfully flew an all-electric aircraft from LA to San Francisco, signaling a new era for sustainable air travel.",
    urlToImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop",
    url: "https://example.com/electric-aviation",
    source: { name: "Wired" },
    publishedAt: "2026-04-07T14:30:00Z",
    category: "startups"
  },
  {
    title: "Google DeepMind Achieves Breakthrough in Protein Structure Prediction",
    description: "DeepMind's latest AlphaFold iteration can now predict protein interactions with near-perfect accuracy, potentially revolutionizing drug discovery.",
    urlToImage: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&h=400&fit=crop",
    url: "https://example.com/deepmind-protein",
    source: { name: "Nature" },
    publishedAt: "2026-04-07T12:00:00Z",
    category: "technology"
  },
  {
    title: "Cryptocurrency Market Sees Massive Surge Following ETF Approval",
    description: "Bitcoin and Ethereum prices skyrocket as regulators approve spot ETFs, opening the door for institutional investors to enter the crypto market.",
    urlToImage: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop",
    url: "https://example.com/crypto-etf",
    source: { name: "CoinDesk" },
    publishedAt: "2026-04-07T10:15:00Z",
    category: "business"
  },
  {
    title: "NBA Playoff Race Intensifies with Surprise Underdog Leading the Pack",
    description: "In a stunning turn, a rebuilding franchise has clinched the top seed, defying all preseason predictions and capturing the hearts of basketball fans nationwide.",
    urlToImage: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=400&fit=crop",
    url: "https://example.com/nba-playoffs",
    source: { name: "Sports Illustrated" },
    publishedAt: "2026-04-07T08:30:00Z",
    category: "sports"
  },
  {
    title: "Grammy-Winning Artist Announces Surprise Album Drop and World Tour",
    description: "Multiple Grammy winner stuns fans with an unannounced album release and a 60-city world tour, with tickets selling out within minutes.",
    urlToImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop",
    url: "https://example.com/surprise-album",
    source: { name: "Rolling Stone" },
    publishedAt: "2026-04-07T06:00:00Z",
    category: "entertainment"
  },
  {
    title: "HealthTech Unicorn Launches AI-Powered Diagnostic Tool for Rural Clinics",
    description: "A healthcare startup valued at $2B rolls out an AI diagnostic system capable of detecting 50+ conditions using just a smartphone camera.",
    urlToImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop",
    url: "https://example.com/healthtech-ai",
    source: { name: "Fast Company" },
    publishedAt: "2026-04-07T04:00:00Z",
    category: "startups"
  },
  {
    title: "SpaceX Successfully Lands Starship Booster on Its First Orbital Attempt",
    description: "In a historic moment for space exploration, SpaceX achieved a perfect landing of the Starship Super Heavy booster after completing a full orbital flight.",
    urlToImage: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=600&h=400&fit=crop",
    url: "https://example.com/spacex-starship",
    source: { name: "Space.com" },
    publishedAt: "2026-04-06T22:00:00Z",
    category: "technology"
  },
  {
    title: "Global Renewable Energy Investment Surpasses Fossil Fuels for First Time",
    description: "A landmark report reveals that worldwide investment in renewable energy has officially exceeded fossil fuel spending, marking a turning point in the energy transition.",
    urlToImage: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&h=400&fit=crop",
    url: "https://example.com/renewable-energy",
    source: { name: "Financial Times" },
    publishedAt: "2026-04-06T20:00:00Z",
    category: "business"
  },
  {
    title: "Formula 1: Rookie Driver Stuns with Back-to-Back Race Victories",
    description: "A 20-year-old sensation continues to dominate the grid, becoming the youngest driver ever to win consecutive Grand Prix races in Formula 1 history.",
    urlToImage: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&h=400&fit=crop",
    url: "https://example.com/f1-rookie",
    source: { name: "Autosport" },
    publishedAt: "2026-04-06T18:30:00Z",
    category: "sports"
  },
  {
    title: "Indie Game Studio's Title Becomes Year's Best-Selling Game on Steam",
    description: "A five-person indie team's passion project topped Steam charts within hours of release, outselling major AAA titles and redefining expectations for indie gaming.",
    urlToImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop",
    url: "https://example.com/indie-game",
    source: { name: "IGN" },
    publishedAt: "2026-04-06T16:00:00Z",
    category: "entertainment"
  },
  {
    title: "Fintech Startup Disrupts Traditional Banking with Zero-Fee Global Transfers",
    description: "A Y Combinator-backed startup launches a borderless payment platform offering instant, free international money transfers powered by blockchain technology.",
    urlToImage: "https://images.unsplash.com/photo-1563986768609-322da13575f2?w=600&h=400&fit=crop",
    url: "https://example.com/fintech-disruption",
    source: { name: "Forbes" },
    publishedAt: "2026-04-06T14:00:00Z",
    category: "startups"
  },
  {
    title: "Climate Scientists Discover New Carbon Capture Method Using Ocean Algae",
    description: "Researchers have developed a breakthrough technique using engineered algae that can absorb CO2 200x faster than trees, offering hope in the fight against climate change.",
    urlToImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop",
    url: "https://example.com/carbon-capture",
    source: { name: "Scientific American" },
    publishedAt: "2026-04-06T12:00:00Z",
    category: "technology"
  },
  {
    title: "Major Tech Companies Form Alliance to Combat AI Deepfakes",
    description: "Leading technology firms unite to launch a coalition dedicated to developing tools and standards for detecting and preventing AI-generated deepfake content.",
    urlToImage: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=600&h=400&fit=crop",
    url: "https://example.com/ai-deepfakes",
    source: { name: "MIT Technology Review" },
    publishedAt: "2026-04-06T10:00:00Z",
    category: "technology"
  },
  {
    title: "World's Largest Indoor Vertical Farm Opens in Singapore",
    description: "A massive 100,000 sq ft vertical farming facility begins operations, capable of producing 2 million pounds of leafy greens annually using 95% less water.",
    urlToImage: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=600&h=400&fit=crop",
    url: "https://example.com/vertical-farm",
    source: { name: "National Geographic" },
    publishedAt: "2026-04-06T08:00:00Z",
    category: "startups"
  },
  {
    title: "Legendary Director Announces Final Film with All-Star Cast",
    description: "The acclaimed filmmaker reveals details of their swansong project, featuring an ensemble cast of Oscar winners in what promises to be a cinematic masterpiece.",
    urlToImage: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&h=400&fit=crop",
    url: "https://example.com/legendary-director",
    source: { name: "Empire" },
    publishedAt: "2026-04-06T06:00:00Z",
    category: "entertainment"
  },
];

// Category map for filtering
const categoryMap = {
  general: mockNewsData,
  technology: mockNewsData.filter(a => a.category === 'technology'),
  business: mockNewsData.filter(a => a.category === 'business'),
  sports: mockNewsData.filter(a => a.category === 'sports'),
  entertainment: mockNewsData.filter(a => a.category === 'entertainment'),
  startups: mockNewsData.filter(a => a.category === 'startups'),
};

export function getMockNews(category = 'general', page = 1, pageSize = 6) {
  const articles = category === 'general' ? mockNewsData : (categoryMap[category] || mockNewsData);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  
  return {
    status: 'ok',
    totalResults: articles.length,
    articles: articles.slice(start, end),
    page,
    pageSize,
  };
}

export function getMockTrending() {
  return {
    status: 'ok',
    articles: mockNewsData.slice(0, 6),
  };
}

export default mockNewsData;
