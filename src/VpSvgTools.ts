
//-----------------------------------------------------------------------
// Copyright (c) 2017-2022 Nikolay Belykh unmanagedvisio.com All rights reserved.
// Nikolay Belykh, nbelyh@gmail.com
//-----------------------------------------------------------------------

import { IDiagram } from './interfaces/IDiagram';

export class VpSvgTools {

  private viewPort: SVGGElement = null;
  public diagram: IDiagram = null;

  private viewBox = '';
  public container: HTMLElement = null;
  public svg: SVGSVGElement = null;

  private enableZoom = 1; // 1 or 0: enable or disable zooming (default enabled)
  private zoomScale = 0.5; // Zoom sensitivity
  private panDelta = 3; // start pan on move

  private state: 'pinch' | 'pan' | 'down' = null;
  private stateOriginSvg: DOMPoint = null;
  private stateOriginClient: { pageX: number, pageY: number } = null;
  private stateTf: DOMMatrix = null;
  private stateDiff: number = null;

  private onViewChanged = null;

  constructor(container: HTMLElement, svg: SVGSVGElement, diagram: IDiagram) {
    this.container = container;
    this.svg = svg;
    this.diagram = diagram;

    this.viewPort = container.querySelector("svg > g");
    this.viewBox = diagram.viewBox;

    this.initCTM();

    this.subscribe(container);
  }

  private subscribe(elem) {
    elem.addEventListener("mousedown", this.handleMouseDown);
    elem.addEventListener("mouseup", this.handleMouseUp)
    elem.addEventListener("mousemove", this.handleMouseMove);
    elem.addEventListener("touchstart", this.handleTouchStart);
    elem.addEventListener("touchmove", this.handleMouseMove);

    this.svg.addEventListener('click', this.handleClick, true);

    if (navigator.userAgent.toLowerCase().indexOf('firefox') >= 0)
      elem.addEventListener('DOMMouseScroll', this.handleMouseWheel); // Firefox
    else
      elem.addEventListener('mousewheel', this.handleMouseWheel); // Chrome/Safari/Opera/IE
  }

  private unsubscribe() {
    // this.elem.removeEventListener('mousedown', )
  }

  private fitInBox(width, height, maxWidth, maxHeight) {

    const aspect = width / height;

    if (width > maxWidth || height < maxHeight) {
      width = maxWidth;
      height = Math.floor(width / aspect);
    }

    if (height > maxHeight || width < maxWidth) {
      height = maxHeight;
      width = Math.floor(height * aspect);
    }

    return {
      width: width,
      height: height
    };
  }

  private initCTM() {

    if (!this.viewBox)
      return;

    const bbox = this.viewBox.split(' ');

    const width = parseFloat(bbox[2]);
    const height = parseFloat(bbox[3]);

    const maxWidth = this.container.offsetWidth;
    const maxHeight = this.container.offsetHeight;

    if (typeof this.svg.createSVGMatrix !== 'function')
      return;

    let m = this.svg.createSVGMatrix();

    const sz = this.fitInBox(width, height, maxWidth, maxHeight);

    if (sz.width < maxWidth)
      m = m.translate((maxWidth - sz.width) / 2, 0);

    if (sz.height < maxHeight)
      m = m.translate(0, (maxHeight - sz.height) / 2, 0);

    m = m.scale(sz.width / width);

    this.setCTM(this.viewPort, m);

    window.addEventListener('hashchange', () => this.processHash());
    this.processHash();
  }

  private getUrlParameter(name) {
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.hash);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  private processHash() {
    const startShape = this.getUrlParameter('shape');
    if (startShape) {
      this.setStartShape(startShape);
    }

    const startZoom = this.getUrlParameter('zoom');
    if (startZoom) {
      this.zoom(startZoom);
    }
  }

  private setStartShape(shapeId) {
    const p2 = this.getDefaultPoint();
    const p1 = this.getShapePoint(shapeId);

    const m = this.viewPort.getCTM();
    if (p1 && p2) {
      const cp = p1.matrixTransform(m.inverse());
      const sp = p2.matrixTransform(m.inverse());
      this.setCTM(this.viewPort, m.translate(sp.x - cp.x, sp.y - cp.y));
    }
  }

  private getShapePoint(shapeId) {
    const shapeElem = this.svg.getElementById(shapeId);
    if (!shapeElem)
      return undefined;

    const rect = shapeElem.getBoundingClientRect();
    const pt = this.svg.createSVGPoint();
    pt.x = (rect.left + rect.right) / 2;
    pt.y = (rect.top + rect.bottom) / 2;
    return pt;
  }

  private getEventClientPoint(evt) {

    const touches = evt.touches;

    if (touches && touches.length === 2) {

      const pt1 = this.makeClientPoint(touches[0].pageX, touches[0].pageY);
      const pt2 = this.makeClientPoint(touches[1].pageX, touches[1].pageY);

      return this.makeClientPoint((pt1.pageX + pt2.pageX) / 2, (pt1.pageY + pt2.pageY) / 2);

    } else if (touches && touches.length === 1) {
      return this.makeClientPoint(touches[0].pageX, touches[0].pageY);
    } else {
      return this.makeClientPoint(evt.pageX, evt.pageY);
    }
  }

  /*
      Instance an SVGPoint object with given coordinates.
  */
  private getSvgClientPoint(clientPoint) {

    const p = this.svg.createSVGPoint();

    const box = this.container.getBoundingClientRect();
    p.x = clientPoint.pageX - box.left;
    p.y = clientPoint.pageY - box.top;

    return p;
  }

  /*
      get center zoom point
  */

  private getDefaultPoint() {

    const p = this.svg.createSVGPoint();

    const box = this.container.getBoundingClientRect();
    p.x = (box.right - box.left) / 2;
    p.y = (box.bottom - box.top) / 2;

    return p;
  }

  /*
      Sets the current transform matrix of an element.
  */

  private setCTM(element, matrix) {

    const s = "matrix(" + matrix.a + "," + matrix.b + "," + matrix.c + "," + matrix.d + "," + matrix.e + "," + matrix.f + ")";

    element.setAttribute("transform", s);

    // BUG with SVG arrow rendering in complex files in IE10, IE11
    if (navigator.userAgent.match(/trident|edge/i)) {

      if (typeof this.svg.style.strokeMiterlimit !== 'undefined') {

        if (this.svg.style.strokeMiterlimit !== "3")
          this.svg.style.strokeMiterlimit = "3";
        else
          this.svg.style.strokeMiterlimit = "2";
      }
    }

    if (this.onViewChanged)
      this.onViewChanged(this.container);
  }

  /*
      zoom in or out on mouse wheel
  */

  private handleMouseWheel = (evt) => {

    if (!this.enableZoom)
      return;

    if (this.diagram.enableZoomCtrl && !evt.ctrlKey)
      return;
    if (this.diagram.enableZoomShift && !evt.shiftKey)
      return;

    if (evt.preventDefault)
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

  private zoom(z, evt?) {

    const evtPt = evt
      ? this.getSvgClientPoint(this.getEventClientPoint(evt))
      : this.getDefaultPoint();

    const p = evtPt.matrixTransform(this.viewPort.getCTM().inverse());

    // Compute new scale matrix in current mouse position
    const k = this.svg.createSVGMatrix().translate(p.x, p.y).scale(z).translate(-p.x, -p.y);

    this.setCTM(this.viewPort, this.viewPort.getCTM().multiply(k));

    if (!this.stateTf)
      this.stateTf = this.viewPort.getCTM().inverse();

    this.stateTf = this.stateTf.multiply(k.inverse());
  }

  /*

  */

  private makeClientPoint(pageX, pageY) {
    return { pageX: pageX, pageY: pageY };
  }

  /*
      compute geometric distance between points
  */

  private diff(pt1, pt2) {
    const dx = pt1.pageX - pt2.pageX;
    const dy = pt1.pageY - pt2.pageY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /*
          continue pan (one touch or mouse) or pinch (with two touches)
  */

  private handleMouseMove = (evt) => {

    if (!this.state)
      return;

    if (evt.preventDefault)
      evt.preventDefault();

    evt.returnValue = false;

    const clientPt = this.getEventClientPoint(evt);

    if (this.state === 'pinch') {

      const touches = evt.touches;
      if (touches && touches.length === 2) {

        const pt1 = this.makeClientPoint(touches[0].pageX, touches[0].pageY);
        const pt2 = this.makeClientPoint(touches[1].pageX, touches[1].pageY);

        const currentDiff = this.diff(pt1, pt2);

        this.zoom(currentDiff / this.stateDiff, evt);

        this.stateDiff = currentDiff;

        const pp = this.getSvgClientPoint(clientPt).matrixTransform(this.stateTf);
        this.setCTM(this.viewPort, this.stateTf.inverse().translate(pp.x - this.stateOriginSvg.x, pp.y - this.stateOriginSvg.y));
      }
    }

    if (this.state === 'down') {

      if (this.diff(clientPt, this.stateOriginClient) > this.panDelta)
        this.state = 'pan';
    }

    if (this.state === 'pan') {
      const sp = this.getSvgClientPoint(clientPt).matrixTransform(this.stateTf);
      this.setCTM(this.viewPort, this.stateTf.inverse().translate(sp.x - this.stateOriginSvg.x, sp.y - this.stateOriginSvg.y));
    }
  }

  /*
      start pan (one touch or mouse) or pinch (with two touches)
  */

  private handleMouseDown = (evt) => {

    if (evt.which !== 1)
      return false;

    // prevent selection on double-click
    if (evt.preventDefault)
      evt.preventDefault();

    return this.handleTouchStart(evt);
  }

  private handleTouchStart = (evt) => {

    const touches = evt.touches;

    if (touches && touches.length === 2) {

      const pt1 = this.makeClientPoint(touches[0].pageX, touches[0].pageY);
      const pt2 = this.makeClientPoint(touches[1].pageX, touches[1].pageY);

      this.stateDiff = this.diff(pt1, pt2);

      this.state = 'pinch';

    } else {

      if (this.diagram.twoFingersTouch && touches) {
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

  private handleMouseUp = (evt) => {
    if (this.state === 'pan' || this.state === 'pinch') {
      if (evt.stopPropagation) {
        evt.stopPropagation();
      }
    }
    this.state = null;
  }

  private handleClick = (evt) => {

    // prevent firing 'click' event in case we pan or zoom
    if (this.state === 'pan' || this.state === 'pinch') {

      if (evt.stopPropagation)
        evt.stopPropagation();
    }

    this.state = null;
  }
}
