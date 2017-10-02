import ClassNames from "classnames";
import HeaderBar from "./HeaderBar.js";
import ProjectAnimationContainer from "./ProjectAnimationContainer.js";
import ProjectDetailsIntroView from "./ProjectDetailsIntroView.js";
import ProjectDetailsMainView from "./ProjectDetailsMainView.js";
import ProjectList from "./ProjectList.js";
import PropTypes from "prop-types";
import React from "react";
import ReactDOM from "react-dom";

/**
 * PortfolioContainer is the main component which handles the swipe events to move projects up and down
 * and the left, right click events to change the selected image within a project
 */
class PortfolioContainer extends React.Component{
  constructor() {
    super();
    this.isAnimating = false;
    this.currentProjectIndex = PortfolioContainer.unSetProjectIndex;
    this.animationDirection = ProjectAnimationContainer.ANIMATING.UP;
    this.animationDuration = 1200;
    this.state = {
      showContactModal: false,
      showListView: true,
      currentProject : undefined,
      showIsAnimating : false,
      items : []
    };
  }
  selctProject = (projectName) => {
    if (this.state.currentProject === undefined || this.state.currentProject.name != projectName) {
      this.updateCurrentProject(projectName);
    }
    else {
      this.handleProjectDetailsShow();
    }
  }
  updateCurrentProject = (projectName) => {
    if (this.isAnimating === true) return;
    if (this.state.showListView === false) return;
    let currentProject;

    this.setAnimating();
    for (let i = 0; i < this.props.projects.length; i++) {
      if (this.props.projects[i].name == projectName) {
        if (i < this.currentProjectIndex) {
          this.animationDirection = ProjectAnimationContainer.ANIMATING.DOWN;
        } else {
          this.animationDirection = ProjectAnimationContainer.ANIMATING.UP;
        }
        this.setState({"currentProject" : this.props.projects[i]});
        this.currentProjectIndex = i;
        this.props.projects[i].active = true;
        currentProject = this.props.projects[i];
      } else {
        this.props.projects[i].active = false;
      }
    }

    if (currentProject !== undefined) {
      this.setState({"animatedProject" : currentProject});
      this.setState({"animatedImageUrl" : currentProject.images[0]});
      this.setState({"animatedImageUrlIndex" : 0});
    }
    else {
      // no project means reset
      this.animationDirection = ProjectAnimationContainer.ANIMATING.DOWN;
      this.currentProjectIndex = PortfolioContainer.unSetProjectIndex;
      this.setState({"animatedProject" : null});
      this.setState({"animatedImageUrl" : null});
      this.setState({"animatedImageUrlIndex" : null});
    }
    this.setNotAnimating();
  }
  handleProjectDetailsShow = () => {
    this.setAnimating();
    this.setState({"showListView" : false});
    this.setNotAnimating();
  }
  handleProjectListShow = () => {
    if (this.props.projects == undefined) return;
    this.isAnimating = false;
    this.setState({"showListView" : true});
  }
  hideContactView = () => {
    this.setState({"showContactModal" : false});
  }
  showContactView = () => {
    this.setState({"showContactModal" : true});
  }
  componentDidMount = () => {
    const elem = ReactDOM.findDOMNode(this);
    elem.addEventListener("wheel", this.handleWheel);
    elem.addEventListener("touchmove", this.handleSwipe);
    elem.addEventListener("touchstart", this.handleSwipeStart);
  }
  handleWheel = (event) => {
    if (this.state.showListView == true) {
      event.preventDefault();
    }
    if (this.isAnimating !== false) return;

    if (event.deltaY < 0) (this.moveDown());
    if (event.deltaY > 0) (this.moveUp());
  }
  handleSwipe = (event) => {
    if (this.state.showListView == true) {
      event.preventDefault();
    }
    if (this.isAnimating !== false) return;
      
    if (event.touches[0].screenY < this.startY) {
      this.moveUp();
    } else {
      this.moveDown();
    }

    this.setAnimating();
  }
  handleSwipeStart = (event) => {
    this.startY = event.touches[0].screenY;
  }
  chooseProjectOne = () => {
    this.moveUp();
  }
  moveUp = () => {
    if (this.props.projects == undefined) return;
    if (this.currentProjectIndex < (this.props.projects.length - 1)) {
      this.updateCurrentProject(this.props.projects[this.currentProjectIndex + 1].name);
    }
  }
  moveDown = () => {
    if (this.props.projects == undefined) return;
    if (this.currentProjectIndex > 0) {
      this.updateCurrentProject(this.props.projects[this.currentProjectIndex - 1].name);
    }

    if (this.currentProjectIndex == 0) {
      this.updateCurrentProject("");
    }
  }
  setAnimating = () => {
    this.isAnimating = true;
    this.setState({"showIsAnimating" : true});
  }
  setNotAnimating = () => {
    const self = this;

    this.timeout = setTimeout(() => {
      self.isAnimating = false;
      self.setState({"showIsAnimating" : false});
    }, this.animationDuration);
  }
  /**
   * Cycle left through images related to a project
   */
  clickLeftIndividualProjectCarousel = () => {
    if (this.isAnimating ===   true) return;
    this.setAnimating();

    this.animationDirection = ProjectAnimationContainer.ANIMATING.LEFT;     
    let newIndex;         

    if (this.state.animatedImageUrlIndex != 0) {
      newIndex = this.state.animatedImageUrlIndex - 1;
    } else {
      newIndex = this.state.currentProject.images.length - 1; 
    }

    this.setState({"animatedImageUrl" : this.state.currentProject.images[newIndex]});
    this.setState({"animatedImageUrlIndex" : newIndex});

    this.setNotAnimating();
  }
  /**
   * Cycle right through images related to a project
   */
  clickRightIndividualProjectCarousel = () => {
    if (this.isAnimating ===   true) return;
    this.setAnimating();

    this.animationDirection = ProjectAnimationContainer.ANIMATING.RIGHT;
    let newIndex;        

    if (this.state.animatedImageUrlIndex != this.state.currentProject.images.length - 1) {
      newIndex = this.state.animatedImageUrlIndex + 1;
    } else {
      newIndex =  0;
    }

    this.setState({"animatedImageUrl" : this.state.currentProject.images[newIndex]});
    this.setState({"animatedImageUrlIndex" : newIndex});

    this.setNotAnimating();
  }
  render = () => {

    const animatingStatusClass = ClassNames({
      "animating_active" : this.state.showIsAnimating
    });
 
    let overallStatusClasses;

    if (this.props.imagesReady == false ){
      overallStatusClasses = ClassNames({"imageLoadingView_active": true});
    }
    else if (this.state.showContactModal == true) {
      overallStatusClasses = ClassNames({"modalView_active": true});
    }
    else if (this.state.showListView == true && this.currentProjectIndex == PortfolioContainer.unSetProjectIndex) {
      overallStatusClasses = ClassNames({"intialView_active": true});
    }
    else if (this.state.showListView == true && this.currentProjectIndex != PortfolioContainer.unSetProjectIndex) {
      overallStatusClasses = ClassNames({"projectListView_active": true});
    }
    else {
      overallStatusClasses = ClassNames({
        "projectDetailsView_active": true,
        "singleImageProject" : this.state.currentProject.images.length == 1 ? true : false
      });
    }
    /**
     *  if (this.props.imagesReady == false ){
        overallStatusClasses = "imageLoadingView_active";
    }
    else if (this.state.showListView == true && this.currentProjectIndex == -1) {
        overallStatusClasses = "intialView_active";
    }
    else if (this.state.showListView == true && this.currentProjectIndex != -1) {
        overallStatusClasses = "projectListView_active";
    }
    else if (this.state.currentProject.images.length == 1) {
      overallStatusClasses = "projectDetailsView_active singleImageProject"
    }
    else {
        overallStatusClasses = "projectDetailsView_active"
    }


    if (this.state.showContactModal == true) {
        overallStatusClasses += " modalView_active";
    }
     */

      

    return ( 
      <div id="mainView" className={overallStatusClasses}><div id="animatingStatus" className={animatingStatusClass}>
        <HeaderBar
          hideContactView={this.hideContactView}
          showContactView={this.showContactView}
          handleProjectListShow={this.handleProjectListShow}
        ></HeaderBar>
        <div id="leftArrow__individualProjecCarousel" className="arrow__individualProjecCarousel">
          <i className="fa fa-chevron-left" onClick={this.clickLeftIndividualProjectCarousel}></i>
        </div>
        <div id="rightArrow__individualProjecCarousel" className="arrow__individualProjecCarousel">
          <i className="fa fa-chevron-right" onClick={this.clickRightIndividualProjectCarousel}></i>
        </div>
        <ProjectDetailsIntroView currentProject={this.state.currentProject}></ProjectDetailsIntroView>
        <div className="projectListView">
          <ProjectAnimationContainer
            animationDirection={this.animationDirection}
            animationDuration={this.animationDuration}
            animatedImageUrl={this.state.animatedImageUrl}>
          </ProjectAnimationContainer>
          <div id="projectListContainer">
            <ProjectList
              projects={this.props.projects}
              selctProject={this.selctProject}
              handleProjectDetailsShow={this.handleProjectDetailsShow}
              chooseProjectOne={this.chooseProjectOne}
              imagesReady={this.props.imagesReady}
              currentProjectIndex={this.currentProjectIndex}>
            </ProjectList>
          </div>
        </div>
        <div className="projectDetailsMainView">
          <ProjectDetailsMainView
            currentProject={this.state.currentProject}
            handleProjectListShow={this.handleProjectListShow} >
          </ProjectDetailsMainView>
        </div>
      </div></div>
    );
  }
}
PortfolioContainer.unSetProjectIndex = -1;
PortfolioContainer.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.object),
  imagesReady: PropTypes.bool,
};

export default PortfolioContainer;
