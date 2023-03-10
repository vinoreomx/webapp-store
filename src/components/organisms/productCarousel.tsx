import { useState } from 'react';
import type { Category, Product } from '@prisma/client';
import { trpc } from '@/lib/trpc';

import { ProductCard } from '@/components/molecules/productCard';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useDeviceWidth } from '@/lib/hooks/useDeviceWidth';
import { carrouselStyle, itemsPerCarrousel } from '@/lib/products';
import { Heading, HeadingSizes } from '../atoms/heading';

type Props = {
  category?: Category;
  favorite?: boolean;
  tag?: string;
  tagClassName?: string;
  className?: string;
  showDescriptions?: boolean;
  ignoredIds?: string[];
};

export const ProductCarousel = ({
  category,
  tag,
  favorite = false,
  className,
  showDescriptions = true,
  ignoredIds,
}: Props) => {
  const router = useRouter();
  const [page, setPage] = useState(0);

  const { screen } = useDeviceWidth();
  const { wrapper } = carrouselStyle(screen);

  const limit = itemsPerCarrousel(screen);
  const { data, fetchNextPage, isLoading, isFetchingNextPage } = trpc.product.getBatch.useInfiniteQuery(
    {
      limit,
      categoryId: category?.id,
      favorite,
      ignoredIds,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const handleFetchNextPage = async () => {
    await fetchNextPage();
    setPage((prev) => prev + 1);
  };

  const handleFetchPreviousPage = () => {
    setPage((prev) => prev - 1);
  };

  const handleCardClick = (name: Product['name']) => {
    router.push(`/product/${name}`);
  };

  const renderLoadingCards = () => {
    const cards = [];

    for (let i = 0; i < limit; i++) {
      cards.push(<ProductCard showAddToCartBtn={false} showDetailsBtn={false} key={i} />);
    }
    return cards;
  };

  const toShow = data?.pages[page]?.items;
  // figure out last page
  const nextCursor = data?.pages[page]?.nextCursor;

  // don't show empty categories
  if (toShow?.length === 0) return null;

  return (
    <div
      className={`relative mt-6 flex flex-col items-center justify-center md:px-12 ${wrapper} ${className ?? ''}`}
    >
      <Heading size={HeadingSizes["9xl"]} className='uppercase'>
        <span id={`${tag || category?.name || '#'}`}>
          {tag || category?.name || 'Products'}
        </span>
      </Heading>
      <div className="relative mt-2 flex w-full justify-center">
        {isLoading || (isFetchingNextPage && !toShow) ? <>{renderLoadingCards()}</> : null}
        {!isLoading &&
          toShow?.map((product, idx) => (
            <ProductCard
              key={product.id ?? idx}
              product={product}
              onClick={() => handleCardClick(product.name)}
              showDetailsBtn={false}
              showDescription={showDescriptions}
            />
          ))}
        {nextCursor && (
          <button
            className="carousel-control-next absolute top-0 bottom-0 -right-14 
                flex items-center justify-center border-0 p-0 text-center 
                hover:no-underline hover:outline-none focus:no-underline focus:outline-none"
            type="button"
            onClick={handleFetchNextPage}
          >
            <Image src="/arrow_forward.svg" width={50} height={50} layout="fixed" alt="next" />
          </button>
        )}
        {page > 0 && (
          <button
            className="carousel-control-prev absolute top-0 bottom-0 -left-10 
                flex items-center justify-center border-0 p-0 text-center 
                hover:no-underline hover:outline-none focus:no-underline focus:outline-none"
            type="button"
            onClick={handleFetchPreviousPage}
          >
            <Image src="/arrow_back.svg" width={50} height={50} layout="fixed" alt="prev" />
          </button>
        )}
      </div>
    </div>
  );
};
