function clickEmitter() {
  return (args, cb) => {
    document.querySelectorAll(args[0]).forEach(element => {
      element.addEventListener('click', () => {
        cb();
      });
    });
  };
}

module.exports = {
  clickEmitter
};
