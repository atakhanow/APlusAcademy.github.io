import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'course' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  structuredData?: object;
}

export function SEO({
  title = 'A+ Academy — Professional IT, IELTS & CEFR Kurslar',
  description = 'A+ Academy — IT, tillar va abituriyentlar uchun zamonaviy ta\'lim. Professional o\'qituvchilar bilan yuqori natija kafolatlanadi. IELTS, CEFR, dasturlash va boshqa kurslar.',
  keywords = 'IELTS, CEFR, IT kurslar, dasturlash, ingliz tili, ta\'lim, o\'quv markazi, Toshkent, A+ Academy',
  image = '/og-image.jpg', // Default Open Graph rasm
  url = typeof window !== 'undefined' ? window.location.href : '',
  type = 'website',
  author = 'A+ Academy',
  publishedTime,
  modifiedTime,
  structuredData,
}: SEOProps) {
  const fullTitle = title.includes('A+ Academy') ? title : `${title} | A+ Academy`;
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const fullImageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;
  const fullUrl = url.startsWith('http') ? url : `${siteUrl}${url}`;

  useEffect(() => {
    // Document title
    document.title = fullTitle;

    // Meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // Meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', keywords);

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', fullUrl);

    // Open Graph tags
    const ogTags = [
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: description },
      { property: 'og:image', content: fullImageUrl },
      { property: 'og:url', content: fullUrl },
      { property: 'og:type', content: type },
      { property: 'og:site_name', content: 'A+ Academy' },
      { property: 'og:locale', content: 'uz_UZ' },
    ];

    if (publishedTime) {
      ogTags.push({ property: 'article:published_time', content: publishedTime });
    }
    if (modifiedTime) {
      ogTags.push({ property: 'article:modified_time', content: modifiedTime });
    }
    if (author) {
      ogTags.push({ property: 'article:author', content: author });
    }

    ogTags.forEach(({ property, content }) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    });

    // Twitter Card tags
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: fullImageUrl },
    ];

    twitterTags.forEach(({ name, content }) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    });

    // Structured Data (JSON-LD)
    if (structuredData) {
      // Oldingi structured data ni o'chirish
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        existingScript.remove();
      }

      // Yangi structured data qo'shish
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }
  }, [fullTitle, description, keywords, fullImageUrl, fullUrl, type, author, publishedTime, modifiedTime, structuredData]);

  return null;
}

