import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CategoryTabs } from "../components/filters/CategoryTabs";
import { MasonryGrid } from "../components/media/MasonryGrid";
import { PhotoCard } from "../components/media/PhotoCard";
import { usePaginatedSlice } from "../hooks/usePaginatedSlice";
import { subscribePublishedCategories, subscribePublishedCollection } from "../lib/firestoreService";
import { categoryMatchesValue, findItemCategory, normalizeCategoryValue } from "../utils/categoryMatching";

const GALLERY_CATEGORY_ORDER = [
  "engagement",
  "prewedding",
  "sangeeth",
  "haldhi",
  "wedding",
  "reception",
  "birthday",
  "babyshoot"
];

function normalizeCategoryName(category) {
  return normalizeCategoryValue(category.slug || category.name || category.id);
}

function categoryMatchesRequest(category, requestedCategory) {
  return categoryMatchesValue(category, requestedCategory);
}

function getCategorySearchValue(category) {
  return category.slug || category.name || category.id;
}

export function GalleryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");
  const requestedCategory = normalizeCategoryValue(searchParams.get("category"));

  useEffect(() => {
    let categoryRows = [];
    let photoRows = [];
    const sync = () => {
      const galleryCategories = categoryRows
        .filter((category) => GALLERY_CATEGORY_ORDER.includes(normalizeCategoryName(category)))
        .sort(
          (a, b) =>
            GALLERY_CATEGORY_ORDER.indexOf(normalizeCategoryName(a)) -
            GALLERY_CATEGORY_ORDER.indexOf(normalizeCategoryName(b))
        );
      setCategories(galleryCategories);
      setPhotos(
        [...photoRows]
          .map((photo) => {
            const category = findItemCategory(photo, galleryCategories);
            return category
              ? { ...photo, categoryId: category.id, categoryName: category.name }
              : null;
          })
          .filter(Boolean)
          .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")))
      );
    };
    const stopCategories = subscribePublishedCategories((rows) => { categoryRows = rows; sync(); });
    const stopPhotos = subscribePublishedCollection("photos", (rows) => { photoRows = rows; sync(); });
    return () => {
      stopCategories();
      stopPhotos();
    };
  }, []);

  useEffect(() => {
    if (!categories.length) {
      if (activeCategory) {
        setActiveCategory("");
      }
      return;
    }

    const requestedMatch = requestedCategory
      ? categories.find((category) => categoryMatchesRequest(category, requestedCategory))
      : null;
    const currentCategoryExists = categories.some((category) => category.id === activeCategory);
    const nextCategory = requestedCategory
      ? requestedMatch?.id || categories[0]?.id || ""
      : currentCategoryExists
        ? activeCategory
        : categories[0]?.id || "";

    if (nextCategory !== activeCategory) {
      setActiveCategory(nextCategory);
    }
  }, [categories, activeCategory, requestedCategory]);

  const filtered = useMemo(() => {
    return photos.filter((photo) => photo.categoryId === activeCategory);
  }, [photos, activeCategory]);

  const { visible, hasMore, loadMore, reset } = usePaginatedSlice(filtered, 12);

  useEffect(() => {
    reset();
  }, [activeCategory, reset]);

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);

    const category = categories.find((item) => item.id === categoryId);
    setSearchParams((currentParams) => {
      if (category) {
        currentParams.set("category", getCategorySearchValue(category));
      } else {
        currentParams.delete("category");
      }
      return currentParams;
    });
  };

  return (
    <section className="section gallery-page">
      <div className="container">
        <div className="filters-row filters-row--gallery">
          <CategoryTabs categories={categories} active={activeCategory} onChange={handleCategoryChange} allowAll={false} />
        </div>
        <MasonryGrid>
          {visible.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} />
          ))}
        </MasonryGrid>
        {hasMore && (
          <div className="load-more-row">
            <button type="button" className="btn btn-soft" onClick={loadMore}>
              Load More
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
