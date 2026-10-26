import React, { useEffect } from 'react';
import { SEO_METADATA, type PageSeoMeta } from '../../data/siteContent';

interface PageMetaProps {
  pageKey?: keyof typeof SEO_METADATA;
  customMeta?: PageSeoMeta;
  title?: string;
  description?: string;
  path?: string;
}

export const PageMeta: React.FC<PageMetaProps> = ({
  pageKey,
  customMeta,
  title,
  description,
  path,
}) => {
  const directMeta: PageSeoMeta | undefined =
    title && description && path ? { title, description, path } : undefined;
  const meta =
    customMeta ?? directMeta ?? (pageKey ? SEO_METADATA[pageKey] : SEO_METADATA.home);

  useEffect(() => {
    if (!meta) return;

    document.title = meta.title;

    const setMetaContent = (selector: string, content: string) => {
      const el = document.querySelector(selector);
      if (el) {
        el.setAttribute('content', content);
      }
    };

    setMetaContent('meta[name="description"]', meta.description);
    setMetaContent('meta[property="og:title"]', meta.title);
    setMetaContent('meta[property="og:description"]', meta.description);
    setMetaContent('meta[property="og:url"]', `https://revatya.space${meta.path}`);
    setMetaContent('meta[name="twitter:title"]', meta.title);
    setMetaContent('meta[name="twitter:description"]', meta.description);

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', `https://revatya.space${meta.path}`);
    }
  }, [meta]);

  return null;
};
