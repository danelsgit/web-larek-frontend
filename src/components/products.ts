import { Component } from './base/component';
import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';
import { ICardActions, ICard, IProductList, IProductPreview, IProductBasket} from '../types';

class ProductCard<T> extends Component<ICard<T>> {
    protected _title: HTMLElement;
    protected _status: boolean;
    protected _price?: HTMLElement;
    protected _button?: HTMLButtonElement;

    constructor(
        protected blockName: string,
        container: HTMLElement,
        actions?: ICardActions
    ) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
        this._button = container.querySelector(`.${blockName}__button`);

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    getValue(): number {
        const price = this._price.textContent;
        return parseInt(price, 10);
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }  

    set price(value: string) {
        this.setText(this._price, value);
    }

    set buttonEnabled(value: boolean) {
        if (!this.getValue()) {
            this._button.setAttribute('disabled', 'disabled');
        }

        if (value) {
            this.setText(this._button, 'Удалить');
        } else {
            this.setText(this._button, 'Добавть В Корзину');
        }

        this._status = value;
    }

    get title(): string {
        return this._title.textContent || '';
    }

    get id(): string {
        return this.container.dataset.id || '';
    }
  
    get price(): string {
        return this._price.textContent || '';
    }
}

class ProductPreviewCard<T> extends ProductCard<IProductPreview<T>> {
    protected _image?: HTMLImageElement;
    protected _description: HTMLElement;
    protected _category?: HTMLElement;

    constructor(
        blockName: string,
        container: HTMLElement,
        actions?: ICardActions
    ) {
        super(blockName, container, actions);

        this._description = container.querySelector(`.${blockName}__description`);
        this._category = ensureElement<HTMLElement>(
            `.${blockName}__category`,
            this.container
        );
        this._image = ensureElement<HTMLImageElement>(
            `.${blockName}__image`,
            this.container
        );
    }

    set category(value: string) {
        this.setText(this._category, value);

        switch (value) {
            case 'другое':
                this._category.classList.add('card__category_other');
                break;
            case 'дополнительно':
                this._category.classList.add('card__category_additional');
                break;
            case 'кнопк':
                this._category.classList.add('card__category_button');
                break;
            case 'хард-скилл':
                this._category.classList.add('card__category_hard');
                break;
            default:
                this._category.classList.add('card__category_soft');
                break;
            
            
        }
    }

    get category(): string {
        return this._category.textContent || '';
    }

    set image(value: string) {
        this.setImg(this._image, value, this.title);
    }

    set description(value: string | string[]) {
        if (Array.isArray(value)) {
            this._description.replaceWith(
                ...value.map((str) => {
                    const descTemplate = this._description.cloneNode() as HTMLElement;
                    this.setText(descTemplate, str);
                    return descTemplate;
                })
            );
        } else {
            this.setText(this._description, value);
        }
    }
}

class ProductBasketCard<T> extends ProductCard<IProductBasket<T>> {
    protected _index?: HTMLElement;

    constructor(
        blockName: string,
        container: HTMLElement,
        actions?: ICardActions
    ) {
        super(blockName, container, actions);

        this._index = this.container.querySelector('.basket__item-index');
    }

    set index(value: number) {
        this.setText(this._index, value.toString());
    }
}

class ProductList extends Component<IProductList> {
    protected _wrapper: HTMLElement;
    protected _basket: HTMLElement;
    protected _catalog: HTMLElement;
    protected _counter: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
        this._basket = ensureElement<HTMLElement>('.header__basket');
        this._counter = ensureElement<HTMLElement>('.header__basket-counter');
        this._catalog = ensureElement<HTMLElement>('.gallery');

        this._basket.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set counter(value: number) {
        this.setText(this._counter, value.toString());
    }

    set catalog(items: HTMLElement[]) {
        this._catalog.replaceChildren(...items);
    }

    set locked(value: boolean) {
        this.toggleClass(this._wrapper, 'page__wrapper_locked', value);
    }
}

export {
    ProductBasketCard,
    ProductCard,
    ProductList,
    ProductPreviewCard,
};
