# SVN Deploy

Use this after WordPress.org approves the plugin and emails you the SVN repository URL.

Prepared artifact:
- `local/wordpress-sandbox/artifacts/svn-layout/`

Structure:
- `trunk/` contains the runtime plugin files only
- `assets/` contains WordPress.org listing images
- `tags/0.1.0/` mirrors the first release

Recommended flow:

1. Check out the empty WordPress.org SVN repository.
2. Copy `svn-layout/trunk/*` into the repository `trunk/`.
3. Copy `svn-layout/assets/*` into the repository `assets/`.
4. Commit the initial upload.
5. Create `tags/0.1.0` from `trunk` with SVN and commit the tag.

Useful reference:
- `https://developer.wordpress.org/plugins/wordpress-org/how-to-use-subversion/`
