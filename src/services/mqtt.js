import mqtt from 'mqtt';
import { insertEvent } from './db.js';
import dotenv from 'dotenv';
dotenv.config();

const client = mqtt.connect(process.env.MQTT_BROKER);

client.on('connect', () => {
  client.subscribe('home/+/device/+/event', { qos: 1 }, err => {
    if (!err) console.log('MQTT subscribed');
  });
});

// client.on('message', async (topic, payload) => {
//   console.log('RAW PAYLOAD:', payload.toString());
//   try{
//     const [ , homeId, , deviceId ] = topic.split('/');
//     const body = JSON.parse(payload.toString());
//     await insertEvent({ ...body, homeId, deviceId, ts: new Date() });
//   }catch(e){ console.error(e); }
// });

client.on('message', async (topic, payload) => {
  console.log('RAW PAYLOAD:', payload.toString());
  let text = payload.toString().trim();

  // remove wrapping single OR double quotes
  if ((text.startsWith("'") && text.endsWith("'")) ||
      (text.startsWith('"') && text.endsWith('"'))) {
    text = text.slice(1, -1);
  }

  let body;
  try {
    body = JSON.parse(text);          // valid JSON ➜ object
  } catch {
    body = { raw: text };             // anything else ➜ store as-is
  }

  const [, homeId,, deviceId] = topic.split('/');
  await insertEvent({ ...body, homeId, deviceId, ts: new Date() });
});

export { client as mqttPub };