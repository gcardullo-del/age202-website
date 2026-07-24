import type { Product } from "@/data/product.types";

function normalizeText(value: string | number | undefined): string {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function getProductSearchText(product: Product): string {
  return normalizeText(
    [
      product.title,
      product.player,
      product.tournament,
      product.year,
      product.brand,
      product.category,
      product.collection,
      product.description,
      product.museumStory,
      product.size,
      product.color,
      product.condition,
      product.status,
      ...product.tags,
    ].join(" ")
  );
}

export function searchProducts(
  products: Product[],
  query: string
): Product[] {
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) {
    return products;
  }

  const searchTerms = normalizedQuery
    .split(/\s+/)
    .filter(Boolean);

  return products.filter((product) => {
    const searchableText = getProductSearchText(product);

    return searchTerms.every((term) =>
      searchableText.includes(term)
    );
  });
}