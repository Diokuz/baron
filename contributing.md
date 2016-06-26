1. Note, that `/baron.js` is just a build instance of source files from `/src` folder. Change source files, and rebuild `/baron.js`, `/baron.min.js` and `/demo/baron.js` by typing `gulp build` command.

2. To do that (`gulp build`) you should be experienced with `npm` (you should have a `nodejs` and be able to print `npm install` command).

3. One pullrequest === one commit with understandable english commit-message. In near future there will be a changelog generatorm which will use commit-messages as a source.

4. Your pullrequest have to proceed all auto-checks. Also, please, after rebuild, test manually `/test/index.html` page. Add more testcases, if need.


## Before release:

```bash
# Change scr/ files,
# bump version in src/core.js and package.json, then
gulp
gulp t
git push
npm publish
```
