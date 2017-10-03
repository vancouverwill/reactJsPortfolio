import PropTypes from "prop-types";
import React from "react";

class ProjectDetailsIntroView extends React.Component {
  render = () => {
    let content;
    if (this.props.currentProject !== undefined) {
      content = 
        <div>
          <h2>{this.props.currentProject.name}</h2>
          <p dangerouslySetInnerHTML={{__html: this.props.currentProject.shortDescription}}></p>    
        </div>;  
    }
    return (
      <div className="projectDetailsIntroView">
        {content}
      </div>
        
    );
  }
}
ProjectDetailsIntroView.propTypes = {
  currentProject : PropTypes.object
};
export default ProjectDetailsIntroView;
