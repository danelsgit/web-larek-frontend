import { Form } from './common';
import { IDeliveryForm, IContactForm } from '../types';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

class OrderContacts extends Form<IContactForm> {
	protected afterInput(field: keyof IContactForm, value: string) {
		this.events.emit('orderContacts:change', {
			field,
			value,
		});
	}
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this.container.addEventListener('submit', (evt: Event) => {
			evt.preventDefault();
			this.events.emit(`orderContacts:submit`);
		});
	}
}

class OrderDelivery<T> extends Form<IDeliveryForm> {
	protected _paymentOnline: HTMLElement;
	protected _paymentOffline: HTMLElement;

	protected afterInput(field: keyof IDeliveryForm, value: string) {
		this.events.emit('orderDelivery:change', {
			field,
			value,
		});
	}
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this._paymentOnline = this.container.querySelector('#online');
		this._paymentOffline = this.container.querySelector('#offline');

		this._paymentOnline.addEventListener('click', (e: Event) => {
			e.preventDefault();
			this._paymentOnline.classList.add('button_alt-active');
			this._paymentOffline.classList.remove('button_alt-active');
			this.afterInput('payment', 'online');
		});

		this._paymentOffline.addEventListener('click', (e: Event) => {
			e.preventDefault();
			this._paymentOffline.classList.add('button_alt-active');
			this._paymentOnline.classList.remove('button_alt-active');
			this.afterInput('payment', 'offline');
		});

		this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this.events.emit(`orderDelivery:submit`);
		});
	}
}



export { OrderContacts, OrderDelivery };
