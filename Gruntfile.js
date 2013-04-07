module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        //separator: ';'
      },
      def: {
        src: [
          'src/main-1.js',
          'src/main-2.js',
          'src/headers-1.js',
          'src/main-3.js',
          'src/headers-ve.js',
          'src/main-4.js',
          'src/headers-ue.js',
          'src/main-5.js'
        ],
        dest: '<%= pkg.name %>.js'
      },
      core: {
        src: [
          'src/main-1.js',
          'src/main-2.js',
          'src/main-3.js',
          'src/main-4.js',
          'src/main-5.js'
        ],
        dest: 'dist/<%= pkg.name %>.js'
      },
      full: {
        src: [
          'src/main-1.js',
          'src/errors.js',
          'src/main-2.js',
          'src/headers-1.js',
          'src/main-3.js',
          'src/headers-ve.js',
          'src/main-4.js',
          'src/headers-ue.js',
          'src/main-5.js'
        ],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      def: {
        files: {
          '<%= pkg.name %>.min.js': ['<%= concat.def.dest %>']
        }
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

  grunt.registerTask('default', ['concat:def', 'uglify:def']);
  grunt.registerTask('core', ['concat:core', 'uglify:core']);
  grunt.registerTask('full', ['concat:full', 'uglify:full']);

};