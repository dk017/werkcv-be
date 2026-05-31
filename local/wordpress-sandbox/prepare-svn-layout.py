from pathlib import Path
from shutil import copy2, copytree, rmtree


REPO_ROOT = Path(__file__).resolve().parents[2]
PLUGIN_DIR = REPO_ROOT / "wordpress-plugin" / "werkcv-salaris-tools"
ARTIFACT_DIR = REPO_ROOT / "local" / "wordpress-sandbox" / "artifacts"
SVN_DIR = ARTIFACT_DIR / "svn-layout"
VERSION = "0.1.0"

TRUNK_FILE_NAMES = {
  "readme.txt",
  "uninstall.php",
  "werkcv-salaris-tools.php",
}

TRUNK_DIR_NAMES = {
  "blocks",
  "includes",
  "languages",
  "templates",
}

ASSET_FILE_NAMES = {
  "banner-772x250.png",
  "banner-1544x500.png",
  "icon-128x128.png",
  "icon-256x256.png",
  "screenshot-1.png",
  "screenshot-2.png",
  "screenshot-3.png",
  "screenshot-4.png",
}


def reset_dir(path: Path) -> None:
  if path.exists():
    rmtree(path)
  path.mkdir(parents=True, exist_ok=True)


def copy_trunk_files(destination: Path) -> None:
  destination.mkdir(parents=True, exist_ok=True)

  for file_name in TRUNK_FILE_NAMES:
    copy2(PLUGIN_DIR / file_name, destination / file_name)

  copytree(
    PLUGIN_DIR / "blocks" / "build",
    destination / "blocks" / "build",
    dirs_exist_ok=True,
  )

  for dir_name in ("includes", "languages", "templates"):
    copytree(PLUGIN_DIR / dir_name, destination / dir_name, dirs_exist_ok=True)


def copy_assets(destination: Path) -> None:
  destination.mkdir(parents=True, exist_ok=True)

  for file_name in ASSET_FILE_NAMES:
    source = PLUGIN_DIR / "assets" / file_name
    if not source.exists():
      source = PLUGIN_DIR / "screenshots" / file_name

    if not source.exists():
      raise FileNotFoundError(f"Missing asset file: {file_name}")

    copy2(source, destination / file_name)


def write_instructions(destination: Path) -> None:
  instructions = f"""SVN upload layout for WerkCV Salaris Tools

Expected WordPress.org SVN structure:
- trunk/
- tags/{VERSION}/
- assets/
- branches/

After approval:
1. Check out the empty SVN repository WordPress gives you.
2. Copy the contents of trunk/ into SVN trunk/.
3. Copy the contents of assets/ into SVN assets/.
4. Commit trunk + assets.
5. Copy trunk to tags/{VERSION} using SVN, then commit the tag.

Reference:
https://developer.wordpress.org/plugins/wordpress-org/how-to-use-subversion/
"""
  (destination / "README.txt").write_text(instructions, encoding="utf-8")


def main() -> None:
  reset_dir(SVN_DIR)

  trunk_dir = SVN_DIR / "trunk"
  assets_dir = SVN_DIR / "assets"
  tags_dir = SVN_DIR / "tags" / VERSION
  branches_dir = SVN_DIR / "branches"

  branches_dir.mkdir(parents=True, exist_ok=True)
  copy_trunk_files(trunk_dir)
  copy_trunk_files(tags_dir)
  copy_assets(assets_dir)
  write_instructions(SVN_DIR)

  print(f"Prepared SVN layout at {SVN_DIR}")


if __name__ == "__main__":
  main()
