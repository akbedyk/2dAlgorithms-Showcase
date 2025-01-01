/**
 * Replace the given node with its clone.
 * [optional] Add the event listener.
 */
function replaceNode(node, event_name, callback) {
	const clone = node.cloneNode(true)
	node.parentNode.replaceChild(clone, node)
	if (callback) clone.addEventListener(event_name, callback)
}

/**
 *
 */
export class Project {

	constructor(name, render) {
		this._DEFAULT_SCREEN_WIDTH = 1000
		this._DEFAULT_SCREEN_HEIGHT = 1000
		this._name = name
		this._render = render
		this._scene = render.newScene()
 		this._speed = 1
	}

	get DEFAULT_SCREEN_WIDTH() {
		return this._DEFAULT_SCREEN_WIDTH
	}

	get DEFAULT_SCREEN_HEIGHT() {
		return this._DEFAULT_SCREEN_HEIGHT
	}

	get name() {
		return this._name
	}

	set name(name) {
		this._name = name
	}

	get r2d() {
		return this._render
	}

	get scene() {
		return this._scene
	}

	get speed() {
		return this._speed
	}

	set speed(speed) {
		this._speed = speed
	}

	build() {
		// rebuild buttons
		replaceNode(document.getElementById('Forward'), 'click', () => {this.forward()})
		replaceNode(document.getElementById('Downward'), 'click', () => {this.downward()})
		replaceNode(document.getElementById('Play'), 'click', () => {this.play()})
		replaceNode(document.getElementById('Pause'), 'click', () => {this.pause()})
		replaceNode(document.getElementById('Stop'), 'click', () => {this.stop()})
		replaceNode(document.getElementById('Help'), 'click', () => {this.help()})

		// rebuild speed selection
 		const sel = document.getElementById('select_speed')
 		replaceNode(sel, 'change', () => {this._speed = sel.value})

 		// project restart
		this.restart()
	}

	restart() {
	    //console.clear()
	    this._render.clear()
	    this._render.width = this.DEFAULT_SCREEN_WIDTH
	    this._render.height = this.DEFAULT_SCREEN_HEIGHT
	}

	play() {
		console.log('Project PLAY')
	}

	pause() {
		console.log('Project PAUSE')
	}

	stop() {
		console.log('Project STOP')
	}

	forward() {
		this.restart()
	}

	downward() {
		this.restart()
	}

	help() {
		console.log('Project HELP')
	}
}