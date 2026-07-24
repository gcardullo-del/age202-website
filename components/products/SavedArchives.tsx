"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import ProductCard from "@/components/products/ProductCard";
import type { Product } from "@/data/products";

type SavedArchivesProps = {
  products: Product[];
};

const STORAGE_KEY = "age202-saved-archives";

export default function SavedArchives({
  products,
}: SavedArchivesProps) {
  const [savedProductIds, setSavedProductIds] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    function loadSavedArchives() {
      try {
        const storedValue = localStorage.getItem(STORAGE_KEY);

        if (!storedValue) {
          setSavedProductIds([]);
          return;
        }

        const parsedValue: unknown = JSON.parse(storedValue);

        if (!Array.isArray(parsedValue)) {
          setSavedProductIds([]);
          return;
        }

        const validIds = parsedValue.filter(
          (item): item is string => typeof item === "string"
        );

        setSavedProductIds(validIds);
      } catch {
        setSavedProductIds([]);
      } finally {
        setIsReady(true);
      }
    }

    loadSavedArchives();

    window.addEventListener("storage", loadSavedArchives);

    return () => {
      window.removeEventListener("storage", loadSavedArchives);
    };
  }, []);

  const savedProducts = products.filter((product) =>
    savedProductIds.includes(product.id)
  );

  function clearSavedArchives() {
    localStorage.removeItem(STORAGE_KEY);
    setSavedProductIds([]);
  }

  if (!isReady) {
    return (
      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-[520px] animate-pulse rounded-[32px] border border-white/10 bg-white/[0.03]"
          />
        ))}
      </div>
    );
  }

  if (savedProducts.length === 0) {
    return (
      <div className="rounded-[40px] border border-white/10 bg-[#111B2E] px-6 py-20 text-center md:px-12 md:py-28">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#C8FF00]/20 bg-[#C8FF00]/10">
          <BookmarkIcon />
        </div>

        <p className="mt-8 text-sm font-black uppercase tracking-[0.35em] text-[#C8FF00]">
          Your Collection
        </p>

        <h2 className="mt-5 text-3xl font-black text-white md:text-5xl">
          No saved archive pieces yet.
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-400">
          Explore the AGE202 archive and save the pieces that belong in your
          personal tennis collection.
        </p>

        <Link
          href="/"
          className="mt-10 inline-flex rounded-full bg-[#C8FF00] px-8 py-4 text-sm font-black uppercase tracking-[0.15em] text-black transition-all duration-300 hover:scale-105 hover:shadow-[0_0_35px_rgba(200,255,0,.25)]"
        >
          Explore the Archive →
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-5 border-b border-white/10 pb-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-gray-400">
          {savedProducts.length}{" "}
          {savedProducts.length === 1
            ? "saved piece"
            : "saved pieces"}
        </p>

        <button
          type="button"
          onClick={clearSavedArchives}
          className="self-start text-xs font-black uppercase tracking-[0.25em] text-gray-500 transition-colors hover:text-red-400 sm:self-auto"
        >
          Clear saved archives
        </button>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {savedProducts.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            image={product.image}
            player={product.player}
            brand={product.brand}
            title={product.title}
            tournament={product.tournament}
            year={product.year}
            price={product.price}
            available={product.available}
          />
        ))}
      </div>
    </div>
  );
}

function BookmarkIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-9 w-9 text-[#C8FF00]"
    >
      <path
        d="M7 4.75A1.75 1.75 0 0 1 8.75 3h6.5A1.75 1.75 0 0 1 17 4.75V21l-5-3.25L7 21V4.75Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}