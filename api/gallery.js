import { UTApi } from 'uploadthing/server';

const utapi = new UTApi();

/**
 * Serverless function Vercel — GET /api/gallery
 * Retourne la liste des images uploadées sur UploadThing.
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { files } = await utapi.listFiles({ limit: 50 });

    const images = files
      .filter((file) => file.status === 'Uploaded')
      .map((file) => ({
        id: file.key,
        url: `https://utfs.io/f/${file.key}`,
        alt: file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
        caption: '',
      }));

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return res.status(200).json(images);
  } catch (error) {
    console.error('[api/gallery] Erreur UploadThing :', error);
    return res.status(500).json({ error: 'Impossible de récupérer les images.' });
  }
}
