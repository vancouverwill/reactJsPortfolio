var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var React = require('react');
var classNames = require('classnames');
var ReactDOM = require('react-dom');
var Jquery = require('jquery');


var hash = {};
var cache = [];

function add(url) {
    if (!hash[url]) {
        hash[url] = new Image();
        hash[url].src = url;

        cache.push(hash[url]);
    }
    return hash[url];
};

function get(url) {
    return add(url);
};

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
                image.addEventListener('load', handleSuccess, false);
                image.addEventListener('error', reject, false);
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
      request.open('GET', url);
      request.responseType = 'blob';
      // When the request loads, check whether it was successful
      request.onload = function() {
        if (request.status === 200) {
        // If successful, resolve the promise by passing back the request response
          resolve(request.response);
        } else {
        // If it fails, reject the promise with a error message
          reject(Error('Image didn\'t load successfully; error code:' + request.statusText));
        }
      };
      request.onerror = function() {
      // Also deal with the case when the entire request fails to begin with
      // This is probably a network error, so reject the promise with an appropriate message
          reject(Error('There was a network error.'));
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
    }
  },
  componentWillMount : function() {
     this.loadCommentsFromServer();
  },
  handleSuccess : function() {
    console.log("handleSuccess")
    this.setState({ready: true});
  },
  handleError : function() {
    console.log("handleError")
  },
  loadCommentsFromServer: function() {
    Jquery.ajax({
      url: this.props.url,
      dataType: 'json',
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
            apiProject.gallery_set.forEach(function(galleryImage, i) {
              project.images.push(galleryImage.url)
              allImages.push(galleryImage.url)
            });
          }
          projects.push(project);
        });

        this.setState({projects: projects});

        loadImages(allImages).then(this.handleSuccess, this.handleError)


      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {

    // if (this.state.ready !== undefined) {
      var defaultView = <PortfolioContainer url={this.props.url} projects={this.state.projects} imageReady={this.state.ready} />
    // }  else {
    //   var defaultView = <div className="text-center">
    //                         <br />
    //                         <br />
    //                         <br />
    //                         <i className="fa fa-spinner fa-pulse fa-5x"></i>
    //                         <h2>projects loading</h2>
    //                       </div>
    // }
    return (
      <div>{defaultView}</div>
    )
  }
})


var PortfolioContainer = React.createClass({
    isAnimating : false,
    currentProjectIndex : -1,
    animationDirection : "movingUp",
    animationDuration : 1200,
    getInitialState: function() {
      return {
        title: "Portfolio Site",
        showListView: true,
        currentProject : undefined,
        showIsAnimating : false,
        items : []
      };
    },
    selctProject: function(projectName)   {
      if (this.state.currentProject.name != projectName) {
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
            this.animationDirection = "movingDown"
          } else {
            this.animationDirection = "movingUp"
          }
          this.setState({"currentProject" : this.props.projects[i]});
          this.currentProjectIndex = i;
          this.props.projects[i].active = true;
          var currentProject = this.props.projects[i]
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
        this.animationDirection = "movingDown"
        this.currentProjectIndex = -1;
        this.setState({"animatedProject" : null});
        this.setState({"animatedImageUrl" : null});
        this.setState({"animatedImageUrlIndex" : null});
      }

      this.setNotAnimating();
    },
    handleProjectDetailsShow:function() {
      this.setAnimating();
      console.log("handleProjectDetailsShow")
      this.setState({"showListView" : false});
      this.setNotAnimating();
    },
    handleProjectListShow:function() {
        this.isAnimating = false;
        this.setState({"showListView" : true});
    },
    showContactView : function() {
      if (this.state.showListView == false) {
        this.handleProjectListShow();
      }
      
      this.updateCurrentProject(-1);
    },
    componentDidMount: function() {
      var elem = ReactDOM.findDOMNode(this);
      elem.addEventListener('wheel', this.handleWheel);
    },
    handleWheel: function(event) {
      if (this.isAnimating !== false) return;

      if (event.deltaY < 0) (this.moveDown())
      if (event.deltaY > 0) (this.moveUp())
    },
    chooseProjectOne: function() {
      console.log("chooseProjectOne")
      this.moveUp();
    },
    moveUp: function() {
        if (this.currentProjectIndex < (this.props.projects.length - 1)) {
          this.updateCurrentProject(this.props.projects[this.currentProjectIndex + 1].name)
        }
    },
    moveDown: function(){
      if (this.currentProjectIndex > 0) {
        this.updateCurrentProject(this.props.projects[this.currentProjectIndex - 1].name)
      }

      if (this.currentProjectIndex == 0) {
        this.updateCurrentProject('')
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
    clickLeftIndividualProjectCarousel: function(e) {
      if (this.isAnimating ===   true) return;
      this.setAnimating();

      console.log("clickLeftIndividualProjectCarousel")
      this.animationDirection = "movingLeft"              

      if (this.state.animatedImageUrlIndex != 0) {
        var newIndex = this.state.animatedImageUrlIndex - 1
      } else {
        var newIndex = this.state.currentProject.images.length - 1 
      }

      this.setState({"animatedImageUrl" : this.state.currentProject.images[newIndex]});
      this.setState({"animatedImageUrlIndex" : newIndex});

      this.setNotAnimating();
    },
    clickRightIndividualProjectCarousel: function(e) {
      if (this.isAnimating ===   true) return;
      this.setAnimating();

      console.log("clickRightIndividualProjectCarousel")
      this.animationDirection = "movingRight"              

      if (this.state.animatedImageUrlIndex != this.state.currentProject.images.length - 1) {
        var newIndex = this.state.animatedImageUrlIndex + 1
      } else {
        var newIndex =  0
      }

      this.setState({"animatedImageUrl" : this.state.currentProject.images[newIndex]});
      this.setState({"animatedImageUrlIndex" : newIndex});

      this.setNotAnimating();
    },
    render: function() {

      if (this.animationDirection == "movingUp") {
        var classes = classNames({
        'movingUp': true
        });
      }
      else if (this.animationDirection == "movingDown") {
        var classes = classNames({
        'movingDown': true
        });
      }
      else if (this.animationDirection == "movingLeft") {
        var classes = classNames({
        'movingLeft': true
        });
      }
      else if (this.animationDirection == "movingRight") {
        var classes = classNames({
        'movingRight': true
        });
      }

      if (this.props.imageReady == false ){
        var overallStatusClasses = classNames({
          'imageLoadingView_active': true,
        });
      }
      else if (this.state.showListView == true) {
        if (this.currentProjectIndex == -1) {
          listColor = {"color" :  "black"}

          var overallStatusClasses = classNames({
          'intialView_active': true,
          'animating_active' : this.state.showIsAnimating
        });
        }
        else {
          listColor = {"color" :  "white"};

          var overallStatusClasses = classNames({
            'ProjectListView_active': true,
            'animating_active' : this.state.showIsAnimating
          });
        }
      } else {
        var overallStatusClasses = classNames({
          'ProjectDetailsView_active': true,
          'animating_active' : this.state.showIsAnimating
        });
      }

      if (this.state.currentProject !== undefined) {
        var projectDetailsView = <div className='projectDetailsView'>
                                    <ProjectDetails currentProject={this.state.currentProject} handleProjectListShow={this.handleProjectListShow} ></ProjectDetails>
                                </div>;
      }
      else {
        var projectDetailsView = '';

      } 

      if (this.currentProjectIndex == -1) {
        var listColor = {"color" :  "black"}
      }
      else {
        var listColor = {"color" :  "white"}
      }

      if (this.state.animatedImageUrl != null) {
        var imageUrl = "url('" + this.state.animatedImageUrl + "')";
        var backgroundStyles = {"backgroundImage" : imageUrl}

        var animateProject = <div key={this.state.animatedImageUrl} className="portfolioSlide"  >
                                <div className="slideImage" style={backgroundStyles} ></div>
                                <div className="slideImageOpacityOverlay" ></div>
                              </div>
      }
      else {
        var animateProject = null
      }

      return ( 
          <div id="mainView" className={overallStatusClasses}>

            <button  id="contactButton" type="button" className="btn btn-default" onClick={this.showContactView} >Contact</button>
            <div  id="closeProjectButton" onClick={this.handleProjectListShow} >
              <i className="fa fa-times fa-2x"></i>
            </div>
            <div id="leftArrow__IndividualProjecCarousel" className="arrow__IndividualProjecCarousel">
              <i className="fa fa-chevron-left" onClick={this.clickLeftIndividualProjectCarousel}></i>
            </div>
            <div id="rightArrow__IndividualProjecCarousel" className="arrow__IndividualProjecCarousel">
              <i className="fa fa-chevron-right" onClick={this.clickRightIndividualProjectCarousel}></i>
            </div>
            <div className="projectListView">
              <div className="introTextContainer" >
                <h1 style={listColor} > Will Melbourne</h1>
                <p className="introText">Will Melbourne is a software engineer working in the west coast of Canada and London, UK <i className="fa fa-arrow-down introText__arrow" onClick={this.chooseProjectOne}></i>
                  <br/>
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
                </p>
                <div className="text-center loadingState">
                  <i className="fa fa-spinner fa-pulse fa-5x"></i>
                  <h3>projects loading</h3>
                </div>
              </div>
              <div id="portfolioProjectAnimationContainer" className={classes}>
                <ReactCSSTransitionGroup transitionName="portfolioProjectAnimation" transitionEnterTimeout={this.animationDuration} transitionLeaveTimeout={this.animationDuration}>
                  {animateProject}                      
                </ReactCSSTransitionGroup>
                
              </div>
              <ProjectList projects={this.props.projects} listColor={listColor} selctProject={this.selctProject} handleProjectDetailsShow={this.handleProjectDetailsShow} imageReady={this.props.imageReady}></ProjectList>
            </div>
            {projectDetailsView}
          </div>
      );
    }
});


var Project = React.createClass({
    render: function() {
      if (this.props.images !== undefined && this.props.images[0]) {
              var imageUrl = "url('" + this.props.images[0] + "')";
              var backgroundStyles = {"backgroundImage" : imageUrl}
            }

            var leftParagrah =  {"position" : "absolute", "left": "-15%", "top": "10%"}

      return (
        <div key={this.props.name} className="portfolioSlide"  >
            <ReactCSSTransitionGroup transitionName="projectImagesAnimation" transitionEnterTimeout={5000} transitionLeaveTimeout={3000}>
              <div className="slideImage" style={backgroundStyles} ></div>
            </ReactCSSTransitionGroup>
        </div>
        )
    }
 });


var ProjectDetails = React.createClass({
    handleProjectListShow: function() {
      this.props.handleProjectListShow();
    },
    render: function() {
      return (
        <div key={this.props.currentProject.name} className="ProjectDetailsContent">
          <span className="pointer"><i className="fa fa-arrow-up" onClick={this.handleProjectListShow}>Back to Projects</i></span>
          <h2>{this.props.currentProject.name}</h2>

          <p dangerouslySetInnerHTML={{__html: this.props.currentProject.description}}></p>
        </div>
        )
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
    render: function() {
      if (this.props.projects !== undefined && this.props.imageReady == true) {
        var loop = this.props.projects.map(function (e) {
              return (
                    <ProjectName key={e.name} name={e.name} fontColor={e.fontColor} shortDescription={e.shortDescription} active={e.active} selctProject={this.selctProject} handleProjectDetailsShow={this.handleProjectDetailsShow}></ProjectName>
                );
            }, this);
      }
      else {
        var loop = ""
      }
      return (
          <div id="ProjectList">
            <div id="ProjectListMenu" style={this.props.listColor} >
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
        'active': this.props.active,
        'project-title' : true
      });

      if (this.props.active == true) {
        var fontColor = {"color" : this.props.fontColor};
      }
      else {
        var fontColor = {};
      }

      return (
        <div className={classes}>
          <div className="spacingDivBorder"  ></div>
          
          <h4  onClick={this.selctProject} style={fontColor} >
            {this.props.name} {this.props.active}
            <i className="fa fa-arrow-right arrowSeeProjectDetails" onClick={this.handleProjectDetailsShow} style={fontColor}></i>
          </h4>
          <p>{this.props.shortDescription}</p>
        </div>
        )
    }
 });


// var ProjectViews = React.createClass({
//   getInitialState: function() {
//       return {
//       };
//   },
//   render: function() {
//         var projectsLoop = this.props.projects.map(function (project) {

//           if (project.images !== undefined && project.images[0]) {
//             var imageUrl = "url('" + project.images[0] + "')";
//             var backgroundStyles = {"backgroundImage" : imageUrl}
//           }

//           if (this.props.currentProject.name == project.name) {
//             var classes = classNames({
//               'active': true,
//               'opacityShow' : true,
//               'opacityTransition' : true,
//               'projectView' : true
//             });
//           }
//           else {
//             var classes = classNames({
//               'active': false,
//               'opacityHide' : true,
//               'opacityTransition' : true,
//               'projectView' : true
//             });
//           }

//             return (
//                   <div key={project.name} id="ProjectView__p" style={backgroundStyles} className={classes}>
//                     <p>current project :{project.currentProject}</p>
//                     <p>color {project.color} </p>
//                     <p>image  {project}</p>
//                   </div>
//               );
//           }, this);
//     return (
//       <div id="ProjectViews_container__p">
//         {projectsLoop}
//       </div>
//     );
//   }
// });

// var apiUrl = "/api/projects"
var apiUrl = "http://api.portfolio.willmelbourne.com/wp-json/wp/v2/projects"




ReactDOM.render(
  <PageLoadingClass url={apiUrl} />,
  document.getElementById('container')
);