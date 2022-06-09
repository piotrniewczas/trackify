import {CurrencyCode} from "../trackify-globals";

export interface Item extends Record<string, string | number | undefined> {
  id: string,
  name: string,
  affiliation?: string,
  coupon?: string,
  currency?: keyof typeof CurrencyCode,
  discount?: number,
  index?: number,
  brand?: string,
  category?: string,
  category2?: string,
  category3?: string,
  category4?: string,
  category5?: string,
  listId?: string,
  listName?: string,
  variant?: string,
  locationId?: string,
  price?: number,
  quantity?: number,
  ean?: number;
  url?: string;
  image?: string;
}
