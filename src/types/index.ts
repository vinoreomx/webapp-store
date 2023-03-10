import type {
  Order,
  OrderDetail,
  User
} from '@prisma/client';
import type { Prisma } from '@prisma/client';

export interface SessionProviders {
  discord: 'discord';
  facebook: 'facebook';
  google: 'google';
}

export enum AuthProviders {
  Discord = 'discord',
  Facebook = 'facebook',
  Google = 'google',
}

export enum PaymentMethods {
  Cash = 'cash',
  Transfer = 'transfer',
  // to implement
  // CreditCard = 'credit-card',
  // DebitCard = 'debit-card',
  // Paypal = 'paypal',
  // MercadoPago = 'mercado-pago',
}

/* Prisma queries don't include relations by default
  https://github.com/prisma/prisma/discussions/10928#discussioncomment-1920961
*/
export type OrderItem = Prisma.OrderItemGetPayload<{
  include: { product: true };
}>;

export type Product = Prisma.ProductGetPayload<{
  include: { category: true; productSpecs: true };
}>;

export type Category = Prisma.CategoryGetPayload<{}>;

export type OrderWithPayload<U extends boolean = false> = Prisma.OrderGetPayload<{
  include: { orderItems: true; orderDetail: true, user: U extends true ? true : false };
}>;

export type OrderWithOptPayload<
  U extends boolean = true,
  D extends boolean = true,
  I extends boolean = true
> = Order & {
  orderItems: I extends true ? OrderItem[] : null;
  orderDetail: D extends true ? OrderDetail | null : null;
  user: U extends true ? User : null;
};

export interface OrderDetails<U extends boolean = true> extends Order {
  orderItems: OrderItem[];
  orderDetail: OrderDetail | null;
  user: U extends true ? User : null;
}

export type ProductTableItem = Product & { category: string };
