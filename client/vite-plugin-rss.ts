// client/vite-plugin-rss.ts
import { promises as fs } from 'fs';
import path from 'path';
import type { Plugin } from 'vite';
import { getNewsletterIssues } from './src/lib/cms';

// Use Netlify's URL env var in production, fallback to localhost for dev
const SITE_URL = process.env.URL || process.env.DEPLOY_URL || 'http://localhost:5000';
const SITE_TITLE = 'Firehouse Lawyer Newsletter';
const SITE_DESCRIPTION = 'Latest newsletters from Firehouse Lawyer';

export function vitePluginRss(): Plugin {
  return {
    name: 'vite-plugin-rss',
    async writeBundle() {
      const newsletters = await getNewsletterIssues(true); // isServer: true

      const xml = `<?xml version="1.0" encoding="UTF-8" ?>
        <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
          <channel>
            <title><![CDATA[${SITE_TITLE}]]></title>
            <description><![CDATA[${SITE_DESCRIPTION}]]></description>
            <link>${SITE_URL}</link>
            <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
            <language>en-us</language>
            ${newsletters.map(item => `
              <item>
                <title><![CDATA[${item.title}]]></title>
                <link>${SITE_URL}/newsletters/${item.slug || item.title.toLowerCase().replace(/\s+/g, '-')}</link>
                <guid isPermaLink="true">${SITE_URL}/newsletters/${item.slug || item.title.toLowerCase().replace(/\s+/g, '-')}</guid>
                <pubDate>${new Date(item.date).toUTCString()}</pubDate>
                <description><![CDATA[${item.description}]]></description>
                ${item.pdf_url ? `<enclosure url="${item.pdf_url.startsWith('http') ? item.pdf_url : SITE_URL + item.pdf_url}" type="application/pdf"/>` : ''}
                ${item.pdf_url ? `<media:content url="${item.pdf_url.startsWith('http') ? item.pdf_url : SITE_URL + item.pdf_url}" medium="document"/>` : ''}
              </item>
            `).join('')}
          </channel>
        </rss>`;

      const outputPath = path.join(process.cwd(), 'dist/public/rss.xml');
      // Ensure the directory exists
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.writeFile(outputPath, xml);
      console.log('RSS feed generated at dist/public/rss.xml');
    }
  };
}