import Head from 'next/head';
import superjson from 'superjson';
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

import { ProductSearchbar } from '@/components/molecules/productSearchbar';
import { ProductCarousel } from '@/components/organisms/productCarousel';

import { trpc } from '@/utils/trpc';
import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import { appRouter } from '@/server/trpc/router';
import { createContext } from '@/server/trpc/context';
import { IKImage } from 'imagekitio-react';
import { env } from '@/env/client.mjs';
import { Pill } from '@/components/atoms/pill';

const carouselUrls = [
  '/hero-1.png?ik-sdk-version=javascript-1.4.3&updatedAt=1673917229291',
  '/hero-2.png?ik-sdk-version=javascript-1.4.3&updatedAt=1673917231502',
  '/hero-3.png?ik-sdk-version=javascript-1.4.3&updatedAt=1673917229711',
];

const Home = () => {
  const { data: categories } = trpc.category.getAll.useQuery();

  return (
    <>
      <Head>
        <title>Vinoreo</title>
        <meta name="description" content="Main Store Page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto flex md:min-h-screen flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold text-gray-700">Bienvenido a Vinoreo</h1>
        <Carousel
          showStatus={false}
          showArrows={true}
          infiniteLoop
          autoPlay
          interval={3500}
          transitionTime={1000}
          className="w-full md:w-3/4"
        >
          {carouselUrls.map((url) => {
            return (
              <div key={url}>
                <IKImage
                  urlEndpoint={env.NEXT_PUBLIC_IMAGEKIT_URL}
                  path={url}
                  // transformation={[{ height: 500, width: 500 }]}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
            );
          })}
        </Carousel>
        <h3 className="mt-6 text-xl font-bold text-gray-700">Estás buscando algo?</h3>
        <ul className="md:my-12 my-6 flex w-full flex-wrap md:flex-row pl-0 md:w-3/4 ">
          {categories?.map((category) => {
            return (
              <li className="flex-auto text-center" key={category.id}>
                <Pill href={`/category/${category.id}`} className="bg-blue-500 text-lg">
                  {category.name}
                </Pill>
              </li>
            );
          })}
        </ul>
        <ProductSearchbar className='mb-6 md:mb-12' />
      </div>
    </>
  );
};

export default Home;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContext({ req: ctx.req as NextApiRequest, res: ctx.res as NextApiResponse }),
    transformer: superjson,
  });

  await ssg.category.getAll.prefetch();

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
};
