/*
Following examples provided by
http://blog.parkji.co.uk/2013/08/11/native-drag-and-drop-in-angularjs.html
*/
setReviewGrader.directive('droppable', function () {
  return {
    scope: {
      drop: '&' // parent
    },
    link: function(scope, element) {
      // get JS object
      var el = element[0];

      // dragover event
      el.addEventListener(
        'dragover',
        function(event) {
          event.dataTransfer.dropEffect = 'move';
          // allow dropping
          if (event.preventDefault) { event.preventDefault(); }
          this.classList.add('over');
          return false;
        },
        false
      );

      // dragenter
      el.addEventListener(
        'dragenter',
        function(event) {
          this.classList.add('over');
          return false;
        },
        false
      );

      // dragleave
      el.addEventListener(
        'dragleave',
        function(event) {
          this.classList.remove('over');
          return false;
        },
        false
      );

      // drop!
      el.addEventListener(
        'drop',
        function(event) {
          // Stop browser from redirecting
          if (event.stopPropagation) { event.stopPropagation(); }

          this.classList.remove('over');

          var item = document.getElementById(event.dataTransfer.getData('Text'));
          this.appendChild(item);

          // call the drop passed drop function
          scope.$apply('drop()');

          return false;
        },
        false
      );
    }
  }
});
