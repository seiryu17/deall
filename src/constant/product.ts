interface IProduct {
  id: number;
  title: string;
  brand: string;
  price: number;
  stock: number;
  category: string;
  description: string;
  discountPercentage: number;
  images: string[];
  rating: number;
  thumbnail: string;
}

export default IProduct;
