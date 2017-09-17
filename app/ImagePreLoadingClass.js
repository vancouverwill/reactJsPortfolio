import ImageCacher from "./ImageCacher.js";
import PortfolioContainer from "./PortfolioContainer.js";
import PropTypes from "prop-types";
import React from "react";

const emptyGallerySetSize = 0;
class ImagePreLoadingClass  extends React.Component{
  constructor() {
    super();
    this.state = {
      projects: undefined,
      ready: false,
      ajaxState: undefined
    };
  }
  componentWillMount = () => {
    this.loadImagesFromServer();
  }
  handleSuccess = () => {
    this.setState({ready: true});
  }
  handleError = () => {
    this.setState({ajaxState : "failed"});
  }
  loadImagesFromServer = () => {
    fetch(this.props.url).then((response) => {
      if (response.ok) {
        response.json().then(apiProjects => {
          const projects = [];
          const allImages = [];

          apiProjects.forEach((apiProject) => {
            const project = {};
            project.name = apiProject.title.rendered;
            project.shortDescription = apiProject.project_short_description;
            project.description = apiProject.content.rendered;
            project.fontColor = apiProject.font_color;

            project.images = [];

            if (apiProject.gallery_set !== undefined && apiProject.gallery_set.length > emptyGallerySetSize) {
              apiProject.gallery_set.forEach((galleryImage) => {
                project.images.push(galleryImage.url);
                allImages.push(galleryImage.url);
              });
            }
            projects.push(project);
          });

          this.setState({projects: projects});
          const cache = new ImageCacher();
          cache.loadImages(allImages).then(this.handleSuccess, this.handleError);
        });
      } else {
        response.json().then(() => {
          this.handleError();
        }); 
      }    
    });
  }
  render() {

    if (this.state.ajaxState === undefined) {
      return (
        <PortfolioContainer url={this.props.url} projects={this.state.projects} imageReady={this.state.ready} >
        </PortfolioContainer>
      );
    }
    return (
      <div className="text-center">
        <h3>Sorry projects are not available to view right now :(</h3> 
        <h3>Please try again later....</h3>
      </div>
    );
  }
}
ImagePreLoadingClass.propTypes = {
  url: PropTypes.string
};

export default ImagePreLoadingClass;