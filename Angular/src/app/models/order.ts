import { Product } from "./product";

export interface Order {
	id?: string;
	orderer?: string;
	orderStatus?: string;
	products?: Product[];
}
