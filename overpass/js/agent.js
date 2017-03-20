	/**
	 * sumAgents('calls'), sumAgents('options.appointment'), sumAgents('options.disconnected')
	 */
	sumAgents(item) {
		if(this.agents && this.agents.length > 0) {
			let flag = false, opts = [];
			if(/\./.test(item)) {
				flag = true;
				opts = item.split('.');
			}
			return this.agents
				.map(m => {
					if(flag) {
						if(m[opts[0]] && m[opts[0]][opts[1]]) {
							return m[opts[0]][opts[1]];
						}
					}
					else {
						return m[item];
					}
				})
				.reduce((sum, n) => {
					if(n && !isNaN(n)) {
						return sum + n;
					}
					else {
						return sum;
					}
				}, 0);
		}
		return 0;
	}