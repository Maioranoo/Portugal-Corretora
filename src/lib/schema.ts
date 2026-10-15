import { PRODUCTS, type Faq } from '../content/products';
import { SUB_PAGES } from '../content/sub-pages';
import { AREA_SERVED, COMPANY } from '../content/site';

export const SITE_URL = 'https://www.portugalcorretora.com.br';
export const ORG_ID = `${SITE_URL}/#corretora`;
export const WEBSITE_ID = `${SITE_URL}/#site`;

export type JsonLdNode = Record<string, unknown>;
export interface Crumb {
  name: string;
  path: string;
}

const abs = (path: string) => new URL(path, SITE_URL).href;
const phone = `+${COMPANY.whatsapp}`;
const cities = () =>
  AREA_SERVED.map((name) => ({ '@type': 'City', name, containedInPlace: { '@type': 'State', name: 'São Paulo' } }));

// Só dados reais: nada de nota, prêmio ou certificação que não esteja publicado e comprovado.
export function organizationNode(): JsonLdNode {
  return {
    '@type': 'InsuranceAgency',
    '@id': ORG_ID,
    name: COMPANY.name,
    legalName: COMPANY.legalName,
    taxID: COMPANY.cnpj,
    identifier: { '@type': 'PropertyValue', propertyID: 'SUSEP', value: COMPANY.susep },
    url: abs('/'),
    logo: { '@type': 'ImageObject', url: abs('/icon-512.png'), width: 512, height: 512 },
    image: abs('/og.v2.jpg'),
    telephone: phone,
    email: COMPANY.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${COMPANY.address.street}, ${COMPANY.address.district}`,
      addressLocality: COMPANY.address.city,
      addressRegion: COMPANY.address.state,
      postalCode: COMPANY.address.zip,
      addressCountry: 'BR',
    },
    hasMap: COMPANY.address.mapsUrl,
    areaServed: cities(),
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: phone,
      email: COMPANY.email,
      availableLanguage: 'Portuguese',
    },
    knowsAbout: [...PRODUCTS.map((p) => p.name), ...SUB_PAGES.map((s) => s.name)],
    sameAs: [COMPANY.social.facebook, COMPANY.social.instagram],
  };
}

export function websiteNode(): JsonLdNode {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: abs('/'),
    name: COMPANY.name,
    inLanguage: 'pt-BR',
    publisher: { '@id': ORG_ID },
  };
}

export function breadcrumbNode(items: readonly Crumb[], path: string): JsonLdNode {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${abs(path)}#trilha`,
    itemListElement: items.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: abs(c.path) })),
  };
}

export function serviceNode(input: { name: string; path: string; description: string }): JsonLdNode {
  return {
    '@type': 'Service',
    '@id': `${abs(input.path)}#servico`,
    name: input.name,
    serviceType: input.name,
    description: input.description,
    url: abs(input.path),
    provider: { '@id': ORG_ID },
    areaServed: cities(),
  };
}

export function faqNode(faqs: readonly Faq[], path: string): JsonLdNode {
  return {
    '@type': 'FAQPage',
    '@id': `${abs(path)}#faq`,
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
}

export function buildGraph(nodes: readonly JsonLdNode[]) {
  return { '@context': 'https://schema.org', '@graph': [organizationNode(), websiteNode(), ...nodes] };
}

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
