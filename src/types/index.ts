
interface ILotItem {
	id: string;
	price?: string;
	title: string;
	about: string;
	image: string;
	descriptionText?: string;
}

interface IAppState {
	lots: ILotItem[];
	preview: string | null;
	order: IOrder | null;
	cartItems: string[];
	currentPage: number;
}

interface IContactForm {
	phone: string;
	email: string;
}

interface IDeliveryForm {
	payment: string;
	address: string;
}

interface IOrder extends IDeliveryForm {
	total: number;
	items: string;
	orderDate: string;
	customerInfo: IContactForm;
}

type OrderErrors = Record<keyof IOrder, string>;

interface IOrderResult {
	id: string;
}

interface IProductList {
	itemCount: number;
	locked: boolean;
	catalog: HTMLElement[];
	itemsPerPage: number;
}

interface IBasketView {
	button: string;
	basketItems: HTMLElement[];
	total: number;
}

interface IFormState {
	valid: boolean;
	errors: OrderErrors;
}

interface IModalContent {
	modalContent: HTMLElement;
}

interface ISuccessMessage {
	totalText: string;
	orderNumber: string;
}

interface ISuccessActions {
	onClick: () => void;
}

interface IAuctionAPI {
	getLots(): Promise<ILotItem[]>;
	addToCart(lotId: string): Promise<void>;
	orderLots(order: IOrder): Promise<IOrderResult>;
	getLotItem(id: string): Promise<ILotItem>;
}

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

interface ICard<T> {
	title: string;
	description?: string | string[];
	image?: string;
	category?: string;
	price?: string;
	button?: boolean;
	status: T;
	index: number;
}

export {
	IAppState,
	IAuctionAPI,
	IBasketView,
	ICard,
	ICardActions,
	IContactForm,
	IDeliveryForm,
	IFormState,
	ILotItem,
	IModalContent,
	IOrder,
	IOrderResult,
	IProductList,
	ISuccessActions,
	ISuccessMessage,
};
