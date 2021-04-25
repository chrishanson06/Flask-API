import { CartItem } from "./cart-item";

export interface User {
	id?: string;
	email?: string;
	admin?: boolean;
	cart?: CartItem[];
	isVendor?: boolean;
}
