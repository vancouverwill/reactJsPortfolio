import ProjectName from"./ProjectName.js";
import PropTypes from "prop-types";
import React from "react";


class ProjectList extends React.Component{
  /**
   * As the current project index updates we use it to define the vertical position
   * of the projectList
   */
  componentWillUpdate = () => {
    if (this.props.projects !== undefined && this.props.currentProjectIndex !== -1) {
      this.verticalMovementInPixels = (this.props.currentProjectIndex + 0.5) * ProjectList.PROJECT_TITLE_HEIGHT + 120;
    } else {
      this.verticalMovementInPixels = 0;
    }
  }
  render = () => {
    let loop;
    if (this.props.projects !== undefined && this.props.imagesReady == true) {
      loop = this.props.projects.map((project) => {
        return (
          <ProjectName
            key={project.name}
            name={project.name}
            active={project.active}
            fontColor={project.fontColor}
            shortDescription={project.shortDescription}
            selctProject={this.props.selctProject}
            handleProjectDetailsShow={this.props.handleProjectDetailsShow}>
          </ProjectName>
        );
      }, this);
    }
    return (
      <div id="projectList" style={{top: "-" + this.verticalMovementInPixels +  "px"}} >
        <p className="introExplainingText">
          scroll down to view some of the key projects 
          <i className="fa fa-arrow-down introText__arrow" onClick={this.props.chooseProjectOne} />
        </p>
        <div className="text-center loadingState">
          <i className="fa fa-spinner fa-pulse fa-5x"></i>
          <h3>projects loading</h3>
        </div>
        <div id="projectListMenu">
          {loop}
        </div>
      </div>
    );
  }
}

ProjectList.PROJECT_TITLE_HEIGHT = 120;

ProjectList.propTypes = {
  currentProjectIndex: PropTypes.number,
  projects:  PropTypes.arrayOf(PropTypes.object),
  imagesReady: PropTypes.bool.isRequired,
  selctProject: PropTypes.func.isRequired,
  handleProjectDetailsShow: PropTypes.func.isRequired,
  chooseProjectOne: PropTypes.func.isRequired,
};

export default ProjectList;
