import { useMemo } from 'react';

interface PraiseImage {
  src: string;
  label: string;
}

const praiseImageModules = import.meta.glob<{ default: string }>(
  '../../praise/*.{png,jpg,jpeg,PNG,JPG,JPEG}',
  { eager: true }
) as Record<string, { default: string }>;

const praiseImages: PraiseImage[] = Object.entries(praiseImageModules)
  .map(([path, module]) => {
    const filename = path.split('/').pop() ?? 'praise';
    const name = filename.replace(/\.[^/.]+$/, '');
    const label = name.replace(/[-_]/g, ' ');
    return { src: module.default, label };
  })
  .sort((a, b) => a.label.localeCompare(b.label));

export const PraiseSection = () => {
  const images = useMemo(() => praiseImages, []);

  return (
    <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-8 shadow-xl">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Praise Gallery</h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, index) => (
          <figure
            key={image.src}
            className="relative overflow-hidden rounded-2xl shadow-lg group"
          >
            <img
              src={image.src}
              alt={`Praise memory ${index + 1}`}
              className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <figcaption className="sr-only">
              Praise memory {index + 1}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
};
