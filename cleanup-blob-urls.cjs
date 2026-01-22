// Script to find and optionally delete documents with blob URLs
const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');

// Read .env file manually
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID,
  dataset: process.env.VITE_SANITY_DATASET || 'production',
  token: process.env.VITE_SANITY_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function findBlobUrls() {
  console.log('🔍 Searching for documents with blob URLs...\n');

  // Search all news types
  const newsTypes = ['swedenNews', 'usaNews', 'germanyNews', 'eritreaNews'];
  const problematicDocs = [];

  for (const type of newsTypes) {
    const docs = await client.fetch(`*[_type == "${type}"]`);
    
    for (const doc of docs) {
      if (doc.media?.url && doc.media.url.startsWith('blob:')) {
        problematicDocs.push({
          _id: doc._id,
          _type: doc._type,
          title: doc.title,
          mediaUrl: doc.media.url,
        });
      }
    }
  }

  if (problematicDocs.length === 0) {
    console.log('✅ No documents with blob URLs found!');
    return;
  }

  console.log(`❌ Found ${problematicDocs.length} document(s) with blob URLs:\n`);
  problematicDocs.forEach((doc, i) => {
    console.log(`${i + 1}. ${doc.title}`);
    console.log(`   Type: ${doc._type}`);
    console.log(`   ID: ${doc._id}`);
    console.log(`   URL: ${doc.mediaUrl}`);
    console.log('');
  });

  console.log('\n📋 To delete these documents, run:');
  console.log('node cleanup-blob-urls.js --delete\n');

  // If --delete flag is passed, delete them
  if (process.argv.includes('--delete')) {
    console.log('🗑️  Deleting documents with blob URLs...\n');
    
    for (const doc of problematicDocs) {
      try {
        await client.delete(doc._id);
        console.log(`✅ Deleted: ${doc.title} (${doc._id})`);
      } catch (error) {
        console.error(`❌ Failed to delete ${doc._id}:`, error.message);
      }
    }
    
    console.log('\n✨ Cleanup complete!');
  }
}

findBlobUrls().catch(console.error);
