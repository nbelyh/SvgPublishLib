import { IShape } from './IShape';

interface ILinkClickedEventArgs {
  evt: PointerEvent;
  shape: IShape;
  link: string;
  href: string;
}

export class LinkClickedEvent extends Event {

  elt: SVGElement;
  args: ILinkClickedEventArgs;

  constructor(elt: SVGElement, args: ILinkClickedEventArgs) {
    super('linkClicked');
    this.elt = elt;
    this.args = args;
  }
}
