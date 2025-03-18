module.exports = {
	testEnvironment: "jsdom",
	transform: {
		"^.+\\.vue$": "@vue/vue3-jest",
		"^.+\\.ts$": "ts-jest",
	},
	moduleFileExtensions: ["ts", "js", "vue", "json"],
	transformIgnorePatterns: ["/node_modules/"],
};
