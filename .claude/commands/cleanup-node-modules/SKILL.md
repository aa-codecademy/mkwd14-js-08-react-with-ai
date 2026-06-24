Find and delete all `node_modules` directories in the current repo.

Steps:
1. Run `find . -type d -name "node_modules" -not -path "*/node_modules/*/node_modules"` to list all node_modules folders.
2. If none are found, report that the repo is already clean.
3. If any are found, print the list, then run `find . -type d -name "node_modules" -not -path "*/node_modules/*/node_modules" -prune -exec rm -rf {} +` to delete them.
4. Confirm deletion by running the find command again and reporting how many were removed.
