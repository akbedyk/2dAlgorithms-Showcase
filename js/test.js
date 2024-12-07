
const testData = {
0: {
	message: 'Must be on the line:',
	data: {
		0: [{x: 0, y: 0}, {x: 1, y: 1}, {x: 2, y: 2}],
		1: [{x: 1, y: 1}, {x: 5, y: 1}, {x: 10, y: 1}],
		2: [{x: 0, y: -1}, {x: 0, y: -3}, {x: 0, y: -10}],
		3: [{x: 0, y: -1}, {x: 0, y: -3}, {x: 0, y: 10}],
	},
},
1: {
	message: 'Must be near the line:',
	data: {
		0: [{x: 0, y: 0}, {x: 1, y: 1}, {x: 20, y: 21}],
		1: [{x: 1, y: 1}, {x: 5, y: 1}, {x: 10, y: 0.5}],
		2: [{x: 0, y: -1}, {x: 0, y: -3}, {x: 0.5, y: 10}],
		3: [{x: 0, y: -1}, {x: 0, y: -3}, {x: -0.5, y: -10}],
	},
},
2: {
	message: 'Must be far of the line:',
	data: {
		0: [{x: 0, y: 0}, {x: 1, y: 1}, {x: 20, y: 200}],
		1: [{x: 1, y: 1}, {x: 5, y: 1}, {x: 10, y: -100}],
		2: [{x: 0, y: -1}, {x: 0, y: -3}, {x: 100, y: -10}],
		3: [{x: 0, y: -1}, {x: 0, y: -3}, {x: -100, y: 10}],
	},
},
}

function forEachData(data, callback) {
	if (typeof(data) == 'object') {
		if (Array.isArray(data)) {
			for(elm of data) callback(elm);
		} else {
			for(key in data) callback(data[key]);
		}
	} else {
		console.log('Data error:', typeof(data))
	}
}

// Test for function isPointNearTheLine(...)
function isPointNearTheLine_test() {
	forEachData(testData, function(elm) {
		console.log(elm.message)
		forEachData(elm.data, function(m) {

			// isPointNearTheLine(m[1], m[2], m[3])

			forEachData(m, function(p) {
				console.log(p.x, p.y);
			})
		})
	})
}


