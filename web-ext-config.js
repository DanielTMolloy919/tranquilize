module.exports = {
  // Run web-ext from the Firefox build directory
  sourceDir: "./dist-firefox",
  
  // Artifacts (packaged extensions) will be saved here
  artifactsDir: "./web-ext-artifacts",
  
  // Ignore files when packaging
  ignoreFiles: [
    "web-ext-config.js",
    "*.map",
    ".DS_Store"
  ],
  
  // Configuration for 'web-ext run' command
  run: {
    // Start URL when Firefox opens
    startUrl: [
      "https://www.youtube.com",
      "https://www.reddit.com",
      "https://www.instagram.com"
    ],
    
    // Browser console logs
    browserConsole: true,
    
    // Automatically reload on file changes
    // Note: You'll need to rebuild with 'pnpm build:firefox' for changes to take effect
    reload: true
  },
  
  // Configuration for 'web-ext lint' command
  lint: {
    output: "text",
    metadata: false,
    warnings: true
  }
};

