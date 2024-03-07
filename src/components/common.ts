import { Component } from './base/component';
import { createElement, ensureElement } from '../utils/utils';
import { EventEmitter, IEvents } from './base/events';
import {
	IBasketView,
	IFormState,
	IModalContent,
	ISuccessActions,
	ISuccessMessage,
} from '../types';

class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _basketButton: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = this.container.querySelector('.basket__price');
		this._basketButton = ensureElement<HTMLButtonElement>(
			'.basket__button',
			this.container
		);

		if (this._basketButton) {
			this._basketButton.addEventListener('click', () =>
				events.emit('orderDelivery:open')
			);
		}

		
		this.items = [];
		
	}

	set button(items: string[]) {
		if (items.length) {
			this.setLock(this._basketButton, false);
		} else {
			this.setLock(this._basketButton, true);
		}
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}

	set total(total: number) {
		this.setText(this._total, filterPrice(total) + ' синапсов');
	}


}

function filterPrice(x: number) {
	return x.toLocaleString('en-US', {
		maximumFractionDigits: 0,
		style: 'decimal',
	});
}

class Form<T> extends Component<IFormState> {
	protected _buttonSubmit: HTMLButtonElement;
	protected _errors: HTMLElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);

		this.container.addEventListener('input', (evt: Event) => {
			const target = evt.target as HTMLInputElement;
			const field = target.name as keyof T;
			const value = target.value;
			this.afterInput(field, value);
		});

		this.container.addEventListener('submit', (evt: Event) => {
			evt.preventDefault();
			events.emit(`${this.container.name}:submit`);
		});

		this._buttonSubmit = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container
		);
		this._errors = ensureElement<HTMLElement>('.form__errors', this.container);
	}

	protected afterInput(field: keyof T, value: string) {
		this.events.emit(`${this.container.name}.${String(field)}:change`, {
            field,
            value
        });
	}
	set errors(value: string) {
		this.setText(this._errors, value);
	}

	set valid(value: boolean) {
		this._buttonSubmit.disabled = !value;
	}


	render(state: Partial<T> & IFormState) {
		const { valid, errors, ...inputs } = state;
		super.render({ valid, errors });
		Object.assign(this, inputs);
		return this.container;
	}
}

class Modal extends Component<IModalContent> {
	protected _closeButton: HTMLButtonElement;
	protected _content: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this._content = ensureElement<HTMLElement>('.modal__content', container);
		this.container.addEventListener('click', this.handleClick.bind(this));
		
	}

	private handleClick(event: Event) {
		const target = event.target as HTMLElement;
		if (target === this._closeButton) {
			this.close();
		} else if (target !== this._content) {
			event.stopPropagation();
		}
	}

	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	open() {
		this.container.classList.add('modal_active');
		this.events.emit('modal:open');
	}

	close() {
		this.container.classList.remove('modal_active');
		this.events.emit('modal:close');
	}

	render(data: IModalContent): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}

class Success extends Component<ISuccessMessage> {
	protected _close: HTMLElement;
	protected _description: HTMLElement;

	constructor(container: HTMLElement, actions: ISuccessActions) {
		super(container);

		this._close = ensureElement<HTMLElement>(
			'.order-success__close',
			this.container
		)
		if (actions.onClick) {
            this._close.addEventListener('click', actions.onClick);
        }

		this._description = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);
	}

	set description(value: string) {
		this.setText(this._description, `Списано ${value} синапсов`);
	}
}

export { Success, Form, Basket, Modal };
