import { Notice, Plugin, TAbstractFile, TFile, TFolder } from "obsidian";
import {
	DEFAULT_SETTINGS,
	DirectorySummarySettings,
	DirectorySummarySettingTab,
} from "./settings";
import { COMMAND, CONTEXT_MENU, NOTICE } from "./constants";

interface FileExplorerView {
	focusedItem?: { file?: TAbstractFile };
}

export default class DirectorySummaryPlugin extends Plugin {
	settings!: DirectorySummarySettings;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: COMMAND.GENERATE_SUMMARY_ID,
			name: COMMAND.GENERATE_SUMMARY_NAME,
			callback: () => this.generateSummary(),
		});

		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, file) => {
				if (file instanceof TFolder) {
					menu.addItem((item) => {
						item.setTitle(CONTEXT_MENU.GENERATE_SUMMARY_TITLE)
							.setIcon(CONTEXT_MENU.GENERATE_SUMMARY_ICON)
							.onClick(() => this.generateSummaryForFolder(file));
					});
				}
			}),
		);

		this.addSettingTab(new DirectorySummarySettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<DirectorySummarySettings>,
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	// Prefer the file explorer's focused item, fall back to the active file's parent.
	private resolveTargetFolder(): TFolder | null {
		try {
			const leaves = this.app.workspace.getLeavesOfType("file-explorer");
			if (leaves.length > 0) {
				const view = leaves[0]?.view as unknown as FileExplorerView;
				const focused = view?.focusedItem?.file;
				if (focused instanceof TFolder) return focused;
				if (focused instanceof TFile) return focused.parent ?? null;
			}
		} catch (err) {
			console.error(NOTICE.EXPLORER_STATE_ERROR, err);
			new Notice(NOTICE.EXPLORER_STATE_ERROR);
		}

		const activeFile = this.app.workspace.getActiveFile();
		return activeFile?.parent ?? null;
	}

	async generateSummary() {
		const folder = this.resolveTargetFolder();
		if (!folder) {
			new Notice(NOTICE.NO_TARGET_FOLDER);
			return;
		}
		await this.generateSummaryForFolder(folder);
	}

	async generateSummaryForFolder(folder: TFolder) {
		const folderName = folder.isRoot()
			? this.app.vault.getName()
			: folder.name;
		const fileName = this.settings.outputFileName.replace(
			"{folder}",
			folderName,
		);
		const outputPath = folder.isRoot()
			? `${fileName}.md`
			: `${folder.path}/${fileName}.md`;

		const content = this.buildContent(folder, 1);

		const existing = this.app.vault.getAbstractFileByPath(outputPath);
		if (existing instanceof TFile) {
			await this.app.vault.modify(existing, content);
		} else {
			await this.app.vault.create(outputPath, content);
		}

		new Notice(NOTICE.SUMMARY_WRITTEN(outputPath));
	}

	private buildFileLink(file: TFile): string {
		const link =
			file.extension === "md"
				? `[[${file.basename}]]`
				: `[[${file.name}]]`;
		let label = link;
		let hasCheckboxProperty = false;

		if (file.extension === "md") {
			const frontmatter = this.app.metadataCache.getFileCache(file)
				?.frontmatter as Record<string, unknown> | undefined;
			const title = frontmatter?.[this.settings.titleProperty];
			if (typeof title === "string" && title.trim()) {
				label = `${link} - ${title.trim()}`;
			}
			const { checkboxProperty, checkboxRegex } = this.settings;
			if (checkboxProperty && frontmatter && checkboxProperty in frontmatter) {
				hasCheckboxProperty = true;
				if (checkboxRegex) {
					try {
						const raw = frontmatter[checkboxProperty];
						const value =
							typeof raw === "string" || typeof raw === "number" || typeof raw === "boolean"
								? String(raw)
								: "";
						const checked = new RegExp(checkboxRegex).test(value);
						return checked ? `[X] ${label}` : `[ ] ${label}`;
					} catch {
						// invalid regex — fall through to unchecked
					}
				}
			}
		}

		return hasCheckboxProperty ? `[ ] ${label}` : label;
	}

	buildContent(folder: TFolder, depth: number): string {
		const { maxDepth, maxFilesPerDirectory, outputFileName } =
			this.settings;
		const folderName = folder.isRoot()
			? this.app.vault.getName()
			: folder.name;
		const resolvedOutputName = outputFileName.replace(
			"{folder}",
			folderName,
		);

		const heading = "#".repeat(depth);
		const lines: string[] = [`${heading} ${folderName}`];

		let files = folder.children
			.filter((c): c is TFile => c instanceof TFile)
			.filter((f) => f.basename !== resolvedOutputName)
			.sort((a, b) => a.name.localeCompare(b.name));

		if (maxFilesPerDirectory > 0) {
			files = files.slice(0, maxFilesPerDirectory);
		}

		for (const file of files) {
			lines.push(`- ${this.buildFileLink(file)}`);
		}

		const atMaxDepth = maxDepth > 0 && depth >= maxDepth;
		if (!atMaxDepth) {
			const subfolders = folder.children
				.filter((c): c is TFolder => c instanceof TFolder)
				.sort((a, b) => a.name.localeCompare(b.name));

			for (const sub of subfolders) {
				lines.push("");
				lines.push(this.buildContent(sub, depth + 1));
			}
		}

		return lines.join("\n");
	}
}
