import { AbstractResource } from "@/services/api/AbstractResource";
import { CartProduct } from "@/services/api/types";

export class CustomerOrdersCartProductsResource extends AbstractResource<CartProduct> {
  protected url = '/customers'

  async create(customerId: number, orderId: number, cartProducts: CartProduct[]) {
    return super.post(`${this.url}/${customerId}/orders/${orderId}/cart-products`, { cart: cartProducts })
  }
}
