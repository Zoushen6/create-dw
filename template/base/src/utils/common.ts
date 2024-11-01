export function MapLoader() {
  return new Promise((resolve) => {
    if (window.AMap) {
      resolve(window.AMap);
    }
    window.initAMap = () => {
      resolve(window.AMap);
    };
  });
}
