var React = require("react");

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
    else {
      return (
        <div className="projectDetailsIntroView">
          <h2>{this.props.currentProject.name}</h2>
          <p>{this.props.currentProject.shortDescription}</p>
        </div>
      );
    }
  }
}
export default ProjectDetailsIntroView;
