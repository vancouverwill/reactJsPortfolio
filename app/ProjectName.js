import PropTypes from 'prop-types';
import React from"react";
import classNames from"classnames";

class ProjectName  extends React.Component {
  selctProject= () => {
    this.props.selctProject(this.props.name);
  }
  handleProjectDetailsShow= () => {
    this.props.handleProjectDetailsShow();
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
                <p className="arrowSeeProjectDetails" onClick={this.handleProjectDetailsShow}>
                    Read More 
                    <i className="fa fa-arrow-right arrowSeeProjectDetailsArrow" ></i>
                </p>
            </div>
    );
  }
}
ProjectName.propTypes = {
  name:  React.PropTypes.string,
  shortDescription:  React.PropTypes.string, 
  active: React.PropTypes.bool,
  selctProject: React.PropTypes.func,
  handleProjectDetailsShow: React.PropTypes.func
}

export default ProjectName;
