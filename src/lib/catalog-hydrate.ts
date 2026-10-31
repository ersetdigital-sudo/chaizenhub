import {
  services as baseServices,
  serviceSlugs,
  type PriceItem,
  type Service,
} from "@/lib/catalog";
import {
  getCatalog,
  type CatalogMethod,
  type CatalogService,
} from "@/lib/db/server";
import type { WebBrand } from "@/lib/db/types";

function hydrateService(service: Service, dbService: CatalogService): Service {
  if (service.byProvider) {
    let cursor = 0;
    const byProvider: Record<string, PriceItem[]> = {};
    for (const [provider, items] of Object.entries(service.byProvider)) {
      byProvider[provider] = items.map((item) => {
        const dbProduct =
          dbService.products.find(
            (product) => product.nama === `${provider} · ${item[0]}`,
          ) ?? dbService.products[cursor];
        cursor += 1;
        return dbProduct
          ? ([item[0], dbProduct.hargaJual, dbProduct.id] as PriceItem)
          : item;
      });
    }
    return { ...service, dbServiceId: dbService.dbId, byProvider };
  }

  if (service.bill) {
    const product = dbService.products[0];
    return {
      ...service,
      dbServiceId: dbService.dbId,
      items: product
        ? ([[product.nama, product.hargaJual, product.id]] as PriceItem[])
        : [],
    };
  }

  let index = 0;
  const items = (service.items ?? []).map((item) => {
    const dbProduct =
      dbService.products.find((product) => product.nama === item[0]) ??
      dbService.products[index];
    index += 1;
    return dbProduct
      ? ([item[0], dbProduct.hargaJual, dbProduct.id] as PriceItem)
      : item;
  });

  return { ...service, dbServiceId: dbService.dbId, items };
}

export type Storefront = {
  services: Record<string, Service>;
  methods: CatalogMethod[];
  brand: WebBrand | null;
};

export async function getStorefront(): Promise<Storefront> {
  const result = await getCatalog();
  if (!result.data) {
    return { services: baseServices, methods: [], brand: null };
  }

  const bySlug = new Map(
    result.data.services.map((service) => [service.slug, service]),
  );
  const services = { ...baseServices };
  for (const slug of serviceSlugs) {
    const dbService = bySlug.get(slug);
    if (dbService) services[slug] = hydrateService(services[slug], dbService);
  }

  return {
    services,
    methods: result.data.methods,
    brand: result.data.brand,
  };
}

export async function getHydratedService(slug: string) {
  const storefront = await getStorefront();
  return {
    service: storefront.services[slug] ?? null,
    services: storefront.services,
    methods: storefront.methods,
    brand: storefront.brand,
  };
}
