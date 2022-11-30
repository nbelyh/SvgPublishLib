import { IShape } from '../interfaces/IShape';

interface ILinkClickedEventArgs {
  evt: PointerEvent;
  shape: IShape;
  link: string;
  href: string;
  target: string;
}

export class LinkClickedEvent extends Event {

  elt: SVGElement;
  args: ILinkClickedEventArgs;

  constructor(elt: SVGElement, args: ILinkClickedEventArgs) {
    super('linkClicked', { cancelable: true });
    this.elt = elt;
    this.args = args;
  }
}
