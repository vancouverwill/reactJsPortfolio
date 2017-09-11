var React = require("react");

class ProjectDetailsMainView  extends React.Component {
  constructor() {
    super();
    this.handleProjectListShow = this.handleProjectListShow.bind(this);
    this.render = this.render.bind(this);
  }
  handleProjectListShow() {
    this.props.handleProjectListShow();
  }
  render() {
    if (this.props.currentProject === undefined) {
      return (
        <div></div>
      );
    }
    else {
      return (
        <div key={this.props.currentProject.name} className="projectDetailsContent">
          <span className="pointer"><i className="fa fa-arrow-up" onClick={this.handleProjectListShow}>Back to Projects</i></span>
          <h2>{this.props.currentProject.name}</h2>

          <p dangerouslySetInnerHTML={{__html: this.props.currentProject.description}}></p>
        </div>
      );
    }
  }
}

module.exports = ProjectDetailsMainView;