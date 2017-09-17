import PropTypes from "prop-types";
import React from "react";

class ProjectDetailsMainView  extends React.Component {
  render = () => {
    if (this.props.currentProject === undefined) {
      return (
        <div></div>
      );
    }
    return (
      <div key={this.props.currentProject.name} className="projectDetailsContent">
        <span className="pointer"><i className="fa fa-arrow-up" onClick={this.props.handleProjectListShow}>Back to Projects</i></span>
        <h2>{this.props.currentProject.name}</h2>

        <p dangerouslySetInnerHTML={{__html: this.props.currentProject.description}}></p>
      </div>
    );
  }
}
ProjectDetailsMainView.propTypes = {
  currentProject : PropTypes.object,
  handleProjectListShow : PropTypes.func
};
export default ProjectDetailsMainView;
