let isTouch = false;
export function longTouchStart(evt, action, duration) {
    isTouch = true;
    setTimeout(() => {
        if (isTouch)
            action(evt);
    }, duration);
}
export function longTouchStop() {
    isTouch = false;
}
