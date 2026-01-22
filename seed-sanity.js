import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env file
const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

const client = createClient({
  projectId: envVars.VITE_SANITY_PROJECT_ID || 'tophwrez',
  dataset: envVars.VITE_SANITY_DATASET || 'production',
  token: envVars.VITE_SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2024-01-22',
});

const randomReactions = () => ({
  like: Math.floor(Math.random() * 10),
  smile: Math.floor(Math.random() * 10),
  heart: Math.floor(Math.random() * 10),
  celebrate: Math.floor(Math.random() * 5),
});

const newsData = [
  // Sweden
  { type: 'swedenNews', title: 'Midsummer Celebration in Stockholm', dateISO: '2025-06-21', location: 'Stockholm, Sweden', kind: 'Holiday', notes: 'Dancing around the maypole with the whole family!', media: { url: 'https://images.unsplash.com/photo-1543825832-628d0551064d?q=80&w=800', type: 'image', alt: 'Midsummer celebration' } },
  { type: 'swedenNews', title: 'Family Reunion in Gothenburg', dateISO: '2025-07-15', location: 'Gothenburg, Sweden', kind: 'Reunion', notes: 'Great to see all the cousins again.', media: { url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=800', type: 'image', alt: 'Family reunion' } },
  { type: 'swedenNews', title: 'Northern Lights Trip', dateISO: '2025-12-10', location: 'Abisko, Sweden', kind: 'Other', notes: 'Magical views of the aurora borealis.', media: { url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=800', type: 'image', alt: 'Northern lights' } },
  { type: 'swedenNews', title: "Sarah's 10th Birthday", dateISO: '2025-08-05', location: 'Malmö, Sweden', kind: 'Birthday', notes: 'Happy birthday Sarah!', media: { url: 'https://images.unsplash.com/photo-1530103862676-de3c9da59af7?q=80&w=800', type: 'image', alt: 'Birthday cake' } },
  { type: 'swedenNews', title: 'Skiing in Åre', dateISO: '2026-02-14', location: 'Åre, Sweden', kind: 'Other', notes: 'Best powder snow ever.', media: { url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=800', type: 'image', alt: 'Skiing' } },

  // USA
  { type: 'usaNews', title: 'Thanksgiving Dinner', dateISO: '2025-11-27', location: 'New York, NY', kind: 'Holiday', notes: 'Grateful for family and good food.', media: { url: 'https://images.unsplash.com/photo-1574672280602-95995c07b6c9?q=80&w=800', type: 'image', alt: 'Thanksgiving turkey' } },
  { type: 'usaNews', title: 'Road Trip to California', dateISO: '2025-05-10', location: 'Big Sur, CA', kind: 'Other', notes: 'Driving up the Pacific Coast Highway.', media: { url: 'https://images.unsplash.com/photo-1502476562095-2da1823932be?q=80&w=800', type: 'image', alt: 'Road trip' } },
  { type: 'usaNews', title: 'Graduation Party', dateISO: '2025-06-15', location: 'Chicago, IL', kind: 'Other', notes: 'Congrats to the class of 2025!', media: { url: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=800', type: 'image', alt: 'Graduation caps' } },
  { type: 'usaNews', title: 'Family Picnic at Central Park', dateISO: '2025-09-01', location: 'New York, NY', kind: 'Reunion', notes: 'Beautiful day in the park.', media: { url: 'https://images.unsplash.com/photo-1596541539266-9dc7303c7349?q=80&w=800', type: 'image', alt: 'Picnic' } },
  { type: 'usaNews', title: 'Baby Shower for Emily', dateISO: '2026-03-20', location: 'Austin, TX', kind: 'Other', notes: 'Welcoming the newest family member soon!', media: { url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800', type: 'image', alt: 'Baby shower' } },

  // Germany
  { type: 'germanyNews', title: 'Oktoberfest Gathering', dateISO: '2025-09-28', location: 'Munich, Germany', kind: 'Holiday', notes: 'Prost! Celebrating traditions.', media: { url: 'https://images.unsplash.com/photo-1533552885934-297eb06b997c?q=80&w=800', type: 'image', alt: 'Oktoberfest' } },
  { type: 'germanyNews', title: 'Christmas Market Visit', dateISO: '2025-12-15', location: 'Nuremberg, Germany', kind: 'Holiday', notes: 'The glühwein was delicious.', media: { url: 'https://images.unsplash.com/photo-1482318057201-98782ee59294?q=80&w=800', type: 'image', alt: 'Christmas market' } },
  { type: 'germanyNews', title: 'Hiking in the Black Forest', dateISO: '2025-08-10', location: 'Black Forest, Germany', kind: 'Other', notes: 'Nature at its finest.', media: { url: 'https://images.unsplash.com/photo-1506450027681-37d452030d97?q=80&w=800', type: 'image', alt: 'Black Forest' } },
  { type: 'germanyNews', title: "Grandma's 80th Birthday", dateISO: '2025-04-22', location: 'Berlin, Germany', kind: 'Birthday', notes: 'A wonderful milestone celebration.', media: { url: 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?q=80&w=800', type: 'image', alt: 'Birthday party' } },
  { type: 'germanyNews', title: 'Berlin City Tour', dateISO: '2026-05-01', location: 'Berlin, Germany', kind: 'Other', notes: 'Exploring the Brandenburg Gate.', media: { url: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?q=80&w=800', type: 'image', alt: 'Berlin' } },

  // Eritrea
  { type: 'eritreaNews', title: 'Independence Day Celebration', dateISO: '2025-05-24', location: 'Asmara, Eritrea', kind: 'Holiday', notes: 'Celebrating freedom and history.', media: { url: 'https://images.unsplash.com/photo-1628172901323-9c864273d63c?q=80&w=800', type: 'image', alt: 'Eritrea celebration' } },
  { type: 'eritreaNews', title: 'Wedding in Asmara', dateISO: '2025-07-20', location: 'Asmara, Eritrea', kind: 'Reunion', notes: 'Congratulations to the happy couple!', media: { url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800', type: 'image', alt: 'Wedding' } },
  { type: 'eritreaNews', title: 'Coffee Ceremony', dateISO: '2025-10-05', location: 'Keren, Eritrea', kind: 'Other', notes: 'Traditional warmth and hospitality.', media: { url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800', type: 'image', alt: 'Coffee ceremony' } },
  { type: 'eritreaNews', title: 'Trip to Massawa', dateISO: '2025-11-12', location: 'Massawa, Eritrea', kind: 'Other', notes: 'Enjoying the Red Sea breeze.', media: { url: 'https://images.unsplash.com/photo-1582294132304-db8384b64a27?q=80&w=800', type: 'image', alt: 'Red Sea' } },
  { type: 'eritreaNews', title: "New Year's Eve", dateISO: '2025-12-31', location: 'Asmara, Eritrea', kind: 'Holiday', notes: 'Ringing in 2026!', media: { url: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?q=80&w=800', type: 'image', alt: 'New Year' } },
];

async function seed() {
  console.log('Seeding data...');
  const transaction = client.transaction();
  
  for (const news of newsData) {
    transaction.create({
      _type: news.type,
      title: news.title,
      dateISO: news.dateISO,
      location: news.location,
      kind: news.kind,
      notes: news.notes,
      media: news.media,
      reactions: randomReactions()
    });
  }

  try {
    await transaction.commit();
    console.log('Done! Added 20 news items.');
  } catch (err) {
    console.error('Migration failed:', err.message);
  }
}

seed();
