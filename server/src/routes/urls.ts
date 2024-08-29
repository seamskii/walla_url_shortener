import express from 'express';
import Urls from '../models/urls';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const urlList = await Urls.find();
    res.status(200).json(urlList);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching URLs' });
  }
});

router.post('/', async (req, res) => {
  if (!req.body.url) {
    return res.status(400).json({ error: 'Please provide url' });
  }
  try {
    const newUrl = await Urls.create({ url: req.body.url });
    res.status(201).json(newUrl);
  } catch (error) {
    res.status(400).json({ error: 'Error creating URL' });
  }
});

export default router;
