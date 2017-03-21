module.exports = function(grunt) {

  require('time-grunt')(grunt);
  // project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // clean dist directory
    clean: ['css/*', 'img/*', 'js/*', 'fonts/*'],

    // copy html and assets
    copy: {
      main: {
        files: [
          {
            cwd: 'app/assets/img/',
            expand: true,
            src: ['**'],
            dest: 'assets/img/'
          },
          {
            cwd: './',
            expand: true,
            src: ['bower_components/bootstrap/dist/fonts/*', 'app/assets/fonts/*'],
            flatten: true,
            dest: 'assets/fonts/'
          },
          {
            cwd: './',
            expand: true,
            src: ['app/assets/js/app.js'],
            flatten: true,
            dest: 'assets/js/',
            rename: function(dest, src) {
              return dest + src.replace('app','<%= pkg.name %>-app');
            }
          },
          {
            cwd: './',
            expand: true,
            src: ['*.html'],
            flatten: true,
            dest: ''
          }
        ]
      }
    },

    // concat
    concat: {
      js: {
        options: {
          separator: ';'
        },
        src: [
          'bower_components/jquery/dist/jquery.js',
          'bower_components/bootstrap/dist/js/bootstrap.js'
        ],
        dest: 'assets/js/<%= pkg.name %>-components.js'
      },
      css: {
        src: [
          'bower_components/bootstrap/dist/css/bootstrap.css',
          'app/assets/css/style.css'
        ],
        dest: 'assets/css/<%= pkg.name %>-style.css'
      }
    },

    // pug
    pug: {
      compile: {
        options: {
          client: false,
          pretty: true,
          data: grunt.file.readJSON('app/data/data.json')
        },
        files: [{
          cwd: 'app/views',
          src: '*.pug',
          dest: '.',
          expand: true,
          ext: '.html'
        }]
      }
    },

    // sass
    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: {
          'app/assets/css/style.css': 'app/sass/main.sass'
        }
      }
    },

    // autoprefixer
    autoprefixer:{
      options: {
          browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1'],
          cascade: false
      },
      multiple_files: {
          expand: true,
          flatten: true,
          src: 'app/assets/css/*.css',
          dest: 'app/assets/css/'
      }
    },


    // minify css
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: {
          'assets/css/<%= pkg.name %>-style.min.css': ['<%= concat.css.dest %>']
        }
      }
    },

    // uncss
    uncss: {
        dist: {
            src: ['about.html', 'index.html', 'page.html', 'contacts.html'],
            ignore: ['/.col-([a-zA-Z0-9]+)-([a-zA-Z0-9]+)/g', '.visible', '.hidden', '.fade', '.fade.in',
                    '.collapse', '.collapse.in', '.collapsing', '/\.open/',
            '.bs.carousel',
            '.slid.bs.carousel',
            '.slide.bs.carousel',
            '.fade',
            '.fade.in',
            '.collapse',
            '.collapse.in',
            '.collapsing',
            '.alert-danger',
            '.logged-in .navbar-default',
            '.carousel-inner > .next',
            '.carousel-inner > .prev',
            '.carousel-inner > .next',
            '.carousel-inner > .prev',
            '.carousel-inner > .next.left',
            '.carousel-inner > .prev.right',
            '.carousel-inner > .active.left',
            '.carousel-inner > .active.right',
            '#float-toc',
            '#float-toc a',
            '.modal-content',
            '.modal-header',
            '.modal-body',
            '.modal-dialog',
            '.modal.fade.in',
            '.modal-open',
            /(#|\.)modal(\-[a-zA-Z]+)?/,
            '.navbar-toggle.open',
            '.fade .modal-dialog',
            '.navbar-collapse.in',
            '.navbar-fixed-top',
            '.logged-in .navbar-fixed-top',
            '.navbar-collapse',
            '.navbar-collapse.in',
            '.navbar-inverse .innovations.navbar-toggle.open',
            '.single-innovation .navbar-inverse .innovations.navbar-toggle.open',
            '#innovations.collapse.in',
            'ul.page-numbers li a.prev',
            '.open',
            '.open > .dropdown-menu',
            '.open > a',
            '.alert-danger',
            '.visible-xs',
            '.noscript-warning',
            '.close',
            '.alert-dismissible',
            '.page.calendar .events .panel:hover .fa-angle-down.open',
            '.fa-angle-down.open' ],
            media: ['(min-width: 320px) handheld and (orientation: landscape)'],
            ignoreSheets: ['/fonts.googleapis/'],
            dest: 'assets/css/<%= pkg.name %>-style.min.css',
            options: {
                report: 'min'
            }
        }
    },

    // imagemin
    imagemin: {
        png: {
            options: {
                optimizationLevel: 7
            },
            files: [
                {
                    // Set to true to enable the following options…
                    expand: true,
                    // cwd is 'current working directory'
                    cwd: 'assets/img/',
                    src: ['**/*.png'],
                    // Could also match cwd line above. i.e. project-directory/img/
                    dest: 'assets/img/',
                    ext: '.png'
                }
            ]
        },
        jpg: {
            options: {
                progressive: true
            },
            files: [
                {
                    // Set to true to enable the following options…
                    expand: true,
                    // cwd is 'current working directory'
                    cwd: 'app/assets/img/',
                    src: ['**/*.jpg'],
                    // Could also match cwd. i.e. project-directory/img/
                    dest: 'assets/img/',
                    ext: '.jpg'
                }
            ]
        }
    },


    // minify js
    uglify: {
      options: {
        // move to usebanner
        // banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      dist: {
        files: {
          'assets/js/<%= pkg.name %>-components.min.js': ['<%= concat.js.dest %>'],
          'assets/js/<%= pkg.name %>-app.min.js': ['app/assets/js/app.js']
        }
      }
    },

    // watch
    watch: {
      options: {
          spawn: false,
          livereload: true
      },
      scripts: {
          files: [
              'app/assets/*.js'
          ],
          tasks: [
              'jshint',
              'uglify'
          ]
      },
      css: {
        files: ['app/sass/components/*.{sass,scss}','app/sass/*.{sass,scss}'],
        tasks: ['sass']
      },
      pug: {
        files: 'app/views/**/*.pug',
        tasks: ['pug']
      }
    },

    connect: {
      server: {
          options: {
              port: 3000,
              livereload: 35729,
              hostname: 'localhost',
              base: ['build']
          },
          livereload: {
              options: {
                  open:true,
                  base: ['build']
              }
          }
      }
    },

    // usemin
    usemin: {
      html: ['*.html']
    },

    // jshint
    jshint: {
      files: ['Gruntfile.js', 'server.js', 'app/**/*.js'],
      options: {
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },

    // banner
    usebanner: {
      jsVersion: {
        options: {
          position: 'top',
          banner: '/*! <%= pkg.name.toUpperCase() %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
          linebreak: true
        },
        files: {
          src: [ 'assets/js/*.js' ]
        }
      },
      cssVersion: {
        options: {
          position: 'top',
          banner: '/*! <%= pkg.name.toUpperCase() %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
          linebreak: true
        },
        files: {
          src: [ 'assets/css/*.css' ]
        }
      },
      htmlVersion: {
        options: {
          position: 'top',
          banner: '<!-- <%= pkg.name.toUpperCase() %> <%= grunt.template.today("dd-mm-yyyy") %> -->\n',
          linebreak: true
        },
        files: {
          src: [ '*.html' ]
        }
      }
    }

  });

  // load plugins
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-uncss');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-pug');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-banner');
  grunt.loadNpmTasks('grunt-livereload');

  // javascript linting
  grunt.registerTask('lint', ['jshint']);

  // default task
  grunt.registerTask('default', ['clean', 'sass', 'autoprefixer', 'pug', 'concat', 'cssmin',  'uglify', 'copy', 'imagemin', 'uncss', 'usemin', 'usebanner']);
};
