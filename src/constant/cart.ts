import IProduct from "./product";

interface ICart {
  id: number;
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
  products: IProduct[];
}

export default ICart;
