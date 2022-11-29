export class utils {
  
  static fitInBox(width: number, height: number, maxWidth: number, maxHeight: number) {

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

}