import React from "react";
import classNames from "classnames";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import ReactDOM from "react-dom";
import ProjectDetailsIntroView from './ProjectDetailsIntroView.js';
import PortfolioContainer from './PortfolioContainer.js';

class PageLoadingClass  extends React.Component{
  constructor() {
    super();
    this.state = {
      projects: undefined,
      ready: false,
      ajaxState: undefined
    };
  }
  componentWillMount = () => {
    this.loadCommentsFromServer();
  }
  handleSuccess = () => {
    this.setState({ready: true});
  }
  handleError = () => {
    this.setState({ajaxState : "failed"});
  }
  loadCommentsFromServer = () => {
    fetch(this.props.url).then((response) => {
      if (response.ok) {
        response.json().then(apiProjects => {
          var projects = [];
          var allImages = [];

          apiProjects.forEach(function(apiProject) {
            var project = {};
            project.name = apiProject.title.rendered;
            project.shortDescription = apiProject.project_short_description;
            project.description = apiProject.content.rendered;
            project.fontColor = apiProject.font_color;

            project.images = [];

            if (apiProject.gallery_set !== undefined && apiProject.gallery_set.length > 0) {
              apiProject.gallery_set.forEach(function(galleryImage) {
                project.images.push(galleryImage.url);
                allImages.push(galleryImage.url);
              });
            }
            projects.push(project);
          });

          this.setState({projects: projects});

          loadImages(allImages).then(this.handleSuccess, this.handleError);
        });
      } else {
        response.json().then(() => {
          this.handleError();
        }); 
      }    
    });
  }
  render() {

    if (this.state.ajaxState == undefined) {
      return (
        <PortfolioContainer url={this.props.url} projects={this.state.projects} imageReady={this.state.ready} >
        </PortfolioContainer>
      );
    }
    else {
      return (
        <div className="text-center">
          <h3>Sorry projects are not available to view right now :(</h3> 
          <h3>Please try again later....</h3>
        </div>
      );
    }
  }
}

var hash = {};
var cache = [];

function loadImages(urls) {
  var promises = urls.map(imgRequestUrlLoad);
  return Promise.all(promises);
}

function imgRequestUrlLoad(url) {

  var image = get(url);

  return new Promise((resolve, reject) => {
    var handleSuccess = function handleSuccess() {
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

function add(url) {
  if (!hash[url]) {
    hash[url] = new Image();
    hash[url].src = url;

    cache.push(hash[url]);
  }
  return hash[url];
}

function get(url) {
  return add(url);
}

export default PageLoadingClass;