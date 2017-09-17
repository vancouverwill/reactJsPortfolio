import PropTypes from "prop-types";
import React from "react";
import classNames from"classnames";

class ProjectName  extends React.Component {
  selctProject= () => {
    this.props.selctProject(this.props.name);
  }
  render= () => {
    const classes = classNames({
      "active": this.props.active,
      "projectTitle" : true
    });

    let fontColor;
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
                  
        </h4>
        <p className="projectShortDescription" dangerouslySetInnerHTML={{__html: this.props.shortDescription}}></p>
        <p className="arrowSeeProjectDetails" onClick={this.props.handleProjectDetailsShow}>
                    Read More 
          <i className="fa fa-arrow-right arrowSeeProjectDetailsArrow" ></i>
        </p>
      </div>
    );
  }
}
ProjectName.propTypes = {
  name:  PropTypes.string,
  shortDescription:  PropTypes.string, 
  active: PropTypes.bool,
  selctProject: PropTypes.func,
  handleProjectDetailsShow: PropTypes.func
};

export default ProjectName;