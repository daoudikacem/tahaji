// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  // You can access Node.js APIs here if needed
  // For example:
  // const replaceText = (selector, text) => {
  //   const element = document.getElementById(selector);
  //   if (element) element.innerText = text;
  // };
  
  // Example of exposing Node.js functionality to renderer:
  // replaceText('app-version', process.env.npm_package_version);
});