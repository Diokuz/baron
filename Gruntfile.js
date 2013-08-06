module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            appjs: {
                options: {
                    jshintrc: '.jshintrc'
                },
                src: ['src/*.js', 'demo/*.js', 'test/*.js']
            }
        },
        concat: {
            def: {
                files: {
                    'dist/<%= pkg.name %>.js': ['src/core.js', 'src/fix.js', 'src/controls.js', 'src/pull.js'],
                    '<%= pkg.name %>.js': ['src/core.js', 'src/fix.js', 'src/controls.js', 'src/pull.js']
                }
            },
            core: {
                src: [
                    'src/core.js'
                ],
                dest: 'dist/<%= pkg.name %>.js'
            },
            full: {
                files: {
                    'dist/<%= pkg.name %>.js': ['src/core.js', 'src/fix.js', 'src/controls.js', 'src/test.js', 'src/pull.js'],
                    'demo/<%= pkg.name %>.full.js': ['src/core.js', 'src/fix.js', 'src/controls.js', 'src/test.js', 'src/pull.js']
                }
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            def: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['dist/<%= pkg.name %>.js'],
                    '<%= pkg.name %>.min.js': ['<%= pkg.name %>.js']
                }
            },
            core: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['<%= concat.core.dest %>'],
                    '<%= pkg.name %>.min.js': ['<%= concat.core.dest %>']
                }
            },
            full: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['dist/<%= pkg.name %>.js'],
                    '<%= pkg.name %>.min.js': ['<%= pkg.name %>.js']
                }
            }
        },
        'mocha-phantomjs': {
            options: {
                view: '1024x768'
            },
            all: ['test/*.auto.html']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadTasks('tasks'); // Для grunt-mocha-phantomjs
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('default', ['concat:def', 'uglify:def']);
    grunt.registerTask('core', ['concat:core', 'uglify:core']);
    grunt.registerTask('full', ['concat:full', 'uglify:full']);
    grunt.registerTask('test', ['mocha-phantomjs']);
    grunt.registerTask('t', ['jshint']);
};