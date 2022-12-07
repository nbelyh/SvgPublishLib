export class VisioSvgParser {

  public static parse(content: string) {

    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/xml');

    const diagramNode = doc.documentElement.getElementsByTagNameNS("http://vispublish", "SvgPublishData")[0];
    const diagramInfo = diagramNode && JSON.parse(diagramNode.innerHTML);

    const viewBox = diagramInfo?.viewBox || doc.documentElement.getAttribute('viewBox');
    doc.documentElement.removeAttribute('viewBox');
    doc.documentElement.setAttribute('width', '100%');
    doc.documentElement.setAttribute('height', '100%');

    const svgXml = doc.documentElement.outerHTML;

    return {
      svgXml,
      viewBox,
      diagramInfo
    }
  }

}
