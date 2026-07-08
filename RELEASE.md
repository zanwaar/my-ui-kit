# Release Checklist

Use this checklist before publishing a new `piceui` version to npm.

## 1. Verify package metadata

- Confirm `name`, `version`, `license`, `repository`, and `homepage` in `package.json`
- Confirm `files` and `exports` still match the intended public API
- Confirm `README.md` install instructions still reflect the actual distribution flow

## 2. Build package assets

Run:

```bash
npm run build:css:prod
```

Expected outputs:

- `core/dist/ui-kit.css`
- `core/dist/ui-kit.min.css`

## 3. Validate publish contents

Run:

```bash
npm run release:check
```

Confirm the tarball contains only the intended runtime files.

## 4. Update release notes

- Add a new version entry to `CHANGELOG.md`
- Summarize added, changed, fixed, or removed items
- Make sure the version date is correct

## 5. Bump version

Use one of the following depending on the release scope:

```bash
npm version patch
npm version minor
npm version major
```

## 6. Authenticate and publish

Login if needed:

```bash
npm login
```

Publish:

```bash
npm publish
```

If you want a publish dry-run first:

```bash
npm run release:dry-run
```

## 7. Post-publish smoke check

Verify the package is reachable:

```bash
npm view piceui name version
```

Optionally install it into a separate test project:

```bash
npm install piceui
```
