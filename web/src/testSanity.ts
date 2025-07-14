import dotenv from 'dotenv';
dotenv.config();  // これで web/.env が読み込まれます

import { createClient } from '@sanity/client';

const sanity = createClient({
  projectId:   process.env.VITE_SANITY_PROJECT_ID!,
  dataset:     process.env.VITE_SANITY_DATASET!,
  apiVersion:  process.env.VITE_SANITY_API_VERSION!,
  useCdn:      true,
});

async function listDatasets() {
  const res = await sanity.datasets.list();
  console.log('Datasets:', res);
}

listDatasets().catch(console.error);
