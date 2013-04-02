module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        //separator: ';'
      },
      core: {
        src: [
          'src/main1.js',
          'src/main-vs.js',
          'src/main-us.js',
          'src/main-end.js'
        ],
        dest: 'dist/<%= pkg.name %>.js'
      },
      full: {
        src: [
          'src/main1.js',
          'src/headers1.js',
          'src/main-vs.js',
          'src/headers-ve.js',
          'src/main-us.js',
          'src/headers-ue.js',
          'src/main-end.js'
        ],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      core: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.core.dest %>']
        }
      },
      full: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.full.dest %>']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['concat:full', 'uglify:full']);

  grunt.registerTask('core', ['concat:core', 'uglify:core']);

};