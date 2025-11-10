const path = require('path');

module.exports = {
  expo: {
    name: "Banking Dashboard",
    slug: "banking-dashboard",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png"
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png",
      bundler: "metro",
      name: "Banking Dashboard",
      shortName: "Banking",
      lang: "pl-PL", 
      scope: "/",
      themeColor: "#7B61FF",
      backgroundColor: "#F8F8F8",
      display: "standalone",
      orientation: "portrait",
      startUrl: "/",
      // Custom HTML template
      template: path.resolve(__dirname, 'public/index.html'),
      // PWA Manifest
      manifest: {
        name: "Banking Dashboard",
        short_name: "Banking",
        description: "Modern banking dashboard with safe area support",
        start_url: "/",
        display: "standalone",
        orientation: "portrait-primary",
        theme_color: "#7B61FF",
        background_color: "#F8F8F8",
        scope: "/",
        lang: "pl-PL"
      },
      meta: {
        "apple-mobile-web-app-capable": "yes",
        "apple-mobile-web-app-status-bar-style": "black-translucent",
        "viewport": "width=device-width, initial-scale=1, viewport-fit=cover"
      }
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000"
          }
        }
      ]
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true
    }
  }
};