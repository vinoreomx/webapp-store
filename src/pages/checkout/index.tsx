import { send } from 'emailjs-com';
import { useForm } from 'react-hook-form';
import { Order } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

import { useCartItems } from '../../lib/hooks/useCartItems';
import { trpc } from '../../lib/utils/trpc';


const checkoutDefaultValues = {
  address: 'Foo Address',
  city: 'Bar City',
  country: 'Mars',
  postalCode: '666',
  phone: '6666666666',
};

interface CheckoutFormValues {
  address: string;
  city: string;
  country: string;
  postalCode: string;
  phone: string;
}

// todo: don't hardcode userId
const userId = 'cl9iv3dwe0004m2q1zvdtt420';

const Checkout = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: checkoutDefaultValues });

  const { cartItems } = useCartItems();

  const userLastOder = trpc.useQuery(['order.getByUserId', { userId: userId }]);
  const userAllOrders = trpc.useQuery(['order.getAll']);

  // console.log('userLastOder', userLastOder.data);
  // console.log('userAllOrders', userAllOrders.data);

  const createOrder = trpc.useMutation('order.create', {
    onMutate: async (values) => {
      // optimistic update
      // mutation about to happen
    },

    onSuccess: async (data, variables, context) => {
      // do stuff after mutation success
    },



    onError: (err, values, context) => {
      // rollback?
    },
    onSettled: () => {
      // Error or success... doesn't matter!
      // queryClient.invalidateQueries('order.getAll');
    },
  });

  const handleFormSubmit = async (data: CheckoutFormValues) => {

    // tried with with mutateAsync but received undefined
    const { mutateAsync } = createOrder;
    const res = await mutateAsync({
      userId: userId,
      orderItems: Object.values(cartItems).map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
      // todo: figure out why array in Order model
      orderDetail: {
        address: data.address,
        city: data.city,
        country: data.country,
        postalCode: data.postalCode,
        phone: data.phone,
      },
    });
    console.log('successful ', res);

    // this doesn't work
    // if (res && res.id) {
    //   trpc.useQuery(['order.getById', { id: res.id }], {
    //     onSuccess: (data) => {
    //       console.log('do stuff with the just created order like sending this data!', data);
    //     },
    //   });
    // }

          // send(
      //   process.env.EMAILJS_SERVICE_ID as string,
      //   process.env.EMAILJS_TEMPLATE_ID as string,
      //   {
      //     // update email body with the order details and real user details
      //     message_html: 'test',
      //     to_name: 'Buyer',
      //     to_email: 'esponges@gmail.com',
      //     from_name: 'cool shop',
      //     reply_to: process.env.EMAILJS_FROM_EMAIL as string,
      //   },
      //   process.env.EMAILJS_USER_ID_PUBLIC_KEY as string
      // )
      //   .then((response) => {
      //     console.log('SUCCESS!', response.status, response.text);
      //   })
      //   .catch((err) => {
      //     console.log('FAILED...', err);
      //   });
      
    // clear cart after order is created
    // and redirect to success page etc
  };

  return (
    <div className="px-10 py-5">
      <h1 className="mb-10">Checkout</h1>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="md:w-[50]">
        <div className="mb-5 grid">
          <label htmlFor="address" className="form-label font-bold">
            Address
          </label>
          <input type="text" className="form-control" id="address" {...register('address', { required: true })} />
          {errors.address && <span className="text-danger">This field is required</span>}
        </div>
        <div className="mb-5 grid">
          <label htmlFor="city" className="form-label font-bold">
            City
          </label>
          <input type="text" className="form-control" id="city" {...register('city', { required: true })} />
          {errors.city && <span className="text-danger">This field is required</span>}
        </div>
        <div className="mb-5 grid">
          <label htmlFor="country" className="form-label font-bold">
            Country
          </label>
          <input type="text" className="form-control" id="country" {...register('country', { required: true })} />
          {errors.country && <span className="text-danger">This field is required</span>}
        </div>
        <div className="mb-5 grid">
          <label htmlFor="postalCode" className="form-label font-bold">
            Postal Code
          </label>
          <input type="text" className="form-control" id="postalCode" {...register('postalCode', { required: true })} />
          {errors.postalCode && <span className="text-danger">This field is required</span>}
        </div>
        <div className="mb-5 grid">
          <label htmlFor="phone" className="form-label font-bold">
            Phone
          </label>
          <input type="text" className="form-control" id="phone" {...register('phone', { required: true })} />
          {errors.phone && <span className="text-danger">This field is required</span>}
        </div>
        <button type="submit" className="btn btn-primary mt-5">
          Proceed and pay
        </button>
      </form>
    </div>
  );
};

export default Checkout;
