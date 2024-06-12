export interface RollData {
  id: string;
  name: string;
  order_number: number;
  size: string[] | string;
  workshop: string;
  total_quantity: number;
  order_date: string;
  completed?: boolean;
  rollcuts: {
    id: string;
    color: string;
    combined: string;
    lining: string;
    quantity: number;
  }[];
  rolldetails: {
    id: string;
    title: string;
    quantity: number;
  }[];
  payments?: { id: string; amount: string; date: string; signature: string }[];
  [key: string]: any;
}

// RollData en la vista por id
export interface RollDataById {
  id: string;
  order_number: number;
  name: string;
  workshop: string;
  size: string;
  total_quantity: number;
  order_date: string;
  completed: boolean;
  rollcuts: {
    id: string;
    color: string;
    combined: string;
    lining: string;
    quantity: number;
    delivered: number;
    rollCutSizes: RollCutSize[];
  }[];
  rolldetails: { id: string; title: string; quantity: number }[];
  payments?: { id: string; amount: string; date: string; signature: string }[];
  [key: string]: any;
}

export interface RollCutSize {
  id: string;
  cutId: string;
  size: string;
  quantity: number;
  createdAt: string;
}

export interface Shipping {
  id: string;
  shipping_order: number;
  name: string;
  zip: string;
  address: string;
  city: string;
  province: string;
  phone: string;
  dni: string;
  transport: string;
  date: string;
  customer_note: string;
  completed: boolean;
  createdAt: string;
}
