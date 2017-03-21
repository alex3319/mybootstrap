module.exports = function(grunt) {
  // project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // clean dist directory
    clean: ['dist/**/*'],

    // copy html and assets
    copy: {
      main: {
        files: [
          {
            cwd: 'app/assets/img/',
            expand: true,
            src: ['**'],
            dest: 'dist/assets/img/'
          },
          {
            cwd: './',
            expand: true,
            src: ['bower_components/bootstrap/dist/fonts/*', 'app/assets/fonts/*'],
            flatten: true,
            dest: 'dist/assets/fonts/'
          },
          {
            cwd: './',
            expand: true,
            src: ['app/assets/js/app.js'],
            flatten: true,
            dest: 'dist/assets/js/',
            rename: function(dest, src) {
              return dest + src.replace('app','<%= pkg.name %>-app');
            }
          },
          {
            cwd: './',
            expand: true,
            src: ['app/*.html'],
            flatten: true,
            dest: 'dist/'
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
        dest: 'dist/assets/js/<%= pkg.name %>-components.js'
      },
      css: {
        src: [
          'bower_components/bootstrap/dist/css/bootstrap.css',
          'app/assets/css/style.css'
        ],
        dest: 'dist/assets/css/<%= pkg.name %>-style.css'
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
          dest: 'app',
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
          'dist/assets/css/<%= pkg.name %>-style.min.css': ['<%= concat.css.dest %>']
        }
      }
    },

    // uncss
    uncss: {
        dist: {
            src: ['app/about.html', 'app/index.html', 'app/page.html', 'app/contacts.html'],
            dest: 'dist/assets/css/<%= pkg.name %>-style.min.css',
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
                    cwd: 'app/assets/img/',
                    src: ['**/*.png'],
                    // Could also match cwd line above. i.e. project-directory/img/
                    dest: 'dist/assets/img/',
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
                    dest: 'dist/assets/img/',
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
          'dist/assets/js/<%= pkg.name %>-components.min.js': ['<%= concat.js.dest %>'],
          'dist/assets/js/<%= pkg.name %>-app.min.js': ['app/assets/js/app.js']
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

    // usemin
    usemin: {
      html: ['dist/*.html']
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
          src: [ 'dist/assets/js/*.js' ]
        }
      },
      cssVersion: {
        options: {
          position: 'top',
          banner: '/*! <%= pkg.name.toUpperCase() %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
          linebreak: true
        },
        files: {
          src: [ 'dist/assets/css/*.css' ]
        }
      },
      htmlVersion: {
        options: {
          position: 'top',
          banner: '<!-- <%= pkg.name.toUpperCase() %> <%= grunt.template.today("dd-mm-yyyy") %> -->\n',
          linebreak: true
        },
        files: {
          src: [ 'dist/*.html' ]
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

  // javascript linting
  grunt.registerTask('lint', ['jshint']);

  // default task
  grunt.registerTask('default', ['clean', 'sass', 'autoprefixer', 'pug', 'concat', 'cssmin',  'uglify', 'copy', 'imagemin', 'uncss', 'usemin', 'usebanner']);
};
