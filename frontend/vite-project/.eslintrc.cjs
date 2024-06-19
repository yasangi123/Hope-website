module.exports = {
	// Specify that this is the root ESLint configuration
	root: true,
	// Define the environment where the code will run (browser and ES2020 features)
	env: { browser: true, es2020: true },
	// Extend ESLint recommended rules, React recommended rules, JSX runtime rules, and React Hooks rules
	extends: [
		"eslint:recommended", // ESLint recommended rules
		"plugin:react/recommended", // React recommended rules
		"plugin:react/jsx-runtime", // JSX runtime rules
		"plugin:react-hooks/recommended", // React Hooks rules
	],
	// Ignore patterns for directories or files that ESLint should not lint
	ignorePatterns: ["dist", ".eslintrc.cjs"],
	// Specify parser options (ECMAScript version and module type)
	parserOptions: { ecmaVersion: "latest", sourceType: "module" },
	// Specify settings for plugins, in this case, the React plugin version
	settings: { react: { version: "18.2" } },
	// Define ESLint plugins used in this configuration (react-refresh)
	plugins: ["react-refresh"],
	// Override specific ESLint rules
	rules: {
		"react/jsx-no-target-blank": "off", // Disable the rule that requires using rel="noreferrer" with target="_blank"
		"react-refresh/only-export-components": ["warn", { allowConstantExport: true }], // Warn if non-component exports are used with react-refresh
		"react/prop-types": "off", // Disable prop-types validation for React components
	},
};
