import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:5000/api/urls'; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const response = await axios.get(BACKEND_URL);
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching URLs' });
    }
  } else if (req.method === 'POST') {
    if (!req.body.url) {
      return res.status(400).json({ error: 'Please provide url' });
    }
    try {
      const response = await axios.post(BACKEND_URL, { url: req.body.url });
      res.status(201).json(response.data);
    } catch (error) {
      res.status(400).json({ error: 'Error creating URL' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
