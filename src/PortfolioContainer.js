import classNames from "classnames";
import ProjectAnimationContainer from "./ProjectAnimationContainer.js";
import ProjectDetailsIntroView from "./ProjectDetailsIntroView.js";
import ProjectDetailsMainView from "./ProjectDetailsMainView.js";
import ProjectList from "./ProjectList.js";
import React from "react";
import ReactDOM from "react-dom";

class PortfolioContainer extends React.Component{
  constructor() {
    super();
    this.isAnimating = false;
    this.unSetProjectIndex = -1;
    this.currentProjectIndex = this.unSetProjectIndex;
    this.animationDirection = "movingUp";
    this.animationDuration = 1200;
    this.state = {
      title: "Portfolio Site",
      showContactModal: false,
      showListView: true,
      currentProject : undefined,
      showIsAnimating : false,
      items : []
    };
  }
  static unSetProjectIndex() {
    return this.unSetProjectIndex;
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
    if (this.isAnimating ===   true) return;
    if (this.state.showListView ===  false) return;
    let currentProject;

    this.setAnimating();
    for (let i = 0; i < this.props.projects.length; i++) {
      if (this.props.projects[i].name == projectName) {
        if (i < this.currentProjectIndex) {
          this.animationDirection = "movingDown";
        } else {
          this.animationDirection = "movingUp";
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
      this.animationDirection = "movingDown";
      this.currentProjectIndex = this.unSetProjectIndex;
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
    if (this.isAnimating !== false) return;

    if (event.deltaY < 0) (this.moveDown());
    if (event.deltaY > 0) (this.moveUp());
  }
  handleSwipe = (event) => {
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
    if (this.currentProjectIndex < (this.props.projects.length - 1)) {
      this.updateCurrentProject(this.props.projects[this.currentProjectIndex + 1].name);
    }
  }
  moveDown = () => {
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
  clickLeftIndividualProjectCarousel = () => {
    if (this.isAnimating ===   true) return;
    this.setAnimating();

    this.animationDirection = "movingLeft";     
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
  clickRightIndividualProjectCarousel = () => {
    if (this.isAnimating ===   true) return;
    this.setAnimating();

    this.animationDirection = "movingRight";
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

    const animatingStatusClass = classNames({
      "animating_active" : this.state.showIsAnimating
    });

    let overallStatusClasses;

    if (this.props.imageReady == false ){
      overallStatusClasses = classNames({"imageLoadingView_active": true});
    }
    else if (this.state.showContactModal == true) {
      overallStatusClasses = classNames({"modalView_active": true});
    }
    else if (this.state.showListView == true && this.currentProjectIndex == this.unSetProjectIndex) {
      overallStatusClasses = classNames({"intialView_active": true});
    }
    else if (this.state.showListView == true && this.currentProjectIndex != this.unSetProjectIndex) {
      overallStatusClasses = classNames({"projectListView_active": true});
    }
    else {
      overallStatusClasses = classNames({
        "projectDetailsView_active": true,
        "singleImageProject" : this.state.currentProject.images.length == 1 ? true : false
      });
    }

      

    return ( 
      <div id="mainView" className={overallStatusClasses}><div id="animatingStatus" className={animatingStatusClass}>
        <div id="testBlock"></div>
        <div id="modalContactView" className="active">
          <div className="closeButton modalCloseButton" onClick={this.hideContactView} >
            <i className="fa fa-times fa-2x"></i>
          </div>
          <div className="modalContactViewText">
                contact : willmelbourne@gmail.com
            <a href="https://ca.linkedin.com/in/willmelbourne" target="_blank">
              <span className="circleBorder">
                <i className="fa fa-linkedin fa-lg"></i>
              </span>
            </a>
            <a href="mailto:willmelbourne@gmail.com">
              <span className="circleBorder">
                <i className="fa fa-envelope fa-lg"></i>
              </span>
            </a>
            <a href="https://github.com/vancouverwill" target="_blank">
              <span className="circleBorder">
                <i className="fa fa-github-alt fa-lg"></i>
              </span>
            </a>
          </div>
        </div>
        <div id="contactButton">
          <a href="https://github.com/vancouverwill/reactJsPortfolio">source</a>
          <button  type="button" className=" btn btn-default" onClick={this.showContactView} >Contact</button>
        </div>
        <div className="closeButton projectCloseButton" onClick={this.handleProjectListShow} >
          <i className="fa fa-times fa-2x"></i>
        </div>
        <div id="leftArrow__individualProjecCarousel" className="arrow__individualProjecCarousel">
          <i className="fa fa-chevron-left" onClick={this.clickLeftIndividualProjectCarousel}></i>
        </div>
        <div id="rightArrow__individualProjecCarousel" className="arrow__individualProjecCarousel">
          <i className="fa fa-chevron-right" onClick={this.clickRightIndividualProjectCarousel}></i>
        </div>
        <ProjectDetailsIntroView currentProject={this.state.currentProject}></ProjectDetailsIntroView>
        <div className="projectListView">
          <ProjectAnimationContainer animationDirection={this.animationDirection} animationDuration={this.animationDuration} animatedImageUrl={this.state.animatedImageUrl}></ProjectAnimationContainer>
          <ProjectList projects={this.props.projects} selctProject={this.selctProject} handleProjectDetailsShow={this.handleProjectDetailsShow} chooseProjectOne={this.chooseProjectOne} imageReady={this.props.imageReady} currentProjectIndex={this.currentProjectIndex}></ProjectList>
        </div>
        <div className="projectDetailsMainView">
          <ProjectDetailsMainView currentProject={this.state.currentProject} handleProjectListShow={this.handleProjectListShow} ></ProjectDetailsMainView>
        </div>
      </div></div>
    );
  }
}

export default PortfolioContainer;
