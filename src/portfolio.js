var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var React = require('react');
var classNames = require('classnames');
var ReactDOM = require('react-dom')

var Container = React.createClass({
            isAnimating : false,
            currentProjectIndex : -1,
            animationDirection : "movingUp",
            animationDuration : 2500,
            // currentState: "home",
            getInitialState: function() {
              return {
                title: "Portfolio Site",
                projects: projects,
                showListView: true,
                currentProject : projects[0],
                showIsAnimating : false,
                items : []
              };
            },
            updateCurrentProject: function(projectName) {
              if (this.isAnimating ===   true) return;
              if (this.state.showListView ===  false) return;

              this.setAnimating();
              for (var i = 0; i < this.state.projects.length; i++) {
                if (this.state.projects[i].name == projectName) {
                  if (i < this.currentProjectIndex) {
                    this.animationDirection = "movingDown"
                  } else {
                    this.animationDirection = "movingUp"
                  }
                  this.setState({"currentProject" : this.state.projects[i]});
                  this.currentProjectIndex = i;
                  this.state.projects[i].active = true;
                  var currentProject = this.state.projects[i]
                } else {
                  this.state.projects[i].active = false;
                }
              }
              this.setState(projects);

              // var newItems = this.state.items;

              // newItems.splice(0, 1);

              if (currentProject !== undefined) {
                // newItems = this.state.items.concat(currentProject);
                this.setState({"animatedProject" : currentProject});
                this.setState({"animatedImageUrl" : currentProject.images[0]});
                this.setState({"animatedImageUrlIndex" : 0});
              }
              else {
                // no project means reset
                // this.goingDown = true;
                this.animationDirection = "movingDown"
                this.currentProjectIndex = -1;
                this.setState({"animatedProject" : null});
                this.setState({"animatedImageUrl" : null});
                this.setState({"animatedImageUrlIndex" : null});
                // this.setState({"currentProject" : null});
              }

              // this.setState({"items" : newItems});
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

              // this.currentState = "home";
              
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
                if (this.currentProjectIndex < (projects.length - 1)) {
                  this.updateCurrentProject(this.state.projects[this.currentProjectIndex + 1].name)
                }
            },
            moveDown: function(){
              if (this.currentProjectIndex > 0) {
                this.updateCurrentProject(this.state.projects[this.currentProjectIndex - 1].name)
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

              if (this.state.showListView == true) {
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

              var projectDetailsView = <div className='projectDetailsView'>
                                            <ProjectDetails currentProject={this.state.currentProject} handleProjectListShow={this.handleProjectListShow} ></ProjectDetails>
                                        </div>;
              if (this.currentProjectIndex == -1) {
                var listColor = {"color" :  "black"}
              }
              else {
                var listColor = {"color" :  "white"}
              }


              // var items = this.state.items.map(function(item, i) {
              //   return (
              //     <Project key={item.name} name={item.name} description={item.description} images={item.images}></Project>
              //   );
              // }.bind(this));
              // 
              // animatedProject

                if (this.state.animatedImageUrl != null) {
                  var imageUrl = "url('images/" + this.state.animatedImageUrl + "')";
                  var backgroundStyles = {"backgroundImage" : imageUrl}

                  var animateProject = <div key={this.state.animatedImageUrl} className="portfolioSlide"  ><div className="slideImage" style={backgroundStyles} ></div><div className="slideImageOpacityOverlay" ></div></div>
                }
                else {
                  var animateProject = null
                }

                var loadingIndicator = (<div>Loading...</div>)
                var images = [];

              return (
                <div id="mainView" className={overallStatusClasses}>
                    <button  id="contactButton" type="button" className="btn btn-default" onClick={this.showContactView} >Contact</button>
                  <div id="leftArrow__IndividualProjecCarousel" className="arrow__IndividualProjecCarousel">
                    <i className="fa fa-chevron-left" onClick={this.clickLeftIndividualProjectCarousel}></i>
                  </div>
                  <div id="rightArrow__IndividualProjecCarousel" className="arrow__IndividualProjecCarousel">
                    <i className="fa fa-chevron-right" onClick={this.clickRightIndividualProjectCarousel}></i>
                  </div>
                  <div className="projectListView">
                    <h1 style={listColor} > Will Melbourne</h1>
                    <div className="introTextContainer" >
                      <p className="introText">Will Melbourne is a software engineer working in Vancouver Canada <i className="fa fa-arrow-down introText__arrow" onClick={this.chooseProjectOne}></i></p>
                    </div>
                    <div id="portfolioProjectAnimationContainer" className={classes}>
                      <ReactCSSTransitionGroup transitionName="portfolioProjectAnimation" transitionEnterTimeout={1000} transitionLeaveTimeout={1000}>
                        {animateProject}                      
                      </ReactCSSTransitionGroup>
                      
                    </div>
                    <ProjectList projects={this.state.projects} listColor={listColor} clickCurrentProject={this.updateCurrentProject} handleProjectDetailsShow={this.handleProjectDetailsShow}></ProjectList>
                  </div>
                  {projectDetailsView}
                </div>

                    
              );
            }
        });


        var Project = React.createClass({
            render: function() {
              if (this.props.images !== undefined && this.props.images[0]) {
                      var imageUrl = "url('images/" + this.props.images[0] + "')";
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

                  <p>{this.props.currentProject.description}</p>
                </div>
                )
            }
         });


         var ProjectList = React.createClass({
            getInitialState: function() {
                return {
                };
            },
            handleProjectShow: function(projectName) {
              this.props.clickCurrentProject(projectName);
            },
            handleProjectDetailsShow: function() {
              this.props.handleProjectDetailsShow();
            },
            render: function() {
              var loop = this.props.projects.map(function (e) {
                    return (
                          <ProjectName key={e.name} name={e.name} fontColor={e.fontColor} shortDescription={e.shortDescription} active={e.active} handleProjectShow={this.handleProjectShow} handleProjectDetailsShow={this.handleProjectDetailsShow}></ProjectName>
                      );
                  }, this);
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
            handleProjectShow: function() {
              this.props.handleProjectShow(this.props.name);
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
                  
                  <h4  onClick={this.handleProjectShow} style={fontColor} >
                    {this.props.name} {this.props.active}
                    <i className="fa fa-arrow-right arrowSeeProjectDetails" onClick={this.handleProjectDetailsShow} style={fontColor}></i>
                  </h4>
                  <p>{this.props.shortDescription}</p>
                </div>
                )
            }
         });


         var ProjectViews = React.createClass({
            getInitialState: function() {
                return {
                };
            },
            render: function() {
                  var projectsLoop = this.props.projects.map(function (project) {

                    if (project.images !== undefined && project.images[0]) {
                      var imageUrl = "url('images/" + project.images[0] + "')";
                      var backgroundStyles = {"backgroundImage" : imageUrl}
                    }

                    if (this.props.currentProject.name == project.name) {
                      var classes = classNames({
                        'active': true,
                        'opacityShow' : true,
                        'opacityTransition' : true,
                        'projectView' : true
                      });
                    }
                    else {
                      var classes = classNames({
                        'active': false,
                        'opacityHide' : true,
                        'opacityTransition' : true,
                        'projectView' : true
                      });
                    }

                      return (
                            <div key={project.name} id="ProjectView__p" style={backgroundStyles} className={classes}>
                              <p>current project :{project.currentProject}</p>
                              <p>color {project.color} </p>
                              <p>image  {project}</p>
                            </div>
                        );
                    }, this);
              return (
                <div id="ProjectViews_container__p">
                  {projectsLoop}
                </div>
              );
            }
         });


        ReactDOM.render(
          <Container />,
        document.getElementById('container')
      );