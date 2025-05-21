import express from 'express';
import { activations } from '../services/db.js';
const router = express.Router();

/**
 * GET /homes/:homeId/usage?from=ISO&to=ISO
 */
router.get('/homes/:homeId/usage', async (req,res)=>{
  const { homeId } = req.params;
  const { from, to } = req.query;
  const data = await activations.aggregate([
    { $match:{ homeId, ts:{ $gte:new Date(from), $lte:new Date(to) } } },
    { $group:{ _id:"$deviceId", count:{ $sum:1 } } }
  ]).toArray();
  res.json(data);
});

export default router;
