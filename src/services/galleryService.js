const GALLERY_TIMEOUT_MS = 10_000;

function normalizeImage(image, index) {
  if (typeof image === 'string') {
    return {
      id: `gallery-${index + 1}`,
      url: image,
      alt: `Photo de Ruphin Gassi ${index + 1}`,
      caption: '',
    };
  }

  return {
    id: String(image.id ?? image.key ?? `gallery-${index + 1}`),
    url: image.url ?? image.ufsUrl ?? image.fileUrl ?? '',
    alt: image.alt ?? image.name ?? `Photo de Ruphin Gassi ${index + 1}`,
    caption: image.caption ?? '',
  };
}

export async function getGalleryImages() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GALLERY_TIMEOUT_MS);

  try {
    const response = await fetch('/api/gallery', {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Erreur galerie : ${response.status}`);
    }

    const data = await response.json();

    const images = Array.isArray(data)
      ? data
      : (data?.images ?? data?.files ?? []);

    if (!Array.isArray(images)) {
      throw new Error('La réponse de la galerie doit contenir un tableau d\'images.');
    }

    return images.map(normalizeImage).filter(({ url }) => Boolean(url));
  } finally {
    clearTimeout(timeout);
  }
}
