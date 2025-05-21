import express from 'express';
import { mqttPub } from '../services/mqtt.js';

const router = express.Router();

/**
 * POST /simulate
 * {
 *   "homeId":   "house1",
 *   "deviceId": "smoke1",
 *   "value":    1,
 *   "meta":     { "battery":87 }
 * }
 */
router.post('/simulate', (req, res) => {
  const { homeId, deviceId, ...payload } = req.body;

  if (!homeId || !deviceId) {
    return res.status(400).json({ error: 'homeId and deviceId required' });
  }

  // Build the topic exactly like real devices use
  const topic = `home/${homeId}/device/${deviceId}/event`;

  // QoS 1 guarantees broker receives it
  mqttPub.publish(topic, JSON.stringify(payload), { qos: 1 }, err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ ok: true, topic });
  });
});

export default router;
