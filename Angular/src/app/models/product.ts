import { Review } from "./review";

export interface Product {
	name: string;
	slug: string;
	date_created: Date;
	date_modified: Date;
	status: boolean;
	featured: boolean;
	catalog_visibility: string;
	description: string;
	short_description: string;
	sku: string;
	price: number;
	regular_price: number;
	sale_price: number;
	date_on_sale_from: Date;
	date_on_sale_to: Date;
	total_sales: number;
	tax_status: string;
	tax_class: string;
	manage_stock: boolean;
	stock_quanity: number;
	stock_status: string;
	backorders: string;
	sold_individually: boolean;
	weight: number;
	weightUnits: string;
	length: number;
	width: number;
	height: number;
	dimensionUnits: string;
	virtual: boolean;
	reviews: Review[];
}
