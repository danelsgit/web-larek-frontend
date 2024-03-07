
interface ILotItem { // заполнение данными карточки c api
	id: string;
	title: string;
	about: string;
	image: string;
	description?: string;
	price: number | null;
}

interface IAppState { // класс appData, который хранит данные
	preview: ILotItem; // отображение карточки 
	order: IOrder; // карточки в заказе
	basket: ILotItem[]; // карточки в корзине
	catalog: ILotItem[];  // карточки отображаемые для выбора
}

interface IContactForm { // форма с контактами
	phone: string;
	email: string;
}

interface IDeliveryForm extends IContactForm { // форма с адрессом и оплатой
	payment: string;
	address: string;
}

interface IOrder extends IDeliveryForm {  // инфо о заказе для сервера
	total: number;
	items: string[];
}

type OrderErrors = Partial<Record<keyof IOrder, string>>;

interface IOrderResult { // для добавления в заказ
	id: string;
	total: number;
}

interface IProductList { // страница с товаром
	itemCount: number; // счетчик товара
	locked: boolean; // доступ к странице
	catalog: HTMLElement[]; // каталог товара
}

interface IBasketView { // корзина
	items: HTMLElement[]; // список элементов в корзине
    total: number;  // сумма товаров в корзине
    button: string[]; // кнопка для оформления заказа
	
}

interface IFormState { // для класса form
	valid: boolean; 
	errors: string[]; 
}

interface IModalContent { // для класса modal
	content: HTMLElement ; // поле с контентом, которое будет отображаться или очищаться
}

interface ISuccessMessage { // для класса success
	description: string; // поле для текста в случае успешной оплаты с кол-во списанных средств
}

interface ISuccessActions { // для класса success
	onClick: () => void;
}

interface IAuctionAPI {
	getLotList: () => Promise<ILotItem[]>;  // список товаров
    getLotItem: (id: string) => Promise<ILotItem>;  // информация о товаре
    orderLots: (order: IOrder) => Promise<IOrderResult>;  // заказ товаров
}

interface ICard<T> { // для класса auctionApi
	title: string;
	description?: string | string[];
	image?: string;
	category?: string;
	price?: string;
	button?: boolean;
	status: T; // есть ли в корзине
	index: number;
}

interface ICardActions { // для класса auctionApi
	onClick: (event: MouseEvent) => void;
}

interface IProductPreview<T> {
    description: string | string[];
    image: string;
    category: string;
}

interface IProductBasket<T> {
    index: number;
	delete: () => void;
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
	OrderErrors,
	IProductPreview,    
	IProductBasket
};
