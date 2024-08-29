import { NextApiRequest, NextApiResponse } from 'next';
import Urls from '../../models/urls';  
import connectMongo from '../../utils/connectMongo';  

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectMongo();

  const { code } = req.query;
  if (req.method === 'GET') {
    try {
      const url = await Urls.findOne({ code });
      if (url) {
        url.clicked += 1;
        await url.save();
        res.redirect(url.url);
      } else {
        res.status(404).json({ error: 'URL not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error fetching URL' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
