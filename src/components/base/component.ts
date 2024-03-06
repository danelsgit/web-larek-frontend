import { IEvents } from './events';

abstract class Component<T> {
	protected constructor(protected readonly container: HTMLElement) {}
	// Инструменты для работы с Dom

	setLock(element: HTMLElement, state: boolean) {
		if (element) {
			if (state) element.setAttribute('disabled', 'disabled');
			else element.removeAttribute('disabled');
		}
	}
	toggleClass(element: HTMLElement, classN: string, status?: boolean) {
		element.classList.toggle(classN, status);
	}
	protected setText(element: HTMLElement, value: unknown) {
		if (element) {
			element.textContent = String(value);
		}
	}

	protected setImg(img: HTMLImageElement, src: string, alt?: string) {
		if (img) {
			img.src = src;
			if (alt) {
				img.alt = alt;
			}
		}
	}
	protected setHide(element: HTMLElement) {
		element.style.display = 'none';
	}

	protected setShow(element: HTMLElement) {
		element.style.removeProperty('display');
	}

	render(data?: Partial<T>) {
		Object.assign(this as object, data ?? {});
		return this.container;
	}
}

abstract class Model<T> {
	constructor(data: Partial<T>, protected events: IEvents) {
		Object.assign(this, data);
	}

	emitChanged(event: string, load?: object) {
		this.events.emit(event, load ?? {});
	}
}

export { Model, Component };
