var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var Container = React.createClass({displayName: "Container",
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
              if (this.isAnimating ===   true) return false;
              if (this.state.showListView ===  false) return false;

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
              elem = this.getDOMNode();
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
              if (this.isAnimating ===   true) return false;
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
              if (this.isAnimating ===   true) return false;
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
              
              var temp = React;
              var cx = React.addons.classSet;
              // var classes = cx({
              //   'movingDown': this.goingDown
              // });

              if (this.animationDirection == "up") {
                var classes = cx({
                'movingUp': true
                });
              }
              else if (this.animationDirection == "down") {
                var classes = cx({
                'movingDown': true
                });
              }
              else if (this.animationDirection == "left") {
                var classes = cx({
                'movingLeft': true
                });
              }
              else if (this.animationDirection == "right") {
                var classes = cx({
                'movingRight': true
                });
              }

              

              if (this.state.showListView == true) {
                var listViewStyles = {"width" : "100%", "height" : "100%"};

                // var detailsViewStyles = {"bottom" : "-100%"};
                // var detailsViewStyles = {"opacity" : "0", "top" : "100%", "height" : "0px"};
                var detailsViewStyles = {"opacity" : "0", "top" : "100%", "transform" : "scale(0.0,0.0)"};

                // var projectDetailsView = '';
                // 
                  var listViewStatusClasses = cx({
                  'listViewStatus': true,
                  'projectListView' : true,
                  'backgroundView': true
                });

                var projectListOpacity = {"opacity" : "1"};
              } else {
                // var listViewStyles = {"left" : "-100%"};
                // var listViewStyles = {"width" : "70%", "height" : "300px", "left" : "15%"};
                var listViewStyles = {"transform" : "scale(0.7,0.7)"};
                // var detailsViewStyles = {"bottom" : "00%"};
                // var detailsViewStyles = {"bottom" : "00%"};
                // var detailsViewStyles = {"opacity" : "1", "top" : "70%", "height" : "auto"};
                var detailsViewStyles = {"opacity" : "1", "top" : "70%", "transform" : "scale(1,1)"};

                var projectListOpacity = {"opacity" : "0"}

                var listViewStatusClasses = cx({
                  'listViewStatus': false,
                  'projectListView' : true,
                  'backgroundView': true
                });


              }

              var projectDetailsView = React.createElement("div", {className: "projectDetailsView backgroundView", style: detailsViewStyles}, 
                      React.createElement(ProjectDetails, {currentProject: this.state.currentProject, handleProjectListShow: this.handleProjectListShow})
                    );

              // if (this.state.items.length <= 0) {
              if (this.currentProjectIndex == -1) {
                listColor = {"color" :  "black"}
                introContainerOpacity = {"opacity" : 1}
              }
              else {
                listColor = {"color" :  "white"}
                introContainerOpacity = {"opacity" : 0}
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
                  var animateProject = React.createElement("div", {key: this.state.animatedImageUrl, className: "portfolioSlide"}, React.createElement("div", {className: "slideImage", style: backgroundStyles}), React.createElement("div", {className: "slideImageOpacityOverlay"}))
                }
                else {
                  var animateProject = null
                }

              return (
                React.createElement("div", {id: "mainView", className: overallState}, 
                    React.createElement("button", {id: "contactButton", type: "button", className: "btn btn-default", onClick: this.showContactView}, "Contact"), 
                  React.createElement("div", {id: "leftArrow"}, 
                    React.createElement("i", {className: "fa fa-chevron-left", onClick: this.clickLeftIndividualProjectCarousel})
                  ), 
                  React.createElement("div", {id: "rightArrow"}, 
                    React.createElement("i", {className: "fa fa-chevron-right", onClick: this.clickRightIndividualProjectCarousel})
                  ), 
                  React.createElement("div", {className: listViewStatusClasses, style: listViewStyles}, 
                    React.createElement("h1", {style: listColor}, " Will Melbourne"), 
                    React.createElement("div", {className: "introTextContainer", style: introContainerOpacity}, 
                      React.createElement("p", {className: "introText"}, "Will Melbourne is a software engineer working in Vancouver Canada", React.createElement("i", {className: "fa fa-arrow-down", onClick: this.chooseProjectOne}))
                    ), 
                    React.createElement("div", {id: "portfolioProjectAnimationContainer", className: classes}, 
                      React.createElement(ReactCSSTransitionGroup, {transitionName: "portfolioProjectAnimation"}, 
                        animateProject
                      )
                      
                    )

                  ), 
                  React.createElement(ProjectList, {projects: this.state.projects, projectListOpacity: projectListOpacity, listColor: listColor, clickCurrentProject: this.updateCurrentProject, handleProjectDetailsShow: this.handleProjectDetailsShow}), 

                  projectDetailsView
                )
              );
            }
        });


        var Project = React.createClass({displayName: "Project",
            render: function() {
              if (this.props.images !== undefined && this.props.images[0]) {
                      var imageUrl = "url('images/" + this.props.images[0] + "')";
                      var backgroundStyles = {"backgroundImage" : imageUrl}
                    }

                    var leftParagrah =  {"position" : "absolute", "left": "-15%", "top": "10%"}

              return (
                React.createElement("div", {key: this.props.name, className: "portfolioSlide"}, 
                    React.createElement(ReactCSSTransitionGroup, {transitionName: "projectImagesAnimation"}, 
                      React.createElement("div", {className: "slideImage", style: backgroundStyles})
                    )
                    
                    
                )
                )
            }
         });


        var ProjectDetails = React.createClass({displayName: "ProjectDetails",
            handleProjectListShow: function() {
              this.props.handleProjectListShow();
            },
            render: function() {


              return (
                React.createElement("div", {key: this.props.currentProject.name, className: "ProjectDetailsContent"}, 
                  React.createElement("span", {className: "pointer"}, React.createElement("i", {className: "fa fa-arrow-up", onClick: this.handleProjectListShow}, "Back to Projects")), 
                  React.createElement("h2", null, this.props.currentProject.name), 

                  React.createElement("p", null, this.props.currentProject.description)
                )
                )
            }
         });


         var ProjectList = React.createClass({displayName: "ProjectList",
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
                            React.createElement(ProjectName, {key: e.name, name: e.name, fontColor: e.fontColor, shortDescription: e.shortDescription, active: e.active, handleProjectShow: this.handleProjectShow, handleProjectDetailsShow: this.handleProjectDetailsShow})
                        );
                    }, this);
                return (
                    React.createElement("div", {id: "ProjectList", style: this.props.projectListOpacity}, 
                      React.createElement("div", {id: "ProjectListMenu", style: this.props.listColor}, 
                        loop
                        )
                    )
            );
            }
         });

         var ProjectName = React.createClass({displayName: "ProjectName",
            handleProjectShow: function() {
              this.props.handleProjectShow(this.props.name);
            },
            handleProjectDetailsShow: function() {
              this.props.handleProjectDetailsShow();
            },
            render: function() {
              var temp = React;
              var cx = React.addons.classSet;
              var classes = cx({
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
                React.createElement("div", {className: classes}, 
                  React.createElement("div", {className: "spacingDivBorder"}), 
                  
                  React.createElement("h4", {onClick: this.handleProjectShow, style: fontColor}, 
                    this.props.name, " ", this.props.active, 
                    React.createElement("i", {className: "fa fa-arrow-right arrow", onClick: this.handleProjectDetailsShow, style: fontColor})
                  ), 
                  React.createElement("p", null, this.props.shortDescription)
                )
                )
            }
         });


         var ProjectViews = React.createClass({displayName: "ProjectViews",
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
                      var temp = React;
                      var cx = React.addons.classSet;
                      var classes = cx({
                        'active': true,
                        'opacityShow' : true,
                        'opacityTransition' : true,
                        'projectView' : true
                      });
                    }
                    else {
                      var temp = React;
                      var cx = React.addons.classSet;
                      var classes = cx({
                        'active': false,
                        'opacityHide' : true,
                        'opacityTransition' : true,
                        'projectView' : true
                      });
                    }

                      return (
                            React.createElement("div", {key: project.name, id: "ProjectView__p", style: backgroundStyles, className: classes}, 
                              React.createElement("p", null, "current project :", project.currentProject), 
                              React.createElement("p", null, "color ", project.color, " "), 
                              React.createElement("p", null, "image  ", project)
                            )
                        );
                    }, this);
              return (
                React.createElement("div", {id: "ProjectViews_container__p"}, 
                  projectsLoop
                )
              );
            }
         });


        React.render(
          React.createElement(Container, null),
        document.getElementById('container')
      );