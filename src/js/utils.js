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
  createDOMBasedOnTemplate: function(dataObject, templateFunction) {
    const generatedHTML = templateFunction(dataObject);
    let div = document.createElement('div');
    div.innerHTML = generatedHTML.trim();
    return div.firstChild;
  },
};

Handlebars.registerHelper('isOnlyOneSongFound', function(value) {
  return value === 1;
});

export default utils;
