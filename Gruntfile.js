module.exports = function(grunt) {

    //Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        compass: {
            dist: { 
                options: {
                    sassDir: 'dev/sass',
                    cssDir: 'dist/css',
                    environment: 'production',
                }
            },
            dev: {
                options: {
                    sassDir: 'dev/sass',
                    cssDir: 'dev/css',
                    environment: 'development'
                }
            }
        },
        uglify: {
            lib: {
                files: {
                    'dist/js/jquery.js' : [
                        'dev/js/lib/jquery.js'
                    ]
                }
            },
            app: {
                files: {
                    'dist/js/rSlider.js' : ['dev/js/*.js']
                }
            }
        },
        dom_munger: {
            make_dist: {
                options: {
                    callback: function($){
                        $('script').remove();
                        $('head').append('<script src="js/jquery.js"></script>');
                        $('body').append('<script src="js/rSlider.js"></script>');
                    }
                },
                src: 'dev/index.html',
                dest: 'dist/index.html'
            }
        },
        watch: {
            compass: {
                files: ['dev/sass/*.scss'],
                tasks: ['compass']
            },
            uglify_lib: {
                files: ['dev/js/lib/*.js'],
                tasks: ['uglify:lib']
            },
            uglify_app: {
                files: ['dev/js/*.js'],
                tasks: ['uglify:app']
            },
            mung: {
                files: ['dev/index.html'],
                tasks: ['dom_munger']
            },
            options: {
                livereload: {
                    options: { livereload: true }
                }
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-dom-munger');

    // Default task(s).
    grunt.registerTask('default', ['compass','uglify','dom_munger']);

};
