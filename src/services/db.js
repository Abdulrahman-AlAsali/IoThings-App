import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

export const client = new MongoClient(process.env.MONGO_URI, {
  tls: false,           // ← flip to true if you add TLS certificates
  appName: 'iothings-api'
});
await client.connect();
export const activations = client.db().collection('activations');

export async function insertEvent(doc){
  return activations.insertOne(doc);
}
