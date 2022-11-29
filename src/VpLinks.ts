
//-----------------------------------------------------------------------
// Copyright (c) 2017-2022 Nikolay Belykh unmanagedvisio.com All rights reserved.
// Nikolay Belykh, nbelyh@gmail.com
//-----------------------------------------------------------------------

import { ILink } from "./interfaces/ILink";
import { LinkClickedEvent } from './interfaces/LinkClickedEvent';
import { SvgPublish } from './SvgPublish';

export class VpLinks {

    private component: SvgPublish;
    constructor(component: SvgPublish) {

        this.component = component;

        const diagram = component.diagram;

        // if (diagram.enableLinks)
        //     diagram.selectionChanged.add(showShapeLinks);

        if (!diagram.enableFollowHyperlinks)
            return;

        for (const shapeId in diagram.shapes) {

            const info = diagram.shapes[shapeId];

            const defaultlink = info.DefaultLink && info.Links[info.DefaultLink - 1];
            const defaultHref = defaultlink && this.buildLinkTargetLocation(defaultlink);

            if (defaultHref) {

                var target = component.findTargetShape(shapeId);
                if (!target)
                    return;

                target.style.cursor = 'pointer';

                target.addEventListener('click', (evt: PointerEvent) => {
                    evt.stopPropagation();

                    if (diagram.events.dispatchEvent(new LinkClickedEvent(target, { evt, shape: info, link: defaultlink, href: defaultHref })))
                        return;

                    if (evt && evt.ctrlKey)
                        return;

                    if (defaultlink.Address && diagram.openHyperlinksInNewWindow || evt.shiftKey)
                        window.open(defaultHref, "_blank");
                    else
                        document.location = defaultHref;
                });
            }
        }
    }

    // $("#shape-links").show();

    private buildLinkTargetLocation(link: ILink) {

        const diagram = this.component.diagram;

        if (link.Address)
            return link.Address;

        var linkPageId = link.PageId;
        if (linkPageId >= 0 && diagram.pages) {
            var targetPage = diagram.pages.filter(p => p.Id === linkPageId)[0];
            var curpath = location.pathname;
            var newpath = curpath.replace(curpath.substring(curpath.lastIndexOf('/') + 1), targetPage.FileName);
            var href = document.location.protocol + "//" + document.location.host + newpath;

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
