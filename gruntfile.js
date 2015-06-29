module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
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
      / Brower-specific modifications
      grunt-postcss
      // Wrapper for css-condense -> Smart CSS minify & grouping
      grunt-cssc
      grunt-contrib-cssmin
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
          files: {
            '*.htm*': 'src/*.htm*'
          },
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
          files: {
            '/*.htm*': '/*.htm*'
          },
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
        files: {
          '/*.htm*': '/*.htm*'
        },
        options: {
            reset: grunt.option('reset') || false,
            relaxerror: ['Bad value X-UA-Compatible for attribute http-equiv on element meta.'] //ignores these errors 
        }
      }, //validation

      // CSS-focused
      cssc: {
        files: {
          'css/*.css': 'src/css/*.css'
        },
        options: {
          consolidateViaDeclarations: true,
          consolidateViaSelectors:    true,
          consolidateMediaQueries:    true
        }
      }, //cssc
 
      cssmin: {
        files: {
          'css/*.min.css': 'css/*.css'
        }
      }, //cssmin

      //JS-focused
      jshint: {
        src: ['src/js/*.js'],
        options: {
          //Report errors but pass the task
          force: true
        }
      }, //jshint

      jsbeautifier: {
          default: {
              src: ["src/js/*.js"]
          },
          git_pre_commit: {
              src: ["src/js/*.js"],
              options: {
                  mode: "VERIFY_ONLY" //Fail the task on errors
              }
          }
      },

      uglify: {
          default: {
            files: {
                'js/*.min.js' : ['js/*.js']
            },
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
                drop_console: true,
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
            options: {
              livereload: true, // reloads browser on save
              spawn: false,
              debounceDelay: 1000,
            },
            scripts: {
                files: ['*.js'],
                tasks: ['jshint', 'uglify']
            }, //scripts
            html: {
                files: ['*.html'],
                tasks: ['htmlhint:build']
            }, //html
            css: {
                files: ['*.css'],
                tasks: ['cssc:build', 'cssmin:build']
            } //css
      }, //watch

      concurrent: {
          target1: ['coffee', 'sass'],
          target2: ['jshint', 'mocha'],
          limit: 4,
      } //concurrent
    }); //initConfig
    grunt.registerTask('default', 'watch');
}; //exports
