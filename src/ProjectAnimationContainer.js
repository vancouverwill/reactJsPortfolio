import React from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

class ProjectAnimationContainer extends React.Component{
  constructor() {
    super();
    this.render = this.render.bind(this);
  }
  render() {
    var animateProject;

    if (this.props.animatedImageUrl != null) {
      var imageUrl = "url('" + this.props.animatedImageUrl + "')";
      var backgroundStyles = {"backgroundImage" : imageUrl};

      animateProject = <div key={this.props.animatedImageUrl} className="portfolioSlide"  >
        <div className="slideImage" style={backgroundStyles} ></div>
        <div className="slideImageOpacityOverlay" ></div>
      </div>;
    }

    return (
      <div id="portfolioProjectAnimationContainer" className={this.props.animationDirection}>
        <ReactCSSTransitionGroup 
          transitionName="portfolioProjectAnimation" 
          transitionEnterTimeout={this.props.animationDuration} 
          transitionLeaveTimeout={this.props.animationDuration}
        >
          {animateProject}                      
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

export default ProjectAnimationContainer;
