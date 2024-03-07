import { Model } from './component';
import {
	OrderErrors,
	IAppState,
	ILotItem,
	IOrder,
	IDeliveryForm,
} from '../../types/index';

class LotItem extends Model<ILotItem> {
	about: string;
  description?: string;
  id: string;
  image: string;
  title: string;
  price: number;
  status: boolean;
  category: string;

}

class AppState extends Model<IAppState> {
  order: IOrder = {
    total: 0,
    items: [],
    email: '',
    phone: '',
    address: '',
    payment: '',
  };
  preview: string | null;
  orderErrors: OrderErrors = {};
  basket: LotItem[];
  catalog: LotItem[];

  getTotal() {
    return this.order.items.reduce((acc, id) => {
      const item = this.catalog.find((it) => it.id === id);
      return acc + (item ? item.price : 0); 
    }, 0);
  }

  setCatalog(items: ILotItem[]) {
    this.catalog = items.map((item) => new LotItem(item, this.events)); 
    this.emitChanged('items:changed', { catalog: this.catalog });
  }

  setPreview(item: LotItem) {
    this.preview = item.id;
    this.emitChanged('preview:changed', item);
  }
  
  getBasketProduct(): LotItem[] {
    return this.basket.filter((item) => item.status);
  }
  
  getActiveLots(): LotItem[] {
    return this.catalog.filter((item) => item.status);
  }
  setOrder(page: keyof IDeliveryForm, value: string) {
    this.order[page] = value;
  }

  validateOrderDelivery() {
    const errors = {} as OrderErrors;
    if (!this.order.address) {
      errors.address = 'Необходим адресс доставки';
    }
    if (!this.order.payment) {
      errors.payment = 'Необходим способ оплаты';
    }
    this.orderErrors = errors;
    this.events.emit('OrderErrors:change', this.orderErrors);
    return Object.keys(errors).length === 0;
  }

  validateOrderContacts() {
    const errors = {} as OrderErrors; 
    if (!this.order.phone) {
      errors.phone = 'Необходим номер телефона';
    }
    if (!this.order.email) {
      errors.email = 'Необходим email';
    }
    this.orderErrors = errors;
    this.events.emit('orderContactsForm:change', this.orderErrors);
    return Object.keys(errors).length === 0;
  }
  
  deleteItem(id: string) {
    const index = this.order.items.indexOf(id);
    if (index !== -1) {
      this.order.items.splice(index, 1);
    }
  }
    addOrder(id: string) {
    this.order.items.push(id);
  }

  clearOrder() {
    this.order.items.forEach(id => {
      this.deleteItem(id);
  });
  }
  
}

export { AppState, LotItem };
