module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);
  /* General dev utils
    // Overhead-related
    matchdep
    load-grunt-tasks
    load-grunt-config
    // Execution-related
    grunt-concurrent
    grunt-contrib-watch
    grunt-newer
    grunt-contrib-concat
  */
  /* HTML utils
    grunt-htmlhint
    grunt-contrib-htmlmin
  */
  /* CSS utils
    grunt-postcss
    / Brower-specific modifications
    autoprefixer-core
    // CSS minify & grouping
    cssnano
  */
  /* JS utils
    grunt-contrib-jshint
    grunt-jsbeautifier
    grunt-contrib-uglify
  */

  grunt.initConfig ({
    // HTML-focused
    htmlhint: {
      build: {
        files: [
          {
            cwd: 'src',
            src: ['*.htm*'],
          }
        ],
        options: {
          'tag-pair': true,
          'tagname-lowercase': true,
          'tag-self-close': true,
          'attr-lowercase': true,
          'attr-value-double-quotes': true,
          'attr-no-duplication': true,
          'spec-char-escape': true,
          'id-unique': true,
          'doctype-first': true,
          'img-alt-require': true,
          'doctype-html5': true,
          'space-tab-mixed-disabled': true
        }
      }
    }, //htmlhint

    htmlmin: {
      build: {
        files: [
          {
            cwd: 'src',
            src: ['*.htm*'],
            ext: '.html'
          }
        ],
        options: {
          removeComments: true,
          removeCommentsFromCDATA: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true
        }
      }
    }, //htmlmin

    validation: {
      build: {
        files: [
          {
            src: ['*.htm*'],
          }
        ],
        options: {
            reset: grunt.option('reset') || false,
            relaxerror: ['Bad value X-UA-Compatible for attribute http-equiv on element meta.'] //ignores these errors 
        }
     }
    }, //validation

    // Image-focused
    imagemin: {
      build: {
        files: [
          {
            expand: true,
            cwd: 'src/img',
            src: ['*'],
            dest: 'img'
          }
        ],
        options: {
          svgoPlugins: [
            { removeViewBox: false },
            { removeUselessStrokeAndFill: false },
            { removeEmptyAttrs: false }
          ]
        }
      }
    }, //imagemin

    // CSS-focused
    postcss: {
      build: {
        files: [
          {
            cwd: 'src/css',
            src: ['*.css', '!*.min.css'],
            dest: 'css',
            ext: '.min.css'
          }
        ],
        options: {
          processors: [
            require('pixrem')(), // add fallbacks for rem units
            require('autoprefixer-core')({browsers: 'last 2 versions'}), // add vendor prefixes
            require('cssnano')() // minify the result
          ]
        }
      }
    }, //cssc

    //JS-focused
    jshint: {
      build: {
        files: [
          {
            cwd: 'src/js',
            src: ['*.js']
          }
        ]
      },
      options: {
        //Report errors but pass the task
        force: true
      }
    }, //jshint

    jsbeautifier: {
      build: {
        files: [
          {
            cwd: 'src/js',
            src: ['*.js'],
            dest: 'js',
            ext: '.js'
          }
        ]
      },
      git_pre_commit: {
        files: [
          {
            cwd: 'src/js',
            src: ['*.js']
          }
        ],
        options: {
            mode: "VERIFY_ONLY" //Fail the task on errors
        }
      }
    },

    uglify: {
      build: {
        files: [
          {
            cwd: 'js',
            src: ['*.js', '!*.min.js'],
            dest: 'js',
            ext: '.min.js'
          }
        ],
        options: {
          preserveComments: 'some',
          quoteStyle: 1,
          compress: {
            sequences: true,
            properties: true,
            dead_code: true,
            drop_debugger: true,
            conditionals: true,
            comparisons: true,
            evaluate: true,
            booleans: true,
            loops: true,
            unused: true,
            if_return: true,
            join_vars: true,
            warnings: true,
            drop_console: true
          }
        }
      }
    }, //uglify
     
    concat: {
        css: {
           src: [
                 'css/merge*.css'
                ],
            dest: 'css/merged.css'
        },
        js: {
            src: [
                'js/merge*.js'
            ],
            dest: 'js/merged.js',
            options: {
              stripBanners: {
                block: true,
                line: true
              },
              separator: ';',
            }
        }
    }, //concat
     
    watch: {
      src: {
          files: ['src/**/*'],
          tasks: ['newer:concurrent']
      }, //src
      html: {
          files: ['*.htm*'],
          tasks: ['newer:htmlhint:build', 'newer:htmlmin:build', 'newer:htmlvalid:build']
      }, //html
      css: {
          files: ['src/css/*.css'],
          tasks: ['newer:postcss:build', 'newer:concat:css']
      }, //css
      js: {
          files: ['src/js/*.js'],
          tasks: ['newer:jshint:build', 'newer:jsbeautifier:build', 'newer:uglify:build', 'newer:concat:js']
      }, //js
      img: {
          files: ['src/img/*'],
          tasks: ['newer:imagemin:build']
      }, //img
      options: {
        livereload: true, // reloads browser on save
        spawn: false,
        debounceDelay: 1000,
      }
    }, //watch

    concurrent: {
        first: ['htmlhint:build', 'postcss:build', 'jshint:build', 'imagemin:build'],
        second: ['htmlmin:build', 'jsbeautifier:build'],
        third: ['htmlvalid:build', 'uglify:build'],
        fourth: ['concat'],
        limit: 4
    } //concurrent
  }); //initConfig

  grunt.registerTask('default', 'watch:src');
  grunt.registerTask('build', 'newer:concurrent');
  grunt.registerTask('html', ['newer:htmlhint:build', 'newer:htmlmin:build', 'newer:htmlvalid:build']);
  grunt.registerTask('css', ['newer:postcss:build', 'newer:concat:css']);
  grunt.registerTask('js', ['newer:jshint:build', 'newer:jsbeautifier:build', 'newer:uglify:build', 'newer:concat:js']);
  grunt.registerTask('img', ['newer:imagemin:build']);
}; //exports
