import Head from 'next/head';
import { ProductSearchbar } from '../components/molecules/productSearchbar';
import { ProductCarousel } from '../components/organisms/productCarousel';
import { trpc } from '../utils/trpc';

const Home = () => {
  const { data: categories, isLoading } = trpc.category.getAll.useQuery();

  return (
    <>
      <Head>
        <title>Store</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold text-gray-700">Welcome to our store!</h1>
        <h3 className="text-xl font-bold text-gray-700 mt-6">What are you looking for?</h3>
        <ProductSearchbar />
        <ul className="flex flex-col gap-4 mt-4">
          {isLoading && <p>Loading items...</p>}
          {categories?.length && (
            categories.map((category) => (
              <ProductCarousel key={category.id} category={category} />
            ))
          )}
        </ul>
      </main>
    </>
  );
};

export default Home;
