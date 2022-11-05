import Head from 'next/head';
import Link from 'next/link';
import { trpc } from '../utils/trpc';

const Home = () => {
  const { data: products, isLoading } = trpc.product.getAll.useQuery();

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold text-gray-700">Welcome to our store!</h1>
        <p className="text-lg text-gray-600">The are the following products in the DB:</p>
        <ul className="flex flex-col gap-4 mt-4">
          {isLoading && <p>Loading items...</p>}
          {products?.map((product) => (
            <li key={product.id} className="flex flex-col gap-2">
              <span className="text-lg font-bold text-gray-700">{product.name}</span>
              <span className="text-sm text-gray-600">{product.description}</span>
              <Link href={`/product/${product.id}`}>
                <a className="text-sm text-violet-500 underline decoration-dotted underline-offset-2">View Product</a>
              </Link>
            </li>
          ))}
        </ul>
        <h3 className="mt-4 text-lg text-gray-600">You can also check the cart:</h3>
        <Link href="/cart">
          <a className="mt-2 text-sm text-violet-500 underline decoration-dotted underline-offset-2">Go to Cart</a>
        </Link>
      </main>
    </>
  );
};

export default Home;
