import ProjectName from"./ProjectName.js";
import PropTypes from "prop-types";
import React from"react";


class ProjectList extends React.Component{
  componentWillUpdate = () => {
 
    if (this.props.projects !== undefined && this.props.currentProjectIndex !== -1) {

      const projectTitleHeight = 120;

      const verticalMovementInPixels = (this.props.currentProjectIndex + 0.5) * projectTitleHeight + 120;
      


      // const projectTitles = document.getElementsByClassName("projectTitle");

      // @todo clear up
      // var verticalMovementInPixels = projectTitles[this.props.currentProjectIndex].offsetTop - 80;

      // below code is to test out aligning from bottom of page

      // const projectTitleEmHeight = 12; // this has to be matched to the .projectTitle CSS height property so that the animation moves up relative to the length of the menu


      // const verticalMovementInEm = (this.props.currentProjectIndex + 0.5) * projectTitleEmHeight;

      // const parentElement = projectTitles[this.props.currentProjectIndex].offsetParent;

      // const tempOffSetHeight = parentElement.offsetHeight;

      // const offSetTop = projectTitles[this.props.currentProjectIndex].offsetTop;

      // const offsetBottom = parentElement.offsetHeight - projectTitles[this.props.currentProjectIndex].offsetTop  - 80;

      // this.verticalMovement = {transform: "translateY(-" + verticalMovementInEm +  "em)"};
      // this.verticalMovement = {transform: "translateY(-" + verticalMovementInPixels +  "px)"};
      this.verticalMovement = {top: "-" + verticalMovementInPixels +  "px"};
             


      // this.verticalMovement = {bottom: "+" + verticalMovementInPixels +  "px"};
    }
    else {
      // this.verticalMovement = {transform: "translateY(-" + 0 +  "px)"};
      this.verticalMovement = {top: "-" + 0 +  "px"};
      // 
            
      // below code is to test out aligning from bottom of page

      // const menu = document.getElementById("projectList");
      // const menuHeight = menu.offsetHeight;


      // const containers = document.getElementsByClassName("projectListView");
      // const containersHeight = containers[0].offsetHeight;

      // const displacementFromBottom = menu.offsetHeight - containers[0].offsetHeight;

      // this.verticalMovement = {bottom: "" + displacementFromBottom +  "px"};
    }
  }
  componentDidUpdate = () => {
    if (this.props.projects !== undefined && this.props.currentProjectIndex == -1) {
      // console.log("testing for projects loading, this would be the place to switch to bottom css positioning");
    }
        
  }
  render = () => {
    let loop;

    if (this.props.projects !== undefined && this.props.imageReady == true) {
      loop = this.props.projects.map(function (project) {
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
      <div id="projectList" style={this.verticalMovement} >
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
ProjectList.propTypes = {
  currentProjectIndex: PropTypes.number,
  projects:  PropTypes.array,
  imageReady: PropTypes.bool,
  selctProject: PropTypes.func,
  handleProjectDetailsShow: PropTypes.func,
  chooseProjectOne: PropTypes.func,
};

export default ProjectList;
