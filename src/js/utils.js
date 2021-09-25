const utils = {
  lookForEventTarget: function(event, targetSelector){
    const eventPath = event.path || (event.composedPath && event.composedPath());
    for(const element of eventPath){
      if(element === event.currentTarget){
        return;
      }
      if(element.matches(targetSelector)){
        return element;
      }
    }
  },
  createDOMFromHTML: function(htmlString) {
    let div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
  },
};

export default utils;
