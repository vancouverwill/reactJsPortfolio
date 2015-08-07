var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var Container = React.createClass({
            isAnimating : false,
            getInitialState: function() {
              return {
                title: "Submit TimeSheet",
                projects: projects,
                currentProjectIndex : 0,
                currentProject : projects[0],
                previousProject : null,
                animating : false,
                items : []
              };
            },
            updateCurrentProject: function(projectName) {
              if (this.isAnimating ===   true) return false;

              this.isAnimating = true;
              for (var i = 0; i < this.state.projects.length; i++) {
                if (this.state.projects[i].name == projectName) {
                  this.setState({"previousProject" : this.state.currentProject});
                  this.setState({"currentProject" : this.state.projects[i]});
                  this.setState({"currentProjectIndex" : i});
                  this.state.projects[i].active = true;

                  var currentProject = this.state.projects[i]
                  // delete projects[i]
                  
                  // break;
                } else {
                  this.state.projects[i].active = false;
                }
              }
              this.setState(projects);

              var newItems = this.state.items;

              // newItems = [];

              // newItems = [this.state.currentProject]

              newItems.splice(0, 1);
              newItems = this.state.items.concat(currentProject);

              this.setState({"items" : newItems});

              var self = this;
              this.timeout = setTimeout(function(){ 
                self.isAnimating = false;
              }, 2000);
            },
            componentDidMount: function() {
              elem = this.getDOMNode();
              elem.addEventListener('wheel', this.handleWheel);
            },
            handleWheel: function(event) {
              elem = this.getDOMNode();

              if (this.isAnimating !== false) return;

              if (event.deltaY < 0) (this.moveDown())
              if (event.deltaY > 0) (this.moveUp())
              if (event.deltaY < 0) (this.moveDown())
              // this.setState({windowWidth: window.innerWidth});
            },
            moveUp: function() {
                if (this.state.currentProjectIndex < (projects.length - 1)) this.updateCurrentProject(this.state.projects[this.state.currentProjectIndex + 1].name)
            },
            moveDown: function(){
              if (this.state.currentProjectIndex > 0) this.updateCurrentProject(this.state.projects[this.state.currentProjectIndex - 1].name)
            },
            render: function() {
              if (this.isAnimating) {
                var animatingSentence = "in progress"
              }
              else {
                var animatingSentence = "animation : static"
              }

              var items = this.state.items.map(function(item, i) {
                return (
                  <Project key={item.name} name={item.name} description={item.description} images={item.images}></Project>
                );
              }.bind(this));
               
              return (
                <div id="mainView"> 
                  <p>animation : <b>{this.state.title}</b></p>
                  <p>{animatingSentence}</p>
                  <p>currentProject {this.state.currentProject}</p>
                  <p>previousProject {this.state.previousProject}</p>
                  
                  <div id="portfolioAnimationContainer">
                    <ReactCSSTransitionGroup transitionName="portfolioAnimation">
                      {items}
                    </ReactCSSTransitionGroup>
                  </div>
                  <ProjectList projects={this.state.projects} clickCurrentProject={this.updateCurrentProject}></ProjectList>
                  <ProjectViews projects={this.state.projects} currentProject={this.state.currentProject}></ProjectViews>
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

              return (
                <div key={this.props.name} className="item"  style={backgroundStyles}>
                    <p>{this.props.name}</p>
                    <p>{this.props.description}</p>
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
            render: function() {
                var loop = this.props.projects.map(function (e) {
                      return (
                            <ProjectName key={e.name} name={e.name} active={e.active} handleProjectShow={this.handleProjectShow}></ProjectName>
                        );
                    }, this);
                return (
                    <div id="ProjectList">
                        <h3>Project List</h3>
                        {loop}
                    </div>
            );
            }
         });

         var ProjectName = React.createClass({
            handleProjectShow: function() {
              this.props.handleProjectShow(this.props.name);
            },
            render: function() {
              var temp = React;
              var cx = React.addons.classSet;
              var classes = cx({
                'active': this.props.active,
                'project-title' : true
              });
              return (
                <h4 className={classes} onClick={this.handleProjectShow}>
                  project - {this.props.name} {this.props.active
                  }</h4>
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


        React.render(
          <Container />,
        document.getElementById('container')
      );