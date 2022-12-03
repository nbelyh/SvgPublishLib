
//-----------------------------------------------------------------------
// Copyright (c) 2017-2022 Nikolay Belykh unmanagedvisio.com All rights reserved.
// Nikolay Belykh, nbelyh@gmail.com
//-----------------------------------------------------------------------

import { ViewChangedEvent } from '../events';
import { ISvgPublishContext } from '../interfaces/ISvgPublishContext';
import { Geometry } from './Geometry';
import { BasicService } from './BasicService';
import { IViewService } from '../interfaces/IViewService';

export class ViewService extends BasicService implements IViewService {

  private viewPort: SVGGElement = null;
  private viewBox: string;

  private enableZoom = true; // 1 or 0: enable or disable zooming (default enabled)
  private enablePan = true;

  private zoomScale = 0.5; // Zoom sensitivity
  private panDelta = 3; // start pan on move

  private state: 'pinch' | 'pan' | 'down' = null;
  private stateOriginSvg: DOMPoint = null;
  private stateOriginClient: { pageX: number, pageY: number } = null;
  private stateTf: DOMMatrix = null;
  private stateDiff: number = null;

  constructor(context: ISvgPublishContext, viewBox: string) {
    super(context);

    this.viewBox = viewBox;
    this.viewPort = context.container.querySelector("svg > g");

    this.reset();

    this.subscribeAll();
  }

  public isPanEnabled() { return this.enablePan; }
  public setPanEnabled(val: boolean) { this.enablePan = val; }

  public isZoomEnabled() { return this.enableZoom; }
  public setZoomEnabled(val: boolean) { this.enableZoom = val; }

  private subscribeAll() {
    const container = this.context.container;
    const svg = this.context.svg;

    this.subscribe(container, "mousedown", this.handleMouseDown);
    this.subscribe(container, "mouseup", this.handleMouseUp);
    this.subscribe(container, "mousemove", this.handleMouseMove);
    this.subscribe(container, "touchstart", this.handleTouchStart);
    this.subscribe(container, "touchmove", this.handleMouseMove);

    this.subscribe(svg, 'click', this.handleClick, true);

    if (navigator.userAgent.toLowerCase().indexOf('firefox') >= 0) { // Firefox
      this.subscribe(container, 'DOMMouseScroll', this.handleMouseWheel);
    } else { // Chrome/Safari/Opera/IE
      this.subscribe(container, 'mousewheel', this.handleMouseWheel);
    }
  }

  public reset() {

    const bbox = this.viewBox.split(' ');

    const width = parseFloat(bbox[2]);
    const height = parseFloat(bbox[3]);

    const { offsetWidth: maxWidth, offsetHeight: maxHeight } = this.context.container;

    let m = this.context.svg.createSVGMatrix();

    const sz = Geometry.fitInBox(width, height, maxWidth, maxHeight);

    if (sz.width < maxWidth)
      m = m.translate((maxWidth - sz.width) / 2, 0);

    if (sz.height < maxHeight)
      m = m.translate(0, (maxHeight - sz.height) / 2, 0);

    m = m.scale(sz.width / width);

    this.setCTM(m, null);
  }

  public setFocusShape(shapeId: string) {
    const p2 = this.getDefaultPoint();
    const p1 = this.getShapePoint(shapeId);

    if (p1 && p2) {
      const m = this.viewPort.getCTM();
      const cp = p1.matrixTransform(m.inverse());
      const sp = p2.matrixTransform(m.inverse());
      this.setCTM(m.translate(sp.x - cp.x, sp.y - cp.y), null);
    }
  }

  private getShapePoint(shapeId: string) {
    const shapeElem = this.context.svg.getElementById(shapeId);
    if (!shapeElem)
      return undefined;

    const rect = shapeElem.getBoundingClientRect();
    const pt = this.context.svg.createSVGPoint();
    pt.x = (rect.left + rect.right) / 2;
    pt.y = (rect.top + rect.bottom) / 2;
    return pt;
  }

  private getEventClientPoint(evt) {

    const touches = evt.touches;

    if (touches && touches.length === 2) {

      const pt1 = Geometry.makeClientPoint(touches[0].pageX, touches[0].pageY);
      const pt2 = Geometry.makeClientPoint(touches[1].pageX, touches[1].pageY);

      return Geometry.makeClientPoint((pt1.pageX + pt2.pageX) / 2, (pt1.pageY + pt2.pageY) / 2);

    } else if (touches && touches.length === 1) {
      return Geometry.makeClientPoint(touches[0].pageX, touches[0].pageY);
    } else {
      return Geometry.makeClientPoint(evt.pageX, evt.pageY);
    }
  }

  /*
      Instance an SVGPoint object with given coordinates.
  */
  private getSvgClientPoint(clientPoint) {

    const p = this.context.svg.createSVGPoint();

    const box = this.context.container.getBoundingClientRect();
    p.x = clientPoint.pageX - box.left;
    p.y = clientPoint.pageY - box.top;

    return p;
  }

  /*
      get center zoom point
  */

  private getDefaultPoint() {

    const p = this.context.svg.createSVGPoint();

    const box = this.context.container.getBoundingClientRect();
    p.x = (box.right - box.left) / 2;
    p.y = (box.bottom - box.top) / 2;

    return p;
  }

  /*
      Sets the current transform matrix of an element.
  */

  private setCTM(matrix: DOMMatrix, evt: Event) {

    const s = "matrix(" + matrix.a + "," + matrix.b + "," + matrix.c + "," + matrix.d + "," + matrix.e + "," + matrix.f + ")";

    this.viewPort.setAttribute("transform", s);

    // BUG with SVG arrow rendering in complex files in IE10, IE11
    // if (navigator.userAgent.match(/trident|edge/i)) {

    //   if (typeof this.svg.style.strokeMiterlimit !== 'undefined') {

    //     if (this.svg.style.strokeMiterlimit !== "3")
    //       this.svg.style.strokeMiterlimit = "3";
    //     else
    //       this.svg.style.strokeMiterlimit = "2";
    //   }
    // }

    const viewChangedEvent = new ViewChangedEvent({
      context: this.context,
      triggerEvent: evt
    });
    this.context.events.dispatchEvent(viewChangedEvent);
  }

  /*
      zoom in or out on mouse wheel
  */

  private handleMouseWheel = (evt) => {

    if (!this.enableZoom)
      return;

    if (this.context.diagram.enableZoomCtrl && !evt.ctrlKey)
      return;
    if (this.context.diagram.enableZoomShift && !evt.shiftKey)
      return;

    evt.preventDefault();

    evt.returnValue = false;

    const delta = (evt.wheelDelta)
      ? evt.wheelDelta / 360 // Chrome/Safari
      : evt.detail / -9; // Mozilla

    const z = Math.pow(1 + this.zoomScale, delta);

    this.zoom(z, evt);
  }

  /*
      zoom with given aspect at given (client) point
  */

  public zoom(z: number, evt?: MouseEvent) {

    const evtPt = evt
      ? this.getSvgClientPoint(this.getEventClientPoint(evt))
      : this.getDefaultPoint();

    const p = evtPt.matrixTransform(this.viewPort.getCTM().inverse());

    // Compute new scale matrix in current mouse position
    const k = this.context.svg.createSVGMatrix().translate(p.x, p.y).scale(z).translate(-p.x, -p.y);

    this.setCTM(this.viewPort.getCTM().multiply(k), evt);

    if (!this.stateTf)
      this.stateTf = this.viewPort.getCTM().inverse();

    this.stateTf = this.stateTf.multiply(k.inverse());
  }

  /*
          continue pan (one touch or mouse) or pinch (with two touches)
  */

  private handleMouseMove = (evt) => {

    if (!this.state)
      return;

    evt.preventDefault();

    evt.returnValue = false;

    const clientPt = this.getEventClientPoint(evt);

    if (this.state === 'pinch') {

      const touches = evt.touches;
      if (touches && touches.length === 2) {

        const pt1 = Geometry.makeClientPoint(touches[0].pageX, touches[0].pageY);
        const pt2 = Geometry.makeClientPoint(touches[1].pageX, touches[1].pageY);

        const currentDiff = Geometry.diff(pt1, pt2);

        this.zoom(currentDiff / this.stateDiff, evt);

        this.stateDiff = currentDiff;

        const pp = this.getSvgClientPoint(clientPt).matrixTransform(this.stateTf);
        this.setCTM(this.stateTf.inverse().translate(pp.x - this.stateOriginSvg.x, pp.y - this.stateOriginSvg.y), evt);
      }
    }

    if (this.state === 'down') {

      if (Geometry.diff(clientPt, this.stateOriginClient) > this.panDelta)
        this.state = 'pan';
    }

    if (this.state === 'pan') {
      const sp = this.getSvgClientPoint(clientPt).matrixTransform(this.stateTf);
      this.setCTM(this.stateTf.inverse().translate(sp.x - this.stateOriginSvg.x, sp.y - this.stateOriginSvg.y), evt);
    }
  }

  /*
      start pan (one touch or mouse) or pinch (with two touches)
  */

  private handleMouseDown = (evt) => {

    if (!this.enablePan)
      return false;

    if (evt.which !== 1)
      return false;

    evt.preventDefault();

    return this.handleTouchStart(evt);
  }

  private handleTouchStart = (evt: TouchEvent) => {

    if (!this.enablePan)
      return false;

    const touches = evt.touches;

    if (touches && touches.length === 2) {

      const pt1 = Geometry.makeClientPoint(touches[0].pageX, touches[0].pageY);
      const pt2 = Geometry.makeClientPoint(touches[1].pageX, touches[1].pageY);

      this.stateDiff = Geometry.diff(pt1, pt2);

      this.state = 'pinch';

    } else {

      if (this.context.diagram.twoFingersTouch && touches) {
        this.state = null;
        return;
      }

      this.state = 'down';
    }

    this.stateTf = this.viewPort.getCTM().inverse();
    this.stateOriginClient = this.getEventClientPoint(evt);
    this.stateOriginSvg = this.getSvgClientPoint(this.stateOriginClient).matrixTransform(this.stateTf);
  }

  /*
      reset state on mouse up
  */

  private handleMouseUp = (evt: MouseEvent) => {
    if (this.state === 'pan' || this.state === 'pinch') {
      if (evt.stopPropagation) {
        evt.stopPropagation();
      }
    }
    this.state = null;
  }

  private handleClick = (evt: MouseEvent) => {

    // prevent firing 'click' event in case we pan or zoom
    if (this.state === 'pan' || this.state === 'pinch') {

      if (evt.stopPropagation)
        evt.stopPropagation();
    }

    this.state = null;
  }
}
