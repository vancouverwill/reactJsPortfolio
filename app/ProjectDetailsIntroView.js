import PropTypes from 'prop-types';
import React from "react";

class ProjectDetailsIntroView extends React.Component {
  constructor() {
    super();
    this.render = this.render.bind(this);
  }
  render() {
    if (this.props.currentProject === undefined) {
      return (
        <div className="projectDetailsIntroView"></div>
      );
    }
    return (
      <div className="projectDetailsIntroView">
        <h2>{this.props.currentProject.name}</h2>
        <p dangerouslySetInnerHTML={{__html: this.props.currentProject.shortDescription}}></p>      </div>
    );
  }
}
ProjectDetailsIntroView.propTypes = {
  currentProject : React.PropTypes.object
}
export default ProjectDetailsIntroView;
