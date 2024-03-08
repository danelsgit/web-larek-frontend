import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { AuctionAPI } from './components/auctionapi';
import { API_URL, CDN_URL } from './utils/constants';
import { AppState, LotItem } from './components/base/appdata';
import {
	ProductBasketCard,
	ProductList,
	ProductPreviewCard,
} from './components/products';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { Basket, Success, Modal } from './components/common';
import { OrderDelivery, OrderContacts } from './components/orderInfo';
import { IContactForm, IDeliveryForm } from './types';

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const orderDeliveryTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderContactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

const events = new EventEmitter();
const api = new AuctionAPI(CDN_URL, API_URL);
const appData = new AppState({}, events);
const page = new ProductList(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderContactsForm = new OrderContacts(
	cloneTemplate(orderContactsTemplate),
	events
);

const orderDeliveryForm = new OrderDelivery(
	cloneTemplate(orderDeliveryTemplate),
	events
);

type CatalogChanged = {
	catalog: LotItem[];
};
events.on<CatalogChanged>('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new ProductPreviewCard(
			'card',
			cloneTemplate(cardCatalogTemplate),
			{
				onClick: () => events.emit('card:select', item),
			}
		);
		return card.render({
			category: item.category,
			title: item.title,
			image: item.image,
			price: item.price !== null ? item.price + ' синапсов' : 'Бесценно',
		});
	});
});

events.on('card:select', (item: LotItem) => {
	appData.setPreview(item);
});

events.on('card: add', (item: LotItem) => {
	appData.addOrder(item.id);
	item.status = true;
	events.emit('basket: render');
});

events.on('card: delete', (item: LotItem) => {
	appData.deleteItem(item.id);
	item.status = false;
	events.emit('basket: render');
});

events.on('orderContacts:open', () => {
	modal.render({
		content: orderContactsForm.render({
			email: null,
			phone: null,
			valid: false,
			errors: [],
		}),
	});
});

events.on('orderContactsForm:change', (errors: Partial<IContactForm>) => {
	const { email, phone } = errors;
	orderContactsForm.valid = !email && !phone;
	orderContactsForm.errors = Object.values({ phone, email })
		.filter((err) => !!err)
		.join('; ');
});

events.on(
	'orderContacts:change',
	(data: { field: keyof IContactForm; value: string }) => {
		appData.setOrder(data.field, data.value);
		orderContactsForm.valid = appData.validateOrderContacts();
	}
);

events.on('orderContacts:submit', () => {
	appData.order.total = appData.getTotalFiltred();
	api
		.orderLots(appData.order)
		.then(() => {
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					appData.clearOrder();
					events.emit('basket: secondRender');
					modal.close();
				},
			});
			
			modal.render({
				content: success.render({
				  description: appData.getTotal().toString(),
				})
			  })
			  
			}).then(() => { 
				appData.clearOrder();
				events.emit('basket: secondRender');
			})
		.catch((err) => {
			console.error(err);
		});
		
});

events.on('orderDelivery:open', () => {
	modal.render({
		content: orderDeliveryForm.render({
			payment: '',
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('orderDeliveryForm:change', (errors: Partial<IDeliveryForm>) => {
	const { payment, address } = errors;
	orderDeliveryForm.valid = !payment && !address;
	orderDeliveryForm.errors = Object.values({ payment, address })
		.filter((err) => !!err)
		.join('; ');
});

events.on(
	'orderDelivery:change',
	(data: { field: keyof IDeliveryForm; value: string }) => {
		appData.setOrder(data.field, data.value);
		orderDeliveryForm.valid = appData.validateOrderDelivery();
	}
);

events.on('orderDelivery:submit', () => {
	events.emit('orderContacts:open');
});

events.on('basket:open', () => {
	modal.render({
		content: createElement<HTMLElement>('div', {}, [
			basket.render({
				button: appData.order.items,
			}),
		]),
	});
});

events.on('basket: render', () => {
	page.counter = appData.getActiveLots().length;
	basket.items = appData.getActiveLots().map((item, index) => {
		const card = new ProductBasketCard(
			'card',
			cloneTemplate(cardBasketTemplate),
			{
				onClick: () => {
					events.emit('card: delete', item);
				},
			}
		);
		return card.render({
			price: item.price !== null ? item.price + ' синапсов' : 'Бесценно',
			index: index + 1,
			title: item.title,
		});
	});
	basket.button = appData.order.items;
	basket.total = appData.getTotal();
});

events.on('basket: secondRender', () => {
	appData.getActiveLots().map((item, index) => {
		item.status = false;
		basket.items = appData.getActiveLots().map((item, index) => {
			const card = new ProductBasketCard(
				'card',
				cloneTemplate(cardBasketTemplate)
			);
			return card.render({
				title: '',
				price: null,
				index: 0,
			});
		});
	});
	page.counter = appData.getActiveLots().length;
	basket.total = appData.getTotal();
});

events.on('preview:changed', (item: LotItem) => {
	const showItem = (item: LotItem) => {
		const card = new ProductPreviewCard(
			'card',
			cloneTemplate(cardPreviewTemplate),
			{
				onClick: () => {
					if (!item.status) {
						events.emit('card: add', item);
					}
					modal.close();
				},
			}
		);

		modal.render({
			content: card.render({
				category: item.category,
				title: item.title,
				price: item.price !== null ? item.price + ' синапсов' : 'Бесценно',
				description: item.description,
				button: item.status,
				image: item.image,
			}),
		});
	};

	if (item) {
		api
			.getLotItem(item.id)
			.then((result) => {
				item.description = result.description;
				showItem(item);
			})
			.catch((err) => {
				console.error(err);
			});
	} else {
		modal.close();
	}
});

events.on('modal:open', () => {
	page.locked = true;
});
events.on('modal:close', () => {
	page.locked = false;
});

let products = api
	.getLotList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});
