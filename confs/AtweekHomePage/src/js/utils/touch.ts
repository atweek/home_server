let isTouch: boolean = false;

type OnEventAction<TEvent extends Event> = (evt: TEvent) => void;

export function longTouchStart<TEvent extends Event>(
    evt: TEvent,
    action: OnEventAction<TEvent>,
    duration: number): void {

    isTouch = true;
    setTimeout(() => {
        if (isTouch)
            action(evt);
    }, duration);
}

export function longTouchStop() {
    isTouch = false;
}