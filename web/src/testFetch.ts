import dotenv from 'dotenv';
dotenv.config();

import { createClient } from '@sanity/client';

const sanity = createClient({
  projectId:   process.env.VITE_SANITY_PROJECT_ID!,
  dataset:     process.env.VITE_SANITY_DATASET!,
  apiVersion:  process.env.VITE_SANITY_API_VERSION!,
  useCdn:      true,
});

async function testFetch() {
  const posts = await sanity.fetch(
    '*[_type == "post"]{_id, title}[0..2]'
  );
  console.log('Posts:', posts);
}

testFetch().catch(console.error);
