import {translateDOMPositionXY} from './utils/data.sheet.utils';
function FixedDataTableTranslateDOMPosition(/*object*/ style, /*number*/ x, /*number*/ y, /*boolean*/ initialRender = false) {
  if (initialRender) {
    style.left = x + 'px';
    style.top = y + 'px';
  } else {
    translateDOMPositionXY(style, x, y);
  }

}

export default FixedDataTableTranslateDOMPosition;
