(function($){
  var fragment = new DocumentFragment(),  //https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
      twin_counter = 0,//pointer for cloned nodes
      node_elem_container,//helper
      append_element,//no use
      that,//context this
      step = 0,
      builder = {
        stag:function() {
          node_elem_container = s.tag.call(this,...arguments);
          this.append(node_elem_container);
          return this;
        },
        tag:function(){
          fragment.appendChild(s.tag.call(this,...arguments));
          return this;
        },
        nest:function(deep) {
          // TODO: add ability nest all last cloned elements
          var length = (fragment.childNodes.length-1)-deep;
          if (deep && typeof deep === 'number') {
            if (deep < length) {
              s.voidNestElements.call(this,deep);
            }else {
              throw 'Argument in nest() has to be less or equal to '+(length-1);
            }
          }else if (deep && deep.isArray() === true) {
            s.voidNestElements.call(this,deep.length);
          }else{
            s.voidNestElements.call(this, fragment.childNodes.length-1);
          }
          return this;
        },
        allIn:function() {//3.2,1 elem will be placed in to 0 elem, if pointer was 3
          // console.log((fragment.childNodes.length-twin_counter)-arguments[0]);
          if (arguments[0] && fragment.childNodes.length-twin_counter-arguments[0] >= 1 && twin_counter !==0) {
            s.allIn(arguments[0]);
          }else if (arguments[0] && fragment.childNodes.length-twin_counter-arguments[0] < 1 && twin_counter!==0) {
            console.trace('If you\'re are plaicing '+twin_counter+' twins + '+arguments[0]+' more elements, you don\'t have any elements that can be a parent');
          }else if (twin_counter === 0) {
            console.trace('You are trying to use allIn() without twin(), this is not restricted, but waisting of bits');
          }else {
            console.log('It went this way');
            s.allIn();
          }
          twin_counter = 0;
          return this;
        },
        twin:function() {
          //arguments[0] - Array of iterable values, arguments[1] - attribute name

          var last_elem = fragment.lastChild,
              a = arguments,
              value;
          fragment.removeChild(fragment.lastChild);
          if(typeof a[0] === 'number'){
            iterator = a[0];
          }else if (Array.isArray(a[0]) === true) {
            iterator = a[0].length;
          }
          twin_counter = iterator;
          s.twin.call({
            a:a[0],
            last:last_elem,
            attr:a[1],
            iter:iterator,
          });
          // s.revealFrag('dir');
          return this;
        },
        print:function () {
          // console.dir(String(fragment);
          this.append(fragment);
          s.removeAll(fragment);
          // s.revealFrag('dir');
          return this;
        }
      };
    //Static methods
    var s = {
      twin:function() {
        var element,
            attribute;
        console.log(this);
        for (var i = 0; i < this.iter; i++) {
          if (!Array.isArray(this.a)) {
            element = this.last.cloneNode(true);
          }else {
            element = this.last.cloneNode(true);
            this.html !== false ? element.innerHTML = this.a[i] : '';//???
            attribute = document.createAttribute(this.attr);
            attribute.value = this.a[i].toLowerCase();//???
            element.setAttributeNode(attribute);
            // console.log(i);
          }

          console.log(i);
          fragment.appendChild(element);
        }
      },
      allIn:function() {
        var start = fragment.childNodes.length-twin_counter - (arguments[0]&&typeof arguments[0]==='number'?arguments[0]:0),
            last_child = fragment.childNodes.length,
            parent_node = start - 1;
        for (var i = start; i < last_child; i++) {
          fragment.childNodes[parent_node].appendChild(fragment.childNodes[parent_node+1]);
        }
      },
      tag:function() {
        var a = arguments,
            node_element;
        if(a[0] && typeof a[0] === 'string'){
          node_element = document.createElement(a[0]);
          if(a[1] && typeof a[1] === 'string'){
            node_element.innerHTML = a[1];
            a[1] = a[2];
          }
          if(a[1] && typeof a[1] === 'object'){
            var attr_node;
                attr = a[1];
            for (var i in attr) {
              attr_node = document.createAttribute(i);
              if(attr[i] !== 'undefined'){
                attr_node.value = attr[i];
                node_element.setAttributeNode(attr_node);
              }
            }
          }
        }
        return node_element;
      },
      voidNestElements:function(deep) {
        var fragment_length = (fragment.childNodes.length-1)-deep;
        for (var i = fragment.childNodes.length-1; i > fragment_length; i--) {
          fragment.childNodes[i-1].appendChild(fragment.childNodes[i]);
        }
      },
      objectToArray:function(object) {
        if(object && typeof object === 'object'){
          return Object.keys(object).map(function(key) {return object[key];});
        }else{
          throw 'Passed parametr type is ->'+typeof object+'<- but must be an object';
        }
      },
      arrayToObject:function(array) {
        return Object.assign({},array);
      },
      //Creates new object, removing elements from OBJECT starting from FROM limited my NUMBER
      removeElements:function(object,from,number) {
        var arr = s.objectToArray(object);
        arr.splice(from,number);
        return s.arrayToObject(arr);
      },
      objectToElement:function(object) {
        // return ...object;
        for(var elem in object){
          fragment.appendChild(object[elem]);
        }
        return fragment;
      },
      lastElement:function(object) {
        // return Object.values(Object.keys(object).length-1);
        console.log(fragment[fragment.lastChild]);
        // for (var i = 0; fragment[i] !== fragment.lastChild; i++) {}
      },
      removeAll:function(obj) {
        // var props = fragment;
        for (var i = 0; i < fragment.childNodes.length; i++) {
          fragment.removeChild(fragment.childNodes[i]);
        }
      },
      revealFrag:function() {
        var set = {};
        console.log(fragment.childNodes[0]);
        for (var i = 0; i < fragment.childNodes.length; i++) {
          console.log(fragment.childNodes[i]);
          set[i] = fragment.childNodes[i];
        }
        arguments[0] == 'dir' ? console.dir(set) : console.log(set);

      }
    }
  for(var o in builder){
    $.fn[o] = builder[o];
  }
}(jQuery))
