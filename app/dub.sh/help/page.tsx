import { constructMetadata } from "#/lib/utils";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { allHelpPosts } from "contentlayer/generated";
import { CATEGORIES, POPULAR_ARTICLES } from "#/lib/constants/content";
import SearchButton from "#/ui/content/search-button";
import CategoryCard from "#/ui/content/category-card";
import ArticleLink from "#/ui/content/article-link";

export const metadata = constructMetadata({
  title: "Help Center – Dub",
});

export default function HelpCenter() {
  const popularArticles = POPULAR_ARTICLES.map(
    (slug) => allHelpPosts.find((post) => post.slug === slug)!,
  );

  const categories = CATEGORIES.map((category) => ({
    ...category,
    postCount: allHelpPosts.filter((post) =>
      post.categories.includes(category.slug),
    ).length,
  }));

  return (
    <>
      <MaxWidthWrapper className="max-w-screen-lg">
        <div className="flex flex-col space-y-4 py-10">
          <h1 className="font-display text-xl font-bold text-gray-700 sm:text-3xl">
            👋 How can we help today?
          </h1>
          <SearchButton />
        </div>
      </MaxWidthWrapper>

      <div className="relative">
        <div className="absolute top-28 h-full w-full border border-gray-200 bg-white/50 shadow-[inset_10px_-50px_94px_0_rgb(199,199,199,0.2)] backdrop-blur-lg" />
        <MaxWidthWrapper className="max-w-screen-lg pb-20">
          <div className="relative mb-10 rounded-xl border border-gray-200 bg-white px-4 py-6">
            <h2 className="px-4 font-display text-2xl font-bold text-gray-700">
              Popular Articles
            </h2>
            <div className="mt-4 grid gap-2 md:grid-cols-2">
              {popularArticles.map((article) => (
                <ArticleLink key={article.slug} article={article} />
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard
                key={category.slug}
                href={`/help/category/${category.slug}`}
                name={category.title}
                description={category.description}
                icon={category.icon}
                pattern={{
                  y: 16,
                  squares: [
                    [0, 1],
                    [1, 3],
                  ],
                }}
              />
            ))}
          </div>
        </MaxWidthWrapper>
      </div>
    </>
  );
}
