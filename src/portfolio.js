// var React = require('react/addons');
var React = require('react');
var classNames = require('classnames');
var ReactDOM = require('react-dom')
var Preload = require('react-preload').Preload; 





var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

var Container = React.createClass({
            isAnimating : false,
            currentProjectIndex : -1,
            // goingDown : false,
            animationDirection : "up",
            animationDuration : 2500,
            getInitialState: function() {
              return {
                title: "Portfolio Site",
                projects: projects,
                showListView: true,
                currentProject : projects[0],
                // previousProject : null,
                // animating : false,
                items : []
              };
            },
            updateCurrentProject: function(projectName) {
              if (this.isAnimating ===   true) return;
              if (this.state.showListView ===  false) return;

              this.isAnimating = true;
              for (var i = 0; i < this.state.projects.length; i++) {
                if (this.state.projects[i].name == projectName) {
                  if (i < this.currentProjectIndex) {
                    // this.goingDown = true;
                    this.animationDirection = "down"
                  } else {
                    // this.goingDown = false;
                    this.animationDirection = "up"
                  }
                  // this.setState({"previousProject" : this.state.currentProject});
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
                this.animationDirection = "down"
                this.currentProjectIndex = -1;
                this.setState({"animatedProject" : null});
                this.setState({"animatedImageUrl" : null});
                this.setState({"animatedImageUrlIndex" : null});
                // this.setState({"currentProject" : null});
              }

              var self = this;
              this.timeout = setTimeout(function(){
                self.isAnimating = false;
              }, this.animationDuration);
            },
            handleProjectDetailsShow:function() {
              this.isAnimating = true;
              console.log("handleProjectDetailsShow")
                this.setState({"showListView" : false});
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
              var elem = ReactDOM.findDOMNode(this) ;
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
            clickLeftIndividualProjectCarousel: function(e) {
              if (this.isAnimating ===   true) return;
              this.isAnimating = true;

              console.log("clickLeftIndividualProjectCarousel")
              this.animationDirection = "left"              

              if (this.state.animatedImageUrlIndex != 0) {
                var newIndex = this.state.animatedImageUrlIndex - 1
              } else {
                var newIndex = this.state.currentProject.images.length - 1 
              }

              this.setState({"animatedImageUrl" : this.state.currentProject.images[newIndex]});
              this.setState({"animatedImageUrlIndex" : newIndex});

              var self = this;
              this.timeout = setTimeout(function(){
                self.isAnimating = false;
              }, this.animationDuration);
            },
            clickRightIndividualProjectCarousel: function(e) {
              console.log("clickRightIndividualProjectCarousel 1")
              if (this.isAnimating ===   true) return;
              this.isAnimating = true;

              console.log("clickRightIndividualProjectCarousel")
              this.animationDirection = "right"              

              if (this.state.animatedImageUrlIndex != this.state.currentProject.images.length - 1) {
                var newIndex = this.state.animatedImageUrlIndex + 1
              } else {
                var newIndex =  0
              }

              this.setState({"animatedImageUrl" : this.state.currentProject.images[newIndex]});
              this.setState({"animatedImageUrlIndex" : newIndex});

              var self = this;
              this.timeout = setTimeout(function(){
                self.isAnimating = false;
              }, this.animationDuration);
            },
            render: function() {
              if (this.animationDirection == "up") {
                var classes = classNames({
                'movingUp': true
                });
              }
              else if (this.animationDirection == "down") {
                var classes = classNames({
                'movingDown': true
                });
              }
              else if (this.animationDirection == "left") {
                var classes = classNames({
                'movingLeft': true
                });
              }
              else if (this.animationDirection == "right") {
                var classes = classNames({
                'movingRight': true
                });
              }

              
              if (this.currentProjectIndex == -1) {
                 var overallState = "unIntiatedListViewState"
                 // var detailsViewStyles = {"opacity" : "0", "top" : "100%", "transform" : "scale(0.0,0.0)"}
              }
              else if (this.state.showListView == true) {


                var overallState = "intiatedListViewState"
                // var detailsViewStyles = {"opacity" : "0", "top" : "100%", "transform" : "scale(0.0,0.0)"}
                var projectListOpacity = {"opacity" : "1"};
              } else { // show individual project in detail
                var overallState = "detailsViewState"
                // var detailsViewStyles = {"opacity" : "1", "top" : "70%", "transform" : "scale(1,1)"};
                var projectListOpacity = {"opacity" : "0"}
              }

              var projectDetailsView = <div className='projectDetailsView backgroundView' >
                      <ProjectDetails currentProject={this.state.currentProject} handleProjectListShow={this.handleProjectListShow} ></ProjectDetails>
                    </div>;

              // if (this.state.items.length <= 0) {
              if (this.currentProjectIndex == -1) {
                var listColor = {"color" :  "black"}
                // introContainerOpacity = {"opacity" : 1}
              }
              else {
                var listColor = {"color" :  "white"}
                // introContainerOpacity = {"opacity" : 0}
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

                // var animateProject = <Project key={this.state.animatedProject.name} name={this.state.animatedProject.name} description={this.state.animatedProject.description} images={this.state.animatedProject.images}></Project>
                  var animateProject = <div key={this.state.animatedImageUrl} className="portfolioSlide"  ><div className="slideImage" style={backgroundStyles} ></div><div className="slideImageOpacityOverlay" ></div></div>
                }
                else {
                  var animateProject = null
                }

                var loadingIndicator = (<div>Loading...</div>)
                var images = [];

                // var Preload = require('react-preload').Preload; 


                /* <Preload
                loadingIndicator={loadingIndicator}
                images={images}
                autoResolveDelay={3000}
                onError={this._handleImageLoadError}
                onSuccess={this._handleImageLoadSuccess}
                resolveOnError={true}
                mountChildren={true}
                >
                  { */

                    /* 

                    }
                </Preload> 

                */

              return (
                
                    <div id="mainView" className={overallState}>
                        <button  id="contactButton" type="button" className="btn btn-default" onClick={this.showContactView} >Contact</button>
                      <div id="leftArrow">
                        <i className="fa fa-chevron-left" onClick={this.clickLeftIndividualProjectCarousel}></i>
                      </div>
                      <div id="rightArrow">
                        <i className="fa fa-chevron-right" onClick={this.clickRightIndividualProjectCarousel}></i>
                      </div>
                      <div className="projectListView backgroundView">
                        <h1 style={listColor} > Will Melbourne</h1>
                        <div className="introTextContainer" >
                          <p className="introText">Will Melbourne is a software engineer working in Vancouver Canada<i className="fa fa-arrow-down" onClick={this.chooseProjectOne}></i></p>
                        </div>
                        <div id="portfolioProjectAnimationContainer" className={classes}>
                          <ReactCSSTransitionGroup transitionName="portfolioProjectAnimation" transitionEnterTimeout={5000} transitionLeaveTimeout={3000}>
                            {animateProject}                      
                          </ReactCSSTransitionGroup>
                          
                        </div>

                      </div>
                      <ProjectList projects={this.state.projects} projectListOpacity={projectListOpacity} listColor={listColor} clickCurrentProject={this.updateCurrentProject} handleProjectDetailsShow={this.handleProjectDetailsShow}></ProjectList>

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
                    <div id="ProjectList" style={this.props.projectListOpacity}>
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
              // var temp = React;
              // var cx = React.addons.classSet;
              var classes = classNames({
                'active': this.props.active,
                'project-title' : true
              });

              if (this.props.active == true) {
                var fontColor = {"color" : this.props.fontColor};
                // var spacingDivBorder = {"transform" : "translateY(-15px)"}
              }
              else {
                var fontColor = {};
                // var spacingDivBorder = {"transform" : "translateY(0px)"}
              }

              return (
                <div className={classes}>
                  <div className="spacingDivBorder"  ></div>
                  
                  <h4  onClick={this.handleProjectShow} style={fontColor} >
                    {this.props.name} {this.props.active}
                    <i className="fa fa-arrow-right arrow" onClick={this.handleProjectDetailsShow} style={fontColor}></i>
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