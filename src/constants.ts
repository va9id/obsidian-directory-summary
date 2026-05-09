export const COMMAND = {
	GENERATE_SUMMARY_ID: 'generate-directory-summary',
	GENERATE_SUMMARY_NAME: 'Generate summary',
} as const;

export const CONTEXT_MENU = {
	GENERATE_SUMMARY_TITLE: 'Generate directory summary',
	GENERATE_SUMMARY_ICON: 'list-tree',
} as const;

export const NOTICE = {
	NO_TARGET_FOLDER: 'Select or open a file in the directory you want to summarize.',
	EXPLORER_STATE_ERROR: 'Directory Summary: failed to read file explorer state.',
	SUMMARY_WRITTEN: (path: string) => `Directory summary written to ${path}`,
} as const;

export const SETTING = {
	OUTPUT_FILE_NAME: {
		NAME: 'Output file name',
		DESC: 'Name of the generated summary file (without .md). Use {folder} as a placeholder for the directory name.',
		PLACEHOLDER: '{folder}_summary',
	},
	TITLE_PROPERTY: {
		NAME: 'Title property',
		DESC: 'Frontmatter property name to use as the display title next to each backlink.',
		PLACEHOLDER: 'Title',
	},
	MAX_DEPTH: {
		NAME: 'Max depth',
		DESC: 'How many levels of subdirectories to include. Set to 0 for unlimited.',
		PLACEHOLDER: '5',
	},
	MAX_FILES_PER_DIRECTORY: {
		NAME: 'Max files per directory',
		DESC: 'Maximum number of files to list per directory. Set to 0 for unlimited.',
		PLACEHOLDER: '100',
	},
} as const;
