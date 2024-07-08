import express from 'express';
import cors from 'cors';
import ytdl from 'ytdl-core';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get('/stream', async (req, res) => {
  const { url } = req.query;

  if (!ytdl.validateURL(url)) {
    return res.status(400).json({ success: false, error: 'Invalid YouTube URL' });
  }

  try {
    const info = await ytdl.getInfo(url);
    const audioFormat = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });

    res.setHeader('Content-Type', 'audio/mpeg');
    ytdl(url, { format: audioFormat }).pipe(res);
  } catch (error) {
    console.error('Error streaming audio:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
