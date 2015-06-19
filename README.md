# targetprocess-mashup-uploader

Utility to upload mashup file to Targetprocesss Mashup Manager.

## Installation

```
git clone git@github.com:TargetProcess/targetprocess-mashup-uploader.git
cd targetprocess-mashup-uploader
npm install
npm link
```

## Using

```
targetprocess-mashup-uploader [options] file.js

Options:
  -h, --help             Show help
  -n, --name String      Name to save mashup
  --host String          Host to upload mashup
  -l, --login String     Auth login - default: admin
  -p, --password String  Auth password - default: admin
  -w, --watch            Watch file and upload on changes
```

## License

MIT (http://www.opensource.org/licenses/mit-license.php)
