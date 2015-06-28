module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    /* General dev utils */
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    /* HTML utils */
    grunt.loadNpmTasks('grunt-htmlhint');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    /* CSS utils */
    grunt.loadNpmTasks('grunt-postcss');  /* Brower-specific modifications */
    grunt.loadNpmTasks('grunt-cssc'); /* Wrapper for css-condense -> Smart CSS minify & grouping */
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    /* JS utils */
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.loadNpmTasks('grunt-contrib-uglify');
 
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
            stoponerror: false,
            remotePath: 'http://decodize.com/',
            remoteFiles: ['html/moving-from-wordpress-to-octopress/',
                          'css/site-preloading-methods/'], //or 
            remoteFiles: 'validation-files.json', // JSON file contains array of page paths. 
            relaxerror: ['Bad value X-UA-Compatible for attribute http-equiv on element meta.'] //ignores these errors 
        }
      }, // validation

      // CSS-focused
      cssc: {
        build: {
           options: {
            consolidateViaDeclarations: true,
            consolidateViaSelectors:    true,
            consolidateMediaQueries:    true
          }
        } //build
      }, //cssc
 
      cssmin: {
        build: {
            src: '_/css/style.css',
            dest: '_/css/style.css'
        } //build
      }, //cssmin

      //JS-focused
      jshint: {
          default: {
              src: ['src/js/*.js']
          },
          options: {
            force: true
          } //Report errors but pass the task
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
                  'js/script.js' : ['src/js/*.js'] //compresses and combine multiple js files
              }
          }
      }, //uglify
       
      concat: {
          css: {
             src: [
                   'src/css/merge*.css'
                  ],
              dest: 'css/merged.css'
          },
          js: {
              src: [
                  'src/js/merge*.js'
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
