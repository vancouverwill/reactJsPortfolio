var React = require("react");
var classNames = require("classnames");


class ProjectName  extends React.Component {
  constructor() {
    super();
    this.selctProject = this.selctProject.bind(this);
    this.handleProjectDetailsShow = this.handleProjectDetailsShow.bind(this);
    this.render = this.render.bind(this);
  }
  selctProject() {
    this.props.selctProject(this.props.name);
  }
  handleProjectDetailsShow() {
    this.props.handleProjectDetailsShow();
  }
  render() {
    var classes = classNames({
      "active": this.props.active,
      "projectTitle" : true
    });

    var fontColor;

    if (this.props.active == true) {
      fontColor = {"color" : this.props.fontColor};
    }
    else {
      fontColor = {};
    }

    return (
      <div className={classes}>          
        <h4  onClick={this.selctProject} style={fontColor} >
          {this.props.name}
          <i className="fa fa-arrow-right arrowSeeProjectDetails" onClick={this.handleProjectDetailsShow} style={fontColor}></i>
        </h4>
        <p dangerouslySetInnerHTML={{__html: this.props.shortDescription}}></p>
      </div>
    );
  }
}

module.exports = ProjectName;