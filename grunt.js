module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-htmlhint');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-cssc');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
 
    grunt.initConfig ({
        uglify: {
            my_target: {
                files: {
                    '_/js/script.js' : ['_/src/js/*.js'] //compresses and combine multiple js files
                } //files
            } //my_target
        }, //uglify
         
        jshint: {
            js_target: {
                src: ['_/src/js/*.js']
            }, //js_target
            options: { force: true }, //report JSHint errors but not fail the task
        }, //jshint
 
        compass: {
            dev: {
                options: {
                    config: 'config.rb'
                } //options
            } //dev
        }, //compass
 
        cssc: {
        build: {
           options: {
            consolidateViaDeclarations: true,
            consolidateViaSelectors:    true,
            consolidateMediaQueries:    true
          }
        } //build
      is}, //cssc 
 
      autoprefixer: {
          build: {
              expand: true,
          flatten: true,
          src: '_/css/style.css', 
          dest: '_/css'
          } //build
      }, //autoprefixer
 
      cssmin: {
        build: {
            src: '_/css/style.css',
            dest: '_/css/style.css'
        } //build
        }, //cssmin
 
        htmlhint: {
            build: {
                options: {
                  'tag-pair': true,
                  'tagname-lowercase': true,
                  'attr-lowercase': true,
                  'attr-value-double-quotes': true,
                  'spec-char-escape': true,
                  'id-unique': true
                }, //options
                src: ['*.html']
            } //build
        }, //htmlhint
 
        watch: {
            options: { livereload: true }, // reloads browser on save
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
                tasks: ['autoprefixer:build', 'cssc:build', 'cssmin:build']
            } //css
        } //watch
    }) //initConfig
    grunt.registerTask('default', 'watch');
} //exports
