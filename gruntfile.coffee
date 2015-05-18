module.exports = (grunt)->
  grunt.initConfig
    pkg: grunt.file.readJSON("package.json")
    path: require "path"

    coffee:
      build:
        options:
          bare: true
        expand: true
        cwd: 'src<%= path.sep %>coffee'
        src: '*.coffee'
        dest: 'src<%= path.sep %>js<%= path.sep %>'
        ext: '.js'

    less:
      build:
        files:
          "src<%= path.sep %>css<%= path.sep %><%= pkg.name.toLowerCase() %>.css": "src<%= path.sep %>less<%= path.sep %>bootstrap.less"

    cssmin:
      build:
        files:
          'public<%= path.sep %>includes<%= path.sep %>css<%= path.sep %><%= pkg.name.toLowerCase() %>.min.css':['src<%= path.sep %>css<%= path.sep %><%= pkg.name.toLowerCase() %>.css','!src<%= path.sep %>css<%= path.sep %>*.min.css']

    uglify:
      build:
        files:
          'public<%= path.sep %>includes<%= path.sep %>js<%= path.sep %><%= pkg.name.toLowerCase() %>.min.js': 'src<%= path.sep %>js<%= path.sep %>*.js'

    watch:
      coffee:
        files: ["src<%= path.sep %>coffee<%= path.sep %>*.coffee"]
        tasks: ["coffee:build","uglify:build"]
      less:
        files: ["src<%= path.sep %>less<%= path.sep %>*.less"]
        tasks: ["less:build","cssmin:build"]

  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-contrib-less"
  grunt.loadNpmTasks "grunt-contrib-cssmin"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-contrib-uglify"
