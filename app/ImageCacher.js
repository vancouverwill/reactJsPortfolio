class ImageCacher {
  constructor() {
    this.hash = {};
    this.cache = [];
    // this.loadImages(urls);
  }
  loadImages = (urls) => {
    const promises = urls.map(this.imgRequestUrlLoad);
    return Promise.all(promises);
  }
  imgRequestUrlLoad = (url) => {

    const image = this.add(url);

    return new Promise((resolve, reject) => {
      const handleSuccess = function handleSuccess() {
        resolve(image);
      };

      if (image.naturalWidth && image.naturalHeight) {
        //Image is loaded, go ahead and change the state
        handleSuccess();
      } else {
        image.addEventListener("load", handleSuccess, false);
        image.addEventListener("error", reject, false);
      }
    });
  }
  add = (url) => {
    if (!this.hash[url]) {
      this.hash[url] = new Image();
      this.hash[url].src = url;

      this.cache.push(this.hash[url]);
    }
    return this.hash[url];
  }
}

export default ImageCacher;