import PropTypes from 'prop-types';
import React from "react";

class ProjectDetailsMainView  extends React.Component {
  handleProjectListShow = () => {
    this.props.handleProjectListShow();
  }
  render = () => {
    if (this.props.currentProject === undefined) {
      return (
        <div></div>
      );
    }
    return (
      <div key={this.props.currentProject.name} className="projectDetailsContent">
        <span className="pointer"><i className="fa fa-arrow-up" onClick={this.handleProjectListShow}>Back to Projects</i></span>
        <h2>{this.props.currentProject.name}</h2>

        <p dangerouslySetInnerHTML={{__html: this.props.currentProject.description}}></p>
      </div>
    );
  }
}
ProjectDetailsMainView.propTypes = {
  currentProject : React.PropTypes.object,
  handleProjectListShow : React.PropTypes.func
}
export default ProjectDetailsMainView;
