class ImageCacher {
  constructor() {
    this.hash = {};
    this.cache = [];
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
  /**
   * Alternative image preload promise
   * @param {*} url 
   */
  static imgLoad(url) {
    // Create new promise with the Promise() constructor;
    // This has as its argument a function
    // with two parameters, resolve and reject
    return new Promise((resolve, reject) => {
      // Standard XHR to load an image
      const request = new XMLHttpRequest();
      request.open("GET", url);
      request.responseType = "blob";
      // When the request loads, check whether it was successful
      request.onload = () => {
        if (request.status === 200) {
          // If successful, resolve the promise by passing back the request response
          resolve(request.response);
        } else {
          // If it fails, reject the promise with a error message
          reject(Error("Image didn't load successfully; error code:" + request.statusText));
        }
      };
      request.onerror = () => {
        // Also deal with the case when the entire request fails to begin with
        // This is probably a network error, so reject the promise with an appropriate message
        reject(Error("There was a network error."));
      };
      // Send the request
      request.send();
    });
  } 
}

export default ImageCacher;