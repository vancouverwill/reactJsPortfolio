var React = require("react");
var ProjectName = require('./ProjectName.js');


class ProjectList extends React.Component{
  constructor() {
    super();
    this.state = {};
    this.selctProject = this.selctProject.bind(this);
    this.handleProjectDetailsShow = this.handleProjectDetailsShow.bind(this);
    this.componentWillUpdate = this.componentWillUpdate.bind(this);
    this.render = this.render.bind(this);
  }
  selctProject(projectName) {
    this.props.selctProject(projectName);
  }
  handleProjectDetailsShow() {
    this.props.handleProjectDetailsShow();
  }
  chooseProjectOne() {
    this.props.chooseProjectOne();
  }
  componentWillUpdate() {
 
    if (this.props.projects !== undefined && this.props.currentProjectIndex !== -1) {

      // var projectTitleHeight = 120;
      var projectTitleEmHeight = 7; // this has to be matched to the .projectTitle CSS height property so that the animation moves up relative to the length of the menu

      // var verticalMovementInPixels = (this.props.currentProjectIndex + 0.5) * projectTitleHeight;
      var verticalMovementInEm = (this.props.currentProjectIndex + 0.5) * projectTitleEmHeight;

      this.verticalMovement = {transform: "translateY(-" + verticalMovementInEm +  "em)"};
    }
    else {
      this.verticalMovement = {transform: "translateY(-" + 0 +  "px)"};
    }
  }
  render() {
    var loop;

    if (this.props.projects !== undefined && this.props.imageReady == true) {
      loop = this.props.projects.map(function (project) {
        return (
          <ProjectName key={project.name} name={project.name} active={project.active} fontColor={project.fontColor} shortDescription={project.shortDescription} selctProject={this.selctProject} handleProjectDetailsShow={this.handleProjectDetailsShow}></ProjectName>
        );
      }, this);
    }

    return (
      <div id="projectList" style={this.verticalMovement} >
        <p className="introExplainingText">scroll down to view some of the key projects <i className="fa fa-arrow-down introText__arrow" onClick={this.chooseProjectOne} /></p>
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

module.exports = ProjectList;