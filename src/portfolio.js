/*global require*/

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

    return new Promise(function (resolve, reject) {
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
    return new Promise(function(resolve, reject) {
      // Standard XHR to load an image
        var request = new XMLHttpRequest();
        request.open("GET", url);
        request.responseType = "blob";
      // When the request loads, check whether it was successful
        request.onload = function() {
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
      // var promises = urls.map(imgRequestUrlLoad.bind(this));
    var promises = urls.map(imgRequestUrlLoad);
    return Promise.all(promises);
}


var PageLoadingClass = React.createClass({
    getInitialState: function() {
        return {
            projects: undefined,
            ready: false
        };
    },
    componentWillMount : function() {
        this.loadCommentsFromServer();
    },
    handleSuccess : function() {
        this.setState({ready: true});
    },
    handleError : function() {
    },
    loadCommentsFromServer: function() {
        Jquery.ajax({
            url: this.props.url,
            dataType: "json",
            success: function(apiProjects) {

                    var projects = [];
                    var allImages = [];

                    apiProjects.forEach(function(apiProject, i) {
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
                }.bind(this)
        });
    },
    render: function() {
        return (
      <PortfolioContainer url={this.props.url} projects={this.state.projects} imageReady={this.state.ready} >
      </PortfolioContainer>
    );
    }
});


var PortfolioContainer = React.createClass({
    isAnimating : false,
    currentProjectIndex : -1,
    animationDirection : "movingUp",
    animationDuration : 1200,
    getInitialState: function() {
        return {
            title: "Portfolio Site",
            showContactModal: false,
            showListView: true,
            currentProject : undefined,
        // currentProjectIndex : undefined,
            showIsAnimating : false,
            items : []
        };
    },
    selctProject: function(projectName)   {
        if (this.state.currentProject === undefined || this.state.currentProject.name != projectName) {
            this.updateCurrentProject(projectName);
        }
      else {
            this.handleProjectDetailsShow();
        }
    },
    updateCurrentProject: function(projectName) {
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
      // this.setState(projects);

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
    },
    handleProjectDetailsShow:function() {
        this.setAnimating();
        this.setState({"showListView" : false});
        this.setNotAnimating();
    },
    handleProjectListShow:function() {
        this.isAnimating = false;
        this.setState({"showListView" : true});
    },
    hideContactView : function() {
        this.setState({"showContactModal" : false});
    },
    showContactView : function() {
        this.setState({"showContactModal" : true});
    },
    componentDidMount: function() {
        var elem = ReactDOM.findDOMNode(this);
        elem.addEventListener("wheel", this.handleWheel);
        elem.addEventListener("touchmove", this.handleSwipe);
        elem.addEventListener("touchstart", this.handleSwipeStart);
    },
    handleWheel: function(event) {
        if (this.isAnimating !== false) return;

        if (event.deltaY < 0) (this.moveDown());
        if (event.deltaY > 0) (this.moveUp());
    },
    handleSwipe: function(event) {
        if (this.isAnimating !== false) return;
      
      // var el = ReactDOM.findDOMNode(this);
          // var touches = event.changedTouches;

        if (event.touches[0].screenY < this.startY) {
            this.moveUp();
        } else {
            this.moveDown();
        }

        this.setAnimating();
    },
    handleSwipeStart: function(event) {
        this.startY = event.touches[0].screenY;
    },
    chooseProjectOne: function() {
        this.moveUp();
    },
    moveUp: function() {
        if (this.currentProjectIndex < (this.props.projects.length - 1)) {
            this.updateCurrentProject(this.props.projects[this.currentProjectIndex + 1].name);
        }
    },
    moveDown: function(){
        if (this.currentProjectIndex > 0) {
            this.updateCurrentProject(this.props.projects[this.currentProjectIndex - 1].name);
        }

        if (this.currentProjectIndex == 0) {
            this.updateCurrentProject("");
        }
    },
    setAnimating: function() {
        this.isAnimating = true;
        this.setState({"showIsAnimating" : true});
    },
    setNotAnimating: function() {
        var self = this;

        this.timeout = setTimeout(function(){
            self.isAnimating = false;
            self.setState({"showIsAnimating" : false});
        }, this.animationDuration);
    },
    clickLeftIndividualProjectCarousel: function() {
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
    },
    clickRightIndividualProjectCarousel: function() {
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
    },
    render: function() {

        var classes, animateProject, overallStatusClasses;

        if (this.animationDirection == "movingUp") {
            classes = classNames({
                      "movingUp": true
                  });
        }
      else if (this.animationDirection == "movingDown") {
          classes = classNames({
              "movingDown": true
          });
      }
      else if (this.animationDirection == "movingLeft") {
          classes = classNames({
              "movingLeft": true
          });
      }
      else if (this.animationDirection == "movingRight") {
          classes = classNames({
              "movingRight": true
          });
      }

        if (this.props.imageReady == false ){
            overallStatusClasses = classNames({
                      "imageLoadingView_active": true
                  });
        }
      else if (this.state.showContactModal == true) {
          overallStatusClasses = classNames({
              "modalView_active": true
          });
      }
      else if (this.state.showListView == true) {
          if (this.currentProjectIndex == -1) {
              overallStatusClasses = classNames({
                  "intialView_active": true,
                  "animating_active" : this.state.showIsAnimating
              });
          }
        else {
              overallStatusClasses = classNames({
                  "projectListView_active": true,
                  "animating_active" : this.state.showIsAnimating
              });
          }
      } else {
          overallStatusClasses = classNames({
              "projectDetailsView_active": true,
              "singleImageProject" : this.state.currentProject.images.length == 1 ? true : false,
              "animating_active" : this.state.showIsAnimating
          });
      }

        if (this.state.animatedImageUrl != null) {
            var imageUrl = "url('" + this.state.animatedImageUrl + "')";
            var backgroundStyles = {"backgroundImage" : imageUrl};

            animateProject = <div key={this.state.animatedImageUrl} className="portfolioSlide"  >
                                <div className="slideImage" style={backgroundStyles} ></div>
                                <div className="slideImageOpacityOverlay" ></div>
                              </div>;
        }
      else {
            animateProject = null;
        }

        return ( 
          <div id="mainView" className={overallStatusClasses}>
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
              <div id="portfolioProjectAnimationContainer" className={classes}>
                <ReactCSSTransitionGroup transitionName="portfolioProjectAnimation" transitionEnterTimeout={this.animationDuration} transitionLeaveTimeout={this.animationDuration}>
                  {animateProject}                      
                </ReactCSSTransitionGroup>
                
              </div>
              <ProjectList projects={this.props.projects} selctProject={this.selctProject} handleProjectDetailsShow={this.handleProjectDetailsShow} chooseProjectOne={this.chooseProjectOne} imageReady={this.props.imageReady} currentProjectIndex={this.currentProjectIndex}></ProjectList>
            </div>
            <div className="projectDetailsMainView">
              <ProjectDetailsMainView currentProject={this.state.currentProject} handleProjectListShow={this.handleProjectListShow} ></ProjectDetailsMainView>
            </div>
          </div>
      );
    }
});


// var Project = React.createClass({
//     render: function() {
//       if (this.props.images !== undefined && this.props.images[0]) {
//               var imageUrl = "url('" + this.props.images[0] + "')";
//               var backgroundStyles = {"backgroundImage" : imageUrl};
//             }
//       return (
//         <div key={this.props.name} className="portfolioSlide"  >
//             <ReactCSSTransitionGroup transitionName="projectImagesAnimation" transitionEnterTimeout={5000} transitionLeaveTimeout={3000}>
//               <div className="slideImage" style={backgroundStyles} ></div>
//             </ReactCSSTransitionGroup>
//         </div>
//         );
//     }
//  });


var ProjectDetailsIntroView = React.createClass({
    render: function() {
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
});


var ProjectDetailsMainView = React.createClass({
    handleProjectListShow: function() {
        this.props.handleProjectListShow();
    },
    render: function() {
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
});


var ProjectList = React.createClass({
    getInitialState: function() {
        return {
         };
    },
    selctProject: function(projectName) {
        this.props.selctProject(projectName);
    },
    handleProjectDetailsShow: function() {
        this.props.handleProjectDetailsShow();
    },
    chooseProjectOne: function() {
        this.props.chooseProjectOne();
    },
    componentWillUpdate: function() {
 
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
    },
    render: function() {
        var loop;

        if (this.props.projects !== undefined && this.props.imageReady == true) {
             loop = this.props.projects.map(function (project) {
                      return (
                    <ProjectName key={project.name} name={project.name} active={project.active} fontColor={project.fontColor} shortDescription={project.shortDescription} selctProject={this.selctProject} handleProjectDetailsShow={this.handleProjectDetailsShow}></ProjectName>
                );
                  }, this);
         }
      else {
             loop = "";
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
});


var ProjectName = React.createClass({
    selctProject: function() {
        this.props.selctProject(this.props.name);
    },
    handleProjectDetailsShow: function() {
        this.props.handleProjectDetailsShow();
    },
    render: function() {
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
          <div className="spacingDivBorder"  ></div>
          
          <h4  onClick={this.selctProject} style={fontColor} >
            {this.props.name}
            <i className="fa fa-arrow-right arrowSeeProjectDetails" onClick={this.handleProjectDetailsShow} style={fontColor}></i>
          </h4>
          <p dangerouslySetInnerHTML={{__html: this.props.shortDescription}}></p>
        </div>
        );
    }
});



ReactDOM.render(
  <PageLoadingClass url={apiUrl} />,
  document.getElementById("container")
);