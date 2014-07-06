/*
Following examples provided by
http://blog.parkji.co.uk/2013/08/11/native-drag-and-drop-in-angularjs.html
*/
setReviewGrader.directive('draggable', function () {
  return function (scope, element) {
    // get the JS object
    var el = element[0];

    el.draggable = true;

    el.addEventListener(
      'dragstart',
      function(event) {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('Text', this.id);
        this.classList.add('drag');
        return false;
      },
      false
    );

    el.addEventListener(
      'dragend',
      function(event) {
        this.classList.remove('drag');
        return false;
      },
      false
    );
  }
});

