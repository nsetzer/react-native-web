# React Native Web Starter

Sample application using React Native and Expo to create a android
application and single page web app

## Introduction

A full list of the scripts defined in `package.json` is shown below.

| Script              | Action                                                 |
| ------------------- | ------------------------------------------------------ |
| `yarn web`          | Start CRA Development Build                            |
| `yarn build-web`    | Create production build for web                        |
| `yarn serve-web`    | serve the production build locally                     |
| `yarn test-web`     | run local tests                                        |
| `yarn eject`        | Eject from Expo                                        |
| `yarn android`      | Start expo packager and run app                        |
| `yarn ios`          | Start expo packager and run app                        |


## Next Steps:

  - [Google Pages Live Demo](https://itnext.io/so-you-want-to-host-your-single-age-react-app-on-github-pages-a826ab01e48)
  - [Revist uglify-es work around](https://github.com/facebook/react-native/issues/17348)

## Notes

### debug
    adb logcat -s ReactNativeJS

TypeError: undefined is not an object AnimatedComponent

RN < 0.50 - watchman watch-del-all && rm -rf $TMPDIR/react-* && rm -rf node_modules/ && npm cache clean && npm install && npm start -- --reset-cache
RN >= 0.50 -  watchman watch-del-all && rm -rf $TMPDIR/react-native-packager-cache-* && rm -rf $TMPDIR/metro-bundler-cache-* && rm -rf node_modules/ && npm cache clean && npm install && npm start -- --reset-cache

npm >= 5 - watchman watch-del-all && rm -rf $TMPDIR/react-* && rm -rf node_modules/ && npm cache verify && npm install && npm start -- --reset-cache

### clear cache on windows
    babel config
        order matters, both plugins, then presets
        and also order of the plugins
    del C:\Users\YOUR_USERNAME\AppData\Local\Temp\metro-cache
    del %appdata%\Roaming\npm-cache &
    cd android & gradlew clean
    del node_modules/
    yarn cache clean
    yarn install


warning "expo > expo-background-fetch@1.0.0" has unmet peer dependency "expo-task-manager-interface@~1.0.0".
warning "expo > expo-google-sign-in@2.0.0" has incorrect peer dependency "react-native@^0.55.4".
warning "expo > expo-location@2.0.1" has unmet peer dependency "expo-task-manager-interface@~1.0.0".
warning "expo > react-native-reanimated@1.0.0-alpha.11" has incorrect peer dependency "react@16.0.0-alpha.6".
warning "expo > react-native-reanimated@1.0.0-alpha.11" has incorrect peer dependency "react-native@^0.44.1".
warning " > @babel/plugin-proposal-decorators@7.4.0" has unmet peer dependency "@babel/core@^7.0.0-0".
warning " > @babel/plugin-transform-flow-strip-types@7.4.0" has unmet peer dependency "@babel/core@^7.0.0-0".
warning " > @babel/plugin-transform-runtime@7.4.3" has unmet peer dependency "@babel/core@^7.0.0-0".
warning " > react-native-web@0.11.2" has incorrect peer dependency "react@>=16.5.1".