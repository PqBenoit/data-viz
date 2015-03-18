var Helpers = (function(my){

	/**
	 * Sort an object
	 * @param Object obj
	 * @return array
	 */
	my.sortObject = function(obj) 
	{
	    var arr = [];
	    for (var prop in obj) {
	        if (obj.hasOwnProperty(prop)) {
	            arr.push({
	                'key': prop,
	                'value': obj[prop]
	            });
	        }
	    }
	    arr.sort(function(a, b) { return b.value - a.value; });

	    return arr; // returns array
	};

	return my;
}(Helpers || {}));