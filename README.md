# Obisidan Directory Summary

Obsidian plugin allowing you to create a summary note for any directory in your vault in just one command.

## Usage

If your vault looks like this:

```
obsidian/
├─ apples/
│  ├─ apple pie recipe.md
│  ├─ macintosh/
│  │  ├─ apple tart recipe.md
├─ bananas/
│  ├─ banana pudding recipe.md
```

Run the command `"Generate directory summary"` which will create a `{folder}_summary.md` summary file that looks like this:

```markdown
# obsidian

## apples

- [[apple pie recipe]]

### macintosh

- [[apple tart recipe]]

## bananas

- [[banana pudding recipe]]
```

### Features

- File names appear in the summary as backlinks
- Can configure various different settings for your summary file like:
    - Max directory search depth and files per directory included in summary.
    - Summary file naming scheme.
    - Specify file property to be included with each file name in the summary.
    - Specify file property to use checkboxes in the summary, and specify a regex for its value to control whether its checked or unchecked.
    - Specify files/directories to exclude from the summary file
