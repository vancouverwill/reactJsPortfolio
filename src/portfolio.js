var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var Container = React.createClass({
            isAnimating : false,
            currentProjectIndex : -1,
            
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

              this.isAnimating = true;
              for (var i = 0; i < this.state.projects.length; i++) {
                if (this.state.projects[i].name == projectName) {
                  if (i < this.currentProjectIndex) {
                    this.decreasing = true;
                  } else {
                    this.decreasing = false;
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

              var newItems = this.state.items;

              newItems.splice(0, 1);

              if (currentProject !== undefined) {
                newItems = this.state.items.concat(currentProject);
              }

              this.setState({"items" : newItems});

              var self = this;
              this.timeout = setTimeout(function(){ 
                self.isAnimating = false;
              }, 3000);
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
            componentDidMount: function() {
              elem = this.getDOMNode();
              elem.addEventListener('wheel', this.handleWheel);
            },
            handleWheel: function(event) {
              if (this.isAnimating !== false) return;

              if (event.deltaY < 0) (this.moveDown())
              if (event.deltaY > 0) (this.moveUp())
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
            render: function() {
              var items = this.state.items.map(function(item, i) {
                return (
                  <Project key={item.name} name={item.name} description={item.description} images={item.images}></Project>
                );
              }.bind(this));

              var temp = React;
              var cx = React.addons.classSet;
              var classes = cx({
                'oppositeDirection': this.decreasing
              });

              if (this.state.showListView == true) { 
                var listViewStyles = {"width" : "100%", "height" : "100%"};
                
                // var detailsViewStyles = {"bottom" : "-100%"};
                // var detailsViewStyles = {"opacity" : "0", "top" : "100%", "height" : "0px"};
                var detailsViewStyles = {"opacity" : "0", "top" : "100%", "transform" : "scale(0.0,0.0)"};

                // var projectDetailsView = '';

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

                
              }

              var projectDetailsView = <div className='projectDetailsView backgroundView' style={detailsViewStyles}>
                      <ProjectDetails currentProject={this.state.currentProject} handleProjectListShow={this.handleProjectListShow} ></ProjectDetails>
                    </div>;

              if (this.state.items.length <= 0) {
                listColor = {"color" :  "black"}
              }
              else {
                listColor = {"color" :  "white"}
              }

              
               
              return (
                <div id="mainView">
                    <button  id="contactButton" type="button" className="btn btn-default">Contact</button>
                  <div className="projectListView backgroundView" style={listViewStyles}> 
                    <h1 style={listColor} > Will Melbourne</h1>
                    <div id="portfolioAnimationContainer" className={classes}>
                      <ReactCSSTransitionGroup transitionName="portfolioAnimation">
                        {items}
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

                      // var imageUrlLocal = "/images/" + imageUrl;
                      var imageUrlLocal = "/images/" + this.props.images[0];
                    }

              return (
                <div key={this.props.name} className="portfolioSlide"  >
                  <div className="slideImage2" style={backgroundStyles} ></div>

                  <div className="crop-height">
                    <img className="slideImageImg" src={imageUrlLocal} />
                  </div>
                  <div className="slideImageOpacityOverlay" ></div>
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
                  <i className="fa fa-arrow-up" onClick={this.handleProjectListShow}>Back to Projects</i>
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
              var temp = React;
              var cx = React.addons.classSet;
              var classes = cx({
                'active': this.props.active,
                'project-title' : true
              });

              if (this.props.active == true) {
                var fontColor = {"color" : this.props.fontColor};
                var spacingDivTransform = {"transform" : "scaleY(2)"}
              }
              else {
                var fontColor = {};
                var spacingDivTransform = {"transform" : "scaleY(1)"}
              }

              return (
                <div className={classes}>
                  <div className="spacingDivTransform" style={spacingDivTransform}></div>
                  <i className="fa fa-arrow-right arrow" onClick={this.handleProjectDetailsShow} style={fontColor}></i>
                  <h4  onClick={this.handleProjectShow} style={fontColor} >{this.props.name} {this.props.active}</h4>
                  <p>{this.props.shortDescription}</p>
                  <div className="spacingDivTransform"></div>
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