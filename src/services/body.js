module.exports = function() {

	return {
		opened: false,

		close: function() {
			this.opened = false;
		},

		toggle: function() {
			this.opened = !this.opened;
		}

	}
}
