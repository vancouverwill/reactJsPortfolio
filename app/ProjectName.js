import PropTypes from "prop-types";
import React from "react";
import classNames from"classnames";

const ProjectName = ({name, shortDescription, fontColor, active, selctProject, handleProjectDetailsShow}) => {
  const selctProjectClick = () => {
    selctProject (name);
  };
  const classes = classNames({
    "active": active,
    "projectName" : true
  });

  let fontColorCSS;
  if (active == true) {
    fontColorCSS = {"color" : fontColor};
  }
  else {
    fontColorCSS = {};
  }

  return (
    <div className={classes}>          
      <h4  onClick={selctProjectClick} style={fontColorCSS} >
        {name}       
      </h4>
      <p className="projectShortDescription" dangerouslySetInnerHTML={{__html: shortDescription}}></p>
      <p className="arrowSeeProjectDetails" onClick={handleProjectDetailsShow}>
                  Read More 
        <i className="fa fa-arrow-right arrowSeeProjectDetailsArrow" ></i>
      </p>
    </div>
  );
};
ProjectName.propTypes = {
  name:  PropTypes.string.isRequired,
  shortDescription:  PropTypes.string.isRequired,
  fontColor: PropTypes.string.isRequired,
  active: PropTypes.bool,
  selctProject: PropTypes.func.isRequired,
  handleProjectDetailsShow: PropTypes.func.isRequired
};

export default ProjectName;
