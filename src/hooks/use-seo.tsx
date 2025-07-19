import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  keywords?: string;
  image?: string;
  type?: string;
  noindex?: boolean;
  structuredData?: Record<string, any>;
}

export const useSEO = ({
  title,
  description,
  canonical,
  keywords,
  image,
  type = 'website',
  noindex = false,
  structuredData
}: SEOProps) => {
  useEffect(() => {
    // Update title
    if (title) {
      document.title = title.includes('Vireia AI') ? title : `${title} | Vireia AI`;
    }

    // Update meta description
    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', description);
    }

    // Update keywords
    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', keywords);
    }

    // Update canonical URL
    if (canonical) {
      let linkCanonical = document.querySelector('link[rel="canonical"]');
      if (!linkCanonical) {
        linkCanonical = document.createElement('link');
        linkCanonical.setAttribute('rel', 'canonical');
        document.head.appendChild(linkCanonical);
      }
      linkCanonical.setAttribute('href', canonical);
    }

    // Update robots meta
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.setAttribute('name', 'robots');
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute('content', noindex ? 'noindex, nofollow' : 'index, follow');

    // Update Open Graph tags
    const ogTags = [
      { property: 'og:title', content: title || 'Vireia AI | ATS-Friendly Resume Builder' },
      { property: 'og:description', content: description || 'Create professional, ATS-optimized resumes with AI-powered assistance. Land your dream job with Vireia AI resume builder.' },
      { property: 'og:type', content: type },
      { property: 'og:url', content: canonical || window.location.href },
      { property: 'og:image', content: image || 'https://cdn.sanity.io/images/mrfd4see/production/e3f234428152d737495819dd61790c8cb1cbdc3c-1498x878.png?w=1200&fit=max&auto=format' },
      { property: 'og:site_name', content: 'Vireia AI' },
      { property: 'og:locale', content: 'en_US' }
    ];

    ogTags.forEach(({ property, content }) => {
      if (content) {
        let metaTag = document.querySelector(`meta[property="${property}"]`);
        if (!metaTag) {
          metaTag = document.createElement('meta');
          metaTag.setAttribute('property', property);
          document.head.appendChild(metaTag);
        }
        metaTag.setAttribute('content', content);
      }
    });

    // Update Twitter Card tags
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@vireiaai' },
      { name: 'twitter:creator', content: '@vireiaai' },
      { name: 'twitter:title', content: title || 'Vireia AI | Resume Builder' },
      { name: 'twitter:description', content: description || 'Create professional, ATS-optimized resumes with AI-powered assistance.' },
      { name: 'twitter:image', content: image || 'https://www.vireia.com/og-image.png' }
    ];

    twitterTags.forEach(({ name, content }) => {
      if (content) {
        let metaTag = document.querySelector(`meta[name="${name}"]`);
        if (!metaTag) {
          metaTag = document.createElement('meta');
          metaTag.setAttribute('name', name);
          document.head.appendChild(metaTag);
        }
        metaTag.setAttribute('content', content);
      }
    });

    // Add structured data
    if (structuredData) {
      let script = document.querySelector('script[type="application/ld+json"]#dynamic-structured-data');
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        script.setAttribute('id', 'dynamic-structured-data');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(structuredData);
    }

    // Cleanup function
    return () => {
      // Remove dynamic structured data on cleanup
      const dynamicScript = document.querySelector('script[type="application/ld+json"]#dynamic-structured-data');
      if (dynamicScript) {
        dynamicScript.remove();
      }
    };
  }, [title, description, canonical, keywords, image, type, noindex, structuredData]);
};