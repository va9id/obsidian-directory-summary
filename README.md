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
- Can configure the following settings in the extension:
    - Default naming scheme of the summary file
    - Max directory depth to include in summary file
    - Max amount of files to include in summary file per directory
    - Specify a file property to show it's value in the summary file next to the backlink
        - For ex: if a file "random.md" has a property "Title" with value "I love soccer" then when you generate the summary the list item will look like:
           - `- [[random]] - I love soccer`
