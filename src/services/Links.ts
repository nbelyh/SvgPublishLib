
//-----------------------------------------------------------------------
// Copyright (c) 2017-2022 Nikolay Belykh unmanagedvisio.com All rights reserved.
// Nikolay Belykh, nbelyh@gmail.com
//-----------------------------------------------------------------------

import { IContext } from "interfaces/IContext";
import { ILink } from 'interfaces/ILink';
import { LinkClickedEvent } from 'events/LinkClickedEvent';
import { Utils } from './Utils';
import { BaseFeature } from './BaseFeature';

export class Links extends BaseFeature {

  constructor(context: IContext) {
    super(context);

    const diagram = context.diagram;

    // if (diagram.enableLinks)
    //     diagram.selectionChanged.add(showShapeLinks);

    if (!diagram.enableFollowHyperlinks)
      return;

    for (const shapeId in diagram.shapes) {

      const info = diagram.shapes[shapeId];

      const defaultlink = info.DefaultLink && info.Links[info.DefaultLink - 1];
      const defaultHref = defaultlink && this.buildDefaultHref(defaultlink);

      if (defaultHref) {

        var target = Utils.findTargetElement(shapeId, context);
        if (!target)
          return;

        target.style.cursor = 'pointer';

        const onClick = (evt: PointerEvent) => {
          evt.stopPropagation();

          const linkClickedEvent = new LinkClickedEvent(target, {
            evt,
            shape: info,
            link: defaultlink,
            href: defaultHref,
            target: (defaultlink.Address && diagram.openHyperlinksInNewWindow || evt.shiftKey) ? '_blank' : undefined
          });

          if (!context.events.dispatchEvent(linkClickedEvent))
            return;

          if (evt && evt.ctrlKey)
            return;

          if (linkClickedEvent.args.target)
            window.open(linkClickedEvent.args.href, "_blank");
          else
            document.location = linkClickedEvent.args.href;
        };

        this.subscribe(target, 'click', onClick);
      }
    }
  }

  // $("#shape-links").show();

  private makeAbsoluteUrl(fileName: string) {
    if (this.context.baseUrl) {
      const href = this.context.baseUrl + fileName;
      return href;
    } else {
      var pathname = location.pathname;
      var newpath = pathname.substring(0, pathname.lastIndexOf('/') + 1) + fileName;
      var href = document.location.origin + newpath;
      return href;
    }
  }

  private buildDefaultHref(link: ILink) {

    const diagram = this.context.diagram;

    if (link.Address)
      return link.Address;

    var linkPageId = link.PageId;
    if (linkPageId >= 0 && diagram.pages) {
      var targetPage = diagram.pages.find(p => p.Id === linkPageId);
      var href = this.makeAbsoluteUrl(targetPage.FileName);

      if (link.ShapeId) {
        href += "#?shape=" + link.ShapeId;
      }

      if (link.Zoom) {
        href += (link.ShapeId ? "&" : "#?") + "zoom=" + link.Zoom;
      }

      return href;
    }

    return "#";
  }

  private buildLinkText(link: ILink) {

    if (link.Description)
      return link.Description;

    if (link.SubAddress) {
      return link.Address
        ? link.Address + '[' + link.SubAddress + ']'
        : link.SubAddress;
    }

    return link.Address;
  }

  // private showShapeLinks(shapeId) {

  //     const diagram = this.component.diagram;
  //     var shape = diagram.shapes[shapeId];

  //     var labelnolinks = $("#panel-links").data('labelnolinks') || 'No Shape Links';
  //     var $html = $('<span>' + labelnolinks + '</span>');

  //     if (shape) {

  //         $html = $("<table class='table borderless' />");

  //         var $tbody = $html.append($('<tbody />'));

  //         $.each(shape.Links, function (linkId, link) {

  //             var href = buildLinkTargetLocation(link);
  //             var text = buildLinkText(link);

  //             var $a = $("<a />")
  //                 .attr("href", href)
  //                 .text(text);

  //             if (link.Address && diagram.openHyperlinksInNewWindow)
  //                 $a.attr("target", "_blank");

  //             $tbody.append($('<tr />')
  //                 .append($("<td />")
  //                     .append($a)));
  //         });
  //     }

  //     $("#panel-links").html($html);
  // }
}
