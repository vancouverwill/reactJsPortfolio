/*global require, apiUrl*/

var ReactCSSTransitionGroup = require("react-addons-css-transition-group");
var React = require("react");
var classNames = require("classnames");
var ReactDOM = require("react-dom");
var Jquery = require("jquery");


var hash = {};
var cache = [];

function add(url) {
    if (!hash[url]) {
      hash[url] = new Image();
      hash[url].src = url;

      cache.push(hash[url]);
    }
    return hash[url];
}

function get(url) {
    return add(url);
}

function imgRequestUrlLoad(url) {

    var image = get(url);

    return new Promise((resolve, reject) => {
        var handleSuccess = function handleSuccess() {
            resolve(image);
        };

        if (image.naturalWidth && image.naturalHeight) {
                //Image is loaded, go ahead and change the state
            handleSuccess();
        } else {
            image.addEventListener("load", handleSuccess, false);
            image.addEventListener("error", reject, false);
        }
    });
}


function imgLoad(url) {
    // Create new promise with the Promise() constructor;
    // This has as its argument a function
    // with two parameters, resolve and reject
    return new Promise((resolve, reject) => {
      // Standard XHR to load an image
        var request = new XMLHttpRequest();
        request.open("GET", url);
        request.responseType = "blob";
      // When the request loads, check whether it was successful
        request.onload = () => {
            if (request.status === 200) {
        // If successful, resolve the promise by passing back the request response
                      resolve(request.response);
                  } else {
        // If it fails, reject the promise with a error message
                      reject(Error("Image didn\'t load successfully; error code:" + request.statusText));
                  }
        };
        request.onerror = function() {
      // Also deal with the case when the entire request fails to begin with
      // This is probably a network error, so reject the promise with an appropriate message
            reject(Error("There was a network error."));
        };
      // Send the request
        request.send();
    });
} 


function loadImages(urls) {
    var promises = urls.map(imgRequestUrlLoad);
    return Promise.all(promises);
}


class PageLoadingClass  extends React.Component{
    constructor() {
        super();
        this.state = {
            projects: undefined,
            ready: false,
            ajaxState: undefined
        };
        this.componentWillMount = this.componentWillMount.bind(this);
        this.handleSuccess = this.handleSuccess.bind(this);
        this.handleError = this.handleError.bind(this);
        this.loadCommentsFromServer = this.loadCommentsFromServer.bind(this);
        this.render = this.render.bind(this);
    }
    componentWillMount() {
        this.loadCommentsFromServer();
    }
    handleSuccess() {
        this.setState({ready: true});
    }
    handleError() {
      this.setState({ajaxState : "failed"})
    }
    loadCommentsFromServer() {
        Jquery.ajax({
            url: this.props.url,
            dataType: "json",
            success: function(apiProjects) {

                    var projects = [];
                    var allImages = [];

                    apiProjects.forEach(function(apiProject) {
                      var project = {};
                      project.name = apiProject.title.rendered;
                      project.shortDescription = apiProject.project_short_description;
                      project.description = apiProject.content.rendered;
                      project.fontColor = apiProject.font_color;

                      project.images = [];

                      if (apiProject.gallery_set !== undefined && apiProject.gallery_set.length > 0) {
                        apiProject.gallery_set.forEach(function(galleryImage) {
                          project.images.push(galleryImage.url);
                          allImages.push(galleryImage.url);
                      });
                    }
                      projects.push(project);
                  });

                    this.setState({projects: projects});

                    loadImages(allImages).then(this.handleSuccess, this.handleError);


                }.bind(this),
            error: function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                    console.log('could not load projects')
                    this.handleError();
                }.bind(this)
        });
    }
    render() {

      if (this.state.ajaxState == undefined) {
        return (
          <PortfolioContainer url={this.props.url} projects={this.state.projects} imageReady={this.state.ready} >
          </PortfolioContainer>
        );
      }
      else {
        return (
          <div className="text-center">
            <h3>Sorry projects are not available to view right now :(</h3> 
            <h3>Please try again later....</h3>
          </div>
        );
      }
    }
};


class PortfolioContainer extends React.Component{
     constructor() {
        super();
        this.isAnimating = false;
        this.currentProjectIndex = -1;
        this.animationDirection = "movingUp";
        this.animationDuration = 1200;
        this.state = {
            title: "Portfolio Site",
            showContactModal: false,
            showListView: true,
            currentProject : undefined,
            showIsAnimating : false,
            items : []
        }
        
        this.selctProject = this.selctProject.bind(this);
        this.updateCurrentProject = this.updateCurrentProject.bind(this);
        this.handleProjectDetailsShow = this.handleProjectDetailsShow.bind(this);
        this.handleProjectListShow = this.handleProjectListShow.bind(this);
        this.hideContactView = this.hideContactView.bind(this);
        this.showContactView = this.showContactView.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleWheel = this.handleWheel.bind(this);
        this.handleSwipe = this.handleSwipe.bind(this);
        this.handleSwipeStart = this.handleSwipeStart.bind(this);
        this.chooseProjectOne = this.chooseProjectOne.bind(this);
        this.moveUp = this.moveUp.bind(this);
        this.moveDown = this.moveDown.bind(this);
        this.setAnimating = this.setAnimating.bind(this);
        this.setNotAnimating = this.setNotAnimating.bind(this);
        this.clickLeftIndividualProjectCarousel = this.clickLeftIndividualProjectCarousel.bind(this);
        this.clickRightIndividualProjectCarousel = this.clickRightIndividualProjectCarousel.bind(this);
        this.render = this.render.bind(this);
     }
    // isAnimating : false,
    // currentProjectIndex : -1,
    // animationDirection : "movingUp",
    // animationDuration : 1200,
    // getInitialState: function() {
    //     return {
    //         title: "Portfolio Site",
    //         showContactModal: false,
    //         showListView: true,
    //         currentProject : undefined,
    //         showIsAnimating : false,
    //         items : []
    //     };
    // },
    selctProject(projectName)   {
        if (this.state.currentProject === undefined || this.state.currentProject.name != projectName) {
            this.updateCurrentProject(projectName);
        }
      else {
            this.handleProjectDetailsShow();
        }
    }
    updateCurrentProject(projectName) {
        if (this.isAnimating ===   true) return;
        if (this.state.showListView ===  false) return;

        this.setAnimating();
        for (var i = 0; i < this.props.projects.length; i++) {
            if (this.props.projects[i].name == projectName) {
                      if (i < this.currentProjectIndex) {
                        this.animationDirection = "movingDown";
                    } else {
                        this.animationDirection = "movingUp";
                    }
                      this.setState({"currentProject" : this.props.projects[i]});
                      this.currentProjectIndex = i;
                      this.props.projects[i].active = true;
                      var currentProject = this.props.projects[i];
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
            this.currentProjectIndex = -1;
            this.setState({"animatedProject" : null});
            this.setState({"animatedImageUrl" : null});
            this.setState({"animatedImageUrlIndex" : null});
        }

        this.setNotAnimating();
    }
    handleProjectDetailsShow() {
        this.setAnimating();
        this.setState({"showListView" : false});
        this.setNotAnimating();
    }
    handleProjectListShow() {
        this.isAnimating = false;
        this.setState({"showListView" : true});
    }
    hideContactView () {
        this.setState({"showContactModal" : false});
    }
    showContactView () {
        this.setState({"showContactModal" : true});
    }
    componentDidMount() {
        var elem = ReactDOM.findDOMNode(this);
        elem.addEventListener("wheel", this.handleWheel);
        elem.addEventListener("touchmove", this.handleSwipe);
        elem.addEventListener("touchstart", this.handleSwipeStart);
    }
    handleWheel(event) {
        if (this.isAnimating !== false) return;

        if (event.deltaY < 0) (this.moveDown());
        if (event.deltaY > 0) (this.moveUp());
    }
    handleSwipe(event) {
        if (this.isAnimating !== false) return;
      
        if (event.touches[0].screenY < this.startY) {
            this.moveUp();
        } else {
            this.moveDown();
        }

        this.setAnimating();
    }
    handleSwipeStart(event) {
        this.startY = event.touches[0].screenY;
    }
    chooseProjectOne() {
        this.moveUp();
    }
    moveUp() {
        if (this.currentProjectIndex < (this.props.projects.length - 1)) {
            this.updateCurrentProject(this.props.projects[this.currentProjectIndex + 1].name);
        }
    }
    moveDown(){
        if (this.currentProjectIndex > 0) {
            this.updateCurrentProject(this.props.projects[this.currentProjectIndex - 1].name);
        }

        if (this.currentProjectIndex == 0) {
            this.updateCurrentProject("");
        }
    }
    setAnimating() {
        this.isAnimating = true;
        this.setState({"showIsAnimating" : true});
    }
    setNotAnimating() {
        var self = this;

        this.timeout = setTimeout(function(){
            self.isAnimating = false;
            self.setState({"showIsAnimating" : false});
        }, this.animationDuration);
    }
    clickLeftIndividualProjectCarousel() {
        if (this.isAnimating ===   true) return;
        this.setAnimating();

        this.animationDirection = "movingLeft";     
        var newIndex;         

        if (this.state.animatedImageUrlIndex != 0) {
            newIndex = this.state.animatedImageUrlIndex - 1;
        } else {
            newIndex = this.state.currentProject.images.length - 1; 
        }

        this.setState({"animatedImageUrl" : this.state.currentProject.images[newIndex]});
        this.setState({"animatedImageUrlIndex" : newIndex});

        this.setNotAnimating();
    }
    clickRightIndividualProjectCarousel() {
        if (this.isAnimating ===   true) return;
        this.setAnimating();

        this.animationDirection = "movingRight";
        var newIndex;        

        if (this.state.animatedImageUrlIndex != this.state.currentProject.images.length - 1) {
            newIndex = this.state.animatedImageUrlIndex + 1;
        } else {
            newIndex =  0;
        }

        this.setState({"animatedImageUrl" : this.state.currentProject.images[newIndex]});
        this.setState({"animatedImageUrlIndex" : newIndex});

        this.setNotAnimating();
    }
    render() {

      var animatingStatusClass = classNames({
              "animating_active" : this.state.showIsAnimating
          });

      var overallStatusClasses;

      if (this.props.imageReady == false ){
          overallStatusClasses = classNames({"imageLoadingView_active": true});
      }
      else if (this.state.showContactModal == true) {
          overallStatusClasses = classNames({"modalView_active": true});
      }
      else if (this.state.showListView == true && this.currentProjectIndex == -1) {
          overallStatusClasses = classNames({"intialView_active": true});
      }
      else if (this.state.showListView == true && this.currentProjectIndex != -1) {
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
            <button id="contactButton" type="button" className=" btn btn-default" onClick={this.showContactView} >Contact</button>
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
};


class ProjectAnimationContainer extends React.Component{
constructor() {
        super();
        this.render = this.render.bind(this);
    }
render() {
      var animateProject;

      if (this.props.animatedImageUrl != null) {
        var imageUrl = "url('" + this.props.animatedImageUrl + "')";
        var backgroundStyles = {"backgroundImage" : imageUrl};

        animateProject = <div key={this.props.animatedImageUrl} className="portfolioSlide"  >
                              <div className="slideImage" style={backgroundStyles} ></div>
                              <div className="slideImageOpacityOverlay" ></div>
                            </div>;
      }

      return (
      <div id="portfolioProjectAnimationContainer" className={this.props.animationDirection}>
            <ReactCSSTransitionGroup 
              transitionName="portfolioProjectAnimation" 
              transitionEnterTimeout={this.props.animationDuration} 
              transitionLeaveTimeout={this.props.animationDuration}
              >
              {animateProject}                      
            </ReactCSSTransitionGroup>
          </div>
    );
  }
};


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
};


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
};


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
};


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
};



ReactDOM.render(
  <PageLoadingClass url={apiUrl} />,
  document.getElementById("container")
);