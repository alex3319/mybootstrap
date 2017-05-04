module.exports = function(grunt) {

  require('time-grunt')(grunt);
  // project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // clean dist directory
    clean: ['assets/css/*', 'assets/img/*', 'assets/js/*', 'assets/fonts/*', 'app/tmp/'],



    // sass - Создаем пользовательский css в папке tmp
    sass: {
        dist: {
            options: {
            style: 'expanded'
            },
            files: {
            'app/tmp/css/style.css': 'app/assets/sass/main.sass'
            }
        }
    },

    stylus: {
        compile: {
            files: {
                'app/tmp/css/style.css': ['app/assets/stylus/style.styl']
            },
            options: {
                paths: ['app/assets/stylus/include'],
                compress: false
            }
        },
    },

      cmq: {
          options: {
              log: false
          },
          your_target: {
              files: {
                  'app/tmp/css/': ['app/tmp/css/*.css']
              }
          }
      },



    csscomb: {
      dist: {
          options: {
              config: 'app/assets/config/config.json'
          },
          files: {
              'assets/css/style.css': ['assets/css/style.css']
          }
      }
    },


      csslint: {
          strict: {
              options: {
                  'order-alphabetical': 0, // Таким же образом можно отключить другие оповещения
                  'universal-selector': 0, // Таким же образом можно отключить другие оповещения
                  'outline-none': 0, // Таким же образом можно отключить другие оповещения
                  'box-sizing': 0, // Таким же образом можно отключить другие оповещения
                  import: 2
              },
              src: ['app/tmp/css/style.css']
          },
      },



    // concat - объединяем все скрипты и css в папке tmp
    concat: {
      js: {
        options: {
          separator: ';'
        },
        src: [
          'app/lib/js/html5shiv.min.js',
          'app/assets/js/app.js',
          'app/assets/js/flexslider.js',
          'app/assets/js/script.js'
        ],
        dest: 'assets/js/concat-app.js'
      },
      css: {
        src: [
          'app/lib/css/normalize.css',
          'app/tmp/css/style.css'
        ],
        dest: 'assets/css/style.css'
      }
    },


      // autoprefixer - добавляем все префиксы
      autoprefixer:{
          options: {
              browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1'],
              cascade: false
          },
          multiple_files: {
              expand: true,
              flatten: true,
              src: 'assets/css/*',
              dest: 'assets/css/'
          }
      },

      // minify css - Далее минифицируем (переменная сорс ссылается на dest модуля concat секции css (это наш tmp))
      cssmin: {
          options: {
              shorthandCompacting: false,
              roundingPrecision: -1
          },
          target: {
              files: {
                  'assets/css/style.min.css': ['assets/css/style.css']
              }
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
                  'assets/js/concat-app.min.js': ['assets/js/concat-app.js']
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
                  dest: './',
                  expand: true,
                  ext: '.html'
              }]
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
              'app/assets/js/*.js',
          ],
          tasks: [
              'jshint',
              'uglify'
          ]
      },
      img: {
        files: ['app/assets/img/*.{img,png'],
        tasks: ['imagemin'] //
      },
      css: {
        files: ['app/assets/stylus/*.styl', 'app/blocks/**/*.styl '],
        tasks: ['stylus',  'concat', 'autoprefixer', 'cssmin', 'csscomb', 'csslint'] //
      },
      pug: {
        files: ['app/views/**/*.pug', 'app/blocks/**/*.pug'],
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

      htmlmin: {                                     // Task
          dist: {                                      // Target
              options: {                                 // Target options
                  removeComments: true,
                  collapseWhitespace: true
              },
              files: {                                   // Dictionary of files
                  'index.html': 'index.html',     // 'destination': 'source'
                  'contact.html': 'contact.html'
              }
          }
      },

    // jshint
    jshint: {
      files: ['Gruntfile.js', 'server.js', 'app/assets/js/app.js'],
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
    //grunt.loadNpmTasks('grunt-contrib-less');
    //grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-clean');
    //grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-uncss');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-pug');
    grunt.loadNpmTasks('grunt-usemin');
    //grunt.loadNpmTasks('grunt-banner');
    grunt.loadNpmTasks('grunt-livereload');
    grunt.loadNpmTasks('grunt-combine-media-queries');
    grunt.loadNpmTasks('grunt-csscomb');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-stylus');



    // javascript linting
    grunt.registerTask('lint', ['jshint']);
    grunt.registerTask('lint', ['jshint']);

    // default task
    grunt.registerTask('default', ['clean', 'pug', 'stylus', 'cmq', 'concat', 'autoprefixer', 'cssmin', 'uglify', 'imagemin', 'csscomb', 'csslint', 'jshint']);
    grunt.registerTask('server', ['clean', 'pug', 'stylus', 'concat', 'autoprefixer', 'cssmin', 'uncss', 'uglify', 'imagemin', 'htmlmin']);

};
//