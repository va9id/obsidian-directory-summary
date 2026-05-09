import { App, PluginSettingTab, Setting } from "obsidian";
import DirectorySummaryPlugin from "./main";
import { SETTING } from "./constants";

export interface DirectorySummarySettings {
	outputFileName: string;
	maxDepth: number;
	maxFilesPerDirectory: number;
	titleProperty: string;
}

export const DEFAULT_SETTINGS: DirectorySummarySettings = {
	outputFileName: '{folder}_summary',
	maxDepth: 5,
	maxFilesPerDirectory: 100,
	titleProperty: 'Title',
};

export class DirectorySummarySettingTab extends PluginSettingTab {
	plugin: DirectorySummaryPlugin;

	constructor(app: App, plugin: DirectorySummaryPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName(SETTING.OUTPUT_FILE_NAME.NAME)
			.setDesc(SETTING.OUTPUT_FILE_NAME.DESC)
			.addText((text) =>
				text
					.setPlaceholder(SETTING.OUTPUT_FILE_NAME.PLACEHOLDER)
					.setValue(this.plugin.settings.outputFileName)
					.onChange(async (value) => {
						this.plugin.settings.outputFileName =
							value.trim() || DEFAULT_SETTINGS.outputFileName;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName(SETTING.TITLE_PROPERTY.NAME)
			.setDesc(SETTING.TITLE_PROPERTY.DESC)
			.addText((text) =>
				text
					.setPlaceholder(SETTING.TITLE_PROPERTY.PLACEHOLDER)
					.setValue(this.plugin.settings.titleProperty)
					.onChange(async (value) => {
						this.plugin.settings.titleProperty =
							value.trim() || DEFAULT_SETTINGS.titleProperty;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName(SETTING.MAX_DEPTH.NAME)
			.setDesc(SETTING.MAX_DEPTH.DESC)
			.addText((text) =>
				text
					.setPlaceholder(SETTING.MAX_DEPTH.PLACEHOLDER)
					.setValue(String(this.plugin.settings.maxDepth))
					.onChange(async (value) => {
						const parsed = parseInt(value, 10);
						this.plugin.settings.maxDepth =
							isNaN(parsed) || parsed < 0 ? 0 : parsed;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName(SETTING.MAX_FILES_PER_DIRECTORY.NAME)
			.setDesc(SETTING.MAX_FILES_PER_DIRECTORY.DESC)
			.addText((text) =>
				text
					.setPlaceholder(SETTING.MAX_FILES_PER_DIRECTORY.PLACEHOLDER)
					.setValue(String(this.plugin.settings.maxFilesPerDirectory))
					.onChange(async (value) => {
						const parsed = parseInt(value, 10);
						this.plugin.settings.maxFilesPerDirectory =
							isNaN(parsed) || parsed < 0 ? 0 : parsed;
						await this.plugin.saveSettings();
					}),
			);
	}
}
