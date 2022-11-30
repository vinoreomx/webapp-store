import { useMemo } from 'react';

import type { ColumnDef } from '@tanstack/react-table';
import type { Item as CartItem } from '../../store/cart';

import { useCartItems } from '../../lib/hooks/useCartItems';

import { Table } from '../../components/molecules/table';
import { Button } from '../../components/atoms/button';
import { Header } from '../../components/atoms/header';
import { Container } from '../../components/molecules/container';

export type TableItem = Pick<CartItem, 'name' | 'price' | 'quantity'>;

const Cart = () => {
  const { cartItems, cartTotal } = useCartItems();

  const tableItems: TableItem[] = Object.values(cartItems).map(({ name, price, quantity }) => ({
    name,
    price,
    quantity,
    cartTotal,
  }));

  const cols = useMemo<ColumnDef<TableItem>[]>(
    () => [
      {
        header: 'Name',
        cell: (row) => row.renderValue(),
        accessorKey: 'name',
        footer: 'Total',
      },
      {
        header: 'Price',
        cell: (row) => row.renderValue(),
        accessorKey: 'price',
        footer: () => cartTotal,
      },
      {
        header: 'Quantity',
        cell: (row) => row.renderValue(),
        accessorKey: 'quantity',
      },
    ],
    [cartTotal]
  );

  return (
    <Container>
      <Header extraClassName="text-center">Cart Items</Header>
      <Table data={tableItems} columns={cols} showGlobalFilter showNavigation={false} />
      <div className="mt-5 flex justify-center">
        <Button variant="link" href="/" extraClassName="mr-5">
          Go Back
        </Button>
        <Button variant="link" href="/checkout" extraClassName="ml-5">
          Checkout
        </Button>
      </div>
    </Container>
  );
};

export default Cart;
