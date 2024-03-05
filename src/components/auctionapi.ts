import { IOrder, IOrderResult, ILotItem, IAuctionAPI } from '../types/index';
import { Api, ApiListResponse } from './base/api';

export class AuctionAPI extends Api implements IAuctionAPI {
	readonly net: string;

	constructor(net: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.net = net;
	}

	getLotList(): Promise<ILotItem[]> {
		return this.get('/product').then((data: ApiListResponse<ILotItem>) => {
			return data.items.map((item) => ({
				...item,
				image: this.net + item.image,
			}));
		});
	}

	getLotItem(id: string): Promise<ILotItem> {
		return this.get(`/product/${id}`).then((item: ILotItem) => ({
			...item,
			image: this.net + item.image,
		}));
	}

	orderLots(order: IOrder): Promise<IOrderResult> {
		return this.post('/order', order).then((data: IOrderResult) => data);
	}
}
